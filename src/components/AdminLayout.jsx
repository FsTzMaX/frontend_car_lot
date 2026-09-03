import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
  { to: '/admin', label: 'Resumen', end: true },
  { to: '/admin/vehiculos', label: 'Vehículos' },
  { to: '/admin/ventas', label: 'Ventas' },
  { to: '/admin/catalogo', label: 'Marcas y tipos' },
  { to: '/admin/usuarios', label: 'Usuarios', adminOnly: true },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/admin/login');
  }

  const navItems = NAV_ITEMS.filter((item) => !item.adminOnly || user?.role === 'ADMIN');

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__brand">
          <span className="brand__mark">●</span> Panel del Lote
        </div>

        <nav className="admin-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `admin-nav__link${isActive ? ' is-active' : ''}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar__footer">
          <div className="admin-sidebar__user">
            <span className="admin-sidebar__name">{user?.name}</span>
            <span className="admin-sidebar__role">{user?.role === 'ADMIN' ? 'Administrador' : 'Vendedor'}</span>
          </div>
          <button type="button" className="admin-nav__logout" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
