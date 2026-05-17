document.addEventListener("DOMContentLoaded", () => {
    if (!haySesion()) {
        window.location.href = "login.html";
        return;
    }

    document.getElementById("loadUsersBtn").addEventListener("click", cargarUsuarios);
    document.getElementById("filterUsersForm").addEventListener("submit", filtrarUsuarios);
    document.getElementById("resetUsersFiltersBtn").addEventListener("click", function() {
        setTimeout(cargarUsuarios, 0);
    });
    document.getElementById("editUserForm").addEventListener("submit", editarUsuario);
    document.getElementById("searchUserForm").addEventListener("submit", buscarUsuario);

    cargarUsuarios();
});

let usuariosCargados = [];

async function cargarUsuarios() {
    try {
        const respuesta = await fetch("/pistaPadel/users", {
            headers: obtenerHeaders()
        });

        if (!respuesta.ok) {
            mostrarFila("No se pudieron cargar los usuarios.");
            return;
        }

        usuariosCargados = await respuesta.json();
        mostrarUsuarios(usuariosCargados);
    } catch (error) {
        console.error("Error al cargar usuarios:", error);
        mostrarFila("Error al cargar usuarios.");
    }
}

function filtrarUsuarios(event) {
    event.preventDefault();

    const id = document.getElementById("userId").value;
    const nombre = document.getElementById("userName").value.toLowerCase();
    const email = document.getElementById("userEmail").value.toLowerCase();

    const filtrados = usuariosCargados.filter(function(usuario) {
        const coincideId = !id || String(usuario.idUsuario) === id;
        const coincideNombre = !nombre || usuario.nombre.toLowerCase().includes(nombre);
        const coincideEmail = !email || usuario.email.toLowerCase().includes(email);

        return coincideId && coincideNombre && coincideEmail;
    });

    mostrarUsuarios(filtrados);
}

function mostrarUsuarios(usuarios) {
    const tabla = document.getElementById("usersTableBody");
    tabla.innerHTML = "";

    if (usuarios.length === 0) {
        mostrarFila("No hay usuarios.");
        return;
    }

    usuarios.forEach(function(usuario) {
        const fila = document.createElement("tr");
        fila.innerHTML =
            "<td>" + usuario.idUsuario + "</td>" +
            "<td>" + usuario.nombre + "</td>" +
            "<td>" + usuario.apellidos + "</td>" +
            "<td>" + usuario.email + "</td>" +
            "<td>" + usuario.telefono + "</td>" +
            "<td>" + usuario.rol + "</td>" +
            "<td>" + (usuario.activo ? "Activo" : "Inactivo") + "</td>" +
            "<td><button type=\"button\" class=\"button-secondary\">Editar</button></td>";

        fila.querySelector("button").addEventListener("click", function() {
            rellenarFormulario(usuario);
        });

        tabla.appendChild(fila);
    });
}

function rellenarFormulario(usuario) {
    document.getElementById("editUserId").value = usuario.idUsuario;
    document.getElementById("editUserName").value = usuario.nombre;
    document.getElementById("editUserLastName").value = usuario.apellidos;
    document.getElementById("editUserEmail").value = usuario.email;
    document.getElementById("editUserPhone").value = usuario.telefono;
}

async function editarUsuario(event) {
    event.preventDefault();

    const userId = document.getElementById("editUserId").value;
    const body = {};
    const nombre = document.getElementById("editUserName").value.trim();
    const apellidos = document.getElementById("editUserLastName").value.trim();
    const email = document.getElementById("editUserEmail").value.trim();
    const telefono = document.getElementById("editUserPhone").value.trim();

    if (nombre) body.nombre = nombre;
    if (apellidos) body.apellidos = apellidos;
    if (email) body.email = email;
    if (telefono) body.telefono = telefono;

    try {
        const respuesta = await fetch("/pistaPadel/users/" + userId, {
            method: "PATCH",
            headers: obtenerHeadersJson(),
            body: JSON.stringify(body)
        });

        if (!respuesta.ok) {
            console.log(await leerRespuesta(respuesta));
            alert("No se pudo editar el usuario.");
            return;
        }

        cargarUsuarios();
    } catch (error) {
        console.error("Error al editar usuario:", error);
        alert("Error al editar usuario.");
    }
}

async function buscarUsuario(event) {
    event.preventDefault();

    const userId = document.getElementById("searchUserId").value;
    const caja = document.getElementById("userDetailBox");

    try {
        const respuesta = await fetch("/pistaPadel/users/" + userId, {
            headers: obtenerHeaders()
        });

        if (!respuesta.ok) {
            caja.innerHTML = "<p>No se encontro el usuario.</p>";
            return;
        }

        const usuario = await respuesta.json();
        caja.innerHTML =
            "<p><strong>ID:</strong> " + usuario.idUsuario + "</p>" +
            "<p><strong>Nombre:</strong> " + usuario.nombre + " " + usuario.apellidos + "</p>" +
            "<p><strong>Email:</strong> " + usuario.email + "</p>" +
            "<p><strong>Telefono:</strong> " + usuario.telefono + "</p>" +
            "<p><strong>Rol:</strong> " + usuario.rol + "</p>";
    } catch (error) {
        console.error("Error al buscar usuario:", error);
        caja.innerHTML = "<p>Error al buscar usuario.</p>";
    }
}

function mostrarFila(texto) {
    document.getElementById("usersTableBody").innerHTML =
        "<tr><td colspan=\"8\" class=\"table-empty\">" + texto + "</td></tr>";
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
