export {};

declare global {
  interface Window {
    electronStore?: {
      get: <T>(key: string) => Promise<T>;
      set: (key: string, value: unknown) => Promise<void>;
    };
  }
}
