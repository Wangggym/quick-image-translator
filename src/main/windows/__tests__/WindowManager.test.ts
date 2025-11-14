import 'reflect-metadata';
import { WindowManager } from '../WindowManager';
import {
  ITranslatorWindow,
  IScreenshotWindow,
  IResultWindow,
} from '../../types/interfaces';

describe('WindowManager', () => {
  let windowManager: WindowManager;
  let mockTranslatorWindow: jest.Mocked<ITranslatorWindow>;
  let mockScreenshotWindow: jest.Mocked<IScreenshotWindow>;
  let mockResultWindow: jest.Mocked<IResultWindow>;

  beforeEach(() => {
    jest.clearAllMocks();

    // Create mock windows
    mockTranslatorWindow = {
      show: jest.fn(),
      hide: jest.fn(),
      close: jest.fn(),
      isVisible: jest.fn(),
      getWindow: jest.fn(),
      loadGoogleTranslate: jest.fn(),
      uploadImage: jest.fn(),
      isReady: jest.fn(),
    } as any;

    mockScreenshotWindow = {
      show: jest.fn(),
      hide: jest.fn(),
      close: jest.fn(),
      isVisible: jest.fn(),
      getWindow: jest.fn(),
      startCapture: jest.fn(),
    } as any;

    mockResultWindow = {
      show: jest.fn(),
      hide: jest.fn(),
      close: jest.fn(),
      isVisible: jest.fn(),
      getWindow: jest.fn(),
      displayResult: jest.fn(),
    } as any;

    windowManager = new WindowManager(
      mockTranslatorWindow,
      mockScreenshotWindow,
      mockResultWindow
    );
  });

  describe('Constructor', () => {
    it('should create instance with window dependencies', () => {
      expect(windowManager).toBeInstanceOf(WindowManager);
    });
  });

  describe('getTranslatorWindow()', () => {
    it('should return translator window instance', () => {
      const window = windowManager.getTranslatorWindow();

      expect(window).toBe(mockTranslatorWindow);
    });
  });

  describe('getScreenshotWindow()', () => {
    it('should return screenshot window instance', () => {
      const window = windowManager.getScreenshotWindow();

      expect(window).toBe(mockScreenshotWindow);
    });
  });

  describe('getResultWindow()', () => {
    it('should return result window instance', () => {
      const window = windowManager.getResultWindow();

      expect(window).toBe(mockResultWindow);
    });
  });

  describe('closeAll()', () => {
    it('should close all windows', () => {
      windowManager.closeAll();

      expect(mockTranslatorWindow.close).toHaveBeenCalled();
      expect(mockScreenshotWindow.close).toHaveBeenCalled();
      expect(mockResultWindow.close).toHaveBeenCalled();
    });
  });

  describe('hideAll()', () => {
    it('should hide all windows', () => {
      windowManager.hideAll();

      expect(mockTranslatorWindow.hide).toHaveBeenCalled();
      expect(mockScreenshotWindow.hide).toHaveBeenCalled();
      expect(mockResultWindow.hide).toHaveBeenCalled();
    });
  });
});

