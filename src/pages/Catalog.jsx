import { useEffect, useState, useCallback } from 'react';
import { api } from '../api';
import VehicleCard from '../components/VehicleCard';
import FilterBar from '../components/FilterBar';
import heroBg from '../assets/hero-bg.jpg';

const EMPTY_FILTERS = { search: '', brandId: '', typeId: '', condition: '', maxPrice: '' };

export default function Catalog() {
  const [vehicles, setVehicles] = useState([]);
  const [total, setTotal] = useState(0);
  const [brands, setBrands] = useState([]);
  const [types, setTypes] = useState([]);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [status, setStatus] = useState('loading'); // loading | ready | error

  useEffect(() => {
    api.getBrands().then(setBrands).catch(() => {});
    api.getVehicleTypes().then(setTypes).catch(() => {});
  }, []);

  const loadVehicles = useCallback(() => {
    setStatus('loading');
    api
      .getVehicles(filters)
      .then((res) => {
        setVehicles(res.data);
        setTotal(res.pagination.total);
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  }, [filters]);

  useEffect(() => {
    const timeout = setTimeout(loadVehicles, 300); // debounce mientras se escribe
    return () => clearTimeout(timeout);
  }, [loadVehicles]);

  return (
    <>
      <section className="hero" style={{ '--hero-bg': `url(${heroBg})` }}>
        <div className="container">
          <p className="hero__eyebrow">Inventario actualizado</p>
          <h1>Haz match con tu auto</h1>
          <p className="hero__sub">
            Autos nuevos y seminuevos, revisados y listos para manejar. Filtra por marca,
            tipo o presupuesto para ver justo lo que buscas.
          </p>
        </div>
      </section>

      <div className="container">
        <FilterBar
          filters={filters}
          onChange={setFilters}
          onReset={() => setFilters(EMPTY_FILTERS)}
          brands={brands}
          types={types}
        />

        <div className="results-bar">
          <span className="results-bar__count">
            {status === 'ready' && (
              <>
                <strong>{total}</strong> {total === 1 ? 'vehículo encontrado' : 'vehículos encontrados'}
              </>
            )}
          </span>
        </div>

        {status === 'loading' && <p className="loading">Cargando inventario…</p>}

        {status === 'error' && (
          <p className="error-state">
            No se pudo conectar con el servidor. Verifica que el backend esté corriendo en
            http://localhost:4000.
          </p>
        )}

        {status === 'ready' && vehicles.length === 0 && (
          <div className="empty">
            <p className="empty__title">Sin resultados</p>
            <p>Prueba con otros filtros o revisa más tarde — el inventario se actualiza seguido.</p>
          </div>
        )}

        {status === 'ready' && vehicles.length > 0 && (
          <div className="grid">
            {vehicles.map((v) => (
              <VehicleCard key={v.id} vehicle={v} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
