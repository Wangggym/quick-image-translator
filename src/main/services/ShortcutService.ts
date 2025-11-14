import { injectable, inject } from 'inversify';
import { globalShortcut } from 'electron';
import { IShortcutService, IConfigService, IScreenshotService } from '../types/interfaces';
import { TYPES } from '../types/types';

/**
 * Shortcut service implementation
 * Manages global keyboard shortcuts
 */
@injectable()
export class ShortcutService implements IShortcutService {
  private registered: Set<string> = new Set();

  constructor(
    @inject(TYPES.ConfigService) private configService: IConfigService,
    @inject(TYPES.ScreenshotService) private screenshotService: IScreenshotService
  ) {}

  /**
   * Register all shortcuts
   */
  register(): void {
    const screenshotShortcut = this.configService.get<string>('shortcuts.screenshot');
    this.registerShortcut(screenshotShortcut, () => {
      this.screenshotService.startScreenshotMode();
    });
  }

  /**
   * Register a single shortcut
   */
  registerShortcut(accelerator: string, callback: () => void): boolean {
    try {
      const success = globalShortcut.register(accelerator, callback);
      if (success) {
        this.registered.add(accelerator);
        console.warn(`Registered shortcut: ${accelerator}`);
      } else {
        console.error(`Failed to register shortcut: ${accelerator}`);
      }
      return success;
    } catch (error) {
      console.error(`Error registering shortcut ${accelerator}:`, error);
      return false;
    }
  }

  /**
   * Unregister all shortcuts
   */
  unregister(): void {
    globalShortcut.unregisterAll();
    this.registered.clear();
    console.warn('Unregistered all shortcuts');
  }

  /**
   * Check if a shortcut is registered
   */
  isRegistered(accelerator: string): boolean {
    return globalShortcut.isRegistered(accelerator);
  }

  /**
   * Get all registered shortcuts
   */
  getRegistered(): string[] {
    return Array.from(this.registered);
  }
}

