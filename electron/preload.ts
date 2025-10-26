import { contextBridge, ipcRenderer } from 'electron';

type StoreAPI = {
  get: (key: string) => Promise<unknown>;
  set: (key: string, value: unknown) => Promise<void>;
};

const store: StoreAPI = {
  get: (key: string) => ipcRenderer.invoke('store:get', key),
  set: (key: string, value: unknown) => ipcRenderer.invoke('store:set', key, value),
};

contextBridge.exposeInMainWorld('electronStore', store);
