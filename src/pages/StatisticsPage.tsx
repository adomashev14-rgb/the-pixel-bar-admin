import { differenceInMinutes, isAfter, isBefore, parseISO, startOfDay, startOfMonth, startOfWeek } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';
import { useAppData } from '@/hooks/useAppData';
import { formatCurrency } from '@/utils/time';

type Range = 'day' | 'week' | 'month';

const getRangeStart = (range: Range) => {
  const now = new Date();
  switch (range) {
    case 'day':
      return startOfDay(now);
    case 'week':
      return startOfWeek(now, { weekStartsOn: 1 });
    case 'month':
      return startOfMonth(now);
    default:
      return startOfDay(now);
  }
};

export const StatisticsPage: React.FC = () => {
  const { state } = useAppData();
  const [, setTick] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setTick((value) => value + 1), 1000 * 60);
    return () => clearInterval(timer);
  }, []);

  const sessions = useMemo(() => [...state.sessionHistory, ...state.activeSessions], [
    state.sessionHistory,
    state.activeSessions,
  ]);

  const ranges: Range[] = ['day', 'week', 'month'];

  const totals = useMemo(() => {
    return ranges.map((range) => {
      const from = getRangeStart(range);
      const filtered = sessions.filter((session) => {
        const end = session.endTime ? parseISO(session.endTime) : new Date();
        return isAfter(end, from) || end.getTime() === from.getTime();
      });

      const minutes = filtered.reduce((total, session) => {
        const end = session.endTime ? parseISO(session.endTime) : new Date();
        if (isBefore(end, from)) return total;
        const start = parseISO(session.startTime);
        const effectiveStart = isAfter(from, start) ? from : start;
        const delta = differenceInMinutes(end, effectiveStart);
        return delta > 0 ? total + delta : total;
      }, 0);

      const revenue = filtered.reduce((total, session) => {
        const end = session.endTime ? parseISO(session.endTime) : new Date();
        const start = parseISO(session.startTime);
        if (isBefore(end, from)) return total;
        const effectiveStart = isAfter(from, start) ? from : start;
        const minutesDelta = Math.max(differenceInMinutes(end, effectiveStart), 0);
        return total + (minutesDelta / 60) * session.hourlyRate;
      }, 0);

      return {
        range,
        hours: (minutes / 60).toFixed(1),
        revenue: formatCurrency(Math.round(revenue)),
        sessions: filtered.length,
      };
    });
  }, [sessions]);

  const perTableStats = useMemo(() => {
    return state.tables.map((table) => {
      const tableSessions = sessions.filter((session) => session.tableId === table.id);
      const data = ranges.reduce(
        (acc, range) => {
          const from = getRangeStart(range);
          const filtered = tableSessions.filter((session) => {
            const end = session.endTime ? parseISO(session.endTime) : new Date();
            return isAfter(end, from) || end.getTime() === from.getTime();
          });
          const minutes = filtered.reduce((total, session) => {
            const end = session.endTime ? parseISO(session.endTime) : new Date();
            if (isBefore(end, from)) return total;
            const start = parseISO(session.startTime);
            const effectiveStart = isAfter(from, start) ? from : start;
            const delta = differenceInMinutes(end, effectiveStart);
            return delta > 0 ? total + delta : total;
          }, 0);
          const revenue = filtered.reduce((total, session) => {
            const end = session.endTime ? parseISO(session.endTime) : new Date();
            const start = parseISO(session.startTime);
            const effectiveStart = isAfter(from, start) ? from : start;
            const minutesDelta = Math.max(differenceInMinutes(end, effectiveStart), 0);
            return total + (minutesDelta / 60) * session.hourlyRate;
          }, 0);
          acc[range] = {
            hours: (minutes / 60).toFixed(1),
            revenue: Math.round(revenue),
            sessions: filtered.length,
          };
          return acc;
        },
        {} as Record<Range, { hours: string; revenue: number; sessions: number }>,
      );
      return { table, data };
    });
  }, [sessions, state.tables]);

  return (
    <div>
      <h1 className="page-title">Аналітика та статистика</h1>
      <p className="page-subtitle">Відстежуйте завантаженість столів та фінансові показники за різні періоди.</p>

      <div className="metric-grid">
        {totals.map((item) => (
          <div key={item.range} className="card">
            <div className="card-header">
              <h2 className="card-title small">
                {item.range === 'day' ? 'Сьогодні' : item.range === 'week' ? 'Цей тиждень' : 'Цей місяць'}
              </h2>
              <p className="card-subtitle">Годин у грі: {item.hours} • Сесій: {item.sessions}</p>
            </div>
            <div className="stat-value">{item.revenue}</div>
          </div>
        ))}
      </div>

      <section className="card mt-lg">
        <div className="card-header">
          <h2 className="card-title">Деталізація по столах</h2>
          <p className="card-subtitle">Порівняйте завантаженість та виручку по кожному столу за ключові періоди.</p>
        </div>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Стіл</th>
                <th>Сьогодні (год / ₴)</th>
                <th>Тиждень (год / ₴)</th>
                <th>Місяць (год / ₴)</th>
                <th>Сесій (д/т/м)</th>
              </tr>
            </thead>
            <tbody>
              {perTableStats.map(({ table, data }) => (
                <tr key={table.id}>
                  <td>{table.name}</td>
                  <td>
                    {data.day.hours} / {formatCurrency(data.day.revenue)}
                  </td>
                  <td>
                    {data.week.hours} / {formatCurrency(data.week.revenue)}
                  </td>
                  <td>
                    {data.month.hours} / {formatCurrency(data.month.revenue)}
                  </td>
                  <td>
                    {data.day.sessions} / {data.week.sessions} / {data.month.sessions}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
