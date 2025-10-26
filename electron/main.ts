// electron/main.ts
import { app, BrowserWindow, globalShortcut } from 'electron';
import * as path from 'node:path';

const isDev = !app.isPackaged;

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // -> dist-electron/preload.js
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  // показати, коли готове (щоб не бачити білий екран під час завантаження)
  win.once('ready-to-show', () => win.show());

  // корисні логи, якщо щось піде не так
  win.webContents.on('did-fail-load', (_ev, code, desc, url) => {
    console.error('did-fail-load:', { code, desc, url });
  });
  win.webContents.on('render-process-gone', (_e, details) => {
    console.error('render-process-gone:', details);
  });

  // DevTools по F12 навіть у зібраному додатку
  globalShortcut.register('F12', () => {
    if (win.webContents.isDevToolsOpened()) win.webContents.closeDevTools();
    else win.webContents.openDevTools({ mode: 'detach' });
  });

  if (isDev) {
    win.loadURL('http://localhost:5173');
    win.webContents.openDevTools({ mode: 'detach' });
  } else {
    // __dirname у збірці = .../resources/app.asar/dist-electron
    const indexPath = path.join(__dirname, '..', 'dist', 'index.html');
    win.loadFile(indexPath).catch(err => {
      console.error('loadFile error:', err, 'path:', indexPath);
    });
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// щоб не падало тихо
process.on('uncaughtException', (e) => console.error('uncaughtException', e));
process.on('unhandledRejection', (e) => console.error('unhandledRejection', e));
