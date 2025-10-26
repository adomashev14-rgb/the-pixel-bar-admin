import { useState } from 'react';
import { useAppData } from '@/hooks/useAppData';

const initialForm = {
  customerName: '',
  customerPhone: '',
  tableId: 1,
  start: '',
  end: '',
  notes: '',
};

type Errors = Partial<Record<keyof typeof initialForm, string>>;

export const BookingForm: React.FC = () => {
  const { state, addBooking } = useAppData();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<Errors>({});

  const updateField = (key: keyof typeof initialForm, value: string | number) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newErrors: Errors = {};
    if (!form.customerName.trim()) newErrors.customerName = "Вкажіть ім'я";
    if (!form.customerPhone.trim()) newErrors.customerPhone = 'Вкажіть номер телефону';
    if (!form.start) newErrors.start = 'Вкажіть дату та час початку';
    if (!form.end) newErrors.end = 'Вкажіть час завершення';
    if (form.start && form.end && new Date(form.end) <= new Date(form.start)) {
      newErrors.end = 'Час завершення має бути пізніше початку';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    addBooking({
      customerName: form.customerName,
      customerPhone: form.customerPhone,
      tableId: Number(form.tableId),
      start: new Date(form.start).toISOString(),
      end: new Date(form.end).toISOString(),
      notes: form.notes,
    });

    setForm(initialForm);
    setErrors({});
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <label className="form-field">
          <span className="form-label">ПІБ клієнта</span>
          <input
            className={`form-input ${errors.customerName ? 'has-error' : ''}`}
            value={form.customerName}
            onChange={(event) => updateField('customerName', event.target.value)}
            placeholder="Наприклад, Іван Петренко"
          />
          {errors.customerName && <span className="form-error">{errors.customerName}</span>}
        </label>
        <label className="form-field">
          <span className="form-label">Номер телефону</span>
          <input
            className={`form-input ${errors.customerPhone ? 'has-error' : ''}`}
            value={form.customerPhone}
            onChange={(event) => updateField('customerPhone', event.target.value)}
            placeholder="Наприклад, +380501112233"
          />
          {errors.customerPhone && <span className="form-error">{errors.customerPhone}</span>}
        </label>
        <label className="form-field">
          <span className="form-label">Стіл</span>
          <select
            className="form-input"
            value={form.tableId}
            onChange={(event) => updateField('tableId', Number(event.target.value))}
          >
            {state.tables.map((table) => (
              <option key={table.id} value={table.id}>
                {table.name} ({table.hourlyRate}₴/год)
              </option>
            ))}
          </select>
        </label>
        <label className="form-field">
          <span className="form-label">Початок</span>
          <input
            type="datetime-local"
            className={`form-input ${errors.start ? 'has-error' : ''}`}
            value={form.start}
            onChange={(event) => updateField('start', event.target.value)}
          />
          {errors.start && <span className="form-error">{errors.start}</span>}
        </label>
        <label className="form-field">
          <span className="form-label">Завершення</span>
          <input
            type="datetime-local"
            className={`form-input ${errors.end ? 'has-error' : ''}`}
            value={form.end}
            onChange={(event) => updateField('end', event.target.value)}
          />
          {errors.end && <span className="form-error">{errors.end}</span>}
        </label>
        <label className="form-field form-field--full">
          <span className="form-label">Примітки</span>
          <textarea
            className="form-input"
            value={form.notes}
            rows={3}
            onChange={(event) => updateField('notes', event.target.value)}
            placeholder="Додаткові побажання клієнта"
          />
        </label>
      </div>
      <p className="form-hint">Дані автоматично зберігаються локально та синхронізуються з календарем.</p>
      <button className="btn btn-primary" type="submit">
        Додати бронювання
      </button>
    </form>
  );
};
