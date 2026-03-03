// Configuración para las pruebas
const bd = require('../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Mock de la base de datos
jest.mock('../config/db');

describe('Auth Controller - Tests', () => {
  
  // Test 1: Login exitoso
  test('Debe hacer login exitoso con credenciales correctas', async () => {
    const authController = require('../controllers/authController');
    
    const req = {
      body: {
        correo: 'test@example.com',
        contrasena: 'password123'
      }
    };
    
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    // Simulamos que el usuario existe en la BD
    const usuarioMock = {
      id: 1,
      nombre: 'Test User',
      correo: 'test@example.com',
      contrasena: await bcrypt.hash('password123', 10),
      rol: 'user'
    };

    bd.query.mockResolvedValue([[usuarioMock]]);

    await authController.iniciarSesion(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        mensaje: 'Inicio de sesi\u00f3n exitoso',
        token: expect.any(String),
        usuario: expect.objectContaining({
          id: 1,
          correo: 'test@example.com',
          rol: 'user'
        })
      })
    );
  });

  // Test 2: Login fallido - usuario no existe
  test('Debe fallar el login si el usuario no existe', async () => {
    const authController = require('../controllers/authController');
    
    const req = {
      body: {
        correo: 'noexiste@example.com',
        contrasena: 'password123'
      }
    };
    
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    // Simulamos que no existe el usuario
    bd.query.mockResolvedValue([[]]);

    await authController.iniciarSesion(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        mensaje: 'Credenciales incorrectas'
      })
    );
  });

  // Test 3: Validación de campos vacíos en login
  test('Debe validar que correo y contraseña no estén vacíos', async () => {
    const authController = require('../controllers/authController');
    
    const req = {
      body: {
        correo: '',
        contrasena: ''
      }
    };
    
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await authController.iniciarSesion(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        mensaje: 'Es obligatorio poner un correo y contraseña.'
      })
    );
  });

  // Test 4: Registro exitoso
  test('Debe registrar un nuevo usuario correctamente', async () => {
    const authController = require('../controllers/authController');
    
    const req = {
      body: {
        nombre: 'Nuevo Usuario',
        correo: 'nuevo@example.com',
        contrasena: 'password123'
      }
    };
    
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    // Simulamos que el usuario no existe previamente
    bd.query.mockResolvedValueOnce([[]])
      .mockResolvedValueOnce([{ insertId: 1 }]);

    await authController.registrarUsuario(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        mensaje: 'Tu usuario ha sido registrado correctamente.',
        token: expect.any(String),
        usuario: expect.objectContaining({
          nombre: 'Nuevo Usuario',
          correo: 'nuevo@example.com',
          rol: 'user'
        })
      })
    );
  });

  // Test 5: Registro con correo duplicado
  test('Debe fallar el registro si el correo ya existe', async () => {
    const authController = require('../controllers/authController');
    
    const req = {
      body: {
        nombre: 'Otro Usuario',
        correo: 'existe@example.com',
        contrasena: 'password123'
      }
    };
    
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    // Simulamos que el correo ya existe
    bd.query.mockResolvedValue([[{ correo: 'existe@example.com' }]]);

    await authController.registrarUsuario(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        mensaje: 'Este correo ya est\u00e1 registrado.'
      })
    );
  });
});

describe('Transaction Controller - Tests', () => {
  
  // Test 6: Obtener movimientos con paginación
  test('Debe obtener movimientos con paginación correcta', async () => {
    const transactionController = require('../controllers/transactionController');
    
    const req = {
      usuario: { idUsuario: 1 },
      query: { page: 1, limit: 10 }
    };
    
    const res = {
      json: jest.fn()
    };

    const movimientosMock = [
      { id: 1, usuario_id: 1, tipo: 'ingreso', monto: 1000 }
    ];

    bd.query
      .mockResolvedValueOnce([movimientosMock])
      .mockResolvedValueOnce([[{ total: 1 }]]);

    await transactionController.obtenerMovimientos(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        exito: true,
        paginacion: expect.objectContaining({
          paginaActual: 1,
          totalRegistros: 1,
          totalPaginas: 1
        })
      })
    );
  });

  // Test 7: Crear movimiento
  test('Debe crear un nuevo movimiento correctamente', async () => {
    const transactionController = require('../controllers/transactionController');
    
    const req = {
      usuario: { idUsuario: 1 },
      body: {
        tipo: 'ingreso',
        categoria: 'Salario',
        monto: 5000,
        descripcion: 'Salario mensual',
        fecha: '2026-03-01'
      }
    };
    
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    bd.query.mockResolvedValue([{ insertId: 1 }]);

    await transactionController.crearMovimiento(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        exito: true,
        mensaje: 'Movimiento registrado correctamente'
      })
    );
  });

  // Test 8: Validación de campos obligatorios en movimiento
  test('Debe validar campos obligatorios al crear movimiento', async () => {
    const transactionController = require('../controllers/transactionController');
    
    const req = {
      usuario: { idUsuario: 1 },
      body: {
        tipo: 'ingreso',
        // Faltan campos obligatorios
      }
    };
    
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await transactionController.crearMovimiento(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        mensaje: expect.stringContaining('obligatorios')
      })
    );
  });

  // Test 9: Eliminar movimiento debe permitir al propio usuario
  test('Debe eliminar un movimiento propio', async () => {
    const transactionController = require('../controllers/transactionController');
    const req = {
      usuario: { idUsuario: 1 },
      params: { id: '5' }
    };
    const res = { json: jest.fn() };
    // primero verificar existencia
    bd.query.mockResolvedValueOnce([[{ id: 5 }]]);
    // luego ejecución de delete
    bd.query.mockResolvedValueOnce([]);

    await transactionController.eliminarMovimiento(req, res);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ exito: true })
    );
  });

  // Test 10: Middleware de roles rechaza usuarios normales e permite admin
  test('El middleware verificarRol bloquea usuarios no administradores', () => {
    const verificarRol = require('../middleware/verificarRol');
    const req = { usuario: { rol: 'user' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    const mw = verificarRol(['admin']);
    mw(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        mensaje: expect.any(String),
        rolActual: 'user',
        rolesRequeridos: ['admin']
      })
    );

    // cuando el rol coincide debe llamar next()
    const mw2 = verificarRol(['user', 'admin']);
    mw2(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  // Test 10: Obtener lista de usuarios (admin)
  test('Obtener usuarios devuelve arreglo', async () => {
    const authController = require('../controllers/authController');
    const req = {};
    const res = { json: jest.fn() };
    const usuariosMock = [
      { id: 1, nombre: 'A', correo: 'a@a.com', rol: 'user' }
    ];
    bd.query.mockResolvedValueOnce([usuariosMock]);

    await authController.obtenerUsuarios(req, res);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        exito: true,
        usuarios: usuariosMock
      })
    );
  });

  // Test 11: Eliminar usuario por id
  test('Eliminar usuario invoca DELETE correcto', async () => {
    const authController = require('../controllers/authController');
    const req = { params: { id: 5 } };
    const res = { json: jest.fn() };
    bd.query.mockResolvedValueOnce([]);

    await authController.eliminarUsuario(req, res);
    expect(bd.query).toHaveBeenCalledWith(
      'DELETE FROM usuarios WHERE id = ?',
      [5]
    );
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        exito: true,
        mensaje: expect.stringContaining('eliminado')
      })
    );
  });
});
