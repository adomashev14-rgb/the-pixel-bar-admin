import { differenceInMinutes, isSameDay, parseISO } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';
import { useAppData } from '@/hooks/useAppData';
import { TableCard } from '@/components/Tables/TableCard';
import { MetricCard } from '@/components/Tables/MetricCard';
import { BookingsList } from '@/components/Bookings/BookingsList';
import { formatCurrency } from '@/utils/time';
import { exportSessionsToExcel } from '@/utils/export';

export const TablesPage: React.FC = () => {
  const { state, startSession, stopSession, removeBooking } = useAppData();
  const [, setTicker] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTicker((value) => value + 1), 1000 * 30);
    return () => clearInterval(interval);
  }, []);

  const now = new Date();

  const todaysSessions = useMemo(
    () =>
      [
        ...state.sessionHistory.filter((session) =>
          session.endTime ? isSameDay(parseISO(session.endTime), now) : isSameDay(parseISO(session.startTime), now),
        ),
        ...state.activeSessions.filter((session) => isSameDay(parseISO(session.startTime), now)),
      ],
    [state.sessionHistory, state.activeSessions, now],
  );

  const activeSessionsCount = state.activeSessions.length;

  const bookedCount = useMemo(
    () => state.bookings.filter((booking) => parseISO(booking.start) > now).length,
    [state.bookings, now],
  );

  const hoursInPlay = useMemo(() => {
    const minutes = todaysSessions.reduce((total, session) => {
      const end = session.endTime ? parseISO(session.endTime) : now;
      return total + differenceInMinutes(end, parseISO(session.startTime));
    }, 0);
    return (minutes / 60).toFixed(1);
  }, [todaysSessions, now]);

  const dailyRevenue = useMemo(() => {
    const amount = todaysSessions.reduce((total, session) => {
      const end = session.endTime ? parseISO(session.endTime) : now;
      const minutes = differenceInMinutes(end, parseISO(session.startTime));
      return total + (minutes / 60) * session.hourlyRate;
    }, 0);
    return formatCurrency(Math.round(amount));
  }, [todaysSessions, now]);

  const upcomingBookings = useMemo(
    () =>
      state.bookings
        .filter((booking) => parseISO(booking.start) >= now)
        .sort((a, b) => parseISO(a.start).getTime() - parseISO(b.start).getTime()),
    [state.bookings, now],
  );

  const tablesLayout = useMemo(() => {
    const firstRow = state.tables.slice(0, 3);
    const secondRow = state.tables.slice(3);
    return [firstRow, secondRow];
  }, [state.tables]);

  const handleExport = () => {
    exportSessionsToExcel(todaysSessions, `pixel-bar-report-${now.toISOString().slice(0, 10)}.xlsx`);
  };

  return (
    <div>
      <h1 className="page-title">Керування столами</h1>
      <p className="page-subtitle">
        Контролюйте активні сесії, бронювання та автоуправління телевізорами в режимі реального часу.
      </p>

      <div className="metric-grid">
        <MetricCard label="Активні сесії" value={activeSessionsCount.toString()} icon="▶" />
        <MetricCard label="Заброньовано" value={bookedCount.toString()} icon="📌" accentColor="#f06292" />
        <MetricCard label="Годин у грі" value={hoursInPlay} icon="⏳" accentColor="#4dd0e1" />
        <MetricCard label="Виручка" value={dailyRevenue} icon="💵" accentColor="#81c784" />
      </div>

      <div className="tables-section">
        {tablesLayout.map((row, index) => (
          <div key={index} className={`table-row table-row--${row.length}`}>
            {row.map((table) => {
              const session = state.activeSessions.find((item) => item.tableId === table.id);
              const booking = upcomingBookings.find((item) => item.tableId === table.id);
              return (
                <TableCard
                  key={table.id}
                  table={table}
                  session={session}
                  upcomingBooking={booking}
                  onStart={() => startSession(table.id)}
                  onStop={() => stopSession(table.id)}
                />
              );
            })}
          </div>
        ))}
      </div>

      <section className="card mt-lg">
        <div className="card-header">
          <h2 className="card-title">Найближчі бронювання</h2>
          <p className="card-subtitle">Перевіряйте майбутні резерви та реагуйте завчасно.</p>
        </div>
        <BookingsList bookings={upcomingBookings} onDelete={removeBooking} />
      </section>

      <section className="card mt-lg">
        <div className="card-header">
          <h2 className="card-title">Звітність за сьогодні</h2>
          <p className="card-subtitle">Отримайте Excel-звіт зі списком сесій та фінансових показників за обраний період.</p>
        </div>
        <button className="btn btn-secondary" type="button" onClick={handleExport}>
          ⬇️ Завантажити Excel
        </button>
      </section>
    </div>
  );
};
