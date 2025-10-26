import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { uk } from 'date-fns/locale';

type TopBarProps = {
  onToggleMenu: () => void;
};

const useClock = () => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000 * 30);
    return () => clearInterval(timer);
  }, []);

  return format(now, 'dd MMMM yyyy, HH:mm', { locale: uk });
};

export const TopBar: React.FC<TopBarProps> = ({ onToggleMenu }) => {
  const clockText = useClock();

  return (
    <header className="topbar">
      <button className="icon-button" type="button" onClick={onToggleMenu} aria-label="Відкрити меню">
        <span aria-hidden>☰</span>
      </button>
      <div className="topbar-title">The Pixel Bar Admin</div>
      <div className="topbar-clock">
        <span className="icon" aria-hidden>
          🕒
        </span>
        <span>{clockText}</span>
      </div>
    </header>
  );
};
