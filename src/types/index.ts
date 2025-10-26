export type LanguageOption = 'uk' | 'ru';

export interface TableConfig {
  id: number;
  name: string;
  hourlyRate: number;
  imagePath?: string;
}

export interface SessionRecord {
  id: string;
  tableId: number;
  startTime: string;
  endTime?: string;
  hourlyRate: number;
  autoPowerOffAt?: string;
}

export interface BookingRecord {
  id: string;
  tableId: number;
  customerName: string;
  customerPhone: string;
  start: string;
  end: string;
  createdAt: string;
  notes?: string;
}

export type TVControlMethod = 'smart-api' | 'network-relay' | 'infrared-controller' | 'hdmi-cec';

export interface TVControlProfile {
  id: string;
  name: string;
  method: TVControlMethod;
  enabled: boolean;
  details: string;
  configuration: Record<string, string>;
}

export interface SettingsState {
  language: LanguageOption;
  autoPowerOffMinutes: number;
  hourlyRates: Record<number, number>;
  tvControlProfiles: TVControlProfile[];
}

export interface AppState {
  tables: TableConfig[];
  activeSessions: SessionRecord[];
  sessionHistory: SessionRecord[];
  bookings: BookingRecord[];
  settings: SettingsState;
}
