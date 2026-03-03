import React, { useEffect, useState } from 'react';
import { authService } from '../services/api.service';
import { useAuth } from '../context/AuthContext';
import './AdminUsuarios.css';

const AdminUsuarios = () => {
  const { esAdmin } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (esAdmin()) cargarUsuarios();
  }, [esAdmin]);

  const cargarUsuarios = async () => {
    try {
      setCargando(true);
      const resp = await authService.obtenerUsuarios();
      setUsuarios(resp.data.usuarios);
      setError('');
    } catch (err) {
      console.error(err);
      setError('No se pudieron cargar los usuarios');
    } finally {
      setCargando(false);
    }
  };

  const borrar = async (id) => {
    if (!window.confirm('¿Eliminar este usuario?')) return;
    try {
      await authService.eliminarUsuario(id);
      cargarUsuarios();
    } catch (err) {
      setError('Error al eliminar usuario');
    }
  };

  if (!esAdmin()) {
    return <div className="admin-usuarios"><p>No tienes permiso para ver esta página.</p></div>;
  }

  if (cargando) return <div className="admin-usuarios"><p>Cargando...</p></div>;

  return (
    <div className="admin-usuarios">
      <h1>👥 Gestión de Usuarios</h1>
      {error && <div className="error-message">{error}</div>}
      <table className="tabla-usuarios">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map(u => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.nombre}</td>
              <td>{u.correo}</td>
              <td>{u.rol}</td>
              <td>
                <button className="btn-eliminar" onClick={() => borrar(u.id)}>
                  🗑️ Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUsuarios;
