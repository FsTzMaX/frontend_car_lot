import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api';
import {
  formatPrice,
  formatMileage,
  STATUS_LABEL,
  TRANSMISSION_LABEL,
  FUEL_LABEL,
  CONDITION_LABEL,
} from '../utils';

export default function VehicleDetail() {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [status, setStatus] = useState('loading');
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    setStatus('loading');
    api
      .getVehicle(id)
      .then((v) => {
        setVehicle(v);
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  }, [id]);

  if (status === 'loading') return <p className="loading">Cargando vehículo…</p>;
  if (status === 'error' || !vehicle) {
    return <p className="error-state">No se encontró este vehículo.</p>;
  }

  const images = vehicle.images || [];
  const isAvailable = vehicle.status === 'AVAILABLE';

  return (
    <div className="container detail">
      <Link to="/" className="detail__back">← Volver al inventario</Link>

      <div className="detail__layout">
        <div>
          <div className="detail__media">
            {images.length > 0 ? (
              <img
                src={images[activeImage].url}
                alt={`${vehicle.brand?.name} ${vehicle.model}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <span>SIN FOTOGRAFÍAS DISPONIBLES</span>
            )}
          </div>

          {images.length > 1 && (
            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
              {images.map((img, i) => (
                <img
                  key={img.id}
                  src={img.url}
                  alt={`Vista ${i + 1}`}
                  onClick={() => setActiveImage(i)}
                  style={{
                    width: '72px',
                    height: '54px',
                    objectFit: 'cover',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    border: i === activeImage ? '2px solid #f5a623' : '2px solid transparent',
                    opacity: i === activeImage ? 1 : 0.6,
                  }}
                />
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="detail__brand">{vehicle.brand?.name}</p>
          <h1>{vehicle.model} {vehicle.year}</h1>

          <div className="detail__price-block">
            <div className="price-tag">
              <span className="price-tag__amount">{formatPrice(vehicle.price)}</span>
              <span className="price-tag__label">
                {STATUS_LABEL[vehicle.status]} · Folio #{vehicle.stockNumber}
              </span>
            </div>
          </div>

          <div className="spec-table">
            <div className="spec-table__item">
              <span className="spec-table__label">Kilometraje</span>
              <span className="spec-table__value">{formatMileage(vehicle.mileage)}</span>
            </div>
            <div className="spec-table__item">
              <span className="spec-table__label">Condición</span>
              <span className="spec-table__value">{CONDITION_LABEL[vehicle.condition]}</span>
            </div>
            <div className="spec-table__item">
              <span className="spec-table__label">Transmisión</span>
              <span className="spec-table__value">{TRANSMISSION_LABEL[vehicle.transmission]}</span>
            </div>
            <div className="spec-table__item">
              <span className="spec-table__label">Combustible</span>
              <span className="spec-table__value">{FUEL_LABEL[vehicle.fuelType]}</span>
            </div>
            <div className="spec-table__item">
              <span className="spec-table__label">Color</span>
              <span className="spec-table__value">{vehicle.color || 'No especificado'}</span>
            </div>
            <div className="spec-table__item">
              <span className="spec-table__label">Tipo</span>
              <span className="spec-table__value">{vehicle.type?.name}</span>
            </div>
          </div>

          {vehicle.description && <p className="detail__desc">{vehicle.description}</p>}

          <button className="cta-btn" disabled={!isAvailable}>
            {isAvailable ? 'Contactar sobre este auto' : STATUS_LABEL[vehicle.status]}
          </button>
        </div>
      </div>
    </div>
  );
}
