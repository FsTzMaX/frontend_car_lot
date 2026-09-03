import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api';
import { formatPrice } from '../../utils';

export default function Dashboard() {
  const [vehicles, setVehicles] = useState([]);
  const [sales, setSales] = useState([]);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    Promise.all([api.getVehicles({ limit: 100 }), api.getSales()])
      .then(([vRes, salesRes]) => {
        setVehicles(vRes.data);
        setSales(salesRes);
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  }, []);

  if (status === 'loading') return <p className="loading">Cargando resumen…</p>;
  if (status === 'error') return <p className="error-state">No se pudo cargar el resumen.</p>;

  const available = vehicles.filter((v) => v.status === 'AVAILABLE').length;
  const reserved = vehicles.filter((v) => v.status === 'RESERVED').length;
  const sold = vehicles.filter((v) => v.status === 'SOLD').length;
  const completedSales = sales.filter((s) => s.status === 'COMPLETED');
  const totalRevenue = completedSales.reduce((sum, s) => sum + Number(s.salePrice), 0);

  return (
    <div>
      <h1 className="admin-page__title">Resumen</h1>
      <p className="admin-page__sub">Vista general del inventario y las ventas del lote.</p>

      <div className="stat-grid">
        <div className="stat-card">
          <span className="stat-card__value">{available}</span>
          <span className="stat-card__label">Disponibles</span>
        </div>
        <div className="stat-card">
          <span className="stat-card__value">{reserved}</span>
          <span className="stat-card__label">Apartados</span>
        </div>
        <div className="stat-card">
          <span className="stat-card__value">{sold}</span>
          <span className="stat-card__label">Vendidos</span>
        </div>
        <div className="stat-card stat-card--amber">
          <span className="stat-card__value">{formatPrice(totalRevenue)}</span>
          <span className="stat-card__label">Ingresos por ventas completadas</span>
        </div>
      </div>

      <div className="admin-page__actions">
        <Link to="/admin/vehiculos/nuevo" className="cta-btn">+ Dar de alta un auto</Link>
      </div>
    </div>
  );
}
