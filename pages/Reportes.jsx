import { useState, useEffect } from 'react';
import { clientesApi, accesoApi } from '../services/api';

export default function Reportes() {
  const [clientes, setClientes] = useState([]);
  const [ocupacion, setOcupacion] = useState([]);
  const [tab, setTab] = useState('clientes');

  useEffect(() => {
    clientesApi.listar().then(setClientes).catch(() => {});
    accesoApi.ocupacion().then(setOcupacion).catch(() => {});
  }, []);

  return (
    <div className="page">
      <h2>Reportes</h2>

      <div className="tabs">
        <button
          className={`tab ${tab === 'clientes' ? 'active' : ''}`}
          onClick={() => setTab('clientes')}
        >
          Listado General de Clientes
        </button>
        <button
          className={`tab ${tab === 'ocupacion' ? 'active' : ''}`}
          onClick={() => setTab('ocupacion')}
        >
          Ocupación Actual
        </button>
      </div>

      {tab === 'clientes' && (
        <div className="card">
          <h3>Todos los clientes inscritos ({clientes.length})</h3>
          {clientes.length === 0 ? (
            <p>No hay clientes registrados.</p>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Nombres</th>
                    <th>Identificación</th>
                    <th>Celular</th>
                    <th>Fecha Inscripción</th>
                    <th>Género</th>
                    <th>Días Rest.</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {clientes.map((c) => (
                    <tr key={c.id}>
                      <td>{c.nombres}</td>
                      <td>{c.identificacion}</td>
                      <td>{c.celular}</td>
                      <td>{new Date(c.fecha_inscripcion).toLocaleDateString()}</td>
                      <td>{c.genero}</td>
                      <td>{c.dias_restantes}</td>
                      <td>
                        <span className={`badge ${c.en_gimnasio ? 'badge-success' : 'badge-secondary'}`}>
                          {c.en_gimnasio ? 'Dentro' : 'Fuera'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {tab === 'ocupacion' && (
        <div className="card">
          <h3>Personas dentro del gimnasio ahora ({ocupacion.length})</h3>
          {ocupacion.length === 0 ? (
            <div className="empty-state">
              <p>No hay nadie en el gimnasio en este momento.</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Nombres</th>
                    <th>Identificación</th>
                    <th>Celular</th>
                    <th>Género</th>
                    <th>Días Rest.</th>
                  </tr>
                </thead>
                <tbody>
                  {ocupacion.map((c) => (
                    <tr key={c.id}>
                      <td>{c.nombres}</td>
                      <td>{c.identificacion}</td>
                      <td>{c.celular}</td>
                      <td>{c.genero}</td>
                      <td>{c.dias_restantes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
