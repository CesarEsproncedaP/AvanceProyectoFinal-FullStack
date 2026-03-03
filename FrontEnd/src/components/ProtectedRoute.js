import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Componente para proteger rutas
const ProtectedRoute = ({ children }) => {
  const { estaAutenticado, cargando } = useAuth();

  if (cargando) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <p>Cargando...</p>
      </div>
    );
  }

  if (!estaAutenticado()) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
