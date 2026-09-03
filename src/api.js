const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

function getToken() {
  return localStorage.getItem('car_lot_token');
}

async function request(path, options = {}) {
  const token = getToken();

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || body.errors?.[0]?.message || `Error ${res.status}`);
  }

  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  // Catálogo público
  getVehicles: (params = {}) => {
    const query = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v !== '' && v != null))
    ).toString();
    return request(`/vehicles${query ? `?${query}` : ''}`);
  },
  getVehicle: (id) => request(`/vehicles/${id}`),
  getBrands: () => request('/brands'),
  getVehicleTypes: () => request('/vehicle-types'),

  // Auth
  login: (email, password) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  me: () => request('/auth/me'),

  // Administración de vehículos
  createVehicle: (data) => request('/vehicles', { method: 'POST', body: JSON.stringify(data) }),
  updateVehicle: (id, data) => request(`/vehicles/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  updateVehicleStatus: (id, status, reason) =>
    request(`/vehicles/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status, reason }) }),
  deleteVehicle: (id) => request(`/vehicles/${id}`, { method: 'DELETE' }),
  addVehicleImages: (id, images) =>
    request(`/vehicles/${id}/images`, { method: 'POST', body: JSON.stringify({ images }) }),
  removeVehicleImage: (id, imageId) =>
    request(`/vehicles/${id}/images/${imageId}`, { method: 'DELETE' }),
  getVehicleHistory: (id) => request(`/vehicles/${id}/history`),

  // Marcas y tipos
  createBrand: (name) => request('/brands', { method: 'POST', body: JSON.stringify({ name }) }),
  createVehicleType: (name) => request('/vehicle-types', { method: 'POST', body: JSON.stringify({ name }) }),

  // Personal (admin/vendedores)
  getStaff: () => request('/auth/staff'),
  createStaffMember: (data) => request('/auth/staff', { method: 'POST', body: JSON.stringify(data) }),
  deleteStaffMember: (id) => request(`/auth/staff/${id}`, { method: 'DELETE' }),

  // Ventas
  getSales: () => request('/sales'),
  getSale: (id) => request(`/sales/${id}`),
  createSale: (data) => request('/sales', { method: 'POST', body: JSON.stringify(data) }),
  updateSaleStatus: (id, status) =>
    request(`/sales/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),

  // Clientes (para el selector de comprador al crear una venta)
  registerCustomer: (data) => request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
};
