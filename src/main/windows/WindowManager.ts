import { injectable, inject } from 'inversify';
import {
  IWindowManager,
  ITranslatorWindow,
  IScreenshotWindow,
  IResultWindow,
} from '../types/interfaces';
import { TYPES } from '../types/types';

/**
 * Window manager implementation
 * Manages all application windows
 */
@injectable()
export class WindowManager implements IWindowManager {
  constructor(
    @inject(TYPES.TranslatorWindow) private translatorWindow: ITranslatorWindow,
    @inject(TYPES.ScreenshotWindow) private screenshotWindow: IScreenshotWindow,
    @inject(TYPES.ResultWindow) private resultWindow: IResultWindow
  ) {}

  /**
   * Get translator window
   */
  getTranslatorWindow(): ITranslatorWindow {
    return this.translatorWindow;
  }

  /**
   * Get screenshot window
   */
  getScreenshotWindow(): IScreenshotWindow {
    return this.screenshotWindow;
  }

  /**
   * Get result window
   */
  getResultWindow(): IResultWindow {
    return this.resultWindow;
  }

  /**
   * Close all windows
   */
  closeAll(): void {
    this.translatorWindow.close();
    this.screenshotWindow.close();
    this.resultWindow.close();
  }

  /**
   * Hide all windows
   */
  hideAll(): void {
    this.translatorWindow.hide();
    this.screenshotWindow.hide();
    this.resultWindow.hide();
  }
}

