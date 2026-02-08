const jwt = require('jsonwebtoken');

const verificarAutenticacion = (req, res, next) => {

  // Obtenemos el token del header
  const token = req.header('Authorization')?.replace('Bearer ', '');

  // Si no hay token se niega el acceso.
  if (!token) {
    return res.status(401).json({ mensaje: 'Acceso denegado. No se proporcionó token' });
  }

  // Verificamos que el token sea válido.
  try {
    const datosUsuario = jwt.verify(token, process.env.JWT_SECRET);

    // Guardamos los datos en req para usarlos después.
    req.usuario = datosUsuario;
    next();
  } catch (error) {
    res.status(401).json({ mensaje: 'Token inválido o expirado' });
  }
};

module.exports = verificarAutenticacion;