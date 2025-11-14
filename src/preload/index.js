"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const interfaces_1 = require("../main/types/interfaces");
// Expose safe API to renderer process
const electronAPI = {
    // Screenshot functions
    screenshotSelected: (bounds) => electron_1.ipcRenderer.invoke(interfaces_1.IPC_CHANNELS.SCREENSHOT_SELECTED, bounds),
    screenshotCancelled: () => electron_1.ipcRenderer.invoke(interfaces_1.IPC_CHANNELS.SCREENSHOT_CANCELLED),
    // Translation functions
    onTranslationResult: (callback) => electron_1.ipcRenderer.on(interfaces_1.IPC_CHANNELS.TRANSLATION_RESULT, (_event, result) => callback(result)),
    // Platform info
    platform: process.platform,
};
// Expose API to window object
electron_1.contextBridge.exposeInMainWorld('electronAPI', electronAPI);
//# sourceMappingURL=index.js.map