import 'reflect-metadata';
import { ShortcutService } from '../ShortcutService';
import { IConfigService, IScreenshotService } from '../../types/interfaces';
import { globalShortcut } from 'electron';

describe('ShortcutService', () => {
  let shortcutService: ShortcutService;
  let mockConfigService: jest.Mocked<IConfigService>;
  let mockScreenshotService: jest.Mocked<IScreenshotService>;

  beforeEach(() => {
    jest.clearAllMocks();

    // Create mock services
    mockConfigService = {
      get: jest.fn(),
      set: jest.fn(),
      getAll: jest.fn(),
      save: jest.fn(),
    } as any;

    mockScreenshotService = {
      startScreenshotMode: jest.fn(),
      capture: jest.fn(),
      handleScreenshotComplete: jest.fn(),
      cancelScreenshot: jest.fn(),
    } as any;

    // Mock config service to return default shortcut
    mockConfigService.get.mockReturnValue('CommandOrControl+Shift+T');

    shortcutService = new ShortcutService(mockConfigService, mockScreenshotService);
  });

  describe('Constructor', () => {
    it('should create instance with dependencies', () => {
      expect(shortcutService).toBeInstanceOf(ShortcutService);
    });
  });

  describe('register()', () => {
    it('should register screenshot shortcut', () => {
      shortcutService.register();

      expect(mockConfigService.get).toHaveBeenCalledWith('shortcuts.screenshot');
      expect(globalShortcut.register).toHaveBeenCalled();
    });

    it('should call screenshot service when shortcut is triggered', () => {
      // Capture the callback
      let registeredCallback: (() => void) | null = null;
      (globalShortcut.register as jest.Mock).mockImplementation(
        (accelerator: string, callback: () => void) => {
          registeredCallback = callback;
          return true;
        }
      );

      shortcutService.register();

      // Trigger the callback
      if (registeredCallback) {
        registeredCallback();
      }

      expect(mockScreenshotService.startScreenshotMode).toHaveBeenCalled();
    });
  });

  describe('registerShortcut()', () => {
    it('should register a single shortcut successfully', () => {
      const result = shortcutService.registerShortcut('Ctrl+S', () => {});

      expect(result).toBe(true);
      expect(globalShortcut.register).toHaveBeenCalled();
    });

    it('should return false if registration fails', () => {
      (globalShortcut.register as jest.Mock).mockReturnValue(false);

      const result = shortcutService.registerShortcut('Invalid', () => {});

      expect(result).toBe(false);
    });

    it('should handle registration errors', () => {
      (globalShortcut.register as jest.Mock).mockImplementation(() => {
        throw new Error('Registration failed');
      });

      const result = shortcutService.registerShortcut('Ctrl+S', () => {});

      expect(result).toBe(false);
    });

    it('should track registered shortcuts', () => {
      shortcutService.registerShortcut('Ctrl+S', () => {});

      const registered = shortcutService.getRegistered();
      expect(registered).toContain('Ctrl+S');
    });
  });

  describe('unregister()', () => {
    it('should unregister all shortcuts', () => {
      shortcutService.register();
      shortcutService.unregister();

      expect(globalShortcut.unregisterAll).toHaveBeenCalled();
    });

    it('should clear registered shortcuts list', () => {
      shortcutService.registerShortcut('Ctrl+S', () => {});

      expect(shortcutService.getRegistered()).toHaveLength(1);

      shortcutService.unregister();

      expect(shortcutService.getRegistered()).toHaveLength(0);
    });
  });

  describe('isRegistered()', () => {
    it('should check if shortcut is registered', () => {
      (globalShortcut.isRegistered as jest.Mock).mockReturnValue(true);

      const result = shortcutService.isRegistered('Ctrl+S');

      expect(result).toBe(true);
      expect(globalShortcut.isRegistered).toHaveBeenCalledWith('Ctrl+S');
    });

    it('should return false for unregistered shortcut', () => {
      (globalShortcut.isRegistered as jest.Mock).mockReturnValue(false);

      const result = shortcutService.isRegistered('Ctrl+X');

      expect(result).toBe(false);
    });
  });

  describe('getRegistered()', () => {
    it('should return empty array initially', () => {
      const registered = shortcutService.getRegistered();

      expect(registered).toEqual([]);
    });

    it('should return list of registered shortcuts', () => {
      shortcutService.registerShortcut('Ctrl+S', () => {});
      shortcutService.registerShortcut('Ctrl+X', () => {});

      const registered = shortcutService.getRegistered();

      expect(registered).toHaveLength(2);
      expect(registered).toContain('Ctrl+S');
      expect(registered).toContain('Ctrl+X');
    });
  });
});

