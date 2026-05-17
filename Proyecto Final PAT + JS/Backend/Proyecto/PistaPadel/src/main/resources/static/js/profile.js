document.addEventListener("DOMContentLoaded", () => {
    if (!haySesion()) {
        window.location.href = "login.html";
        return;
    }

    document.getElementById("profileForm").addEventListener("submit", guardarPerfil);
    document.getElementById("logoutBtn").addEventListener("click", cerrarSesion);

    cargarPerfil();
});

async function cargarPerfil() {
    try {
        const respuesta = await fetch("/pistaPadel/auth/me", {
            headers: obtenerHeaders()
        });

        if (!respuesta.ok) {
            mostrarMensaje("No se pudo cargar el perfil.", "error");
            return;
        }

        const usuario = await respuesta.json();
        sessionStorage.setItem("usuario", JSON.stringify(usuario));
        rellenarFormulario(usuario);
    } catch (error) {
        console.error("Error al cargar perfil:", error);
        mostrarMensaje("Error al cargar perfil.", "error");
    }
}

function rellenarFormulario(usuario) {
    document.getElementById("userId").value = usuario.idUsuario;
    document.getElementById("role").value = usuario.rol;
    document.getElementById("createdAt").value = usuario.fechaRegistro;
    document.getElementById("active").value = usuario.activo ? "Activo" : "Inactivo";
    document.getElementById("firstName").value = usuario.nombre;
    document.getElementById("lastName").value = usuario.apellidos;
    document.getElementById("email").value = usuario.email;
    document.getElementById("phone").value = usuario.telefono;
}

async function guardarPerfil(event) {
    event.preventDefault();

    const userId = document.getElementById("userId").value;

    try {
        const respuesta = await fetch("/pistaPadel/users/" + userId, {
            method: "PATCH",
            headers: obtenerHeadersJson(),
            body: JSON.stringify({
                nombre: document.getElementById("firstName").value.trim(),
                apellidos: document.getElementById("lastName").value.trim(),
                email: document.getElementById("email").value.trim(),
                telefono: document.getElementById("phone").value.trim()
            })
        });

        const usuario = await leerRespuesta(respuesta);

        if (!respuesta.ok) {
            mostrarMensaje("No se pudo guardar el perfil.", "error");
            console.log(usuario);
            return;
        }

        sessionStorage.setItem("usuario", JSON.stringify(usuario));
        rellenarFormulario(usuario);
        mostrarMensaje("Perfil guardado correctamente.", "success");
    } catch (error) {
        console.error("Error al guardar perfil:", error);
        mostrarMensaje("Error al guardar perfil.", "error");
    }
}

async function cerrarSesion() {
    try {
        await fetch("/pistaPadel/auth/logout", {
            method: "POST",
            headers: obtenerHeaders()
        });
    } catch (error) {
        console.error("Error al cerrar sesion:", error);
    }

    sessionStorage.clear();
    window.location.href = "login.html";
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
    const mensaje = document.getElementById("profileMessage");
    mensaje.textContent = texto;
    mensaje.className = "message " + tipo;
}
