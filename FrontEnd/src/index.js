import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Proveedor de autenticación envuelve toda la aplicación
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
