import { format } from 'date-fns';
import { uk } from 'date-fns/locale';
import { BookingRecord } from '@/types';

const formatRange = (start: string, end: string) =>
  `${format(new Date(start), 'dd MMM, HH:mm', { locale: uk })} — ${format(new Date(end), 'HH:mm', { locale: uk })}`;

type BookingsListProps = {
  bookings: BookingRecord[];
  onDelete?: (id: string) => void;
};

export const BookingsList: React.FC<BookingsListProps> = ({ bookings, onDelete }) => (
  <div className="booking-list">
    {bookings.length === 0 ? (
      <p className="muted">Бронювань поки немає.</p>
    ) : (
      bookings.map((booking) => (
        <div className="booking-item" key={booking.id}>
          <div className="booking-icon" aria-hidden>
            📌
          </div>
          <div className="booking-details">
            <div className="booking-title">
              {booking.customerName} • Стіл {booking.tableId}
            </div>
            <div className="booking-meta">{formatRange(booking.start, booking.end)}</div>
            <div className="booking-meta">Телефон: {booking.customerPhone}</div>
            {booking.notes && <div className="booking-notes">{booking.notes}</div>}
          </div>
          {onDelete && (
            <button className="icon-button danger" type="button" onClick={() => onDelete(booking.id)} aria-label="Видалити бронювання">
              🗑
            </button>
          )}
        </div>
      ))
    )}
  </div>
);
