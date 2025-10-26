import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

type AppLayoutProps = {
  children: React.ReactNode;
};

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="app-shell">
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
      {menuOpen && <div className="sidebar-overlay" onClick={() => setMenuOpen(false)} />}
      <div className="app-content">
        <TopBar onToggleMenu={() => setMenuOpen((prev) => !prev)} />
        <main className="app-main">{children}</main>
      </div>
    </div>
  );
};
