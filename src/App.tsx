import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/Layout/AppLayout';
import { TablesPage } from './pages/TablesPage';
import { BookingsPage } from './pages/BookingsPage';
import { StatisticsPage } from './pages/StatisticsPage';
import { SettingsPage } from './pages/SettingsPage';
import { SupportPage } from './pages/SupportPage';

const App: React.FC = () => (
  <AppLayout>
    <Routes>
      <Route path="/" element={<TablesPage />} />
      <Route path="/bookings" element={<BookingsPage />} />
      <Route path="/statistics" element={<StatisticsPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/support" element={<SupportPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </AppLayout>
);

export default App;
