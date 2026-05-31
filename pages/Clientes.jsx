import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { clientesApi } from '../services/api';

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    clientesApi.listar().then(setClientes).catch((e) => setError(e.message));
  }, []);

  const handleEliminar = async (id, nombres) => {
    if (!confirm(`¿Eliminar a "${nombres}"? Esta acción no se puede deshacer.`)) return;
    try {
      await clientesApi.eliminar(id);
      setClientes(clientes.filter((c) => c.id !== id));
    } catch (e) {
      setError(e.message);
    }
  };

  if (error) return <div className="alert alert-error">{error}</div>;

  return (
    <div className="page">
      <div className="page-header">
        <h2>Gestión de Clientes</h2>
        <Link to="/clientes/nuevo" className="btn btn-primary">+ Nuevo Cliente</Link>
      </div>

      {clientes.length === 0 ? (
        <div className="empty-state">
          <p>No hay clientes registrados aún.</p>
          <Link to="/clientes/nuevo" className="btn btn-primary">Registrar primer cliente</Link>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombres</th>
                <th>Identificación</th>
                <th>Celular</th>
                <th>Fecha Inscripción</th>
                <th>Género</th>
                <th>Días Rest.</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((c) => (
                <tr key={c.id}>
                  <td>{c.id}</td>
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
                  <td className="actions">
                    <Link to={`/clientes/editar/${c.id}`} className="btn btn-sm btn-secondary">Editar</Link>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleEliminar(c.id, c.nombres)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
