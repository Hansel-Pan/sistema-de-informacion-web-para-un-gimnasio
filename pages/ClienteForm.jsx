import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { clientesApi } from '../services/api';

export default function ClienteForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const esEdicion = Boolean(id);

  const [form, setForm] = useState({
    nombres: '',
    identificacion: '',
    celular: '',
    fecha_inscripcion: new Date().toISOString().split('T')[0],
    genero: 'Masculino',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      clientesApi.obtener(id).then((data) => {
        setForm({
          nombres: data.nombres,
          identificacion: data.identificacion,
          celular: data.celular,
          fecha_inscripcion: data.fecha_inscripcion.split('T')[0],
          genero: data.genero,
        });
      }).catch((e) => setError(e.message));
    }
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.nombres.trim() || !form.identificacion.trim() || !form.celular.trim() || !form.fecha_inscripcion) {
      setError('Todos los campos son obligatorios');
      return;
    }

    setLoading(true);
    try {
      if (esEdicion) {
        await clientesApi.actualizar(id, form);
      } else {
        await clientesApi.crear(form);
      }
      navigate('/clientes');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <h2>{esEdicion ? 'Editar Cliente' : 'Nuevo Cliente'}</h2>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="nombres">Nombres completos</label>
          <input id="nombres" name="nombres" value={form.nombres} onChange={handleChange} placeholder="Ej: Juan Pérez" required />
        </div>

        <div className="form-group">
          <label htmlFor="identificacion">Identificación</label>
          <input id="identificacion" name="identificacion" value={form.identificacion} onChange={handleChange} placeholder="Ej: 1234567890" required />
        </div>

        <div className="form-group">
          <label htmlFor="celular">Número de celular</label>
          <input id="celular" name="celular" value={form.celular} onChange={handleChange} placeholder="Ej: 3001234567" required />
        </div>

        <div className="form-group">
          <label htmlFor="fecha_inscripcion">Fecha de inscripción</label>
          <input id="fecha_inscripcion" name="fecha_inscripcion" type="date" value={form.fecha_inscripcion} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="genero">Género</label>
          <select id="genero" name="genero" value={form.genero} onChange={handleChange}>
            <option value="Masculino">Masculino</option>
            <option value="Femenino">Femenino</option>
            <option value="Otro">Otro</option>
          </select>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Guardando...' : esEdicion ? 'Actualizar Cliente' : 'Registrar Cliente'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/clientes')}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
