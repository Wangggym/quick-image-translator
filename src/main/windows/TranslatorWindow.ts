import { injectable, inject } from 'inversify';
import { BrowserWindow, NativeImage } from 'electron';
import * as path from 'path';
import { ITranslatorWindow, IConfigService } from '../types/interfaces';
import { BaseWindow } from './BaseWindow';
import { TYPES } from '../types/types';

/**
 * Translator window implementation
 * Manages the Google Translate window
 */
@injectable()
export class TranslatorWindow extends BaseWindow implements ITranslatorWindow {
  private ready = false;

  constructor(@inject(TYPES.ConfigService) private configService: IConfigService) {
    super();
  }

  /**
   * Create translator window
   */
  protected create(): BrowserWindow {
    const window = this.createWindow({
      width: 1024,
      height: 768,
      show: false,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, '../../../dist/main/preload/index.js'),
      },
    });

    // Listen for page load
    window.webContents.on('did-finish-load', () => {
      this.ready = true;
      console.warn('Translator window loaded');
    });

    // Handle page load errors
    window.webContents.on('did-fail-load', (_event, errorCode, errorDescription) => {
      console.error(`Translator window failed to load: ${errorCode} - ${errorDescription}`);
      this.ready = false;
    });

    return window;
  }

  /**
   * Load Google Translate page
   */
  async loadGoogleTranslate(): Promise<void> {
    if (!this.window) {
      this.window = this.create();
    }

    const url = this.configService.get<string>('translator.url');
    await this.window.loadURL(url);
  }

  /**
   * Upload image to Google Translate
   */
  async uploadImage(image: NativeImage): Promise<void> {
    if (!this.window || !this.ready) {
      throw new Error('Translator window not ready');
    }

    // Convert image to base64 data URL
    const dataURL = image.toDataURL();

    // Execute script to upload image
    // Note: This is a simplified version. Actual implementation
    // may need more sophisticated DOM manipulation
    await this.window.webContents.executeJavaScript(`
      (async function() {
        try {
          // Find the file input
          const fileInput = document.querySelector('input[type="file"]');
          if (!fileInput) {
            return { success: false, error: 'File input not found' };
          }

          // Convert data URL to file
          const res = await fetch('${dataURL}');
          const blob = await res.blob();
          const file = new File([blob], 'screenshot.png', { type: 'image/png' });
          
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(file);
          fileInput.files = dataTransfer.files;
          
          const event = new Event('change', { bubbles: true });
          fileInput.dispatchEvent(event);
          
          return { success: true };
        } catch (error) {
          return { success: false, error: error.message };
        }
      })();
    `);
  }

  /**
   * Check if window is ready
   */
  isReady(): boolean {
    return this.ready && this.window !== null;
  }

  /**
   * Show window
   */
  show(): void {
    if (!this.window || !this.ready) {
      this.loadGoogleTranslate().then(() => {
        super.show();
      });
    } else {
      super.show();
    }
  }

  /**
   * Handle window closed
   */
  protected onClosed(): void {
    this.ready = false;
  }
}

