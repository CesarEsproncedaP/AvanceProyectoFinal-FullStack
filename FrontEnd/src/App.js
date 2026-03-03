import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import NavBar from './components/NavBar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Movimientos from './pages/Movimientos';
import Crear from './pages/Crear';
import AdminUsuarios from './pages/AdminUsuarios';
import './App.css';

// Componente principal de la aplicación
function App() {
  return (
    <AuthProvider>
      <Router>
        <NavBar />
        <main className="main-content">
          <Routes>
            {/* Ruta pública para login */}
            <Route path="/login" element={<Login />} />

            {/* Rutas protegidas */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/movimientos" 
              element={
                <ProtectedRoute>
                  <Movimientos />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/crear" 
              element={
                <ProtectedRoute>
                  <Crear />
                </ProtectedRoute>
              } 
            />
            <Route
              path="/usuarios"
              element={
                <ProtectedRoute>
                  <AdminUsuarios />
                </ProtectedRoute>
              }
            />

            {/* Redirigir a dashboard por defecto */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </Router>
    </AuthProvider>
  );
}

export default App;
