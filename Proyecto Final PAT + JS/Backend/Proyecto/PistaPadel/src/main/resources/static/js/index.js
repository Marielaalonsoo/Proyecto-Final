document.addEventListener("DOMContentLoaded", () => {
    comprobarServidor();
    cargarResumenPistas();
});

async function comprobarServidor() {
    try {
        const respuesta = await fetch("/pistaPadel/health");
        console.log("Servidor:", respuesta.ok ? "OK" : "No disponible");
    } catch (error) {
        console.error("Error al comprobar el servidor:", error);
    }
}

async function cargarResumenPistas() {
    const elemento = document.getElementById("totalPistasInicio");

    if (!elemento) {
        return;
    }

    const email = sessionStorage.getItem("email");
    const password = sessionStorage.getItem("password");

    if (!email || !password) {
        elemento.textContent = "Inicia sesion para ver las pistas";
        return;
    }

    try {
        const respuesta = await fetch("/pistaPadel/courts?active=true", {
            headers: {
                "Authorization": "Basic " + btoa(email + ":" + password)
            }
        });

        if (!respuesta.ok) {
            elemento.textContent = "No se pudieron cargar las pistas";
            return;
        }

        const pistas = await respuesta.json();
        elemento.textContent = pistas.length + " pistas activas";
    } catch (error) {
        console.error("Error al cargar pistas:", error);
        elemento.textContent = "No se pudieron cargar las pistas";
    }
}
