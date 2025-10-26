import { app, BrowserWindow, ipcMain, nativeTheme } from 'electron';
import path from 'path';
import Store from 'electron-store';

const isDev = !!process.env.VITE_DEV_SERVER_URL;
const store = new Store();

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 720,
    backgroundColor: nativeTheme.shouldUseDarkColors ? '#121212' : '#f5f5f5',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
    title: 'The Pixel Bar Admin',
  });

  if (isDev && process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.handle('store:get', (_event, key: string) => {
  return store.get(key);
});

ipcMain.handle('store:set', (_event, key: string, value: unknown) => {
  store.set(key, value);
});
