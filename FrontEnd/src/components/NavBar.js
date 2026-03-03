import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './NavBar.css';

// Barra de navegación
const NavBar = () => {
  const { usuario, logout, estaAutenticado } = useAuth();

  if (!estaAutenticado()) {
    return null;
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-logo">
          💰 Gestor de Gastos
        </Link>
        
        <div className="navbar-menu">
          <Link to="/dashboard" className="navbar-link">
            Dashboard
          </Link>
          <Link to="/movimientos" className="navbar-link">
            Movimientos
          </Link>
          <Link to="/crear" className="navbar-link">
            Crear Movimiento
          </Link>
          {usuario?.rol === 'admin' && (
            <Link to="/usuarios" className="navbar-link">
              Usuarios
            </Link>
          )}
          
          <div className="navbar-user">
            <span className="navbar-username">{usuario?.nombre}</span>
            {usuario?.rol === 'admin' && (
              <span className="navbar-badge">👨‍💼 Admin</span>
            )}
            <button onClick={logout} className="navbar-logout">
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
