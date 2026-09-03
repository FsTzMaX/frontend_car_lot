import { formatPrice, formatMileage, TRANSMISSION_LABEL, FUEL_LABEL, CONDITION_LABEL } from './utils';

// Arma el texto de especificaciones listo para copiar/enviar a un cliente.
export function buildVehicleSpecsText(v) {
  const lines = [
    `${v.brand?.name || ''} ${v.model} ${v.year}`.trim(),
    `Folio: ${v.stockNumber}`,
    `Precio: ${formatPrice(v.price)}`,
    `Kilometraje: ${formatMileage(v.mileage)}`,
    `Condición: ${CONDITION_LABEL[v.condition] || v.condition}`,
    `Transmisión: ${TRANSMISSION_LABEL[v.transmission] || v.transmission}`,
    `Combustible: ${FUEL_LABEL[v.fuelType] || v.fuelType}`,
    `Color: ${v.color}`,
  ];

  if (v.description) lines.push('', v.description);

  return lines.join('\n');
}

// Copia el texto de specs al portapapeles. Devuelve una promesa boolean de éxito.
export function copyVehicleSpecs(v) {
  const text = buildVehicleSpecsText(v);
  return navigator.clipboard
    .writeText(text)
    .then(() => true)
    .catch(() => false);
}

// Abre WhatsApp con el texto de specs pre-cargado.
// Si se pasa un número de destino, abre el chat directo con ese contacto (formato: 521XXXXXXXXXX).
export function openWhatsAppWithSpecs(v, phoneNumber = '') {
  const text = buildVehicleSpecsText(v);
  const base = phoneNumber ? `https://wa.me/${phoneNumber}` : 'https://wa.me/';
  const url = `${base}?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}
