// Middleware para verificar que el usuario tenga un rol específico y se devuelve error 
// 403 cuando el rol no coincide.
const verificarRol = (rolesPermitidos) => {
  return (req, res, next) => {
    
    // Revisamos que exista el usuario en el request (añadido por auth)
    if (!req.usuario) {
      return res.status(401).json({ mensaje: 'Usuario no autenticado' });
    }

    // Obtenemos el rol del usuario desde el token
    const rolUsuario = req.usuario.rol || 'user';

    // Validamos que el rol esté permitido
    if (!rolesPermitidos.includes(rolUsuario)) {
      return res.status(403).json({ 
        mensaje: 'No tienes permiso para acceder a este recurso',
        rolActual: rolUsuario,
        rolesRequeridos: rolesPermitidos
      });
    }

    // Si todo está bien, continuamos
    next();
  };
};

module.exports = verificarRol;
