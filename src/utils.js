export function formatPrice(value) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 0,
  }).format(Number(value));
}

export function formatMileage(km) {
  return `${new Intl.NumberFormat('es-MX').format(km)} km`;
}

export const STATUS_LABEL = {
  AVAILABLE: 'Disponible',
  RESERVED: 'Apartado',
  SOLD: 'Vendido',
  IN_SERVICE: 'En servicio',
};

export const TRANSMISSION_LABEL = {
  MANUAL: 'Manual',
  AUTOMATIC: 'Automática',
};

export const FUEL_LABEL = {
  GASOLINE: 'Gasolina',
  DIESEL: 'Diésel',
  HYBRID: 'Híbrido',
  ELECTRIC: 'Eléctrico',
};

export const CONDITION_LABEL = {
  NEW: 'Nuevo',
  USED: 'Usado',
};
