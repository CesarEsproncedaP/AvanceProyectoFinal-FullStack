import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api.service';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

// Página de login y registro
const Login = () => {
  const [esRegistro, setEsRegistro] = useState(false);
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Función para manejar el submit
  const manejarSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    try {
      let respuesta;

      if (esRegistro) {
        // Registrarse
        respuesta = await authService.register(nombre, correo, contrasena);
      } else {
        // Iniciar sesión
        respuesta = await authService.login(correo, contrasena);
      }

      const { token, usuario } = respuesta.data;
      login(usuario, token);
      navigate('/dashboard');

    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error en la solicitud');
    } finally {
      setCargando(false);
    }
  };

  // Limpiar formulario cuando se cambia entre login y registro
  const cambiarModo = () => {
    setEsRegistro(!esRegistro);
    setError('');
    setNombre('');
    setCorreo('');
    setContrasena('');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>💰 Gestor de Gastos</h1>
        <h2>{esRegistro ? 'Registrarse' : 'Iniciar Sesión'}</h2>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={manejarSubmit} className="auth-form">
          {esRegistro && (
            <div className="form-group">
              <label htmlFor="nombre">Nombre</label>
              <input
                type="text"
                id="nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                placeholder="Tu nombre completo"
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="correo">Correo</label>
            <input
              type="email"
              id="correo"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
              placeholder="correo@example.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="contrasena">Contraseña</label>
            <input
              type="password"
              id="contrasena"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              required
              placeholder="Tu contraseña"
            />
          </div>

          <button 
            type="submit" 
            className="submit-button"
            disabled={cargando}
          >
            {cargando ? 'Cargando...' : (esRegistro ? 'Registrarse' : 'Iniciar Sesión')}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            {esRegistro ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}
            {' '}
            <button 
              type="button"
              className="toggle-button"
              onClick={cambiarModo}
            >
              {esRegistro ? 'Iniciar Sesión' : 'Registrarse'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
