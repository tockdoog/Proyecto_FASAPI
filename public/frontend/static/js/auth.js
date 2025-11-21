function toggleForms(event) {
    event.preventDefault();
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    loginForm.classList.toggle('active');
    registerForm.classList.toggle('active');
}

async function handleLogin(event) {
    event.preventDefault();

    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;

    const data = { username, password };

    const resp = await fetch("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    if (resp.ok) {
        // Redirecciona al panel principal
        window.location.href = "/index";
    } else {
        alert("❌ Usuario o contraseña incorrectos");
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

    const resp = await fetch("/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    if (resp.ok) {
        alert("Registro exitoso 🎉 Ahora puedes iniciar sesión.");
        toggleForms(event); // Cambia a formulario de login
    } else {
        alert("❌ Error registrando usuario");
    }
}
