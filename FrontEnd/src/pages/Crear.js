import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { transactionService } from '../services/api.service';
import './Crear.css';

// Página para crear movimiento
const Crear = () => {
  const navigate = useNavigate();
  const [formulario, setFormulario] = useState({
    tipo: 'gasto',
    categoria: '',
    monto: '',
    descripcion: '',
    fecha: new Date().toISOString().split('T')[0]
  });
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  // Función para manejar cambios en el formulario
  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFormulario({ ...formulario, [name]: value });
  };

  // Función para submitir el formulario
  const manejarSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validar campos obligatorios
    if (!formulario.categoria || !formulario.monto || !formulario.fecha) {
      setError('Por favor completa todos los campos obligatorios');
      return;
    }

    if (parseFloat(formulario.monto) <= 0) {
      setError('El monto debe ser mayor a 0');
      return;
    }

    setCargando(true);

    try {
      await transactionService.crearMovimiento({
        tipo: formulario.tipo,
        categoria: formulario.categoria,
        monto: parseFloat(formulario.monto),
        descripcion: formulario.descripcion,
        fecha: formulario.fecha
      });

      navigate('/movimientos');
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al crear el movimiento');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="crear">
      <div className="crear-card">
        <h1>➕ Crear Nuevo Movimiento</h1>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={manejarSubmit} className="crear-form">
          <div className="form-group">
            <label htmlFor="tipo">Tipo de Movimiento</label>
            <select
              id="tipo"
              name="tipo"
              value={formulario.tipo}
              onChange={manejarCambio}
            >
              <option value="gasto">📉 Gasto</option>
              <option value="ingreso">📈 Ingreso</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="categoria">Categoría</label>
            <input
              type="text"
              id="categoria"
              name="categoria"
              value={formulario.categoria}
              onChange={manejarCambio}
              placeholder="Ej: Alimentos, Transporte, Salario"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="monto">Monto</label>
            <input
              type="number"
              id="monto"
              name="monto"
              value={formulario.monto}
              onChange={manejarCambio}
              placeholder="0.00"
              step="0.01"
              min="0"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="descripcion">Descripción</label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={formulario.descripcion}
              onChange={manejarCambio}
              placeholder="Opcional: detalles adicionales"
              rows="4"
            />
          </div>

          <div className="form-group">
            <label htmlFor="fecha">Fecha</label>
            <input
              type="date"
              id="fecha"
              name="fecha"
              value={formulario.fecha}
              onChange={manejarCambio}
              required
            />
          </div>

          <div className="form-buttons">
            <button
              type="submit"
              className="btn-submit"
              disabled={cargando}
            >
              {cargando ? 'Guardando...' : 'Crear Movimiento'}
            </button>
            <button
              type="button"
              className="btn-cancelar"
              onClick={() => navigate('/movimientos')}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Crear;
