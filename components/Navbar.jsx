import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Inicio', icon: '🏠' },
  { to: '/clientes', label: 'Clientes', icon: '👥' },
  { to: '/pagos', label: 'Pagos', icon: '💰' },
  { to: '/acceso', label: 'Control Acceso', icon: '🚪' },
  { to: '/reportes', label: 'Reportes', icon: '📊' },
];

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <strong>🏋️ GymSys</strong>
      </div>
      <ul className="navbar-links">
        {links.map((link) => (
          <li key={link.to}>
            <NavLink
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              <span>{link.icon}</span>
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
