import { injectable, inject } from 'inversify';
import { BrowserWindow, screen, ipcMain } from 'electron';
import * as path from 'path';
import { IScreenshotWindow, IScreenshotService, ScreenshotBounds } from '../types/interfaces';
import { BaseWindow } from './BaseWindow';
import { TYPES } from '../types/types';
import { IPC_CHANNELS } from '../types/interfaces';

/**
 * Screenshot window implementation
 * Manages the screenshot selection overlay
 */
@injectable()
export class ScreenshotWindow extends BaseWindow implements IScreenshotWindow {
  constructor(@inject(TYPES.ScreenshotService) private screenshotService: IScreenshotService) {
    super();
    this.setupIPC();
  }

  /**
   * Create screenshot window
   */
  protected create(): BrowserWindow {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;

    const window = this.createWindow({
      width,
      height,
      x: 0,
      y: 0,
      transparent: true,
      frame: false,
      resizable: false,
      movable: false,
      alwaysOnTop: true,
      skipTaskbar: true,
      fullscreen: false,
      show: false,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, '../../../dist/main/preload/index.js'),
      },
    });

    // Make window visible on all workspaces
    window.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
    window.setAlwaysOnTop(true, 'screen-saver', 1);

    // Load screenshot UI
    const htmlPath = path.join(__dirname, '../../../src/renderer/screenshot/index.html');
    window.loadFile(htmlPath).catch((error) => {
      console.error('Failed to load screenshot window:', error);
    });

    return window;
  }

  /**
   * Setup IPC handlers
   */
  private setupIPC(): void {
    // Handle screenshot selection
    ipcMain.handle(IPC_CHANNELS.SCREENSHOT_SELECTED, async (_event, bounds: ScreenshotBounds) => {
      try {
        await this.screenshotService.handleScreenshotComplete(bounds);
        this.hide();
        return { success: true };
      } catch (error: any) {
        console.error('Screenshot selected error:', error);
        return { success: false, error: error.message };
      }
    });

    // Handle screenshot cancellation
    ipcMain.handle(IPC_CHANNELS.SCREENSHOT_CANCELLED, () => {
      this.hide();
      return { success: true };
    });
  }

  /**
   * Start capture mode
   */
  async startCapture(): Promise<void> {
    this.show();
  }

  /**
   * Show window and focus
   */
  show(): void {
    if (!this.window) {
      this.window = this.create();
    }
    super.show();
  }
}

