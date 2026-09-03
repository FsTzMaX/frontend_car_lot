import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/AdminLayout';
import Header from './components/Header';

import Catalog from './pages/Catalog';
import VehicleDetail from './pages/VehicleDetail';

import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import VehiclesAdmin from './pages/admin/VehiclesAdmin';
import VehicleForm from './pages/admin/VehicleForm';
import SalesAdmin from './pages/admin/SalesAdmin';
import BrandsTypesAdmin from './pages/admin/BrandsTypesAdmin';
import UsersAdmin from './pages/admin/UsersAdmin';

function PublicSite() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Catalog />} />
        <Route path="/vehiculos/:id" element={<VehicleDetail />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/admin/login" element={<Login />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="vehiculos" element={<VehiclesAdmin />} />
          <Route path="vehiculos/nuevo" element={<VehicleForm />} />
          <Route path="vehiculos/:id/editar" element={<VehicleForm />} />
          <Route path="ventas" element={<SalesAdmin />} />
          <Route path="catalogo" element={<BrandsTypesAdmin />} />
          <Route path="usuarios" element={<UsersAdmin />} />
        </Route>

        <Route path="/*" element={<PublicSite />} />
      </Routes>
    </AuthProvider>
  );
}
