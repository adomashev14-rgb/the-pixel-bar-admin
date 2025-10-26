import { useEffect, useMemo, useState } from 'react';
import { differenceInSeconds, parseISO } from 'date-fns';
import { BookingRecord, SessionRecord, TableConfig } from '@/types';
import { calculateRevenue, formatCurrency, formatDateTime, formatDuration, secondsUntil } from '@/utils/time';

const formatCountdown = (seconds: number): string => {
  if (seconds <= 0) return '0:00';
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

type TableCardProps = {
  table: TableConfig;
  session?: SessionRecord;
  upcomingBooking?: BookingRecord;
  onStart: () => void;
  onStop: () => void;
};

export const TableCard: React.FC<TableCardProps> = ({ table, session, upcomingBooking, onStart, onStop }) => {
  const [, setTick] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setTick((value) => value + 1), 1000);
    return () => clearInterval(timer);
  }, [session?.autoPowerOffAt]);

  const revenue = useMemo(() => (session ? calculateRevenue(session.startTime, session.hourlyRate) : 0), [session]);

  const countdownSeconds = useMemo(() => secondsUntil(session?.autoPowerOffAt), [session?.autoPowerOffAt]);

  const progress = useMemo(() => {
    if (!session?.autoPowerOffAt) return 0;
    const total = differenceInSeconds(parseISO(session.autoPowerOffAt), parseISO(session.startTime));
    if (total <= 0) return 0;
    const remaining = Math.max(countdownSeconds, 0);
    return Math.min(100, ((total - remaining) / total) * 100);
  }, [session?.autoPowerOffAt, session?.startTime, countdownSeconds]);

  const bookingTooltip = upcomingBooking
    ? `Бронювання ${upcomingBooking.customerName} • ${formatDateTime(upcomingBooking.start)} — ${formatDateTime(upcomingBooking.end)}`
    : 'Немає запланованих бронювань';

  return (
    <div className={`table-card ${session ? 'is-active' : ''}`} title={bookingTooltip}>
      {upcomingBooking && <div className="table-card-badge">Заброньовано</div>}
      <div className={`table-card-media ${table.imagePath ? '' : 'is-empty'}`}>
        {table.imagePath ? (
          <img src={table.imagePath} alt={`Фото ${table.name}`} loading="lazy" />
        ) : (
          <div className="table-card-media-placeholder">
            <span role="img" aria-label="Фото відсутнє">
              📷
            </span>
            <p>Додайте зображення столу в /public/images/tables/</p>
          </div>
        )}
      </div>
      <div className="table-card-header">
        <div>
          <div className="table-card-title">{table.name}</div>
          <div className="table-card-subtitle">Тариф: {formatCurrency(table.hourlyRate)} / год</div>
        </div>
      </div>
      <div className="table-card-body">
        <div className="table-card-row">
          <span className="icon" aria-hidden>
            ⏱️
          </span>
          <span>{session ? `Тривалість: ${formatDuration(session.startTime)}` : 'Сесія не активна'}</span>
        </div>
        {session && (
          <div className="table-card-row">
            <span className="icon" aria-hidden>
              💰
            </span>
            <span>Виручка: {formatCurrency(revenue)}</span>
          </div>
        )}
        {session?.autoPowerOffAt && (
          <div className="table-card-countdown">
            <div className="countdown-label">Автовимкнення через {formatCountdown(Math.max(countdownSeconds, 0))}</div>
            <div className="progress">
              <div className="progress-bar" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}
      </div>
      <div className="table-card-actions">
        <button className="btn btn-primary" type="button" onClick={onStart} disabled={!!session}>
          ▶ Старт
        </button>
        <button className="btn btn-outline" type="button" onClick={onStop} disabled={!session}>
          ■ Стоп
        </button>
      </div>
    </div>
  );
};
