import { useEffect, useState, useCallback } from 'react';
import { api } from '../../api';

export default function BrandsTypesAdmin() {
  const [brands, setBrands] = useState([]);
  const [types, setTypes] = useState([]);
  const [newBrand, setNewBrand] = useState('');
  const [newType, setNewType] = useState('');
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');

  const load = useCallback(() => {
    setStatus('loading');
    Promise.all([api.getBrands(), api.getVehicleTypes()])
      .then(([b, t]) => {
        setBrands(b);
        setTypes(t);
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  }, []);

  useEffect(load, [load]);

  async function handleAddBrand(e) {
    e.preventDefault();
    if (!newBrand.trim()) return;
    setError('');
    try {
      await api.createBrand(newBrand.trim());
      setNewBrand('');
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleAddType(e) {
    e.preventDefault();
    if (!newType.trim()) return;
    setError('');
    try {
      await api.createVehicleType(newType.trim());
      setNewType('');
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <h1 className="admin-page__title">Marcas y tipos</h1>
      <p className="admin-page__sub">Catálogo base que se usa al dar de alta vehículos.</p>

      {status === 'loading' && <p className="loading">Cargando…</p>}
      {status === 'error' && <p className="error-state">No se pudo cargar el catálogo.</p>}

      {status === 'ready' && (
        <div className="catalog-columns">
          <section>
            <h2 className="admin-page__title" style={{ fontSize: 20 }}>Marcas</h2>
            <form className="inline-form" onSubmit={handleAddBrand}>
              <input
                type="text"
                placeholder="Ej. Honda"
                value={newBrand}
                onChange={(e) => setNewBrand(e.target.value)}
              />
              <button type="submit" className="filters__reset">Agregar</button>
            </form>
            <ul className="tag-list">
              {brands.map((b) => (
                <li key={b.id}>
                  {b.name} <span className="admin-table__muted">({b._count?.vehicles ?? 0})</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="admin-page__title" style={{ fontSize: 20 }}>Tipos de vehículo</h2>
            <form className="inline-form" onSubmit={handleAddType}>
              <input
                type="text"
                placeholder="Ej. Pickup"
                value={newType}
                onChange={(e) => setNewType(e.target.value)}
              />
              <button type="submit" className="filters__reset">Agregar</button>
            </form>
            <ul className="tag-list">
              {types.map((t) => (
                <li key={t.id}>
                  {t.name} <span className="admin-table__muted">({t._count?.vehicles ?? 0})</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}

      {error && <p className="form-error">{error}</p>}
    </div>
  );
}
