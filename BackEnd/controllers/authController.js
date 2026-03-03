const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bd = require('../config/db');

// Registrar nuevo usuario
// Valida datos, encripta la contraseña y crea un token con rol 'user'.
exports.registrarUsuario = async (req, res) => {
  try {
    
    // Se obtienen los datos que manda el usuario
    const { nombre, correo, contrasena } = req.body;

    // Validamos que no estén vacíos
    if (!nombre || !correo || !contrasena) {
      return res.status(400).json({ mensaje: 'Tienes que llenar todos los campos.' });
    }

    // Revisamos que no exista el correo en la DB.
    const [usuarioExistente] = await bd.query(
      'SELECT * FROM usuarios WHERE correo = ?', 
      [correo]
    );
    
    if (usuarioExistente.length > 0) {
      return res.status(400).json({ mensaje: 'Este correo ya está registrado.' });
    }

    // Encriptamos la contraseña por seguridad.
    const salt = await bcrypt.genSalt(10);
    const contrasenaEncriptada = await bcrypt.hash(contrasena, salt);

    // Guardamos el usuario en la base de datos con rol de "usuario" por defecto.
    const [resultado] = await bd.query(
      'INSERT INTO usuarios (nombre, correo, contrasena, rol) VALUES (?, ?, ?, ?)',
      [nombre, correo, contrasenaEncriptada, 'user']
    );

    // Creamos un token para el login con el rol.
    const token = jwt.sign(
      { idUsuario: resultado.insertId, correo, rol: 'user' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      mensaje: 'Tu usuario ha sido registrado correctamente.',
      token,
      usuario: {
        id: resultado.insertId,
        nombre,
        correo,
        rol: 'user'
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al registrar usuario.' });
  }
};

// Iniciar sesión en donde se validan credenciales.
exports.iniciarSesion = async (req, res) => {
  try {
    const { correo, contrasena } = req.body;

    if (!correo || !contrasena) {
      return res.status(400).json({ mensaje: 'Es obligatorio poner un correo y contraseña.' });
    }

    const [usuarios] = await bd.query(
      'SELECT * FROM usuarios WHERE correo = ?', 
      [correo]
    );

    if (usuarios.length === 0) {
      return res.status(401).json({ mensaje: 'Credenciales incorrectas' });
    }

    const usuario = usuarios[0];

    const contrasenaValida = await bcrypt.compare(contrasena, usuario.contrasena);

    if (!contrasenaValida) {
      return res.status(401).json({ mensaje: 'Credenciales incorrectas' });
    }

    const token = jwt.sign(
      { idUsuario: usuario.id, correo: usuario.correo, rol: usuario.rol || 'user' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      mensaje: 'Inicio de sesión exitoso',
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol || 'user'
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al iniciar sesión' });
  }
};

// Se obtiene una lista de todos los"admin".
exports.obtenerUsuarios = async (req, res) => {
  try {
    const [usuarios] = await bd.query(
      'SELECT id, nombre, correo, rol FROM usuarios'
    );
    res.json({ exito: true, usuarios });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener usuarios' });
  }
};

// Se eliminan los usuarios por id, al igual se eliminan sus movimientos por defecto, esto solo lo puede hacer un admin.
exports.eliminarUsuario = async (req, res) => {
  try {
    const idUsuario = req.params.id;
    await bd.query('DELETE FROM usuarios WHERE id = ?', [idUsuario]);
    res.json({ exito: true, mensaje: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al eliminar el usuario' });
  }
};