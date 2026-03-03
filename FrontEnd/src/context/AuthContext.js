import React, { createContext, useState, useContext, useEffect } from 'react';

// Se crea el contexto de autenticación
const AuthContext = createContext();

// Proveedor del contexto
export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(null);
  const [cargando, setCargando] = useState(true);

  // Al montar el componente verificamos si hay sesión guardada
  useEffect(() => {
    const tokenGuardado = localStorage.getItem('token');
    const usuarioGuardado = localStorage.getItem('usuario');
    
    if (tokenGuardado && usuarioGuardado) {
      setToken(tokenGuardado);
      setUsuario(JSON.parse(usuarioGuardado));
    }
    
    setCargando(false);
  }, []);

  // Función para hacer login
  const login = (usuarioData, tokenData) => {
    setUsuario(usuarioData);
    setToken(tokenData);
    localStorage.setItem('token', tokenData);
    localStorage.setItem('usuario', JSON.stringify(usuarioData));
  };

  // Función para hacer logout
  const logout = () => {
    setUsuario(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  };

  // Verificamos si el usuario está autenticado
  const estaAutenticado = () => !!token;

  // Verificamos si el usuario es admin
  const esAdmin = () => usuario?.rol === 'admin';

  return (
    <AuthContext.Provider value={{ usuario, token, cargando, login, logout, estaAutenticado, esAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};
