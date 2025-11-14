import { injectable } from 'inversify';
import { BrowserWindow } from 'electron';
import * as path from 'path';
import { IResultWindow, TranslationResult } from '../types/interfaces';
import { BaseWindow } from './BaseWindow';

/**
 * Result window implementation
 * Displays translation results (optional feature)
 */
@injectable()
export class ResultWindow extends BaseWindow implements IResultWindow {
  /**
   * Create result window
   */
  protected create(): BrowserWindow {
    const window = this.createWindow({
      width: 600,
      height: 400,
      show: false,
      frame: true,
      resizable: true,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, '../../../dist/main/preload/index.js'),
      },
    });

    // Load result UI
    const htmlPath = path.join(__dirname, '../../../src/renderer/result/index.html');
    window.loadFile(htmlPath).catch((error) => {
      console.error('Failed to load result window:', error);
    });

    return window;
  }

  /**
   * Display translation result
   */
  displayResult(result: TranslationResult): void {
    if (!this.window) {
      this.window = this.create();
    }

    // Send result to renderer
    this.window.webContents.send('translation-result', result);
    this.show();
  }
}

