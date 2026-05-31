import { useState, useEffect } from 'react';
import { clientesApi, pagosApi } from '../services/api';

const PRECIOS = [
  { dias: 1, label: '1 día', precio: '$8.000/día' },
  { dias: 14, label: '14 días', precio: '$8.000/día' },
  { dias: 15, label: 'Paquete 15 días', precio: '$50.000' },
  { dias: 30, label: 'Paquete 30 días', precio: '$90.000' },
  { dias: 365, label: 'Año completo', precio: '$1.000.000' },
];

function calcularTotal(dias) {
  if (dias === 365) return 1000000;
  if (dias === 30) return 90000;
  if (dias === 15) return 50000;
  if (dias >= 1 && dias <= 14) return dias * 8000;
  return 0;
}

export default function Pagos() {
  const [clientes, setClientes] = useState([]);
  const [pagos, setPagos] = useState([]);
  const [form, setForm] = useState({ cliente_id: '', fecha_pago: new Date().toISOString().split('T')[0], dias_contratados: 30 });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    clientesApi.listar().then(setClientes).catch((e) => setError(e.message));
    listarPagos();
  }, []);

  const listarPagos = () => {
    pagosApi.listar().then(setPagos).catch((e) => setError(e.message));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.cliente_id) {
      setError('Debe seleccionar un cliente');
      return;
    }

    try {
      const pago = await pagosApi.crear({
        cliente_id: Number(form.cliente_id),
        fecha_pago: form.fecha_pago,
        dias_contratados: Number(form.dias_contratados),
      });
      setSuccess(`Pago registrado: $${pago.total.toLocaleString()} por ${form.dias_contratados} días`);
      listarPagos();
      const updated = await clientesApi.listar();
      setClientes(updated);
      setForm({ ...form, cliente_id: '' });
    } catch (e) {
      setError(e.message);
    }
  };

  const total = calcularTotal(Number(form.dias_contratados));

  return (
    <div className="page">
      <h2>Registro de Pagos</h2>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="card">
        <h3>Nuevo Pago</h3>
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label>Cliente</label>
            <select name="cliente_id" value={form.cliente_id} onChange={handleChange} required>
              <option value="">-- Seleccione un cliente --</option>
              {clientes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombres} - {c.identificacion} (Días restantes: {c.dias_restantes})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Fecha del pago</label>
            <input type="date" name="fecha_pago" value={form.fecha_pago} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Días contratados</label>
            <input
              type="number"
              name="dias_contratados"
              min="1"
              max="365"
              value={form.dias_contratados}
              onChange={handleChange}
              required
            />
            <small>Valor: ${total.toLocaleString()}</small>
          </div>

          <div className="precios-ref">
            <strong>Referencia de precios:</strong>
            <ul>
              {PRECIOS.map((p) => (
                <li key={p.dias}>{p.label}: {p.precio}</li>
              ))}
            </ul>
          </div>

          <button type="submit" className="btn btn-primary">
            Registrar Pago (${total.toLocaleString()})
          </button>
        </form>
      </div>

      <div className="card">
        <h3>Historial de Pagos</h3>
        {pagos.length === 0 ? (
          <p>No hay pagos registrados.</p>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Cliente</th>
                  <th>Identificación</th>
                  <th>Fecha</th>
                  <th>Días</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {pagos.map((p) => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.nombres}</td>
                    <td>{p.identificacion}</td>
                    <td>{new Date(p.fecha_pago).toLocaleDateString()}</td>
                    <td>{p.dias_contratados}</td>
                    <td>${Number(p.total).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
