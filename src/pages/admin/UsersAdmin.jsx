import { useEffect, useState, useCallback } from 'react';
import { api } from '../../api';
import { useAuth } from '../../context/AuthContext';

const ROLE_LABEL = { ADMIN: 'Administrador', SALES: 'Vendedor' };

const EMPTY_FORM = { name: '', email: '', password: '', role: 'SALES' };

export default function UsersAdmin() {
  const { user: me } = useAuth();
  const [staff, setStaff] = useState([]);
  const [status, setStatus] = useState('loading');
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [removingId, setRemovingId] = useState(null);

  const load = useCallback(() => {
    setStatus('loading');
    api
      .getStaff()
      .then((data) => {
        setStaff(data);
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  }, []);

  useEffect(load, [load]);

  function updateField(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleCreate(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || form.password.length < 6) {
      setError('Completa nombre, email, y una contraseña de al menos 6 caracteres.');
      return;
    }
    setError('');
    setSaving(true);
    try {
      await api.createStaffMember({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        role: form.role,
      });
      setForm(EMPTY_FORM);
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id, name) {
    if (!window.confirm(`¿Eliminar a ${name}? Esta acción no se puede deshacer.`)) return;
    setError('');
    setRemovingId(id);
    try {
      await api.deleteStaffMember(id);
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setRemovingId(null);
    }
  }

  return (
    <div>
      <h1 className="admin-page__title">Usuarios</h1>
      <p className="admin-page__sub">
        Administradores y vendedores con acceso al panel. Los clientes ven el catálogo público sin necesidad de cuenta.
      </p>

      <form className="user-form" onSubmit={handleCreate}>
        <div className="user-form__grid">
          <label className="field">
            <span>Nombre</span>
            <input
              type="text"
              placeholder="Nombre completo"
              value={form.name}
              onChange={(e) => updateField('name', e.target.value)}
            />
          </label>
          <label className="field">
            <span>Email</span>
            <input
              type="email"
              placeholder="correo@lotedeautos.com"
              value={form.email}
              onChange={(e) => updateField('email', e.target.value)}
            />
          </label>
          <label className="field">
            <span>Contraseña</span>
            <input
              type="text"
              placeholder="Mínimo 6 caracteres"
              value={form.password}
              onChange={(e) => updateField('password', e.target.value)}
            />
          </label>
          <label className="field">
            <span>Rol</span>
            <select value={form.role} onChange={(e) => updateField('role', e.target.value)}>
              <option value="SALES">Vendedor</option>
              <option value="ADMIN">Administrador</option>
            </select>
          </label>
        </div>
        <button type="submit" className="filters__reset" disabled={saving}>
          {saving ? 'Creando…' : 'Agregar usuario'}
        </button>
      </form>

      {error && <p className="form-error">{error}</p>}

      {status === 'loading' && <p className="loading">Cargando…</p>}
      {status === 'error' && <p className="error-state">No se pudo cargar la lista de usuarios.</p>}

      {status === 'ready' && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Alta</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {staff.map((s) => (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td>{s.email}</td>
                  <td>{ROLE_LABEL[s.role] || s.role}</td>
                  <td className="admin-table__muted">
                    {new Date(s.createdAt).toLocaleDateString('es-MX')}
                  </td>
                  <td>
                    {s.id !== me?.id && (
                      <button
                        type="button"
                        className="user-form__delete"
                        onClick={() => handleDelete(s.id, s.name)}
                        disabled={removingId === s.id}
                      >
                        {removingId === s.id ? 'Eliminando…' : 'Eliminar'}
                      </button>
                    )}
                    {s.id === me?.id && <span className="admin-table__muted">Tú</span>}
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
