import React, { useState, useEffect } from 'react';
import { transactionService } from '../services/api.service';
import { useAuth } from '../context/AuthContext';
import './Movimientos.css';

// Página de movimientos
const Movimientos = () => {

  const [movimientos, setMovimientos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [paginacion, setPaginacion] = useState({
    paginaActual: 1,
    totalPaginas: 1
  });
  const [filtros, setFiltros] = useState({
    tipo: '',
    categoria: ''
  });
  const [categoriaInput, setCategoriaInput] = useState('');
  const [editando, setEditando] = useState(null);
  const [formularioEdit, setFormularioEdit] = useState({});

  // Se cargan los movimientos al montar o cuando cambian los filtros/página
  useEffect(() => {
    cargarMovimientos();
  }, [filtros, paginacion.paginaActual]);

  // Función para cargar movimientos
  const cargarMovimientos = async () => {
    try {
      setCargando(true);
      const respuesta = await transactionService.obtenerMovimientos(
        paginacion.paginaActual,
        10,
        filtros.tipo,
        filtros.categoria
      );
      setMovimientos(respuesta.data.datos);
      setPaginacion({
        paginaActual: respuesta.data.paginacion.paginaActual,
        totalPaginas: respuesta.data.paginacion.totalPaginas
      });
      setError('');
    } catch (err) {
      setError('Error al cargar los movimientos');
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  // Función para eliminar un movimiento
  const eliminarMovimiento = async (id) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este movimiento?')) {
      return;
    }

    try {
      await transactionService.eliminarMovimiento(id);
      cargarMovimientos();
    } catch (err) {
      setError('Error al eliminar el movimiento');
    }
  };


  // Función para iniciar edición
  const iniciarEdicion = (movimiento) => {
    setFormularioEdit({
      tipo: movimiento.tipo,
      categoria: movimiento.categoria,
      monto: movimiento.monto,
      descripcion: movimiento.descripcion || '',
      fecha: movimiento.fecha
    });
    setEditando(movimiento.id);
  };

  // Función para guardar edición
  const guardarEdicion = async () => {
    try {
      // Validacion.
      if (!formularioEdit.tipo || !formularioEdit.categoria || formularioEdit.monto === '' || formularioEdit.monto === null || !formularioEdit.fecha) {
        setError('Todos los campos son obligatorios');
        return;
      }

      await transactionService.actualizarMovimiento(editando, {
        tipo: formularioEdit.tipo,
        categoria: formularioEdit.categoria,
        monto: parseFloat(formularioEdit.monto),
        descripcion: formularioEdit.descripcion,
        fecha: formularioEdit.fecha
      });
      setEditando(null);
      setFormularioEdit({});
      cargarMovimientos();
    } catch (err) {
      console.error('Error:', err);
      setError('Error al actualizar');
    }
  };

  const manejarCambioTipo = (e) => {
    const { value } = e.target;
    setFiltros({ ...filtros, tipo: value });
    setPaginacion({ ...paginacion, paginaActual: 1 });
  };

  const aplicarFiltroCategoria = () => {
    setFiltros({ ...filtros, categoria: categoriaInput });
    setPaginacion({ ...paginacion, paginaActual: 1 });
  };

  if (cargando) {
    return <div className="movimientos"><p>Cargando movimientos...</p></div>;
  }

  return (
    <div className="movimientos">
      <h1>📋 Mis Movimientos</h1>

      {error && <div className="error-message">{error}</div>}

      <div className="filtros">
        <div className="filtro-group">
          <label htmlFor="tipo">Tipo</label>
          <select
            id="tipo"
            name="tipo"
            value={filtros.tipo}
            onChange={manejarCambioTipo}
          >
            <option value="">Todos</option>
            <option value="ingreso">Ingreso</option>
            <option value="gasto">Gasto</option>
          </select>
        </div>

        <div className="filtro-group">
          <label htmlFor="categoria">Categoría</label>
          <div className="categoria-busqueda">
            <input
              type="text"
              id="categoria"
              name="categoria"
              value={categoriaInput}
              onChange={(e) => setCategoriaInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') aplicarFiltroCategoria();
              }}
              placeholder="Buscar categoría..."
            />
            <button className="btn-buscar" onClick={aplicarFiltroCategoria}>🔍</button>
          </div>
        </div>
      </div>

      {movimientos.length === 0 ? (
        <div className="sin-movimientos">
          <p>No hay movimientos registrados con los filtros seleccionados.</p>
        </div>
      ) : (
        <>
          <div className="tabla-container">
            <table className="tabla-movimientos">
              <thead>
                <tr>
                  <th>Tipo</th>
                  <th>Categoría</th>
                  <th>Monto</th>
                  <th>Descripción</th>
                  <th>Fecha</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {movimientos.map((mov) => (
                  <tr key={mov.id} className={mov.tipo === 'ingreso' ? 'ingreso-row' : 'gasto-row'}>
                    <td className="tipo-badge">
                      {mov.tipo === 'ingreso' ? '⬆️ Ingreso' : '⬇️ Gasto'}
                    </td>
                    <td>{mov.categoria}</td>
                    <td className={`monto ${mov.tipo === 'ingreso' ? 'positivo' : 'negativo'}`}>
                      ${Number(mov.monto).toFixed(2)}
                    </td>
                    <td>{mov.descripcion || '-'}</td>
                    <td>{new Date(mov.fecha).toLocaleDateString('es-ES')}</td>
                    <td className="acciones">
                      <button
                        className="btn-editar"
                        onClick={() => iniciarEdicion(mov)}
                      >
                        ✏️ Editar
                      </button>
                      <button
                        className="btn-eliminar"
                        onClick={() => eliminarMovimiento(mov.id)}
                      >
                        🗑️ Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="paginacion">
            <button
              className="btn-pagina"
              onClick={() => setPaginacion({ ...paginacion, paginaActual: paginacion.paginaActual - 1 })}
              disabled={paginacion.paginaActual === 1}
            >
              ← Anterior
            </button>
            <span className="info-pagina">
              Página {paginacion.paginaActual} de {paginacion.totalPaginas}
            </span>
            <button
              className="btn-pagina"
              onClick={() => setPaginacion({ ...paginacion, paginaActual: paginacion.paginaActual + 1 })}
              disabled={paginacion.paginaActual === paginacion.totalPaginas}
            >
              Siguiente →
            </button>
          </div>
        </>
      )}

      {editando && (
        <div className="modal-edit">
          <div className="modal-content">
            <h2>Editar Movimiento</h2>
            <div className="form-group">
              <label>Tipo</label>
              <select
                value={formularioEdit.tipo}
                onChange={(e) => setFormularioEdit({ ...formularioEdit, tipo: e.target.value })}
              >
                <option value="ingreso">Ingreso</option>
                <option value="gasto">Gasto</option>
              </select>
            </div>
            <div className="form-group">
              <label>Categoría</label>
              <input
                type="text"
                value={formularioEdit.categoria}
                onChange={(e) => setFormularioEdit({ ...formularioEdit, categoria: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Monto</label>
              <input
                type="number"
                value={formularioEdit.monto}
                onChange={(e) => setFormularioEdit({ ...formularioEdit, monto: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Descripción</label>
              <textarea
                value={formularioEdit.descripcion}
                onChange={(e) => setFormularioEdit({ ...formularioEdit, descripcion: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Fecha</label>
              <input
                type="date"
                value={formularioEdit.fecha ? (formularioEdit.fecha.includes('T') ? formularioEdit.fecha.split('T')[0] : formularioEdit.fecha) : ''}
                onChange={(e) => setFormularioEdit({ ...formularioEdit, fecha: e.target.value })}
              />
            </div>
            <div className="modal-buttons">
              <button className="btn-guardar" onClick={guardarEdicion}>
                Guardar
              </button>
              <button className="btn-cancelar" onClick={() => setEditando(null)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Movimientos;
