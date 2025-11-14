import { BrowserWindow, NativeImage, Rectangle } from 'electron';

/**
 * Base window interface
 */
export interface IWindow {
  show(): void;
  hide(): void;
  close(): void;
  isVisible(): boolean;
  getWindow(): BrowserWindow | null;
}

/**
 * Window manager interface
 */
export interface IWindowManager {
  getTranslatorWindow(): ITranslatorWindow;
  getScreenshotWindow(): IScreenshotWindow;
  getResultWindow(): IResultWindow;
  closeAll(): void;
}

/**
 * Translator window interface
 */
export interface ITranslatorWindow extends IWindow {
  loadGoogleTranslate(): Promise<void>;
  uploadImage(image: NativeImage): Promise<void>;
  isReady(): boolean;
}

/**
 * Screenshot window interface
 */
export interface IScreenshotWindow extends IWindow {
  startCapture(): Promise<void>;
}

/**
 * Result window interface
 */
export interface IResultWindow extends IWindow {
  displayResult(result: TranslationResult): void;
}

/**
 * Tray service interface
 */
export interface ITrayService {
  create(): void;
  destroy(): void;
  updateTooltip(text: string): void;
}

/**
 * Screenshot service interface
 */
export interface IScreenshotService {
  capture(bounds: Rectangle): Promise<NativeImage>;
  startScreenshotMode(): void;
}

/**
 * Translator service interface
 */
export interface ITranslatorService {
  translate(image: NativeImage): Promise<TranslationResult>;
  uploadToGoogle(image: NativeImage): Promise<void>;
}

/**
 * Shortcut service interface
 */
export interface IShortcutService {
  register(): void;
  unregister(): void;
  registerShortcut(accelerator: string, callback: () => void): boolean;
}

/**
 * Image service interface
 */
export interface IImageService {
  toDataURL(image: NativeImage): string;
  toBuffer(image: NativeImage): Buffer;
  crop(image: NativeImage, bounds: Rectangle): NativeImage;
  copyToClipboard(image: NativeImage): void;
}

/**
 * Config service interface
 */
export interface IConfigService {
  get<T>(key: string): T;
  set<T>(key: string, value: T): void;
  getAll(): AppConfig;
  save(): Promise<void>;
}

/**
 * Application configuration
 */
export interface AppConfig {
  shortcuts: {
    screenshot: string;
  };
  translator: {
    url: string;
    timeout: number;
  };
  window: {
    alwaysOnTop: boolean;
    showInDock: boolean;
  };
  ui: {
    language: string;
    theme: 'light' | 'dark' | 'auto';
  };
}

/**
 * Translation result
 */
export interface TranslationResult {
  originalText: string;
  translatedText: string;
  sourceLang: string;
  targetLang: string;
  timestamp: Date;
}

/**
 * Screenshot bounds
 */
export interface ScreenshotBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * IPC channel names
 */
export const IPC_CHANNELS = {
  SCREENSHOT_SELECTED: 'screenshot:selected',
  SCREENSHOT_CANCELLED: 'screenshot:cancelled',
  TRANSLATION_RESULT: 'translation:result',
  TRANSLATION_ERROR: 'translation:error',
  WINDOW_READY: 'window:ready',
} as const;

/**
 * Event types
 */
export enum AppEvent {
  SCREENSHOT_START = 'screenshot:start',
  SCREENSHOT_COMPLETE = 'screenshot:complete',
  SCREENSHOT_CANCEL = 'screenshot:cancel',
  TRANSLATION_START = 'translation:start',
  TRANSLATION_COMPLETE = 'translation:complete',
  TRANSLATION_ERROR = 'translation:error',
  APP_QUIT = 'app:quit',
}

