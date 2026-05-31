import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { clientesApi, accesoApi } from '../services/api';

export default function Inicio() {
  const [stats, setStats] = useState({ total: 0, dentro: 0, conDias: 0 });

  useEffect(() => {
    Promise.all([clientesApi.listar(), accesoApi.ocupacion()]).then(([clientes, ocupacion]) => {
      setStats({
        total: clientes.length,
        dentro: ocupacion.length,
        conDias: clientes.filter((c) => c.dias_restantes > 0).length,
      });
    });
  }, []);

  return (
    <div className="page">
      <h2>Panel de Control</h2>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-number">{stats.total}</div>
          <div className="stat-label">Clientes registrados</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-number">{stats.conDias}</div>
          <div className="stat-label">Con membresía activa</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🚪</div>
          <div className="stat-number">{stats.dentro}</div>
          <div className="stat-label">Dentro del gimnasio</div>
        </div>
      </div>

      <div className="quick-actions">

        <h3>Acciones rápidas</h3>
        
        <div className="actions-grid">
          <Link to="/clientes/nuevo" className="action-card">
            <span className="action-icon">➕</span>
            <span>Nuevo Cliente</span>
          </Link>
          <Link to="/pagos" className="action-card">
            <span className="action-icon">💰</span>
            <span>Registrar Pago</span>
          </Link>
          <Link to="/acceso" className="action-card">
            <span className="action-icon">🚪</span>
            <span>Control Acceso</span>
          </Link>
          <Link to="/reportes" className="action-card">
            <span className="action-icon">📊</span>
            <span>Ver Reportes</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
