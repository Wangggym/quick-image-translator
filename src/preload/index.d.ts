/**
 * Preload script to safely expose IPC to renderer processes
 * This maintains security by using contextIsolation
 */
export interface ElectronAPI {
    screenshotSelected: (bounds: {
        x: number;
        y: number;
        width: number;
        height: number;
    }) => Promise<{
        success: boolean;
        error?: string;
    }>;
    screenshotCancelled: () => Promise<{
        success: boolean;
    }>;
    onTranslationResult: (callback: (result: any) => void) => void;
    platform: string;
}
declare global {
    interface Window {
        electronAPI: ElectronAPI;
    }
}
//# sourceMappingURL=index.d.ts.map