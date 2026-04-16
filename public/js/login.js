// Seleccionamos el formulario de login del HTML
const loginForm = document.getElementById('login-form');

loginForm.addEventListener('submit', async (e) => {
    // Evitamos que la página se recargue al darle al botón
    e.preventDefault();

    // Recogemos los valores que ha escrito el usuario
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        // Hacemos la petición POST al backend 
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: email, password: password })
        });

        // Convertimos la respuesta del servidor a formato que JavaScript entienda
        const data = await response.json();

        if (response.ok) {
            // Guardamos los datos del usuario en la memoria del navegador
            localStorage.setItem('usuario', JSON.stringify(data.usuario));
            
            // Redirigimos al usuario a su panel principal
            window.location.href = '/dashboard.html';
        } else {
            // Si hay error (por ejemplo la contraseña es incorrecta), mostramos el mensaje del backend
            alert('Error: ' + data.error);
        }
    } catch (error) {
        console.error('Error de conexión:', error);
        alert('No se pudo conectar con el servidor.');
    }
});

const registerForm = document.getElementById('register-form');
const showRegisterLink = document.getElementById('show-register');
const showLoginLink = document.getElementById('show-login');

// Lógica para intercambiar formularios visualmente
showRegisterLink.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
});

showLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    registerForm.style.display = 'none';
    loginForm.style.display = 'block';
});

// Enviar los datos de registro al servidor 
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const datos = {
        nombre: document.getElementById('reg-nombre').value,
        email: document.getElementById('reg-email').value,
        password: document.getElementById('reg-password').value,
        nivel_id: document.getElementById('reg-nivel').value,
        estado_preferente_id: document.getElementById('reg-estado').value
    };

    try {
        const response = await fetch('/api/auth/registro', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });

        const resData = await response.json();

        if (response.ok) {
            alert('¡Registro completado! Ahora puedes iniciar sesión.');
            // Volvemos al formulario de login automáticamente
            registerForm.style.display = 'none';
            loginForm.style.display = 'block';
        } else {
            alert('Error: ' + resData.error);
        }
    } catch (err) {
        alert('Error al conectar con el servidor.');
    }
});