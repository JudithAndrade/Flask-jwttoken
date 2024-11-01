document.getElementById('login-form').addEventListener('submit', async function(event) {
    event.preventDefault(); // Evitar el comportamiento por defecto del formulario

    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    const response = await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }), // Enviar datos como JSON
    });

    if (response.ok) {
        const data = await response.json();
        // Almacenar tokens en el almacenamiento local
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);
        document.getElementById('welcome-message').innerText = `Bienvenido, ${username}!`;
        toggleSections('welcome-section'); // Cambiar a la sección de bienvenida
    } else {
        const error = await response.json();
        alert(error.error); // Mostrar mensaje de error
    }
});

document.getElementById('register-form').addEventListener('submit', async function(event) {
    event.preventDefault(); // Evitar el comportamiento por defecto del formulario

    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;

    const response = await fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }), // Enviar datos como JSON
    });

    if (response.ok) {
        alert("Usuario registrado exitosamente."); // Mensaje de éxito
        toggleSections('login-section'); // Volver a la sección de inicio de sesión
    } else {
        const error = await response.json();
        alert(error.error); // Mostrar mensaje de error
    }
});

document.getElementById('logout-btn').addEventListener('click', function() {
    localStorage.removeItem('access_token'); // Eliminar el token de acceso
    localStorage.removeItem('refresh_token'); // Eliminar el token de renovación
    toggleSections('login-section'); // Volver a la sección de inicio de sesión
});

document.getElementById('show-register').addEventListener('click', function() {
    toggleSections('register-section'); // Cambiar a la sección de registro
});

document.getElementById('show-login').addEventListener('click', function() {
    toggleSections('login-section'); // Cambiar a la sección de inicio de sesión
});

// Función para mostrar/ocultar secciones
function toggleSections(activeSection) {
    const sections = document.querySelectorAll('.form-section');
    sections.forEach(section => {
        if (section.id === activeSection) {
            section.classList.add('active'); // Mostrar la sección activa
        } else {
            section.classList.remove('active'); // Ocultar otras secciones
        }
    });
}
