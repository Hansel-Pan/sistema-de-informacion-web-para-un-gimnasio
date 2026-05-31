import { useState, useEffect } from 'react';
import { clientesApi, accesoApi } from '../services/api';

export default function Acceso() {
  const [clientes, setClientes] = useState([]);
  const [ocupacion, setOcupacion] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    clientesApi.listar().then(setClientes).catch((e) => setError(e.message));
    cargarOcupacion();
  }, []);

  const cargarOcupacion = () => {
    accesoApi.ocupacion().then(setOcupacion).catch((e) => setError(e.message));
  };

  const clientesFiltrados = clientes.filter(
    (c) =>
      c.nombres.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.identificacion.includes(busqueda)
  );

  const handleEntrada = async (id) => {
    setError('');
    setSuccess('');
    try {
      const res = await accesoApi.entrada(id);
      setSuccess(`Entrada registrada: ${res.nombres}. Días restantes: ${res.dias_restantes_actualizados}`);
      const updated = await clientesApi.listar();
      setClientes(updated);
      cargarOcupacion();
    } catch (e) {
      setError(e.message);
    }
  };

  const handleSalida = async (id) => {
    setError('');
    setSuccess('');
    try {
      const res = await accesoApi.salida(id);
      setSuccess(`Salida registrada: ${res.nombres}`);
      const updated = await clientesApi.listar();
      setClientes(updated);
      cargarOcupacion();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="page">
      <h2>Control de Acceso</h2>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="card">
        <h3>Clientes dentro del gimnasio ({ocupacion.length})</h3>
        {ocupacion.length === 0 ? (
          <div className="empty-state">
            <p>No hay clientes en el gimnasio en este momento.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Identificación</th>
                  <th>Celular</th>
                  <th>Días Rest.</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {ocupacion.map((c) => (
                  <tr key={c.id}>
                    <td>{c.nombres}</td>
                    <td>{c.identificacion}</td>
                    <td>{c.celular}</td>
                    <td>{c.dias_restantes}</td>
                    <td>
                      <button className="btn btn-sm btn-warning" onClick={() => handleSalida(c.id)}>
                        Registrar Salida
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="card">
        <h3>Registrar ingreso / salida</h3>
        <div className="form-group">
          <label>Buscar cliente por nombre o identificación</label>
          <input
            type="text"
            placeholder="Escriba para buscar..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        {busqueda && (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Identificación</th>
                  <th>Género</th>
                  <th>Días Rest.</th>
                  <th>Estado</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {clientesFiltrados.map((c) => (
                  <tr key={c.id}>
                    <td>{c.nombres}</td>
                    <td>{c.identificacion}</td>
                    <td>{c.genero}</td>
                    <td>{c.dias_restantes}</td>
                    <td>
                      <span className={`badge ${c.en_gimnasio ? 'badge-success' : 'badge-secondary'}`}>
                        {c.en_gimnasio ? 'Dentro' : 'Fuera'}
                      </span>
                    </td>
                    <td>
                      {c.en_gimnasio ? (
                        <button className="btn btn-sm btn-warning" onClick={() => handleSalida(c.id)}>
                          Salida
                        </button>
                      ) : (
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => handleEntrada(c.id)}
                          disabled={c.dias_restantes <= 0}
                          title={c.dias_restantes <= 0 ? 'Sin días disponibles' : ''}
                        >
                          Entrada
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {clientesFiltrados.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '1rem' }}>
                      No se encontraron clientes.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
