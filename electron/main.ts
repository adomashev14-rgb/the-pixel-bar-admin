// electron/main.ts
import { app, BrowserWindow } from 'electron';
import * as path from 'path';

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      // якщо є preload.ts → після компіляції буде preload.js у dist-electron
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // Dev vs Prod
  if (process.env.VITE_DEV_SERVER_URL) {
    // dev-режим (vite dev server)
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
    // win.webContents.openDevTools();
  } else {
    // прод-збірка (відкриваємо зібраний Vite HTML)
    win.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
