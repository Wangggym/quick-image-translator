import 'reflect-metadata';
import { BaseWindow } from '../BaseWindow';
import { BrowserWindow } from 'electron';

// Create a concrete class for testing abstract BaseWindow
class TestWindow extends BaseWindow {
  protected create(): BrowserWindow {
    return this.createWindow({
      width: 800,
      height: 600,
      show: false,
    });
  }
}

describe('BaseWindow', () => {
  let testWindow: TestWindow;

  beforeEach(() => {
    jest.clearAllMocks();
    testWindow = new TestWindow();
  });

  describe('show()', () => {
    it('should create window if not exists', () => {
      testWindow.show();

      expect(testWindow.getWindow()).not.toBeNull();
    });

    it('should show and focus window', () => {
      testWindow.show();

      const window = testWindow.getWindow();
      expect(window?.show).toHaveBeenCalled();
      expect(window?.focus).toHaveBeenCalled();
    });

    it('should not recreate window if already exists', () => {
      testWindow.show();
      const firstWindow = testWindow.getWindow();

      testWindow.show();
      const secondWindow = testWindow.getWindow();

      expect(firstWindow).toBe(secondWindow);
    });
  });

  describe('hide()', () => {
    it('should hide window if exists', () => {
      testWindow.show();
      testWindow.hide();

      const window = testWindow.getWindow();
      expect(window?.hide).toHaveBeenCalled();
    });

    it('should not throw if window does not exist', () => {
      expect(() => testWindow.hide()).not.toThrow();
    });
  });

  describe('close()', () => {
    it('should close window if exists', () => {
      testWindow.show();
      testWindow.close();

      const window = testWindow.getWindow();
      expect(window?.close).toHaveBeenCalled();
    });

    it('should not throw if window does not exist', () => {
      expect(() => testWindow.close()).not.toThrow();
    });
  });

  describe('isVisible()', () => {
    it('should return false if window does not exist', () => {
      expect(testWindow.isVisible()).toBe(false);
    });

    it('should return window visibility status', () => {
      testWindow.show();
      const window = testWindow.getWindow();

      (window?.isVisible as jest.Mock).mockReturnValue(true);

      expect(testWindow.isVisible()).toBe(true);
    });
  });

  describe('getWindow()', () => {
    it('should return null initially', () => {
      expect(testWindow.getWindow()).toBeNull();
    });

    it('should return window instance after creation', () => {
      testWindow.show();

      expect(testWindow.getWindow()).not.toBeNull();
      expect(testWindow.getWindow()).toBeInstanceOf(BrowserWindow);
    });
  });

  describe('Window lifecycle', () => {
    it('should handle window close event', () => {
      testWindow.show();
      const window = testWindow.getWindow();

      // Simulate window close event
      const closeHandler = (window?.on as jest.Mock).mock.calls.find(
        (call) => call[0] === 'closed'
      )?.[1];

      if (closeHandler) {
        closeHandler();
      }

      // Window should be set to null after close
      expect(testWindow.getWindow()).toBeNull();
    });
  });
});

