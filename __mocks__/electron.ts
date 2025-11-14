/**
 * Mock for Electron modules
 * Used in unit tests to avoid Electron runtime dependencies
 */

export const app = {
  getPath: jest.fn((name: string) => `/mock/path/${name}`),
  quit: jest.fn(),
  whenReady: jest.fn(() => Promise.resolve()),
  requestSingleInstanceLock: jest.fn(() => true),
  on: jest.fn(),
  dock: {
    hide: jest.fn(),
  },
};

export const BrowserWindow = jest.fn().mockImplementation(() => ({
  loadURL: jest.fn(() => Promise.resolve()),
  loadFile: jest.fn(() => Promise.resolve()),
  show: jest.fn(),
  hide: jest.fn(),
  close: jest.fn(),
  isVisible: jest.fn(() => false),
  focus: jest.fn(),
  reload: jest.fn(),
  setVisibleOnAllWorkspaces: jest.fn(),
  setAlwaysOnTop: jest.fn(),
  on: jest.fn(),
  webContents: {
    send: jest.fn(),
    executeJavaScript: jest.fn(() => Promise.resolve()),
    on: jest.fn(),
  },
}));

export const Tray = jest.fn().mockImplementation(() => ({
  setToolTip: jest.fn(),
  setContextMenu: jest.fn(),
  setImage: jest.fn(),
  destroy: jest.fn(),
  on: jest.fn(),
}));

export const Menu = {
  buildFromTemplate: jest.fn((template) => template),
};

export const nativeImage = {
  createEmpty: jest.fn(() => ({
    toDataURL: jest.fn(() => 'data:image/png;base64,mock'),
    toPNG: jest.fn(() => Buffer.from('mock')),
    toJPEG: jest.fn(() => Buffer.from('mock')),
    getSize: jest.fn(() => ({ width: 100, height: 100 })),
    crop: jest.fn(function (this: any) {
      return this;
    }),
    resize: jest.fn(function (this: any) {
      return this;
    }),
  })),
  createFromPath: jest.fn((path: string) => ({
    toDataURL: jest.fn(() => 'data:image/png;base64,mock'),
    toPNG: jest.fn(() => Buffer.from('mock')),
  })),
};

export const globalShortcut = {
  register: jest.fn(() => true),
  unregister: jest.fn(),
  unregisterAll: jest.fn(),
  isRegistered: jest.fn(() => false),
};

export const clipboard = {
  writeText: jest.fn(),
  readText: jest.fn(() => ''),
  writeImage: jest.fn(),
  readImage: jest.fn(() => nativeImage.createEmpty()),
};

export const screen = {
  getPrimaryDisplay: jest.fn(() => ({
    workAreaSize: { width: 1920, height: 1080 },
    size: { width: 1920, height: 1080 },
  })),
};

export const desktopCapturer = {
  getSources: jest.fn(() =>
    Promise.resolve([
      {
        id: 'screen:0',
        name: 'Entire Screen',
        thumbnail: nativeImage.createEmpty(),
      },
    ])
  ),
};

export const ipcMain = {
  handle: jest.fn(),
  on: jest.fn(),
  removeHandler: jest.fn(),
};

export const ipcRenderer = {
  invoke: jest.fn(() => Promise.resolve()),
  on: jest.fn(),
  send: jest.fn(),
};

export const contextBridge = {
  exposeInMainWorld: jest.fn(),
};

