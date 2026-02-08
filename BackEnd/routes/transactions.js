const express = require('express');
const router = express.Router();

// Se usa el Middleware para verificar si el usuario está logueado
const verificarAutenticacion = require('../middleware/auth');

// Importamos funciones del controlador.
const {
  obtenerMovimientos,
  obtenerMovimientoPorId,
  crearMovimiento,
  actualizarMovimiento,
  eliminarMovimiento,
  obtenerResumen
} = require('../controllers/transactionController');

// Todas las rutas necesitan la verificacion
router.use(verificarAutenticacion);

//Son las rutas para hacer dichas cosas que vienen ahi.
router.get('/resumen', obtenerResumen);
router.get('/', obtenerMovimientos);
router.get('/:id', obtenerMovimientoPorId);
router.post('/', crearMovimiento);
router.put('/:id', actualizarMovimiento);
router.delete('/:id', eliminarMovimiento);

module.exports = router;