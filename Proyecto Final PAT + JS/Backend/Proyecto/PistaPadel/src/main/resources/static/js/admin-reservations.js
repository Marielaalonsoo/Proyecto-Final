document.addEventListener("DOMContentLoaded", () => {
    if (!haySesion()) {
        window.location.href = "login.html";
        return;
    }

    document.getElementById("filterReservationsForm").addEventListener("submit", filtrarReservas);
    document.getElementById("loadReservationsBtn").addEventListener("click", cargarReservas);
    document.getElementById("resetReservationsFiltersBtn").addEventListener("click", function() {
        setTimeout(cargarReservas, 0);
    });
    document.getElementById("searchReservationForm").addEventListener("submit", buscarReserva);

    cargarReservas();
});

async function filtrarReservas(event) {
    event.preventDefault();
    cargarReservas();
}

async function cargarReservas() {
    const date = document.getElementById("reservationDate").value;
    const courtId = document.getElementById("reservationCourtId").value;
    const userId = document.getElementById("reservationUserId").value;
    const parametros = new URLSearchParams();

    if (date) parametros.append("date", date);
    if (courtId) parametros.append("courtId", courtId);
    if (userId) parametros.append("userId", userId);

    let url = "/pistaPadel/admin/reservations";

    if (parametros.toString()) {
        url += "?" + parametros.toString();
    }

    try {
        const respuesta = await fetch(url, {
            headers: obtenerHeaders()
        });

        if (!respuesta.ok) {
            mostrarFila("No se pudieron cargar las reservas.");
            return;
        }

        const reservas = await respuesta.json();
        mostrarReservas(reservas);
    } catch (error) {
        console.error("Error al cargar reservas:", error);
        mostrarFila("Error al cargar reservas.");
    }
}

function mostrarReservas(reservas) {
    const tabla = document.getElementById("reservationsTableBody");
    tabla.innerHTML = "";

    if (reservas.length === 0) {
        mostrarFila("No hay reservas.");
        return;
    }

    reservas.forEach(function(reserva) {
        const usuario = reserva.usuario || {};
        const pista = reserva.pista || {};
        const fila = document.createElement("tr");

        fila.innerHTML =
            "<td>" + reserva.idReserva + "</td>" +
            "<td>" + (usuario.idUsuario || "") + "</td>" +
            "<td>" + (usuario.nombre || "") + "</td>" +
            "<td>" + (pista.idPista || "") + "</td>" +
            "<td>" + (pista.nombre || "") + "</td>" +
            "<td>" + reserva.fechaReserva + "</td>" +
            "<td>" + reserva.horaInicio + "</td>" +
            "<td>" + reserva.horaFin + "</td>" +
            "<td>" + reserva.duracionMinutos + "</td>" +
            "<td>" + reserva.estado + "</td>" +
            "<td>" + reserva.fechaCreacion + "</td>";

        tabla.appendChild(fila);
    });
}

async function buscarReserva(event) {
    event.preventDefault();

    const reservationId = document.getElementById("searchReservationId").value;
    const caja = document.getElementById("reservationDetailBox");

    try {
        const respuesta = await fetch("/pistaPadel/reservations/" + reservationId, {
            headers: obtenerHeaders()
        });

        if (!respuesta.ok) {
            caja.innerHTML = "<p>No se encontro la reserva.</p>";
            return;
        }

        const reserva = await respuesta.json();
        const usuario = reserva.usuario || {};
        const pista = reserva.pista || {};

        caja.innerHTML =
            "<p><strong>ID reserva:</strong> " + reserva.idReserva + "</p>" +
            "<p><strong>Usuario:</strong> " + (usuario.nombre || "") + "</p>" +
            "<p><strong>Pista:</strong> " + (pista.nombre || "") + "</p>" +
            "<p><strong>Fecha:</strong> " + reserva.fechaReserva + "</p>" +
            "<p><strong>Hora:</strong> " + reserva.horaInicio + " - " + reserva.horaFin + "</p>" +
            "<p><strong>Estado:</strong> " + reserva.estado + "</p>";
    } catch (error) {
        console.error("Error al buscar reserva:", error);
        caja.innerHTML = "<p>Error al buscar reserva.</p>";
    }
}

function mostrarFila(texto) {
    document.getElementById("reservationsTableBody").innerHTML =
        "<tr><td colspan=\"11\">" + texto + "</td></tr>";
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
