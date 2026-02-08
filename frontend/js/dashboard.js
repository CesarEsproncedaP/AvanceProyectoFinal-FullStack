const API_URL = 'http://localhost:5000/api';

// Verificar autenticación
const token = localStorage.getItem('token');
if (!token) {
  window.location.href = 'login.html';
}

// Elementos del DOM
const lista = document.getElementById("listaMovimientos");
const btnAgregar = document.getElementById("btnAgregar");
const btnCerrarSesion = document.getElementById("btnCerrarSesion");
const btnLimpiarFiltros = document.getElementById("btnLimpiarFiltros");
const filtroTipo = document.getElementById("filtroTipo");
const formularioEdicion = document.getElementById("formularioEdicion");
const btnGuardarEdicion = document.getElementById("btnGuardarEdicion");
const btnCancelarEdicion = document.getElementById("btnCancelarEdicion");

// Cargar movimientos al iniciar la página
window.addEventListener('DOMContentLoaded', () => {
  mostrarInfoUsuario(); 
  cargarMovimientos();
  cargarResumen();
});

// === EVENTOS ===

// Cerrar sesión
btnCerrarSesion.addEventListener("click", () => {
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
  window.location.href = 'index.html';
});

// Filtrar cuando cambie el select
filtroTipo.addEventListener("change", () => {
  console.log("Filtro cambiado a:", filtroTipo.value);
  cargarMovimientos();
});

// Limpiar filtros
btnLimpiarFiltros.addEventListener("click", () => {
  console.log("Limpiando filtros...");
  filtroTipo.value = "";
  cargarMovimientos();
});

// Agregar movimiento
btnAgregar.addEventListener("click", async () => {
  const tipo = document.getElementById("tipo").value;
  const categoria = document.getElementById("categoria").value;
  const monto = document.getElementById("monto").value;
  const descripcion = document.getElementById("descripcion").value;
  const fecha = document.getElementById("fecha").value;

  if (categoria === "" || monto === "" || fecha === "") {
    alert("Por favor completa categoría, monto y fecha");
    return;
  }

  try {
    const respuesta = await fetch(`${API_URL}/movimientos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        tipo,
        categoria,
        monto: parseFloat(monto),
        descripcion,
        fecha
      })
    });

    const datos = await respuesta.json();

    if (respuesta.ok) {
      document.getElementById("categoria").value = "";
      document.getElementById("monto").value = "";
      document.getElementById("descripcion").value = "";
      document.getElementById("fecha").value = "";
      
      cargarMovimientos();
      cargarResumen();
    } else {
      alert(datos.mensaje || "Error al crear movimiento");
    }

  } catch (error) {
    console.error('Error:', error);
    alert("Error al conectar con el servidor");
  }
});

// Guardar edición
btnGuardarEdicion.addEventListener("click", async () => {
  const id = document.getElementById("editarId").value;
  const tipo = document.getElementById("editarTipo").value;
  const categoria = document.getElementById("editarCategoria").value;
  const monto = document.getElementById("editarMonto").value;
  const descripcion = document.getElementById("editarDescripcion").value;
  const fecha = document.getElementById("editarFecha").value;

  if (!categoria || !monto || !fecha) {
    alert("Completa todos los campos obligatorios");
    return;
  }

  try {
    const respuesta = await fetch(`${API_URL}/movimientos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        tipo,
        categoria,
        monto: parseFloat(monto),
        descripcion,
        fecha
      })
    });

    const datos = await respuesta.json();

    if (respuesta.ok) {
      alert("Movimiento actualizado correctamente");
      formularioEdicion.style.display = "none";
      cargarMovimientos();
      cargarResumen();
    } else {
      alert(datos.mensaje || "Error al actualizar");
    }

  } catch (error) {
    console.error('Error:', error);
    alert("Error al conectar con el servidor");
  }
});

// Cancelar edición
btnCancelarEdicion.addEventListener("click", () => {
  formularioEdicion.style.display = "none";
});

// === FUNCIONES ===

// Cargar movimientos con filtro opcional
async function cargarMovimientos() {
  try {
    const tipoSeleccionado = filtroTipo.value;

    let url = `${API_URL}/movimientos`;
    
    if (tipoSeleccionado) {
      url += `?tipo=${tipoSeleccionado}`;
    }

    console.log('🔍 Cargando movimientos desde:', url);

    const respuesta = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const datos = await respuesta.json();
    console.log('📦 Datos recibidos:', datos);

    if (respuesta.ok) {
      mostrarMovimientos(datos.datos);
      actualizarIndicadorFiltro(tipoSeleccionado, datos.cantidad);
    } else {
      if (respuesta.status === 401) {
        localStorage.removeItem('token');
        window.location.href = 'login.html';
      } else {
        console.error('❌ Error:', datos);
        alert('Error al cargar movimientos');
      }
    }

  } catch (error) {
    console.error('❌ Error de conexión:', error);
    alert('Error al conectar con el servidor');
  }
}

function actualizarIndicadorFiltro(tipo, cantidad) {
  const contador = document.getElementById("contadorFiltro");
  const mensajeFiltro = document.getElementById("mensajeFiltro");
  const textoFiltro = document.getElementById("textoFiltro");

  // Actualizar contador
  contador.textContent = `Total: ${cantidad}`;

  // Mostrar mensaje según el filtro
  if (tipo === "ingreso") {
    contador.style.background = "#4CAF50";
    mensajeFiltro.style.display = "block";
    mensajeFiltro.style.background = "#e8f5e9";
    mensajeFiltro.style.borderColor = "#4CAF50";
    textoFiltro.style.color = "#2e7d32";
    textoFiltro.textContent = `✓ Mostrando solo INGRESOS (${cantidad} movimientos)`;
  } else if (tipo === "gasto") {
    contador.style.background = "#f44336";
    mensajeFiltro.style.display = "block";
    mensajeFiltro.style.background = "#ffebee";
    mensajeFiltro.style.borderColor = "#f44336";
    textoFiltro.style.color = "#c62828";
    textoFiltro.textContent = `✓ Mostrando solo GASTOS (${cantidad} movimientos)`;
  } else {
    contador.style.background = "#2196F3";
    mensajeFiltro.style.display = "none";
  }
}

// Mostrar movimientos en la lista
function mostrarMovimientos(movimientos) {
  lista.innerHTML = "";

  console.log(`📋 Mostrando ${movimientos.length} movimientos`);

  if (movimientos.length === 0) {
    lista.innerHTML = "<li style='text-align: center; border: none; color: #999;'>No hay movimientos para mostrar</li>";
    return;
  }

  movimientos.forEach(mov => {
    const item = document.createElement("li");
    item.className = mov.tipo;
    
    const signo = mov.tipo === 'ingreso' ? '+' : '-';
    const color = mov.tipo === 'ingreso' ? '#4CAF50' : '#f44336';
    
    // Formatear fecha (quitar la hora)
    const fechaFormateada = mov.fecha.split('T')[0];
    
    item.innerHTML = `
      <div>
        <strong>${mov.categoria}</strong> - ${mov.descripcion || 'Sin descripción'}<br>
        <small style="color: #666;">📅 ${fechaFormateada}</small>
      </div>
      <div style="display: flex; align-items: center; gap: 10px;">
        <strong style="color: ${color}; font-size: 16px;">${signo}$${parseFloat(mov.monto).toFixed(2)}</strong>
        <button onclick="editarMovimiento(${mov.id})" style="background: #ffc107; color: #000; width: 70px;">Editar</button>
        <button onclick="eliminarMovimiento(${mov.id})" style="width: 70px;">Eliminar</button>
      </div>
    `;
    
    lista.appendChild(item);
  });
}

// Editar movimiento
async function editarMovimiento(id) {
  try {
    const respuesta = await fetch(`${API_URL}/movimientos/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const datos = await respuesta.json();

    if (respuesta.ok) {
      const mov = datos.datos;
      
      document.getElementById("editarId").value = mov.id;
      document.getElementById("editarTipo").value = mov.tipo;
      document.getElementById("editarCategoria").value = mov.categoria;
      document.getElementById("editarMonto").value = mov.monto;
      document.getElementById("editarDescripcion").value = mov.descripcion || '';
      document.getElementById("editarFecha").value = mov.fecha;
      
      formularioEdicion.style.display = "block";
      formularioEdicion.scrollIntoView({ behavior: 'smooth' });
    }

  } catch (error) {
    console.error('Error:', error);
    alert("Error al cargar el movimiento");
  }
}

// Eliminar movimiento
async function eliminarMovimiento(id) {
  if (!confirm('¿Estás seguro de eliminar este movimiento?')) {
    return;
  }

  try {
    const respuesta = await fetch(`${API_URL}/movimientos/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (respuesta.ok) {
      cargarMovimientos();
      cargarResumen();
    } else {
      alert("Error al eliminar movimiento");
    }

  } catch (error) {
    console.error('Error:', error);
    alert("Error al conectar con el servidor");
  }
}

// Cargar resumen financiero
async function cargarResumen() {
  try {
    const respuesta = await fetch(`${API_URL}/movimientos/resumen`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const datos = await respuesta.json();

    if (respuesta.ok) {
      document.getElementById("totalIngresos").textContent = datos.datos.total_ingresos.toFixed(2);
      document.getElementById("totalGastos").textContent = datos.datos.total_gastos.toFixed(2);
      
      const saldoElement = document.getElementById("saldo");
      const saldo = datos.datos.saldo;
      saldoElement.textContent = saldo.toFixed(2);
      saldoElement.style.color = saldo >= 0 ? '#4CAF50' : '#f44336';
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

// Establecer fecha de hoy por defecto
document.getElementById("fecha").valueAsDate = new Date();

// Mostrar información del usuario
function mostrarInfoUsuario() {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  
  if (usuario) {
    document.getElementById('nombreUsuario').textContent = usuario.nombre;
    document.getElementById('correoUsuario').textContent = usuario.correo;
  } else {
    document.getElementById('nombreUsuario').textContent = 'Usuario';
    document.getElementById('correoUsuario').textContent = 'Sin correo';
  }
}