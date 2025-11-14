import { contextBridge, ipcRenderer } from 'electron';
import { IPC_CHANNELS } from '../main/types/interfaces';

/**
 * Preload script to safely expose IPC to renderer processes
 * This maintains security by using contextIsolation
 */

// Type definitions for the exposed API
export interface ElectronAPI {
  // Screenshot API
  screenshotSelected: (bounds: { x: number; y: number; width: number; height: number }) => Promise<{ success: boolean; error?: string }>;
  screenshotCancelled: () => Promise<{ success: boolean }>;

  // Translation API
  onTranslationResult: (callback: (result: any) => void) => void;

  // Platform info
  platform: string;
}

// Expose safe API to renderer process
const electronAPI: ElectronAPI = {
  // Screenshot functions
  screenshotSelected: (bounds) =>
    ipcRenderer.invoke(IPC_CHANNELS.SCREENSHOT_SELECTED, bounds),

  screenshotCancelled: () =>
    ipcRenderer.invoke(IPC_CHANNELS.SCREENSHOT_CANCELLED),

  // Translation functions
  onTranslationResult: (callback) =>
    ipcRenderer.on(IPC_CHANNELS.TRANSLATION_RESULT, (_event, result) => callback(result)),

  // Platform info
  platform: process.platform,
};

// Expose API to window object
contextBridge.exposeInMainWorld('electronAPI', electronAPI);

// Add type declaration for TypeScript
declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

