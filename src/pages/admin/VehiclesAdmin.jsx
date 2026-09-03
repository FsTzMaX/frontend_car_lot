import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api';
import { formatPrice, formatMileage, STATUS_LABEL } from '../../utils';

const STATUS_OPTIONS = ['AVAILABLE', 'RESERVED', 'SOLD', 'IN_SERVICE'];

export default function VehiclesAdmin() {
  const [vehicles, setVehicles] = useState([]);
  const [status, setStatus] = useState('loading');
  const [updatingId, setUpdatingId] = useState(null);

  const load = useCallback(() => {
    setStatus('loading');
    api
      .getVehicles({ limit: 100 })
      .then((res) => {
        setVehicles(res.data);
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  }, []);

  useEffect(load, [load]);

  async function handleStatusChange(vehicle, newStatus) {
    if (newStatus === vehicle.status) return;
    setUpdatingId(vehicle.id);
    try {
      await api.updateVehicleStatus(vehicle.id, newStatus);
      load();
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div>
      <div className="admin-page__header">
        <div>
          <h1 className="admin-page__title">Vehículos</h1>
          <p className="admin-page__sub">Gestiona el inventario completo del lote.</p>
        </div>
        <Link to="/admin/vehiculos/nuevo" className="cta-btn">+ Dar de alta un auto</Link>
      </div>

      {status === 'loading' && <p className="loading">Cargando…</p>}
      {status === 'error' && <p className="error-state">No se pudo cargar el inventario.</p>}

      {status === 'ready' && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Folio</th>
                <th>Vehículo</th>
                <th>Kilometraje</th>
                <th>Precio</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((v) => (
                <tr key={v.id}>
                  <td className="mono">{v.stockNumber}</td>
                  <td>
                    <strong>{v.brand?.name} {v.model}</strong>
                    <div className="admin-table__muted">{v.year} · {v.type?.name}</div>
                  </td>
                  <td className="mono">{formatMileage(v.mileage)}</td>
                  <td className="mono">{formatPrice(v.price)}</td>
                  <td>
                    <select
                      className={`status-select status-select--${v.status}`}
                      value={v.status}
                      disabled={updatingId === v.id}
                      onChange={(e) => handleStatusChange(v, e.target.value)}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>{STATUS_LABEL[s]}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <Link to={`/admin/vehiculos/${v.id}/editar`} className="admin-table__link">
                      Editar
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {vehicles.length === 0 && (
            <div className="empty">
              <p className="empty__title">Sin vehículos todavía</p>
              <p>Da de alta el primer auto del lote para empezar.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
