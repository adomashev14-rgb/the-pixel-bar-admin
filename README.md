# The Pixel Bar Admin

Electron + React + TypeScript desktop application for managing The Pixel Bar operations: table sessions, bookings, finance tracking and TV automation.

## Key features

- **Live session control** – start/stop timers for 7 gaming tables with automatic power-off countdowns and realtime cash tracking.
- **Smart booking workflow** – capture customer details, schedule tables, view a Google-style calendar and surface upcoming reservations directly on the dashboard.
- **Powerful analytics** – daily, weekly and monthly performance breakdown for each table and the whole venue.
- **Flexible automation settings** – configure multiple TV control scenarios (Smart API, network relay, infrared controller, HDMI-CEC) and per-table hourly rates.
- **One-click reporting** – export the daily session log to Excel for finance reconciliation.
- **Dedicated support hub** – quick access to developer contact details (email + phone).

## Getting started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
npm install
```

### Development mode

Run Vite dev server and Electron simultaneously:

```bash
npm run dev
```

The Electron window will launch automatically once the frontend is ready on port `5173`.

### Production build

Create the production bundles for both renderer and Electron processes:

```bash
npm run build
```

### Packaging installers

Generate platform-specific installers with [electron-builder](https://www.electron.build/):

```bash
npm run dist
```

Installer artifacts will be written to the `dist/` folder according to your OS (NSIS for Windows, DMG for macOS, AppImage for Linux).

## Project structure

```
├─ electron/           # Main & preload processes
├─ src/
│  ├─ components/      # Reusable UI blocks (tables, bookings, settings)
│  ├─ context/         # Global state management & persistence
│  ├─ pages/           # Top-level routed views
│  ├─ styles/          # Theme & global styles
│  ├─ types/           # Shared TypeScript types
│  └─ utils/           # Time helpers, Excel export utilities
├─ dist/               # Renderer build output (generated)
├─ dist-electron/      # Electron build output (generated)
├─ public/images/      # Фото столів та інші статичні зображення
├─ package.json
└─ vite.config.ts
```

## Додавання власних фото та іконок

- **Фото столів.** Для відображення зображень на головній сторінці додайте файли `table-1.jpg` … `table-7.jpg` у каталог `public/images/tables/`. Усі картки столів уже посилаються на ці шляхи (`/images/tables/table-X.jpg`), тож після додавання файлів оновлювати код не потрібно. Рекомендоване співвідношення сторін 16:9 (наприклад, 1600×900) у форматі JPG або PNG.
- **Іконка застосунку.** Перед упаковкою інсталятора покладіть бажану іконку у `build/icon.png` (512×512 PNG). Цей шлях використовується в конфігурації electron-builder і автоматично підхоплюється під час `npm run dist`.
- **Додаткові матеріали.** Якщо потрібно додати промофото або заставки, зберігайте їх поруч у `public/images/` та посилайтеся з компонентів або стилів як `/images/назва-файлу.ext`.

## Data persistence

Application state (sessions, bookings, settings) is stored locally using `electron-store` inside the Electron main process. When running in a browser during development, data falls back to `localStorage`.

## License

MIT
