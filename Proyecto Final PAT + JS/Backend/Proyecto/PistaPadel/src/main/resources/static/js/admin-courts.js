document.addEventListener("DOMContentLoaded", () => {
    if (!haySesion()) {
        window.location.href = "login.html";
        return;
    }

    const hoy = new Date().toISOString().slice(0, 10);
    document.getElementById("courtCreatedDate").value = hoy;

    document.getElementById("createCourtForm").addEventListener("submit", crearPista);
    document.getElementById("editCourtForm").addEventListener("submit", editarPista);
    document.getElementById("deleteCourtBtn").addEventListener("click", borrarPista);
    document.getElementById("loadCourtsBtn").addEventListener("click", cargarPistas);
    document.getElementById("filterCourtStatus").addEventListener("change", cargarPistas);

    cargarPistas();
});

async function cargarPistas() {
    const estado = document.getElementById("filterCourtStatus").value;
    let url = "/pistaPadel/courts";

    if (estado !== "") {
        url += "?active=" + estado;
    }

    try {
        const respuesta = await fetch(url, {
            headers: obtenerHeaders()
        });

        if (!respuesta.ok) {
            mostrarFila("No se pudieron cargar las pistas.");
            return;
        }

        const pistas = await respuesta.json();
        mostrarPistas(pistas);
    } catch (error) {
        console.error("Error al cargar pistas:", error);
        mostrarFila("Error al cargar pistas.");
    }
}

function mostrarPistas(pistas) {
    const tabla = document.getElementById("courtsTableBody");
    tabla.innerHTML = "";

    if (pistas.length === 0) {
        mostrarFila("No hay pistas.");
        return;
    }

    pistas.forEach(function(pista) {
        const fila = document.createElement("tr");
        fila.innerHTML =
            "<td>" + pista.idPista + "</td>" +
            "<td>" + pista.nombre + "</td>" +
            "<td>" + pista.ubicacion + "</td>" +
            "<td>" + pista.precioHora + "</td>" +
            "<td>" + (pista.activa ? "Activa" : "Inactiva") + "</td>" +
            "<td>" + pista.fechaAlta + "</td>" +
            "<td><button type=\"button\" class=\"button-secondary\">Editar</button></td>";

        fila.querySelector("button").addEventListener("click", function() {
            rellenarFormularioEdicion(pista);
        });

        tabla.appendChild(fila);
    });
}

function rellenarFormularioEdicion(pista) {
    document.getElementById("editCourtId").value = pista.idPista;
    document.getElementById("editCourtName").value = pista.nombre;
    document.getElementById("editCourtLocation").value = pista.ubicacion;
    document.getElementById("editCourtPrice").value = pista.precioHora;
    document.getElementById("editCourtActive").value = String(pista.activa);
}

async function crearPista(event) {
    event.preventDefault();

    const body = {
        nombre: document.getElementById("courtName").value.trim(),
        ubicacion: document.getElementById("courtLocation").value.trim(),
        precioHora: Number(document.getElementById("courtPrice").value),
        fechaAlta: document.getElementById("courtCreatedDate").value,
        activa: document.getElementById("courtActive").value === "true"
    };

    try {
        const respuesta = await fetch("/pistaPadel/courts", {
            method: "POST",
            headers: obtenerHeadersJson(),
            body: JSON.stringify(body)
        });

        if (!respuesta.ok) {
            console.log(await leerRespuesta(respuesta));
            alert("No se pudo crear la pista.");
            return;
        }

        document.getElementById("createCourtForm").reset();
        document.getElementById("courtCreatedDate").value = new Date().toISOString().slice(0, 10);
        cargarPistas();
    } catch (error) {
        console.error("Error al crear pista:", error);
        alert("Error al crear pista.");
    }
}

async function editarPista(event) {
    event.preventDefault();

    const courtId = document.getElementById("editCourtId").value;
    const body = {};
    const nombre = document.getElementById("editCourtName").value.trim();
    const ubicacion = document.getElementById("editCourtLocation").value.trim();
    const precioHora = document.getElementById("editCourtPrice").value;
    const activa = document.getElementById("editCourtActive").value;

    if (nombre) body.nombre = nombre;
    if (ubicacion) body.ubicacion = ubicacion;
    if (precioHora) body.precioHora = Number(precioHora);
    if (activa !== "") body.activa = activa === "true";

    try {
        const respuesta = await fetch("/pistaPadel/courts/" + courtId, {
            method: "PATCH",
            headers: obtenerHeadersJson(),
            body: JSON.stringify(body)
        });

        if (!respuesta.ok) {
            console.log(await leerRespuesta(respuesta));
            alert("No se pudo editar la pista.");
            return;
        }

        cargarPistas();
    } catch (error) {
        console.error("Error al editar pista:", error);
        alert("Error al editar pista.");
    }
}

async function borrarPista() {
    const courtId = document.getElementById("editCourtId").value;

    if (!courtId) {
        alert("Selecciona una pista.");
        return;
    }

    try {
        const respuesta = await fetch("/pistaPadel/courts/" + courtId, {
            method: "DELETE",
            headers: obtenerHeaders()
        });

        if (!respuesta.ok) {
            alert("No se pudo desactivar la pista.");
            return;
        }

        cargarPistas();
    } catch (error) {
        console.error("Error al borrar pista:", error);
        alert("Error al desactivar pista.");
    }
}

function mostrarFila(texto) {
    document.getElementById("courtsTableBody").innerHTML =
        "<tr><td colspan=\"7\">" + texto + "</td></tr>";
}

function haySesion() {
    return sessionStorage.getItem("email") && sessionStorage.getItem("password");
}

function obtenerHeaders() {
    const email = sessionStorage.getItem("email");
    const password = sessionStorage.getItem("password");

    return {
        "Authorization": "Basic " + btoa(email + ":" + password)
    };
}

function obtenerHeadersJson() {
    return {
        "Content-Type": "application/json",
        "Authorization": obtenerHeaders().Authorization
    };
}

async function leerRespuesta(respuesta) {
    const texto = await respuesta.text();

    if (!texto) {
        return {};
    }

    return JSON.parse(texto);
}
