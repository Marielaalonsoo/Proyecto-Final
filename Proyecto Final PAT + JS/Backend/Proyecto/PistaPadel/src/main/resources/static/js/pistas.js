document.addEventListener("DOMContentLoaded", () => {
    const formulario = document.getElementById("filtrosPistasForm");
    formulario.addEventListener("submit", function(event) {
        event.preventDefault();
        cargarPistas();
    });

    cargarPistas();
});

async function cargarPistas() {
    const contenedor = document.getElementById("pistasGrid");
    const headers = obtenerHeaders();

    if (!headers) {
        contenedor.innerHTML = "<p>Inicia sesion para consultar las pistas.</p>";
        return;
    }

    const estado = document.getElementById("estado").value;
    const ubicacion = document.getElementById("tipo").value.toLowerCase();
    let url = "/pistaPadel/courts";

    if (estado !== "") {
        url += "?active=" + estado;
    }

    try {
        const respuesta = await fetch(url, { headers: headers });

        if (!respuesta.ok) {
            contenedor.innerHTML = "<p>No se pudieron cargar las pistas.</p>";
            return;
        }

        const pistas = await respuesta.json();
        const pistasFiltradas = pistas.filter(function(pista) {
            if (ubicacion === "") {
                return true;
            }

            return pista.ubicacion.toLowerCase().includes(ubicacion);
        });

        await mostrarPistas(pistasFiltradas);
    } catch (error) {
        console.error("Error al cargar pistas:", error);
        contenedor.innerHTML = "<p>Error al cargar pistas.</p>";
    }
}

async function mostrarPistas(pistas) {
    const contenedor = document.getElementById("pistasGrid");
    contenedor.innerHTML = "";

    if (pistas.length === 0) {
        contenedor.innerHTML = "<p>No hay pistas con esos filtros.</p>";
        return;
    }

    for (const pista of pistas) {
        const ocupada = await estaOcupada(pista.idPista);
        const tarjeta = document.createElement("article");
        tarjeta.className = "pista-card";

        const estado = pista.activa ? "Activa" : "Inactiva";
        const textoOcupacion = ocupada ? "Ocupada en ese horario" : estado;
        const boton = document.createElement("button");
        boton.type = "button";
        boton.className = ocupada || !pista.activa ? "button-secondary" : "button-primary";
        boton.textContent = ocupada || !pista.activa ? "Ver otros horarios" : "Reservar";
        boton.addEventListener("click", function() {
            sessionStorage.setItem("pistaSeleccionada", pista.idPista);
            window.location.href = "reservas.html";
        });

        tarjeta.innerHTML =
            "<img src=\"" + obtenerImagenPista(pista.idPista) + "\" alt=\"" + pista.nombre + "\">" +
            "<div class=\"pista-info\">" +
            "<h3>" + pista.nombre + "</h3>" +
            "<p><strong>Ubicacion:</strong> " + pista.ubicacion + "</p>" +
            "<p><strong>Precio:</strong> " + pista.precioHora + " euros / hora</p>" +
            "<p><strong>Estado:</strong> " + textoOcupacion + "</p>" +
            "</div>";

        tarjeta.querySelector(".pista-info").appendChild(boton);
        contenedor.appendChild(tarjeta);
    }
}

async function estaOcupada(courtId) {
    const fecha = document.getElementById("fecha").value;
    const hora = document.getElementById("hora").value;

    if (!fecha || !hora) {
        return false;
    }

    try {
        const respuesta = await fetch("/pistaPadel/courts/" + courtId + "/availability?date=" + fecha, {
            headers: obtenerHeaders()
        });

        if (!respuesta.ok) {
            return false;
        }

        const reservas = await respuesta.json();
        const horaCompleta = hora.length === 5 ? hora + ":00" : hora;

        return reservas.some(function(reserva) {
            return horaCompleta >= reserva.horaInicio && horaCompleta < reserva.horaFin;
        });
    } catch (error) {
        console.error("Error al consultar disponibilidad:", error);
        return false;
    }
}

function obtenerHeaders() {
    const email = sessionStorage.getItem("email");
    const password = sessionStorage.getItem("password");

    if (!email || !password) {
        return null;
    }

    return {
        "Authorization": "Basic " + btoa(email + ":" + password)
    };
}

function obtenerImagenPista(idPista) {
    const imagenes = [
        "https://padelescuelaclub.es/wp-content/uploads/2025/03/pistas-padel-majadahonda.jpg",
        "https://www.porticosport.es/outdoor-court/gallery/Outdoor-Padel-Court-1.webp",
        "https://voleapadel.es/img/volea_paddel_pista_cabecera.jpg",
        "https://unbuendiaenmadrid.com/wp-content/uploads/2022/03/carrusel_club_0002_07.jpg"
    ];

    return imagenes[(idPista - 1) % imagenes.length];
}
