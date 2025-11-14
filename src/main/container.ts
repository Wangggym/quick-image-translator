import 'reflect-metadata';
import { Container } from 'inversify';
import { TYPES } from './types/types';

// Import interfaces
import {
  ITrayService,
  IScreenshotService,
  ITranslatorService,
  IShortcutService,
  IImageService,
  IConfigService,
  IWindowManager,
  ITranslatorWindow,
  IScreenshotWindow,
  IResultWindow,
} from './types/interfaces';

// Import implementations
import { TrayService } from './services/TrayService';
import { ScreenshotService } from './services/ScreenshotService';
import { TranslatorService } from './services/TranslatorService';
import { ShortcutService } from './services/ShortcutService';
import { ImageService } from './services/ImageService';
import { ConfigService } from './services/ConfigService';
import { WindowManager } from './windows/WindowManager';
import { TranslatorWindow } from './windows/TranslatorWindow';
import { ScreenshotWindow } from './windows/ScreenshotWindow';
import { ResultWindow } from './windows/ResultWindow';
import { Application } from './Application';

/**
 * Create and configure the IoC container
 */
export function createContainer(): Container {
  const container = new Container();

  // Bind services
  container.bind<ITrayService>(TYPES.TrayService).to(TrayService).inSingletonScope();
  container
    .bind<IScreenshotService>(TYPES.ScreenshotService)
    .to(ScreenshotService)
    .inSingletonScope();
  container
    .bind<ITranslatorService>(TYPES.TranslatorService)
    .to(TranslatorService)
    .inSingletonScope();
  container
    .bind<IShortcutService>(TYPES.ShortcutService)
    .to(ShortcutService)
    .inSingletonScope();
  container.bind<IImageService>(TYPES.ImageService).to(ImageService).inSingletonScope();
  container.bind<IConfigService>(TYPES.ConfigService).to(ConfigService).inSingletonScope();

  // Bind windows
  container.bind<IWindowManager>(TYPES.WindowManager).to(WindowManager).inSingletonScope();
  container
    .bind<ITranslatorWindow>(TYPES.TranslatorWindow)
    .to(TranslatorWindow)
    .inSingletonScope();
  container
    .bind<IScreenshotWindow>(TYPES.ScreenshotWindow)
    .to(ScreenshotWindow)
    .inSingletonScope();
  container.bind<IResultWindow>(TYPES.ResultWindow).to(ResultWindow).inSingletonScope();

  // Bind application
  container.bind<Application>(TYPES.Application).to(Application).inSingletonScope();

  return container;
}

