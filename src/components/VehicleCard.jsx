import { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatPrice, formatMileage, STATUS_LABEL } from '../utils';

export default function VehicleCard({ vehicle }) {
  const images = vehicle.images || [];
  const [index, setIndex] = useState(0);
  const hasMultiple = images.length > 1;
  const current = images[index]?.url;

  const goTo = (e, i) => {
    e.preventDefault();
    e.stopPropagation();
    setIndex(i);
  };

  const prev = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  };

  const next = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIndex((i) => (i === images.length - 1 ? 0 : i + 1));
  };

  return (
    <Link to={`/vehiculos/${vehicle.id}`} className="car-card">
      <div className="car-card__media">
        <span className={`car-card__status car-card__status--${vehicle.status}`}>
          {STATUS_LABEL[vehicle.status] || vehicle.status}
        </span>
        {current ? (
          <>
            <img
              key={current}
              src={current}
              alt={`${vehicle.brand?.name} ${vehicle.model}`}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            {hasMultiple && (
              <>
                <button type="button" className="car-card__nav car-card__nav--prev" onClick={prev} aria-label="Foto anterior">
                  ‹
                </button>
                <button type="button" className="car-card__nav car-card__nav--next" onClick={next} aria-label="Foto siguiente">
                  ›
                </button>
                <div className="car-card__dots">
                  {images.map((img, i) => (
                    <button
                      key={img.id ?? i}
                      type="button"
                      className={`car-card__dot ${i === index ? 'is-active' : ''}`}
                      onClick={(e) => goTo(e, i)}
                      aria-label={`Ver foto ${i + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="car-card__media-empty">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path
                d="M3 13l1.5-4.5A2 2 0 0 1 6.4 7h11.2a2 2 0 0 1 1.9 1.5L21 13v5a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-1H6v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-5z"
                strokeLinejoin="round"
              />
              <circle cx="7" cy="16" r="1.4" fill="currentColor" stroke="none" />
              <circle cx="17" cy="16" r="1.4" fill="currentColor" stroke="none" />
            </svg>
            <span>SIN FOTO · {vehicle.stockNumber}</span>
          </div>
        )}
      </div>

      <div className="car-card__body">
        <span className="car-card__brand">{vehicle.brand?.name}</span>
        <h3 className="car-card__title">
          {vehicle.model} {vehicle.year}
        </h3>
        <div className="car-card__specs">
          <span>{formatMileage(vehicle.mileage)}</span>
          <span>{vehicle.type?.name}</span>
          {vehicle.color && <span>{vehicle.color}</span>}
        </div>

        <div className="car-card__footer">
          <div className="price-tag">
            <span className="price-tag__amount">{formatPrice(vehicle.price)}</span>
            <span className="price-tag__label">Precio de lista</span>
          </div>
          <span className="stock-code">#{vehicle.stockNumber}</span>
        </div>
      </div>
    </Link>
  );
}
