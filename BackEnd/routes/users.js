const express = require('express');
const router = express.Router();

const verificarAutenticacion = require('../middleware/auth');
const verificarRol = require('../middleware/verificarRol');
const {
  obtenerUsuarios,
  eliminarUsuario
} = require('../controllers/authController');

// todas las rutas requieren estar autenticado y ser admin
router.use(verificarAutenticacion);
router.use(verificarRol(['admin']));

router.get('/', obtenerUsuarios);
router.delete('/:id', eliminarUsuario);

module.exports = router;
