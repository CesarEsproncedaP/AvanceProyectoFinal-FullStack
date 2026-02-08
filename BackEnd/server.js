const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Nos conectamos a la base de datos.
require('./config/db');

// Importamos las rutas
const rutasAutenticacion = require('./routes/auth');
const rutasMovimientos = require('./routes/transactions');

// Enrutamos el middleware para errores.
const manejadorErrores = require('./middleware/errorHandler');

const app = express();

// Permitimos peticiones desde el frontend
app.use(cors());

// Para leer datos JSON
app.use(express.json());

// Para leer datos de formularios
app.use(express.urlencoded({ extended: true }));

// Rutas de autenticación
app.use('/api/autenticacion', rutasAutenticacion);

// Rutas de movimientos
app.use('/api/movimientos', rutasMovimientos);

// Ruta principal para probar que funciona
app.get('/', (req, res) => {
  res.json({ 
    mensaje: 'API del Gestor de Gastos Personales funcionando correctamente',
    version: '1.0.0'
  });
});

// Middleware para manejar errores
app.use(manejadorErrores);

// Puerto del servidor
const PORT = process.env.PORT || 5000;

// Se inicia el servidor.
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});