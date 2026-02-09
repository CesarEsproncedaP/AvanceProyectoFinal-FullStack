const API_URL = 'http://localhost:5000/api';

const form = document.getElementById("loginForm");
const msg = document.getElementById("loginMsg");

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const correo = document.getElementById("email").value;
  const contrasena = document.getElementById("password").value;

  if (correo === "" || contrasena === "") {
    mostrarMensaje("Por favor completa todos los campos", "error");
    return;
  }

  try {
    const respuesta = await fetch(`${API_URL}/autenticacion/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ correo, contrasena })
    });

    const datos = await respuesta.json();

    if (respuesta.ok) {
      // Guardar token en localStorage
      localStorage.setItem('token', datos.token);
      localStorage.setItem('usuario', JSON.stringify(datos.usuario));
      
      mostrarMensaje("Inicio de sesión exitoso", "success");
      
      // Redirigir al dashboard
      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 1000);
    } else {
      mostrarMensaje(datos.mensaje || "Credenciales incorrectas", "error");
    }

  } catch (error) {
    console.error('Error:', error);
    mostrarMensaje("Error al conectar con el servidor", "error");
  }
});

function mostrarMensaje(texto, tipo) {
  msg.textContent = texto;
  msg.className = tipo;
}