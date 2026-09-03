import { useEffect, useState, useCallback } from 'react';
import { api } from '../../api';
import { formatPrice } from '../../utils';

const SALE_STATUS_LABEL = {
  RESERVED: 'Apartado',
  COMPLETED: 'Completada',
  CANCELLED: 'Cancelada',
};

export default function SalesAdmin() {
  const [sales, setSales] = useState([]);
  const [availableVehicles, setAvailableVehicles] = useState([]);
  const [status, setStatus] = useState('loading');
  const [showForm, setShowForm] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  const load = useCallback(() => {
    setStatus('loading');
    Promise.all([api.getSales(), api.getVehicles({ status: 'AVAILABLE', limit: 100 })])
      .then(([salesRes, vehiclesRes]) => {
        setSales(salesRes);
        setAvailableVehicles(vehiclesRes.data);
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  }, []);

  useEffect(load, [load]);

  async function handleStatusChange(sale, newStatus) {
    if (newStatus === sale.status) return;
    setUpdatingId(sale.id);
    try {
      await api.updateSaleStatus(sale.id, newStatus);
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
          <h1 className="admin-page__title">Ventas</h1>
          <p className="admin-page__sub">Reserva o registra la venta de un vehículo disponible.</p>
        </div>
        <button className="cta-btn" onClick={() => setShowForm((v) => !v)}>
          {showForm ? 'Cancelar' : '+ Registrar venta'}
        </button>
      </div>

      {showForm && (
        <NewSaleForm
          availableVehicles={availableVehicles}
          onCreated={() => {
            setShowForm(false);
            load();
          }}
        />
      )}

      {status === 'loading' && <p className="loading">Cargando…</p>}
      {status === 'error' && <p className="error-state">No se pudieron cargar las ventas.</p>}

      {status === 'ready' && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Vehículo</th>
                <th>Comprador</th>
                <th>Precio</th>
                <th>Fecha</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((s) => (
                <tr key={s.id}>
                  <td>
                    <strong>{s.vehicle?.brand?.name} {s.vehicle?.model}</strong>
                    <div className="admin-table__muted">#{s.vehicle?.stockNumber}</div>
                  </td>
                  <td>
                    {s.buyer?.name}
                    <div className="admin-table__muted">{s.buyer?.email}</div>
                  </td>
                  <td className="mono">{formatPrice(s.salePrice)}</td>
                  <td className="admin-table__muted">{new Date(s.saleDate).toLocaleDateString('es-MX')}</td>
                  <td>
                    <select
                      className={`status-select status-select--${s.status}`}
                      value={s.status}
                      disabled={updatingId === s.id || s.status === 'COMPLETED'}
                      onChange={(e) => handleStatusChange(s, e.target.value)}
                    >
                      {Object.keys(SALE_STATUS_LABEL).map((key) => (
                        <option key={key} value={key}>{SALE_STATUS_LABEL[key]}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {sales.length === 0 && (
            <div className="empty">
              <p className="empty__title">Sin ventas registradas</p>
              <p>Cuando registres una venta o reserva, va a aparecer aquí.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function NewSaleForm({ availableVehicles, onCreated }) {
  const [vehicleId, setVehicleId] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [downPayment, setDownPayment] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState('RESERVED');

  // Datos del comprador: si no existe, lo damos de alta como CUSTOMER de una vez
  const [buyerName, setBuyerName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function handleVehicleChange(e) {
    const id = e.target.value;
    setVehicleId(id);
    const v = availableVehicles.find((veh) => String(veh.id) === id);
    if (v) setSalePrice(v.price);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      // El comprador se registra como CUSTOMER con una contraseña temporal;
      // puede cambiarla después si el negocio le da acceso a su cuenta.
      const tempPassword = Math.random().toString(36).slice(-10);
      const { user: buyer } = await api.registerCustomer({
        name: buyerName,
        email: buyerEmail,
        phone: buyerPhone,
        password: tempPassword,
      });

      await api.createSale({
        vehicleId: Number(vehicleId),
        buyerId: buyer.id,
        salePrice: Number(salePrice),
        downPayment: downPayment ? Number(downPayment) : undefined,
        notes,
        status,
      });

      onCreated();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="admin-form" onSubmit={handleSubmit} style={{ marginBottom: 32 }}>
      <div className="admin-form__grid">
        <div className="field">
          <label htmlFor="vehicleId">Vehículo</label>
          <select id="vehicleId" required value={vehicleId} onChange={handleVehicleChange}>
            <option value="">Selecciona un auto disponible…</option>
            {availableVehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.brand?.name} {v.model} {v.year} — #{v.stockNumber}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="salePrice">Precio de venta</label>
          <input id="salePrice" type="number" required value={salePrice} onChange={(e) => setSalePrice(e.target.value)} />
        </div>

        <div className="field">
          <label htmlFor="buyerName">Nombre del comprador</label>
          <input id="buyerName" required value={buyerName} onChange={(e) => setBuyerName(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="buyerEmail">Correo del comprador</label>
          <input id="buyerEmail" type="email" required value={buyerEmail} onChange={(e) => setBuyerEmail(e.target.value)} />
        </div>

        <div className="field">
          <label htmlFor="buyerPhone">Teléfono</label>
          <input id="buyerPhone" value={buyerPhone} onChange={(e) => setBuyerPhone(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="downPayment">Anticipo (opcional)</label>
          <input id="downPayment" type="number" value={downPayment} onChange={(e) => setDownPayment(e.target.value)} />
        </div>

        <div className="field">
          <label htmlFor="status">Estado inicial</label>
          <select id="status" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="RESERVED">Apartado (aún sin completar pago)</option>
            <option value="COMPLETED">Completada (venta cerrada)</option>
          </select>
        </div>
      </div>

      <div className="field">
        <label htmlFor="notes">Notas</label>
        <textarea id="notes" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
      </div>

      {error && <p className="form-error">{error}</p>}

      <button className="cta-btn" type="submit" disabled={saving}>
        {saving ? 'Guardando…' : 'Registrar venta'}
      </button>
    </form>
  );
}
