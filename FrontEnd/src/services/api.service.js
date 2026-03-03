import axios from 'axios';

// Configuramos la URL base de la API
const API_URL = 'http://localhost:5000/api';

// Crear instancia de axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar el token en cada petición, se garda token en localStorage al hacer login.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Servicios de Autenticación
export const authService = {
  login: (correo, contrasena) => 
    api.post('/autenticacion/login', { correo, contrasena }),
  
  register: (nombre, correo, contrasena) =>
    api.post('/autenticacion/registro', { nombre, correo, contrasena }),

  // Estas funciones requieren que el token corresponda a un admin.
  obtenerUsuarios: () => api.get('/usuarios'),
  eliminarUsuario: (id) => api.delete(`/usuarios/${id}`)
};

// Servicios de Movimientos
export const transactionService = {
  obtenerMovimientos: (page = 1, limit = 10, tipo = '', categoria = '') =>
    api.get('/movimientos', { 
      params: { page, limit, tipo, categoria } 
    }),
  
  obtenerMovimientoPorId: (id) =>
    api.get(`/movimientos/${id}`),
  
  crearMovimiento: (datos) =>
    api.post('/movimientos', datos),
  
  actualizarMovimiento: (id, datos) =>
    api.put(`/movimientos/${id}`, datos),
  
  eliminarMovimiento: (id) =>
    api.delete(`/movimientos/${id}`),
  
  obtenerResumen: () =>
    api.get('/movimientos/resumen')
  ,
  obtenerEstadisticas: () =>
    api.get('/movimientos/estadisticas')
};

export default api;
