document.addEventListener("DOMContentLoaded", () => {
    if (!haySesion()) {
        window.location.href = "login.html";
        return;
    }

    cargarPanel();
});

async function cargarPanel() {
    await cargarTotalPistas();
    await cargarTotalUsuarios();
    await cargarReservasHoy();
}

async function cargarTotalPistas() {
    try {
        const respuesta = await fetch("/pistaPadel/courts", {
            headers: obtenerHeaders()
        });

        if (!respuesta.ok) {
            document.getElementById("totalCourts").textContent = "-";
            return;
        }

        const pistas = await respuesta.json();
        document.getElementById("totalCourts").textContent = pistas.length;
    } catch (error) {
        console.error("Error al cargar pistas:", error);
        document.getElementById("totalCourts").textContent = "-";
    }
}

async function cargarTotalUsuarios() {
    try {
        const respuesta = await fetch("/pistaPadel/users", {
            headers: obtenerHeaders()
        });

        if (!respuesta.ok) {
            document.getElementById("totalUsers").textContent = "-";
            return;
        }

        const usuarios = await respuesta.json();
        document.getElementById("totalUsers").textContent = usuarios.length;
    } catch (error) {
        console.error("Error al cargar usuarios:", error);
        document.getElementById("totalUsers").textContent = "-";
    }
}

async function cargarReservasHoy() {
    const hoy = new Date().toISOString().slice(0, 10);

    try {
        const respuesta = await fetch("/pistaPadel/admin/reservations?date=" + hoy, {
            headers: obtenerHeaders()
        });

        if (!respuesta.ok) {
            document.getElementById("todayReservations").textContent = "-";
            return;
        }

        const reservas = await respuesta.json();
        document.getElementById("todayReservations").textContent = reservas.length;
    } catch (error) {
        console.error("Error al cargar reservas:", error);
        document.getElementById("todayReservations").textContent = "-";
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
