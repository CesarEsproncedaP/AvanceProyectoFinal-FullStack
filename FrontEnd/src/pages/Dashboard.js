import React, { useState, useEffect } from 'react';
import { transactionService } from '../services/api.service';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';
import './Dashboard.css';

ChartJS.register(Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);

// Dashboard principal
const Dashboard = () => {
  const [resumen, setResumen] = useState({
    total_ingresos: 0,
    total_gastos: 0,
    saldo: 0
  });
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [estadisticas, setEstadisticas] = useState({
    cumulativo: [],
    mensual: { labels: [], ingresos: [], gastos: [] }
  });

  // Se carga el resumen al montar el componente
  useEffect(() => {
    cargarResumen();
    cargarEstadisticas();
  }, []);

  // Función para cargar el resumen
  const cargarResumen = async () => {
    try {
      const respuesta = await transactionService.obtenerResumen();
      setResumen(respuesta.data.datos);
      setError('');
    } catch (err) {
      setError('Error al cargar el resumen');
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  const cargarEstadisticas = async () => {
    try {
      const resp = await transactionService.obtenerEstadisticas();
      setEstadisticas(resp.data.datos);
    } catch (err) {
      console.error('Error al cargar estadísticas', err);
    }
  };

  if (cargando) {
    return <div className="dashboard"><p>Cargando...</p></div>;
  }

  return (
    <div className="dashboard">
      <h1>📊 Dashboard Financiero</h1>

      {error && <div className="error-message">{error}</div>}

      <div className="resumen-container">
        <div className="resumen-card ingresos">
          <h3>Ingresos</h3>
          <p className="cantidad">
            ${resumen.total_ingresos?.toFixed(2) || '0.00'}
          </p>
        </div>

        <div className="resumen-card gastos">
          <h3>Gastos</h3>
          <p className="cantidad">
            ${resumen.total_gastos?.toFixed(2) || '0.00'}
          </p>
        </div>

        <div className={`resumen-card saldo ${resumen.saldo >= 0 ? 'positivo' : 'negativo'}`}>
          <h3>Saldo</h3>
          <p className="cantidad">
            ${resumen.saldo?.toFixed(2) || '0.00'}
          </p>
        </div>
      </div>

      <div className="grafico-linea">
        <h3>Saldo acumulado</h3>
        <Line
          data={{
            labels: estadisticas.cumulativo.map(i => i.fecha),
            datasets: [{
              label: 'Saldo',
              data: estadisticas.cumulativo.map(i => i.saldo),
              borderColor: '#3498db',
              backgroundColor: 'rgba(52,152,219,0.2)',
              tension: 0.3,
              fill: true
            }]
          }}
          options={{
            responsive: true,
            scales: { x: { ticks: { maxRotation: 45, minRotation: 0 } } },
            plugins: { legend: { display: false } }
          }}
        />
      </div>

      <div className="dashboard-info">
        <h2>Bienvenido al Gestor de Gastos Personales</h2>
        <p>En este panel puedes ver tu resumen financiero y gestionar tus movimientos.</p>
        <p>Navega a la sección de Movimientos para ver, crear, editar o eliminar tus registros.</p>
      </div>
    </div>
  );
};

export default Dashboard;
