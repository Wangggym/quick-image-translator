import { injectable } from 'inversify';
import { IConfigService, AppConfig } from '../types/interfaces';
import * as path from 'path';
import * as fs from 'fs';
import { app } from 'electron';

/**
 * Configuration service implementation
 * Manages application settings
 */
@injectable()
export class ConfigService implements IConfigService {
  private config: AppConfig;
  private configPath: string;

  constructor() {
    this.configPath = path.join(app.getPath('userData'), 'config.json');
    this.config = this.loadConfig();
  }

  /**
   * Get default configuration
   */
  private getDefaultConfig(): AppConfig {
    return {
      shortcuts: {
        screenshot: 'CommandOrControl+Shift+T',
      },
      translator: {
        url: 'https://translate.google.com/?op=images',
        timeout: 30000,
      },
      window: {
        alwaysOnTop: false,
        showInDock: false,
      },
      ui: {
        language: 'auto',
        theme: 'auto',
      },
    };
  }

  /**
   * Load configuration from disk
   */
  private loadConfig(): AppConfig {
    try {
      if (fs.existsSync(this.configPath)) {
        const data = fs.readFileSync(this.configPath, 'utf-8');
        const loadedConfig = JSON.parse(data);
        return { ...this.getDefaultConfig(), ...loadedConfig };
      }
    } catch (error) {
      console.error('Failed to load config:', error);
    }
    return this.getDefaultConfig();
  }

  /**
   * Get configuration value by key
   */
  get<T>(key: string): T {
    const keys = key.split('.');
    let value: any = this.config;
    for (const k of keys) {
      value = value[k];
      if (value === undefined) break;
    }
    return value as T;
  }

  /**
   * Set configuration value
   */
  set<T>(key: string, value: T): void {
    const keys = key.split('.');
    let obj: any = this.config;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!obj[keys[i]]) obj[keys[i]] = {};
      obj = obj[keys[i]];
    }
    obj[keys[keys.length - 1]] = value;
  }

  /**
   * Get all configuration
   */
  getAll(): AppConfig {
    return { ...this.config };
  }

  /**
   * Save configuration to disk
   */
  async save(): Promise<void> {
    try {
      const dir = path.dirname(this.configPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(this.configPath, JSON.stringify(this.config, null, 2), 'utf-8');
    } catch (error) {
      console.error('Failed to save config:', error);
      throw error;
    }
  }
}

