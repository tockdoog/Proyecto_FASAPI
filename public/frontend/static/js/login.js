
        function toggleForms(event) {
            event.preventDefault();
            const loginForm = document.getElementById('loginForm');
            const registerForm = document.getElementById('registerForm');
            
            loginForm.classList.toggle('active');
            registerForm.classList.toggle('active');
        }

        function handleLogin(event) {
            event.preventDefault();
            // Aquí puedes agregar la validación con tu base de datos
            alert('Login exitoso! Redireccionando...');
            // Redirecciona a tu página principal
            // window.location.href = 'tu-pagina-principal.html';
        }

        function handleRegister(event) {
            event.preventDefault();
            const password = event.target.querySelector('input[placeholder="Password"]').value;
            const confirmPassword = event.target.querySelector('input[placeholder="Confirm Password"]').value;
            
            if (password !== confirmPassword) {
                alert('Las contraseñas no coinciden');
                return;
            }
            
            // Aquí puedes agregar la lógica para guardar en tu base de datos
            alert('Registro exitoso! Redireccionando...');
            // Redirecciona a tu página principal
            // window.location.href = 'tu-pagina-principal.html';
        }