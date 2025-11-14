import 'reflect-metadata';
import { ConfigService } from '../ConfigService';
import * as fs from 'fs';

// Mock fs module
jest.mock('fs');

describe('ConfigService', () => {
  let configService: ConfigService;
  const mockConfigPath = '/mock/path/userData/config.json';

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();

    // Mock fs.existsSync to return false (no existing config)
    (fs.existsSync as jest.Mock).mockReturnValue(false);

    configService = new ConfigService();
  });

  describe('Constructor', () => {
    it('should create instance with default config', () => {
      expect(configService).toBeInstanceOf(ConfigService);
    });

    it('should load default configuration', () => {
      const config = configService.getAll();

      expect(config).toHaveProperty('shortcuts');
      expect(config).toHaveProperty('translator');
      expect(config).toHaveProperty('window');
      expect(config).toHaveProperty('ui');
    });
  });

  describe('get()', () => {
    it('should get top-level configuration value', () => {
      const shortcuts = configService.get<any>('shortcuts');

      expect(shortcuts).toBeDefined();
      expect(shortcuts).toHaveProperty('screenshot');
    });

    it('should get nested configuration value', () => {
      const screenshotShortcut = configService.get<string>('shortcuts.screenshot');

      expect(screenshotShortcut).toBe('CommandOrControl+Shift+T');
    });

    it('should return undefined for non-existent key', () => {
      const value = configService.get<any>('nonexistent.key');

      expect(value).toBeUndefined();
    });
  });

  describe('set()', () => {
    it('should set top-level configuration value', () => {
      configService.set('shortcuts', { screenshot: 'Ctrl+Alt+S' });

      const shortcuts = configService.get<any>('shortcuts');
      expect(shortcuts.screenshot).toBe('Ctrl+Alt+S');
    });

    it('should set nested configuration value', () => {
      configService.set('shortcuts.screenshot', 'Ctrl+Alt+S');

      const shortcut = configService.get<string>('shortcuts.screenshot');
      expect(shortcut).toBe('Ctrl+Alt+S');
    });

    it('should create nested object if not exists', () => {
      configService.set('new.nested.value', 'test');

      const value = configService.get<string>('new.nested.value');
      expect(value).toBe('test');
    });
  });

  describe('getAll()', () => {
    it('should return a copy of all configuration', () => {
      const config1 = configService.getAll();
      const config2 = configService.getAll();

      expect(config1).not.toBe(config2); // Different objects
      expect(config1).toEqual(config2); // Same content
    });

    it('should return complete configuration structure', () => {
      const config = configService.getAll();

      expect(config.shortcuts).toBeDefined();
      expect(config.translator).toBeDefined();
      expect(config.window).toBeDefined();
      expect(config.ui).toBeDefined();
    });
  });

  describe('save()', () => {
    it('should save configuration to file', async () => {
      (fs.writeFileSync as jest.Mock).mockImplementation(() => {});
      (fs.mkdirSync as jest.Mock).mockImplementation(() => {});

      await configService.save();

      expect(fs.writeFileSync).toHaveBeenCalled();
    });

    it('should create directory if not exists', async () => {
      (fs.existsSync as jest.Mock).mockReturnValue(false);
      (fs.mkdirSync as jest.Mock).mockImplementation(() => {});
      (fs.writeFileSync as jest.Mock).mockImplementation(() => {});

      await configService.save();

      expect(fs.mkdirSync).toHaveBeenCalled();
    });

    it('should throw error if save fails', async () => {
      (fs.writeFileSync as jest.Mock).mockImplementation(() => {
        throw new Error('Write failed');
      });

      await expect(configService.save()).rejects.toThrow();
    });
  });

  describe('Default Configuration', () => {
    it('should have correct default shortcut', () => {
      const shortcut = configService.get<string>('shortcuts.screenshot');
      expect(shortcut).toBe('CommandOrControl+Shift+T');
    });

    it('should have correct default translator URL', () => {
      const url = configService.get<string>('translator.url');
      expect(url).toBe('https://translate.google.com/?op=images');
    });

    it('should have correct default translator timeout', () => {
      const timeout = configService.get<number>('translator.timeout');
      expect(timeout).toBe(30000);
    });

    it('should have correct default window settings', () => {
      const alwaysOnTop = configService.get<boolean>('window.alwaysOnTop');
      const showInDock = configService.get<boolean>('window.showInDock');

      expect(alwaysOnTop).toBe(false);
      expect(showInDock).toBe(false);
    });

    it('should have correct default UI settings', () => {
      const language = configService.get<string>('ui.language');
      const theme = configService.get<string>('ui.theme');

      expect(language).toBe('auto');
      expect(theme).toBe('auto');
    });
  });

  describe('Load existing config', () => {
    it('should load config from file if exists', () => {
      const mockConfig = {
        shortcuts: { screenshot: 'Ctrl+S' },
        translator: { url: 'https://test.com', timeout: 5000 },
        window: { alwaysOnTop: true, showInDock: true },
        ui: { language: 'en', theme: 'dark' },
      };

      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(mockConfig));

      const service = new ConfigService();

      expect(service.get<string>('shortcuts.screenshot')).toBe('Ctrl+S');
      expect(service.get<string>('translator.url')).toBe('https://test.com');
    });

    it('should merge with defaults if loaded config is incomplete', () => {
      const partialConfig = {
        shortcuts: { screenshot: 'Ctrl+S' },
      };

      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(partialConfig));

      const service = new ConfigService();

      // Custom value
      expect(service.get<string>('shortcuts.screenshot')).toBe('Ctrl+S');

      // Default values still exist
      expect(service.get<string>('translator.url')).toBe(
        'https://translate.google.com/?op=images'
      );
    });

    it('should use defaults if config file is corrupted', () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.readFileSync as jest.Mock).mockReturnValue('invalid json');

      const service = new ConfigService();

      // Should fall back to defaults
      expect(service.get<string>('shortcuts.screenshot')).toBe('CommandOrControl+Shift+T');
    });
  });
});

