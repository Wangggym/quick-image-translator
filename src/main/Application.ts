import { injectable, inject } from 'inversify';
import { app, BrowserWindow } from 'electron';
import {
  ITrayService,
  IShortcutService,
  IWindowManager,
  IConfigService,
} from './types/interfaces';
import { TYPES } from './types/types';

/**
 * Main application class
 * Orchestrates all services and manages application lifecycle
 */
@injectable()
export class Application {
  constructor(
    @inject(TYPES.TrayService) private trayService: ITrayService,
    @inject(TYPES.ShortcutService) private shortcutService: IShortcutService,
    @inject(TYPES.WindowManager) private windowManager: IWindowManager,
    @inject(TYPES.ConfigService) private configService: IConfigService
  ) {}

  /**
   * Initialize the application
   */
  async initialize(): Promise<void> {
    console.warn('Initializing Quick Image Translator...');

    // Setup application
    this.setupApp();

    // Create tray icon
    this.trayService.create();

    // Register global shortcuts
    this.shortcutService.register();

    // Pre-load translator window in background
    await this.preloadWindows();

    console.warn('Application initialized successfully');
  }

  /**
   * Setup application configuration
   */
  private setupApp(): void {
    // Don't show app in dock (menu bar app only)
    if (process.platform === 'darwin') {
      app.dock.hide();
    }

    // Prevent multiple instances
    const gotTheLock = app.requestSingleInstanceLock();
    if (!gotTheLock) {
      console.warn('Another instance is already running. Quitting...');
      app.quit();
      return;
    }

    // Handle second instance
    app.on('second-instance', () => {
      console.warn('Second instance detected. Bringing to focus...');
      // You could show a notification or bring translator window to front
    });

    // Handle window-all-closed
    app.on('window-all-closed', (event) => {
      // Prevent app from quitting
      event.preventDefault();
    });

    // Handle will-quit
    app.on('will-quit', () => {
      this.cleanup();
    });

    // Handle before-quit
    app.on('before-quit', () => {
      this.cleanup();
    });

    // Handle activate (macOS)
    app.on('activate', () => {
      // On macOS, re-create windows when dock icon is clicked
      if (BrowserWindow.getAllWindows().length === 0) {
        this.preloadWindows();
      }
    });
  }

  /**
   * Pre-load windows for better performance
   */
  private async preloadWindows(): Promise<void> {
    try {
      // Pre-load translator window
      const translatorWindow = this.windowManager.getTranslatorWindow();
      await translatorWindow.loadGoogleTranslate();
      console.warn('Translator window pre-loaded');
    } catch (error) {
      console.error('Failed to pre-load windows:', error);
    }
  }

  /**
   * Cleanup resources before quit
   */
  private cleanup(): void {
    console.warn('Cleaning up application...');

    // Unregister shortcuts
    this.shortcutService.unregister();

    // Destroy tray
    this.trayService.destroy();

    // Close all windows
    this.windowManager.closeAll();

    // Save config
    this.configService.save().catch((error) => {
      console.error('Failed to save config:', error);
    });

    console.warn('Cleanup complete');
  }

  /**
   * Quit application
   */
  quit(): void {
    app.quit();
  }
}

