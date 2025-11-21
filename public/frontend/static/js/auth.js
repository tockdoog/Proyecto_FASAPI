async function handleLogin(event) {
event.preventDefault();


const username = document.getElementById("login-username").value;
const password = document.getElementById("login-password").value;

const data = { username, password };

try {
    const resp = await fetch("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    if (resp.ok) {
        // Redirige a la página principal después del login
        window.location.href = "/index";
    } else {
        const err = await resp.json();
        alert("❌ " + (err.detail || "Usuario o contraseña incorrectos"));
    }
} catch (error) {
    console.error("Error al hacer login:", error);
    alert("❌ Error de conexión al servidor");
}


}

async function handleRegister(event) {
event.preventDefault();


const username = document.getElementById("reg-username").value;
const email = document.getElementById("reg-email").value;
const password = document.getElementById("reg-password").value;
const confirm = document.getElementById("reg-confirm").value;

if (password !== confirm) {
    alert("❌ Las contraseñas no coinciden");
    return;
}

const data = { username, email, password };

try {
    const resp = await fetch("/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    if (resp.ok) {
        alert("✅ Usuario registrado correctamente");
        // Cambia al formulario de login
        toggleForms();
    } else {
        const err = await resp.json();
        alert("❌ " + (err.detail || "Error en el registro"));
    }
} catch (error) {
    console.error("Error al registrar usuario:", error);
    alert("❌ Error de conexión al servidor");
}


}

// Función para alternar entre login y registro
function toggleForms(event) {
if (event) event.preventDefault();

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

loginForm.classList.toggle("active");
registerForm.classList.toggle("active");

}
