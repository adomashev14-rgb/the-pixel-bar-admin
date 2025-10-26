const supportEmail = 'technoboxx.dp@gmail.com';
const phones = ['+380971286969', '+380931286969'];

export const SupportPage: React.FC = () => (
  <div>
    <h1 className="page-title">Центр зв'язку з адміністратором</h1>
    <p className="page-subtitle">Швидко зв’яжіться з розробником у разі питань або пропозицій.</p>

    <div className="responsive-columns">
      <section className="card">
        <div className="card-header">
          <h2 className="card-title">Електронна пошта</h2>
          <p className="card-subtitle">Надішліть повідомлення напряму на Gmail.</p>
        </div>
        <p className="support-info">
          <span className="icon" aria-hidden>
            ✉️
          </span>
          {supportEmail}
        </p>
        <a
          className="btn btn-primary"
          href={`https://mail.google.com/mail/?view=cm&fs=1&to=${supportEmail}`}
          target="_blank"
          rel="noreferrer"
        >
          Відкрити Gmail
        </a>
      </section>
      <section className="card">
        <div className="card-header">
          <h2 className="card-title">Телефони для дзвінків</h2>
          <p className="card-subtitle">Зателефонуйте чи напишіть у месенджери.</p>
        </div>
        <div className="support-list">
          {phones.map((phone) => (
            <a key={phone} className="btn btn-secondary" href={`tel:${phone}`}>
              📞 {phone}
            </a>
          ))}
        </div>
      </section>
    </div>

    <section className="card mt-lg">
      <div className="card-header">
        <h2 className="card-title">Корисні поради для адміністратора</h2>
      </div>
      <p className="card-subtitle">
        Зберігайте резервні копії бронювань та сесій. Перевіряйте налаштування телевізорів після оновлень.
      </p>
      <p className="card-subtitle">
        У разі технічних проблем опишіть ситуацію та вкажіть кроки для відтворення — це пришвидшить підтримку.
      </p>
      <p className="card-subtitle">Додаткові матеріали та інструкції можна отримати за запитом на електронну пошту.</p>
    </section>
  </div>
);
