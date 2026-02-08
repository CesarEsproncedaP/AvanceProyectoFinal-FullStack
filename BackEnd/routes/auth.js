const express = require('express');
const router = express.Router();

// Importamos las funciones del controlador
const { registrarUsuario, iniciarSesion } = require('../controllers/authController');

// Ruta para registrar usuario
router.post('/registro', registrarUsuario);

// Ruta para iniciar sesión
router.post('/login', iniciarSesion);

// Exportamos las rutas
module.exports = router;