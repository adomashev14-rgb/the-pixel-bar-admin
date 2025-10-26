import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { addMinutes, isAfter, parseISO } from 'date-fns';
import { AppState, BookingRecord, SessionRecord, SettingsState, TableConfig } from '@/types';

const STORAGE_KEY = 'pixel-bar-admin-state';

const defaultTables: TableConfig[] = [
  { id: 1, name: 'Стіл 1', hourlyRate: 80, imagePath: '/images/tables/table-1.jpg' },
  { id: 2, name: 'Стіл 2', hourlyRate: 80, imagePath: '/images/tables/table-2.jpg' },
  { id: 3, name: 'Стіл 3', hourlyRate: 120, imagePath: '/images/tables/table-3.jpg' },
  { id: 4, name: 'Стіл 4', hourlyRate: 120, imagePath: '/images/tables/table-4.jpg' },
  { id: 5, name: 'Стіл 5', hourlyRate: 120, imagePath: '/images/tables/table-5.jpg' },
  { id: 6, name: 'Стіл 6', hourlyRate: 120, imagePath: '/images/tables/table-6.jpg' },
  { id: 7, name: 'Стіл 7', hourlyRate: 120, imagePath: '/images/tables/table-7.jpg' },
];

const defaultState: AppState = {
  tables: defaultTables,
  activeSessions: [],
  sessionHistory: [],
  bookings: [],
  settings: {
    language: 'uk',
    autoPowerOffMinutes: 120,
    hourlyRates: defaultTables.reduce<Record<number, number>>((acc, table) => {
      acc[table.id] = table.hourlyRate;
      return acc;
    }, {}),
    tvControlProfiles: [
      {
        id: 'smart-api',
        name: 'Smart TV API',
        method: 'smart-api',
        enabled: true,
        details:
          'Підключення через офіційні API Smart TV. Потрібно вказати IP, ключ API та час увімкнення/вимкнення.',
        configuration: {
          host: '192.168.1.100',
          apiKey: 'API_KEY',
          powerOnTime: '09:45',
          powerOffTime: '23:15',
        },
      },
      {
        id: 'network-relay',
        name: 'Мережеве реле',
        method: 'network-relay',
        enabled: false,
        details:
          'Управління через мережеві розетки або реле. Підходить для старих телевізорів без Smart функцій.',
        configuration: {
          relayHost: '192.168.1.55',
          onCommand: 'relay/on',
          offCommand: 'relay/off',
        },
      },
      {
        id: 'infrared-controller',
        name: 'ІЧ контролер',
        method: 'infrared-controller',
        enabled: false,
        details:
          'Використовує інфрачервоний контролер (наприклад Broadlink). Потрібно записати сигнали пульта.',
        configuration: {
          controllerId: 'BROADLINK-RM4',
          powerOnSignal: 'TV_POWER_ON',
          powerOffSignal: 'TV_POWER_OFF',
        },
      },
      {
        id: 'hdmi-cec',
        name: 'HDMI-CEC',
        method: 'hdmi-cec',
        enabled: false,
        details:
          'Керування живленням через HDMI-CEC. Підходить для консолей/ПК з підтримкою CEC.',
        configuration: {
          device: 'PlayStation 5',
          autoWake: 'true',
          autoSleep: 'true',
        },
      },
    ],
  },
};

type AppDataContextValue = {
  state: AppState;
  loading: boolean;
  startSession: (tableId: number) => void;
  stopSession: (tableId: number) => void;
  addBooking: (booking: Omit<BookingRecord, 'id' | 'createdAt'>) => void;
  removeBooking: (bookingId: string) => void;
  updateSettings: (updater: (current: SettingsState) => SettingsState) => void;
  updateHourlyRate: (tableId: number, rate: number) => void;
};

const AppDataContext = createContext<AppDataContextValue | undefined>(undefined);

const getPersistedState = async (): Promise<AppState | null> => {
  if (window.electronStore) {
    const stored = (await window.electronStore.get<AppState>(STORAGE_KEY)) ?? null;
    return stored;
  }
  if (typeof localStorage === 'undefined') return null;
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? (JSON.parse(raw) as AppState) : null;
};

const persistState = async (state: AppState) => {
  if (window.electronStore) {
    await window.electronStore.set(STORAGE_KEY, state);
  } else {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }
};

export const AppDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(defaultState);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const stored = await getPersistedState();
      if (stored) {
        const mergedTables = defaultTables.map((table) => {
          const storedTable = stored.tables.find((item) => item.id === table.id);
          return {
            ...table,
            ...storedTable,
            hourlyRate:
              stored.settings.hourlyRates[table.id] ?? storedTable?.hourlyRate ?? table.hourlyRate,
            imagePath: storedTable?.imagePath ?? table.imagePath,
          };
        });

        setState({
          ...stored,
          tables: mergedTables,
          settings: {
            ...defaultState.settings,
            ...stored.settings,
            hourlyRates: {
              ...defaultState.settings.hourlyRates,
              ...stored.settings.hourlyRates,
            },
          },
        });
      }
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (!loading) {
      void persistState(state);
    }
  }, [state, loading]);

  useEffect(() => {
    const interval = setInterval(() => {
      setState((current) => {
        const now = new Date();
        const expiredSessions = current.activeSessions.filter((session) => {
          if (!session.autoPowerOffAt) return false;
          return !isAfter(parseISO(session.autoPowerOffAt), now);
        });
        if (expiredSessions.length === 0) {
          return current;
        }
        const updatedActive = current.activeSessions.filter(
          (session) => !expiredSessions.some((expired) => expired.id === session.id),
        );
        const updatedHistory = [
          ...current.sessionHistory,
          ...expiredSessions.map((session) => ({
            ...session,
            endTime: session.autoPowerOffAt,
          })),
        ];
        return {
          ...current,
          activeSessions: updatedActive,
          sessionHistory: updatedHistory,
        };
      });
    }, 1000 * 15);

    return () => clearInterval(interval);
  }, []);

  const startSession = useCallback((tableId: number) => {
    setState((current) => {
      if (current.activeSessions.some((session) => session.tableId === tableId)) {
        return current;
      }
      const table = current.tables.find((item) => item.id === tableId);
      if (!table) return current;
      const startTime = new Date().toISOString();
      const autoPowerOffAt = addMinutes(
        new Date(startTime),
        current.settings.autoPowerOffMinutes,
      ).toISOString();
      const newSession: SessionRecord = {
        id: `session-${Date.now()}-${tableId}`,
        tableId,
        startTime,
        hourlyRate: current.settings.hourlyRates[tableId] ?? table.hourlyRate,
        autoPowerOffAt,
      };
      return {
        ...current,
        activeSessions: [...current.activeSessions, newSession],
      };
    });
  }, []);

  const stopSession = useCallback((tableId: number) => {
    setState((current) => {
      const activeSession = current.activeSessions.find((session) => session.tableId === tableId);
      if (!activeSession) return current;
      const filteredActive = current.activeSessions.filter((session) => session.tableId !== tableId);
      const updatedHistory: SessionRecord[] = [
        ...current.sessionHistory,
        {
          ...activeSession,
          endTime: new Date().toISOString(),
        },
      ];
      return {
        ...current,
        activeSessions: filteredActive,
        sessionHistory: updatedHistory,
      };
    });
  }, []);

  const addBooking = useCallback(
    (booking: Omit<BookingRecord, 'id' | 'createdAt'>) => {
      const id = `booking-${Date.now()}`;
      setState((current) => ({
        ...current,
        bookings: [
          ...current.bookings,
          {
            ...booking,
            id,
            createdAt: new Date().toISOString(),
          },
        ],
      }));
    },
    [],
  );

  const removeBooking = useCallback((bookingId: string) => {
    setState((current) => ({
      ...current,
      bookings: current.bookings.filter((booking) => booking.id !== bookingId),
    }));
  }, []);

  const updateSettings = useCallback((updater: (current: SettingsState) => SettingsState) => {
    setState((current) => ({
      ...current,
      settings: updater(current.settings),
    }));
  }, []);

  const updateHourlyRate = useCallback((tableId: number, rate: number) => {
    setState((current) => ({
      ...current,
      tables: current.tables.map((table) =>
        table.id === tableId ? { ...table, hourlyRate: rate } : table,
      ),
      settings: {
        ...current.settings,
        hourlyRates: {
          ...current.settings.hourlyRates,
          [tableId]: rate,
        },
      },
    }));
  }, []);

  const value = useMemo(
    () => ({
      state,
      loading,
      startSession,
      stopSession,
      addBooking,
      removeBooking,
      updateSettings,
      updateHourlyRate,
    }),
    [state, loading, startSession, stopSession, addBooking, removeBooking, updateSettings, updateHourlyRate],
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
};

export const useAppDataContext = (): AppDataContextValue => {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error('useAppDataContext must be used within AppDataProvider');
  }
  return context;
};
