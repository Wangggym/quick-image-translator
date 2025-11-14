import { injectable, inject } from 'inversify';
import { desktopCapturer, screen, NativeImage, Rectangle } from 'electron';
import {
  IScreenshotService,
  IWindowManager,
  IImageService,
  ITranslatorService,
} from '../types/interfaces';
import { TYPES } from '../types/types';

/**
 * Screenshot service implementation
 * Handles screenshot capture operations
 */
@injectable()
export class ScreenshotService implements IScreenshotService {
  constructor(
    @inject(TYPES.WindowManager) private windowManager: IWindowManager,
    @inject(TYPES.ImageService) private imageService: IImageService,
    @inject(TYPES.TranslatorService) private translatorService: ITranslatorService
  ) {}

  /**
   * Start screenshot mode
   */
  startScreenshotMode(): void {
    const screenshotWindow = this.windowManager.getScreenshotWindow();
    screenshotWindow.startCapture();
  }

  /**
   * Capture screenshot of specified bounds
   */
  async capture(bounds: Rectangle): Promise<NativeImage> {
    try {
      // Get desktop sources
      const sources = await desktopCapturer.getSources({
        types: ['screen'],
        thumbnailSize: screen.getPrimaryDisplay().size,
      });

      if (sources.length === 0) {
        throw new Error('No screen sources available');
      }

      // Use the first screen source (primary display)
      const screenshot = sources[0].thumbnail;

      // Crop to specified bounds
      const croppedImage = this.imageService.crop(screenshot, {
        x: Math.round(bounds.x),
        y: Math.round(bounds.y),
        width: Math.round(bounds.width),
        height: Math.round(bounds.height),
      });

      return croppedImage;
    } catch (error) {
      console.error('Screenshot capture error:', error);
      throw error;
    }
  }

  /**
   * Handle screenshot completion
   */
  async handleScreenshotComplete(bounds: Rectangle): Promise<void> {
    try {
      // Capture the screenshot
      const image = await this.capture(bounds);

      // Send to translator service
      await this.translatorService.uploadToGoogle(image);
    } catch (error) {
      console.error('Screenshot handling error:', error);
      throw error;
    }
  }

  /**
   * Cancel screenshot
   */
  cancelScreenshot(): void {
    const screenshotWindow = this.windowManager.getScreenshotWindow();
    screenshotWindow.hide();
  }
}

