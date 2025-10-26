import { ChangeEvent } from 'react';
import { useAppData } from '@/hooks/useAppData';
import { TVControlProfile } from '@/types';

export const SettingsPage: React.FC = () => {
  const { state, updateSettings, updateHourlyRate } = useAppData();

  const handleLanguageChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value as 'uk' | 'ru';
    updateSettings((settings) => ({ ...settings, language: value }));
  };

  const handleAutoPowerChange = (event: ChangeEvent<HTMLInputElement>) => {
    const minutes = Number(event.target.value);
    updateSettings((settings) => ({ ...settings, autoPowerOffMinutes: minutes }));
  };

  const updateProfile = (profile: TVControlProfile, updates: Partial<TVControlProfile>) => {
    updateSettings((settings) => ({
      ...settings,
      tvControlProfiles: settings.tvControlProfiles.map((item) =>
        item.id === profile.id ? { ...item, ...updates } : item,
      ),
    }));
  };

  return (
    <div>
      <h1 className="page-title">Налаштування системи</h1>
      <p className="page-subtitle">
        Персоналізуйте мову інтерфейсу, тарифи та сценарії автоматичного керування телевізорами.
      </p>

      <div className="responsive-columns">
        <section className="card">
          <div className="card-header">
            <h2 className="card-title">Мова інтерфейсу</h2>
            <p className="card-subtitle">Оберіть мову для всіх елементів панелі адміністратора.</p>
          </div>
          <label className="form-field">
            <span className="form-label">Мова</span>
            <select className="form-input" value={state.settings.language} onChange={handleLanguageChange}>
              <option value="uk">Українська</option>
              <option value="ru">Російська</option>
            </select>
          </label>
        </section>
        <section className="card">
          <div className="card-header">
            <h2 className="card-title">Автовимкнення телевізорів</h2>
            <p className="card-subtitle">Вкажіть тривалість сесії після якої телевізор автоматично вимикається.</p>
          </div>
          <label className="form-field">
            <span className="form-label">Тривалість, хвилин</span>
            <input
              type="range"
              className="slider"
              min={30}
              max={240}
              step={15}
              value={state.settings.autoPowerOffMinutes}
              onChange={handleAutoPowerChange}
            />
          </label>
          <div className="slider-labels">
            <span>30</span>
            <span>60</span>
            <span>120</span>
            <span>180</span>
            <span>240</span>
          </div>
          <p className="form-hint">Поточне значення: {state.settings.autoPowerOffMinutes} хвилин.</p>
        </section>
      </div>

      <section className="card mt-lg">
        <div className="card-header">
          <h2 className="card-title">Сценарії підключення телевізорів</h2>
          <p className="card-subtitle">
            Увімкніть один або декілька варіантів залежно від моделі телевізора. Налаштування зберігаються локально.
          </p>
        </div>
        <div className="profile-grid">
          {state.settings.tvControlProfiles.map((profile) => (
            <div key={profile.id} className="profile-card">
              <div className="profile-header">
                <div>
                  <div className="profile-title">{profile.name}</div>
                  <div className="profile-description">{profile.details}</div>
                </div>
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={profile.enabled}
                    onChange={(event) => updateProfile(profile, { enabled: event.target.checked })}
                  />
                  <span>Активно</span>
                </label>
              </div>
              <div className="profile-settings">
                {Object.entries(profile.configuration).map(([key, value]) => (
                  <label key={key} className="form-field">
                    <span className="form-label">{key}</span>
                    <input
                      className="form-input"
                      value={value}
                      onChange={(event) =>
                        updateProfile(profile, {
                          configuration: { ...profile.configuration, [key]: event.target.value },
                        })
                      }
                    />
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="card mt-lg">
        <div className="card-header">
          <h2 className="card-title">Тарифи на гру</h2>
          <p className="card-subtitle">Встановіть актуальну вартість години для кожного з семи столів.</p>
        </div>
        <div className="rate-grid">
          {state.tables.map((table) => (
            <label key={table.id} className="form-field">
              <span className="form-label">{table.name} (грн/год)</span>
              <input
                type="number"
                className="form-input"
                min={0}
                step={10}
                value={table.hourlyRate}
                onChange={(event) => updateHourlyRate(table.id, Number(event.target.value))}
              />
            </label>
          ))}
        </div>
      </section>

      <section className="card mt-lg">
        <div className="card-header">
          <h2 className="card-title">Фотографії столів</h2>
          <p className="card-subtitle">
            Додайте власні зображення у папку <code>public/images/tables/</code> (файли <code>table-1.jpg</code>…<code>table-7.jpg</code>),
            щоб вони автоматично з'явилися на головній сторінці.
          </p>
        </div>
        <ul className="info-list">
          <li>Рекомендований розмір: 1600×900 px у форматі JPG або PNG.</li>
          <li>Назва файлу повинна відповідати номеру столу (наприклад, <code>table-3.jpg</code>).</li>
          <li>Зміни застосовуються одразу після перезапуску застосунку.</li>
        </ul>
      </section>
    </div>
  );
};
