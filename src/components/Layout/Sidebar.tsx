import { NavLink } from 'react-router-dom';

type SidebarProps = {
  open: boolean;
  onClose: () => void;
};

const navItems = [
  { label: 'Столи', icon: '🎮', path: '/' },
  { label: 'Бронювання', icon: '📅', path: '/bookings' },
  { label: 'Статистика', icon: '📊', path: '/statistics' },
  { label: 'Налаштування', icon: '⚙️', path: '/settings' },
  { label: 'Для адміністратора', icon: '🆘', path: '/support' },
];

export const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => (
  <aside className={`sidebar ${open ? 'is-open' : ''}`}>
    <div className="sidebar-header">
      <div className="sidebar-logo" aria-hidden>
        PB
      </div>
      <div>
        <div className="sidebar-title">The Pixel Bar</div>
        <div className="sidebar-subtitle">Панель адміністратора</div>
      </div>
      <button className="icon-button" type="button" onClick={onClose} aria-label="Закрити меню">
        <span aria-hidden>×</span>
      </button>
    </div>
    <nav className="sidebar-nav">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          end={item.path === '/'}
          className={({ isActive }) => `sidebar-link ${isActive ? 'is-active' : ''}`}
          onClick={onClose}
        >
          <span className="icon" aria-hidden>
            {item.icon}
          </span>
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
    <div className="sidebar-footer">© {new Date().getFullYear()} The Pixel Bar</div>
  </aside>
);
