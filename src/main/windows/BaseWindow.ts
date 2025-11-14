import { BrowserWindow, BrowserWindowConstructorOptions } from 'electron';
import { IWindow } from '../types/interfaces';

/**
 * Base window class
 * Provides common window functionality
 */
export abstract class BaseWindow implements IWindow {
  protected window: BrowserWindow | null = null;

  /**
   * Create window with options
   */
  protected createWindow(options: BrowserWindowConstructorOptions): BrowserWindow {
    if (this.window) {
      return this.window;
    }

    this.window = new BrowserWindow(options);

    // Handle window close
    this.window.on('closed', () => {
      this.onClosed();
      this.window = null;
    });

    return this.window;
  }

  /**
   * Show window
   */
  show(): void {
    if (!this.window) {
      this.window = this.create();
    }
    this.window.show();
    this.window.focus();
  }

  /**
   * Hide window
   */
  hide(): void {
    if (this.window) {
      this.window.hide();
    }
  }

  /**
   * Close window
   */
  close(): void {
    if (this.window) {
      this.window.close();
    }
  }

  /**
   * Check if window is visible
   */
  isVisible(): boolean {
    return this.window?.isVisible() ?? false;
  }

  /**
   * Get browser window instance
   */
  getWindow(): BrowserWindow | null {
    return this.window;
  }

  /**
   * Template method - subclasses must implement window creation
   */
  protected abstract create(): BrowserWindow;

  /**
   * Hook for when window is closed
   */
  protected onClosed(): void {
    // Override in subclass if needed
  }
}

