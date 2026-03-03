const bd = require('../config/db');

// Se obtienen todos los movimientos del usuario.
exports.obtenerMovimientos = async (req, res) => {
  try {
    const idUsuario = req.usuario.idUsuario;
    const { tipo, categoria, page = 1, limit = 10 } = req.query;

    // Convertimos page y limit a números
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit) || 10));
    const offset = (pageNum - 1) * limitNum;

    // Consultamos la base
    let query = 'SELECT * FROM movimientos WHERE usuario_id = ?';
    let queryCount = 'SELECT COUNT(*) as total FROM movimientos WHERE usuario_id = ?';
    const params = [idUsuario];

    // Se pone si es filtro por ingreso o gasto agregandose a la consulta.
    if (tipo && (tipo === 'ingreso' || tipo === 'gasto')) {
      query += ' AND tipo = ?';
      queryCount += ' AND tipo = ?';
      params.push(tipo);
    }

     // Si viene filtro por categoria se agrega.
    if (categoria && categoria.trim() !== '') {
      query += ' AND categoria LIKE ?';
      queryCount += ' AND categoria LIKE ?';
      params.push(`%${categoria}%`);
    }

    query += ' ORDER BY fecha DESC LIMIT ? OFFSET ?';

    console.log('📝 Query SQL:', query);
    console.log('📝 Params:', params);

    // Se ejecutan las consultas
    const [movimientos] = await bd.query(query, [...params, limitNum, offset]);
    const [resultadoTotal] = await bd.query(queryCount, params);
    const totalRegistros = resultadoTotal[0].total;
    const totalPaginas = Math.ceil(totalRegistros / limitNum);

    // Convertimos el campo monto a número para evitar strings
    movimientos.forEach(m => {
      if (m.monto !== undefined && m.monto !== null) {
        m.monto = parseFloat(m.monto);
      }
    });

    console.log(`✅ Movimientos encontrados: ${movimientos.length}`);

    res.json({
      exito: true,
      paginacion: {
        paginaActual: pageNum,
        registrosPorPagina: limitNum,
        totalRegistros: totalRegistros,
        totalPaginas: totalPaginas
      },
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

    // convertimos monto
    const mov = movimientos[0];
    if (mov.monto !== undefined && mov.monto !== null) {
      mov.monto = parseFloat(mov.monto);
    }

    res.json({
      exito: true,
      datos: mov
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
        monto: parseFloat(monto),
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
    let { tipo, categoria, monto, descripcion, fecha } = req.body;

    // Convertimos la fecha al formato YYYY-MM-DD
    if (fecha && fecha.includes('T')) {
      fecha = fecha.split('T')[0];
    }

    // Validamos que los campos obligatorios estén presentes
    if (!tipo || !categoria || !monto || !fecha) {
      return res.status(400).json({ 
        mensaje: 'Los campos tipo, categoría, monto y fecha son obligatorios' 
      });
    }

    // Validamos que el tipo esté correcto
    if (tipo !== 'ingreso' && tipo !== 'gasto') {
      return res.status(400).json({ 
        mensaje: 'El tipo debe ser "ingreso" o "gasto"' 
      });
    }

    // Verificamos que el movimiento exista y pertenezca al usuario
    const [movimientoExistente] = await bd.query(
      'SELECT * FROM movimientos WHERE id = ? AND usuario_id = ?',
      [idMovimiento, idUsuario]
    );

    if (movimientoExistente.length === 0) {
      return res.status(404).json({ mensaje: 'Movimiento no encontrado' });
    }

    await bd.query(
      'UPDATE movimientos SET tipo = ?, categoria = ?, monto = ?, descripcion = ?, fecha = ? WHERE id = ? AND usuario_id = ?',
      [tipo, categoria, parseFloat(monto), descripcion || '', fecha, idMovimiento, idUsuario]
    );

    res.json({
      exito: true,
      mensaje: 'Movimiento actualizado correctamente'
    });

  } catch (error) {
    console.error('Error en actualizarMovimiento:', error);
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

// Obtener estadísticas para gráficos (saldo acumulado y totales mensuales)
exports.obtenerEstadisticas = async (req, res) => {
  try {
    const idUsuario = req.usuario.idUsuario;

    // Traemos todas las filas necesarias ordenadas por fecha asc
    const [filas] = await bd.query(
      'SELECT fecha, tipo, monto FROM movimientos WHERE usuario_id = ? ORDER BY fecha ASC',
      [idUsuario]
    );

    // Convertir monto a número y normalizar fecha (YYYY-MM-DD)
    const filasProcesadas = filas.map(r => ({
      fecha: new Date(r.fecha).toISOString().slice(0,10),
      tipo: r.tipo,
      monto: parseFloat(r.monto) || 0
    }));

    // Construir saldo acumulado por movimiento (sube/baja por cada movimiento)
    const cumulativo = [];
    let saldoAcumulado = 0;
    filasProcesadas.forEach((r, idx) => {
      // aplicar ingreso o gasto al acumulado
      saldoAcumulado += (r.tipo === 'ingreso' ? r.monto : -Math.abs(r.monto));
      // usar fecha y un índice para evitar etiquetas idénticas si hay múltiples movimientos el mismo día
      const label = `${r.fecha}${filasProcesadas.length > 1 ? ` ${idx+1}` : ''}`;
      cumulativo.push({ fecha: label, saldo: +saldoAcumulado.toFixed(2) });
    });

    // Agregar por mes (YYYY-MM) para barras: ingresos y gastos por mes
    const porMes = {};
    filasProcesadas.forEach(r => {
      const mes = r.fecha.slice(0,7); // YYYY-MM
      if (!porMes[mes]) porMes[mes] = { ingresos: 0, gastos: 0 };
      if (r.tipo === 'ingreso') porMes[mes].ingresos += r.monto;
      else porMes[mes].gastos += r.monto;
    });

    const mesesOrdenados = Object.keys(porMes).sort();
    const mensual = {
      labels: mesesOrdenados,
      ingresos: mesesOrdenados.map(m => +porMes[m].ingresos.toFixed(2)),
      gastos: mesesOrdenados.map(m => +porMes[m].gastos.toFixed(2))
    };

    res.json({
      exito: true,
      datos: {
        cumulativo,
        mensual
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener estadísticas' });
  }
};