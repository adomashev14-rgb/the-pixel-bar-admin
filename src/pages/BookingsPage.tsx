import { useMemo } from 'react';
import { parseISO } from 'date-fns';
import { useAppData } from '@/hooks/useAppData';
import { BookingForm } from '@/components/Bookings/BookingForm';
import { BookingsList } from '@/components/Bookings/BookingsList';
import { BookingsCalendar } from '@/components/Bookings/BookingsCalendar';

export const BookingsPage: React.FC = () => {
  const { state, removeBooking } = useAppData();

  const sortedBookings = useMemo(
    () =>
      [...state.bookings].sort((a, b) => parseISO(a.start).getTime() - parseISO(b.start).getTime()),
    [state.bookings],
  );

  return (
    <div>
      <h1 className="page-title">Управління бронюваннями</h1>
      <p className="page-subtitle">
        Створюйте бронювання, контролюйте розклад та синхронізуйте роботу столів з календарем.
      </p>

      <div className="responsive-columns">
        <section className="card">
          <div className="card-header">
            <h2 className="card-title">Форма бронювання</h2>
            <p className="card-subtitle">Дані автоматично відображаються на головній сторінці та в календарі.</p>
          </div>
          <BookingForm />
        </section>
        <section className="card">
          <div className="card-header">
            <h2 className="card-title">Календар бронювань</h2>
            <p className="card-subtitle">Огляд усіх запланованих і завершених бронювань.</p>
          </div>
          <BookingsCalendar bookings={sortedBookings} />
        </section>
      </div>

      <section className="card mt-lg">
        <div className="card-header">
          <h2 className="card-title">Усі бронювання</h2>
          <p className="card-subtitle">Список бронювань з можливістю швидко скасувати запис.</p>
        </div>
        <BookingsList bookings={sortedBookings} onDelete={removeBooking} />
      </section>
    </div>
  );
};
