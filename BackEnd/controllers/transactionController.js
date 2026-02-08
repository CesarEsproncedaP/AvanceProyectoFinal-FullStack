const bd = require('../config/db');

// Obtener todos los movimientos del usuario.
exports.obtenerMovimientos = async (req, res) => {
  try {
    const idUsuario = req.usuario.idUsuario;
    const { tipo, categoria } = req.query; 

    // Consultamos la base
    let query = 'SELECT * FROM movimientos WHERE usuario_id = ?';
    const params = [idUsuario];

    // Si viene filtro por tipo, se agrega.
    if (tipo && (tipo === 'ingreso' || tipo === 'gasto')) {
      query += ' AND tipo = ?';
      params.push(tipo);
    }

     // Si viene filtro por categoria se agrega.
    if (categoria && categoria.trim() !== '') {
      query += ' AND categoria LIKE ?';
      params.push(`%${categoria}%`);
    }

    query += ' ORDER BY fecha DESC';

    console.log('📝 Query SQL:', query);
    console.log('📝 Params:', params);

    // Se ejecuta la consulta
    const [movimientos] = await bd.query(query, params);

    console.log(`✅ Movimientos encontrados: ${movimientos.length}`);

    res.json({
      exito: true,
      cantidad: movimientos.length,
      datos: movimientos
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener los movimientos' });
  }
};

// Obtener un movimiento específico
exports.obtenerMovimientoPorId = async (req, res) => {
  try {
    const idUsuario = req.usuario.idUsuario;
    const idMovimiento = req.params.id;

    const [movimientos] = await bd.query(
      'SELECT * FROM movimientos WHERE id = ? AND usuario_id = ?',
      [idMovimiento, idUsuario]
    );

    if (movimientos.length === 0) {
      return res.status(404).json({ mensaje: 'Movimiento no encontrado' });
    }

    res.json({
      exito: true,
      datos: movimientos[0]
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener el movimiento' });
  }
};

// Crear nuevo movimiento
exports.crearMovimiento = async (req, res) => {
  try {
    // Solicitamos el id del usuario
    const idUsuario = req.usuario.idUsuario;
    const { tipo, categoria, monto, descripcion, fecha } = req.body;

    // Validamos que esten llenos los campos obligatorios.
    if (!tipo || !categoria || !monto || !fecha) {
      return res.status(400).json({ 
        mensaje: 'Los campos tipo, categoría, monto y fecha son obligatorios' 
      });
    }

    // Validamos que el tipo esté correcto.
    if (tipo !== 'ingreso' && tipo !== 'gasto') {
      return res.status(400).json({ 
        mensaje: 'El tipo debe ser "ingreso" o "gasto"' 
      });
    }

    // Insertamos el movimiento en la DB.
    const [resultado] = await bd.query(
      'INSERT INTO movimientos (usuario_id, tipo, categoria, monto, descripcion, fecha) VALUES (?, ?, ?, ?, ?, ?)',
      [idUsuario, tipo, categoria, monto, descripcion || '', fecha]
    );

    res.status(201).json({
      exito: true,
      mensaje: 'Movimiento registrado correctamente',
      datos: {
        id: resultado.insertId,
        usuario_id: idUsuario,
        tipo,
        categoria,
        monto,
        descripcion,
        fecha
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al crear el movimiento' });
  }
};

// Actualizar movimiento
exports.actualizarMovimiento = async (req, res) => {
  try {
    const idUsuario = req.usuario.idUsuario;
    const idMovimiento = req.params.id;
    const { tipo, categoria, monto, descripcion, fecha } = req.body;

    const [movimientoExistente] = await bd.query(
      'SELECT * FROM movimientos WHERE id = ? AND usuario_id = ?',
      [idMovimiento, idUsuario]
    );

    if (movimientoExistente.length === 0) {
      return res.status(404).json({ mensaje: 'Movimiento no encontrado' });
    }

    await bd.query(
      'UPDATE movimientos SET tipo = ?, categoria = ?, monto = ?, descripcion = ?, fecha = ? WHERE id = ? AND usuario_id = ?',
      [tipo, categoria, monto, descripcion, fecha, idMovimiento, idUsuario]
    );

    res.json({
      exito: true,
      mensaje: 'Movimiento actualizado correctamente'
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al actualizar el movimiento' });
  }
};

// Eliminar movimiento
exports.eliminarMovimiento = async (req, res) => {
  try {
    const idUsuario = req.usuario.idUsuario;
    const idMovimiento = req.params.id;

    const [movimientoExistente] = await bd.query(
      'SELECT * FROM movimientos WHERE id = ? AND usuario_id = ?',
      [idMovimiento, idUsuario]
    );

    if (movimientoExistente.length === 0) {
      return res.status(404).json({ mensaje: 'Movimiento no encontrado' });
    }

    await bd.query(
      'DELETE FROM movimientos WHERE id = ? AND usuario_id = ?', 
      [idMovimiento, idUsuario]
    );

    res.json({
      exito: true,
      mensaje: 'Movimiento eliminado correctamente'
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al eliminar el movimiento' });
  }
};

// Obtener resumen financiero
exports.obtenerResumen = async (req, res) => {
  try {
    const idUsuario = req.usuario.idUsuario;

    const [resultado] = await bd.query(
      `SELECT 
        SUM(CASE WHEN tipo = 'ingreso' THEN monto ELSE 0 END) as total_ingresos,
        SUM(CASE WHEN tipo = 'gasto' THEN monto ELSE 0 END) as total_gastos
       FROM movimientos 
       WHERE usuario_id = ?`,
      [idUsuario]
    );

    const totalIngresos = parseFloat(resultado[0].total_ingresos) || 0;
    const totalGastos = parseFloat(resultado[0].total_gastos) || 0;
    const saldo = totalIngresos - totalGastos;

    res.json({
      exito: true,
      datos: {
        total_ingresos: totalIngresos,
        total_gastos: totalGastos,
        saldo: saldo
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener el resumen' });
  }
};