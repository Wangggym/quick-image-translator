import 'reflect-metadata';
import { app } from 'electron';
import { createContainer } from './container';
import { Application } from './Application';
import { TYPES } from './types/types';

/**
 * Main entry point for the Electron application
 */

// Create IoC container
const container = createContainer();

// Error handling
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason);
});

/**
 * Initialize the application
 */
async function main() {
  try {
    // Wait for Electron to be ready
    await app.whenReady();

    // Get application instance from container
    const application = container.get<Application>(TYPES.Application);

    // Initialize application
    await application.initialize();

    console.warn('Quick Image Translator is running...');
    console.warn('Press Cmd+Shift+T or click the tray icon to translate');
  } catch (error) {
    console.error('Failed to initialize application:', error);
    app.quit();
  }
}

// Start the application
main();

