/**
 * Dependency injection types
 * These are used as identifiers for InversifyJS container
 */
export const TYPES = {
  // Services
  TrayService: Symbol.for('TrayService'),
  ScreenshotService: Symbol.for('ScreenshotService'),
  TranslatorService: Symbol.for('TranslatorService'),
  ShortcutService: Symbol.for('ShortcutService'),
  ImageService: Symbol.for('ImageService'),
  ConfigService: Symbol.for('ConfigService'),

  // Windows
  WindowManager: Symbol.for('WindowManager'),
  TranslatorWindow: Symbol.for('TranslatorWindow'),
  ScreenshotWindow: Symbol.for('ScreenshotWindow'),
  ResultWindow: Symbol.for('ResultWindow'),

  // Application
  Application: Symbol.for('Application'),
} as const;

