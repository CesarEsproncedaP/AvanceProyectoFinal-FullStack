const API_URL = 'http://localhost:5000/api';

const form = document.getElementById("registroForm");
const msg = document.getElementById("registroMsg");

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value;
  const correo = document.getElementById("correo").value;
  const contrasena = document.getElementById("contrasena").value;

  if (nombre === "" || correo === "" || contrasena === "") {
    mostrarMensaje("Por favor completa todos los campos", "error");
    return;
  }

  try {
    const respuesta = await fetch(`${API_URL}/autenticacion/registro`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ nombre, correo, contrasena })
    });

    const datos = await respuesta.json();

    if (respuesta.ok) {
      mostrarMensaje("¡Registro exitoso! Redirigiendo...", "success");
      
      // Guardar token automáticamente
      localStorage.setItem('token', datos.token);
      localStorage.setItem('usuario', JSON.stringify(datos.usuario));
      
      // Redirigir al dashboard
      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 1500);
    } else {
      mostrarMensaje(datos.mensaje || "Error al registrar usuario", "error");
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