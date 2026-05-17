document.addEventListener("DOMContentLoaded", () => {
    const formulario = document.getElementById("loginForm");
    formulario.addEventListener("submit", iniciarSesion);
});

async function iniciarSesion(event) {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try {
        const respuesta = await fetch("/pistaPadel/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Basic " + btoa(email + ":" + password)
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        const resultado = await leerRespuesta(respuesta);

        if (!respuesta.ok) {
            mostrarMensaje("Email o contrasena incorrectos.", "error");
            console.log(resultado);
            return;
        }

        sessionStorage.setItem("email", email);
        sessionStorage.setItem("password", password);
        sessionStorage.setItem("usuario", JSON.stringify(resultado.usuario));

        mostrarMensaje("Sesion iniciada correctamente.", "success");

        if (resultado.usuario && resultado.usuario.rol === "ADMIN") {
            window.location.href = "admin-dashboard.html";
        } else {
            window.location.href = "profile.html";
        }
    } catch (error) {
        console.error("Error al iniciar sesion:", error);
        mostrarMensaje("No se pudo iniciar sesion.", "error");
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
    const mensaje = document.getElementById("loginMensaje");
    mensaje.textContent = texto;
    mensaje.className = "message " + tipo;
}
