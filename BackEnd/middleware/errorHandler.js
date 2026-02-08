// Esta parte del middelware es usada para manejar errores generales del servidor
const manejadorErrores = (error, req, res, next) => {

  // Mostramos el error en consola para saber qué pasó
  console.error('Error capturado:', error.message);

  const codigoEstado = error.statusCode || 500;
  const mensaje = error.message || 'Error interno del servidor';

  res.status(codigoEstado).json({
    exito: false,
    mensaje: mensaje,
    detalles: process.env.NODE_ENV === 'production' ? null : error.stack
  });
};

module.exports = manejadorErrores;