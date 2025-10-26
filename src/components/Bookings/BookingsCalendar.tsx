import { Calendar, dateFnsLocalizer, Event } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { uk } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { BookingRecord } from '@/types';
import { useMemo } from 'react';

const locales = {
  uk,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

type CalendarProps = {
  bookings: BookingRecord[];
};

export const BookingsCalendar: React.FC<CalendarProps> = ({ bookings }) => {
  const events = useMemo<Event<BookingRecord>[]>(
    () =>
      bookings.map((booking) => ({
        title: `${booking.customerName} • Стіл ${booking.tableId}`,
        start: new Date(booking.start),
        end: new Date(booking.end),
        resource: booking,
        allDay: false,
      })),
    [bookings],
  );

  return (
    <div style={{ height: 500 }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%', borderRadius: 16, overflow: 'hidden', backgroundColor: '#0b1220', color: '#e2e8f0' }}
        messages={{
          next: 'Далі',
          previous: 'Назад',
          today: 'Сьогодні',
          month: 'Місяць',
          week: 'Тиждень',
          day: 'День',
        }}
      />
    </div>
  );
};
