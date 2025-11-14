import 'reflect-metadata';
import { ImageService } from '../ImageService';
import { nativeImage, clipboard } from 'electron';

// Mocked by __mocks__/electron.ts

describe('ImageService', () => {
  let imageService: ImageService;
  let mockImage: any;

  beforeEach(() => {
    jest.clearAllMocks();
    imageService = new ImageService();

    // Create a mock image
    mockImage = nativeImage.createEmpty();
  });

  describe('toDataURL()', () => {
    it('should convert image to data URL', () => {
      const result = imageService.toDataURL(mockImage);

      expect(result).toBeDefined();
      expect(mockImage.toDataURL).toHaveBeenCalled();
    });
  });

  describe('toBuffer()', () => {
    it('should convert image to buffer', () => {
      const result = imageService.toBuffer(mockImage);

      expect(result).toBeInstanceOf(Buffer);
      expect(mockImage.toPNG).toHaveBeenCalled();
    });
  });

  describe('crop()', () => {
    it('should crop image with specified bounds', () => {
      const bounds = { x: 10, y: 20, width: 100, height: 200 };

      const result = imageService.crop(mockImage, bounds);

      expect(result).toBeDefined();
      expect(mockImage.crop).toHaveBeenCalledWith(bounds);
    });

    it('should handle zero bounds', () => {
      const bounds = { x: 0, y: 0, width: 0, height: 0 };

      const result = imageService.crop(mockImage, bounds);

      expect(result).toBeDefined();
      expect(mockImage.crop).toHaveBeenCalledWith(bounds);
    });
  });

  describe('copyToClipboard()', () => {
    it('should copy image to clipboard', () => {
      imageService.copyToClipboard(mockImage);

      expect(clipboard.writeImage).toHaveBeenCalledWith(mockImage);
    });
  });

  describe('getSize()', () => {
    it('should return image size', () => {
      const size = imageService.getSize(mockImage);

      expect(size).toHaveProperty('width');
      expect(size).toHaveProperty('height');
      expect(mockImage.getSize).toHaveBeenCalled();
    });

    it('should return correct dimensions', () => {
      const size = imageService.getSize(mockImage);

      expect(size.width).toBe(100);
      expect(size.height).toBe(100);
    });
  });

  describe('resize()', () => {
    it('should resize image with width only', () => {
      const options = { width: 50 };

      const result = imageService.resize(mockImage, options);

      expect(result).toBeDefined();
      expect(mockImage.resize).toHaveBeenCalledWith(options);
    });

    it('should resize image with height only', () => {
      const options = { height: 75 };

      const result = imageService.resize(mockImage, options);

      expect(result).toBeDefined();
      expect(mockImage.resize).toHaveBeenCalledWith(options);
    });

    it('should resize image with width and height', () => {
      const options = { width: 50, height: 75 };

      const result = imageService.resize(mockImage, options);

      expect(result).toBeDefined();
      expect(mockImage.resize).toHaveBeenCalledWith(options);
    });

    it('should resize image with quality option', () => {
      const options = { width: 50, quality: 'best' as const };

      const result = imageService.resize(mockImage, options);

      expect(result).toBeDefined();
      expect(mockImage.resize).toHaveBeenCalledWith(options);
    });
  });
});

