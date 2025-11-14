import { injectable, inject } from 'inversify';
import { Tray, Menu, nativeImage, app } from 'electron';
import { ITrayService, IScreenshotService, IWindowManager } from '../types/interfaces';
import { TYPES } from '../types/types';
import * as path from 'path';

/**
 * Tray service implementation
 * Manages the system tray icon and menu
 */
@injectable()
export class TrayService implements ITrayService {
  private tray: Tray | null = null;

  constructor(
    @inject(TYPES.ScreenshotService) private screenshotService: IScreenshotService,
    @inject(TYPES.WindowManager) private windowManager: IWindowManager
  ) {}

  /**
   * Create system tray
   */
  create(): void {
    if (this.tray) {
      return; // Already created
    }

    // Create tray icon
    // For now, use empty image. TODO: Replace with actual icon
    const icon = this.createIcon();
    this.tray = new Tray(icon);

    // Set tooltip
    this.tray.setToolTip('Quick Image Translator');

    // Create context menu
    const contextMenu = this.createContextMenu();
    this.tray.setContextMenu(contextMenu);

    // Handle click event
    this.tray.on('click', () => {
      this.screenshotService.startScreenshotMode();
    });

    console.warn('Tray icon created');
  }

  /**
   * Create tray icon
   */
  private createIcon(): nativeImage {
    // Try to load icon from assets
    const iconPath = path.join(__dirname, '../../../assets/icons/trayTemplate.png');
    
    // Create a simple placeholder icon if file doesn't exist
    // In production, you should provide a proper icon file
    try {
      return nativeImage.createFromPath(iconPath);
    } catch {
      // Create a simple 16x16 icon as placeholder
      return nativeImage.createEmpty();
    }
  }

  /**
   * Create context menu
   */
  private createContextMenu(): Menu {
    return Menu.buildFromTemplate([
      {
        label: 'Quick Translate',
        accelerator: 'CmdOrCtrl+Shift+T',
        click: () => {
          this.screenshotService.startScreenshotMode();
        },
      },
      { type: 'separator' },
      {
        label: 'Show Translator',
        click: () => {
          const translatorWindow = this.windowManager.getTranslatorWindow();
          translatorWindow.show();
        },
      },
      {
        label: 'Reload Translator',
        click: () => {
          const translatorWindow = this.windowManager.getTranslatorWindow();
          const window = translatorWindow.getWindow();
          if (window) {
            window.reload();
          }
        },
      },
      { type: 'separator' },
      {
        label: 'About',
        click: () => {
          // TODO: Show about dialog
          console.warn('About Quick Image Translator v0.1.0');
        },
      },
      {
        label: 'Quit',
        accelerator: 'CmdOrCtrl+Q',
        click: () => {
          app.quit();
        },
      },
    ]);
  }

  /**
   * Update tooltip text
   */
  updateTooltip(text: string): void {
    if (this.tray) {
      this.tray.setToolTip(text);
    }
  }

  /**
   * Destroy tray
   */
  destroy(): void {
    if (this.tray) {
      this.tray.destroy();
      this.tray = null;
      console.warn('Tray icon destroyed');
    }
  }

  /**
   * Update tray icon
   */
  updateIcon(iconPath: string): void {
    if (this.tray) {
      const icon = nativeImage.createFromPath(iconPath);
      this.tray.setImage(icon);
    }
  }
}

