document.addEventListener("DOMContentLoaded", () => {
    const formulario = document.getElementById("registerForm");
    formulario.addEventListener("submit", registrarUsuario);
});

async function registrarUsuario(event) {
    event.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const apellidos = document.getElementById("apellidos").value.trim();
    const email = document.getElementById("email").value.trim();
    const telefono = document.getElementById("telefono").value.trim();
    const password = document.getElementById("password").value;

    try {
        const respuesta = await fetch("/pistaPadel/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nombre: nombre,
                apellidos: apellidos,
                email: email,
                telefono: telefono,
                password: password
            })
        });

        const resultado = await leerRespuesta(respuesta);

        if (!respuesta.ok) {
            mostrarMensaje("No se pudo crear la cuenta.", "error");
            console.log(resultado);
            return;
        }

        mostrarMensaje("Cuenta creada. Ahora puedes iniciar sesion.", "success");
        document.getElementById("registerForm").reset();
    } catch (error) {
        console.error("Error al registrar usuario:", error);
        mostrarMensaje("Error al registrar usuario.", "error");
    }
}

async function leerRespuesta(respuesta) {
    const texto = await respuesta.text();

    if (!texto) {
        return {};
    }

    return JSON.parse(texto);
}

function mostrarMensaje(texto, tipo) {
    const mensaje = document.getElementById("registerMensaje");
    mensaje.textContent = texto;
    mensaje.className = "message " + tipo;
}
