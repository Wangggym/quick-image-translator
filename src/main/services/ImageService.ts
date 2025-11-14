import { injectable } from 'inversify';
import { NativeImage, clipboard, Rectangle } from 'electron';
import { IImageService } from '../types/interfaces';

/**
 * Image service implementation
 * Handles image processing operations
 */
@injectable()
export class ImageService implements IImageService {
  /**
   * Convert image to data URL
   */
  toDataURL(image: NativeImage): string {
    return image.toDataURL();
  }

  /**
   * Convert image to buffer
   */
  toBuffer(image: NativeImage): Buffer {
    return image.toPNG();
  }

  /**
   * Crop image to specified bounds
   */
  crop(image: NativeImage, bounds: Rectangle): NativeImage {
    return image.crop(bounds);
  }

  /**
   * Copy image to clipboard
   */
  copyToClipboard(image: NativeImage): void {
    clipboard.writeImage(image);
  }

  /**
   * Get image size
   */
  getSize(image: NativeImage): { width: number; height: number } {
    return image.getSize();
  }

  /**
   * Resize image
   */
  resize(
    image: NativeImage,
    options: { width?: number; height?: number; quality?: 'good' | 'better' | 'best' }
  ): NativeImage {
    return image.resize(options);
  }
}

