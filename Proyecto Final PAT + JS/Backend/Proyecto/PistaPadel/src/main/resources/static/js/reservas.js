document.addEventListener("DOMContentLoaded", () => {
    if (!haySesion()) {
        window.location.href = "login.html";
        return;
    }

    const formulario = document.getElementById("reservaForm");
    formulario.addEventListener("submit", crearReserva);

    cargarPistas();
    cargarReservas();
});

async function cargarPistas() {
    const select = document.getElementById("pista");
    const pistaSeleccionada = sessionStorage.getItem("pistaSeleccionada");

    try {
        const respuesta = await fetch("/pistaPadel/courts?active=true", {
            headers: obtenerHeaders()
        });

        if (!respuesta.ok) {
            mostrarMensaje("No se pudieron cargar las pistas.", "error");
            return;
        }

        const pistas = await respuesta.json();
        select.innerHTML = "<option value=\"\">Selecciona una pista</option>";

        pistas.forEach(function(pista) {
            const option = document.createElement("option");
            option.value = pista.idPista;
            option.textContent = pista.nombre + " - " + pista.ubicacion;
            select.appendChild(option);
        });

        if (pistaSeleccionada) {
            select.value = pistaSeleccionada;
            sessionStorage.removeItem("pistaSeleccionada");
        }
    } catch (error) {
        console.error("Error al cargar pistas:", error);
        mostrarMensaje("Error al cargar pistas.", "error");
    }
}

async function crearReserva(event) {
    event.preventDefault();

    const courtId = Number(document.getElementById("pista").value);
    const date = document.getElementById("fecha").value;
    const time = document.getElementById("hora").value;
    const durationMinutes = Number(document.getElementById("duracion").value);

    try {
        const respuesta = await fetch("/pistaPadel/reservations", {
            method: "POST",
            headers: obtenerHeadersJson(),
            body: JSON.stringify({
                courtId: courtId,
                date: date,
                time: time,
                durationMinutes: durationMinutes
            })
        });

        const resultado = await leerRespuesta(respuesta);

        if (!respuesta.ok) {
            mostrarMensaje("No se pudo crear la reserva.", "error");
            console.log(resultado);
            return;
        }

        mostrarMensaje("Reserva creada correctamente.", "success");
        document.getElementById("reservaForm").reset();
        cargarReservas();
    } catch (error) {
        console.error("Error al crear reserva:", error);
        mostrarMensaje("Error al crear reserva.", "error");
    }
}

async function cargarReservas() {
    const contenedor = document.getElementById("reservasGrid");

    try {
        const respuesta = await fetch("/pistaPadel/reservations", {
            headers: obtenerHeaders()
        });

        if (!respuesta.ok) {
            contenedor.innerHTML = "<p>No se pudieron cargar tus reservas.</p>";
            return;
        }

        const reservas = await respuesta.json();
        mostrarReservas(reservas);
    } catch (error) {
        console.error("Error al cargar reservas:", error);
        contenedor.innerHTML = "<p>Error al cargar tus reservas.</p>";
    }
}

function mostrarReservas(reservas) {
    const contenedor = document.getElementById("reservasGrid");
    contenedor.innerHTML = "";

    if (reservas.length === 0) {
        contenedor.innerHTML = "<p>Todavia no tienes reservas.</p>";
        return;
    }

    reservas.forEach(function(reserva) {
        const tarjeta = document.createElement("article");
        tarjeta.className = "reserva-card card";

        const nombrePista = reserva.pista ? reserva.pista.nombre : "Pista";
        tarjeta.innerHTML =
            "<h3>" + nombrePista + "</h3>" +
            "<p><strong>Fecha:</strong> " + reserva.fechaReserva + "</p>" +
            "<p><strong>Hora:</strong> " + reserva.horaInicio + "</p>" +
            "<p><strong>Duracion:</strong> " + reserva.duracionMinutos + " minutos</p>" +
            "<p><strong>Estado:</strong> " + reserva.estado + "</p>";

        const botones = document.createElement("div");
        botones.className = "reserva-botones";

        const cancelar = document.createElement("button");
        cancelar.type = "button";
        cancelar.className = "button-primary";
        cancelar.textContent = "Cancelar";
        cancelar.addEventListener("click", function() {
            cancelarReserva(reserva.idReserva);
        });

        botones.appendChild(cancelar);
        tarjeta.appendChild(botones);
        contenedor.appendChild(tarjeta);
    });
}

async function cancelarReserva(idReserva) {
    try {
        const respuesta = await fetch("/pistaPadel/reservations/" + idReserva, {
            method: "DELETE",
            headers: obtenerHeaders()
        });

        if (!respuesta.ok) {
            mostrarMensaje("No se pudo cancelar la reserva.", "error");
            return;
        }

        mostrarMensaje("Reserva cancelada.", "success");
        cargarReservas();
    } catch (error) {
        console.error("Error al cancelar reserva:", error);
        mostrarMensaje("Error al cancelar reserva.", "error");
    }
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

function mostrarMensaje(texto, tipo) {
    const mensaje = document.getElementById("reservasMensaje");
    mensaje.textContent = texto;
    mensaje.className = "message " + tipo;
}
