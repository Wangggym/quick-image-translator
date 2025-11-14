/**
 * Screenshot renderer process
 * Handles user interaction for region selection
 */

interface SelectionBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

class ScreenshotRenderer {
  private canvas: HTMLCanvasElement;
  private selection: HTMLDivElement;
  private dimensions: HTMLDivElement;
  private hint: HTMLDivElement;

  private isDrawing = false;
  private startX = 0;
  private startY = 0;

  constructor() {
    // Get DOM elements
    this.canvas = document.getElementById('canvas') as HTMLCanvasElement;
    this.selection = document.getElementById('selection') as HTMLDivElement;
    this.dimensions = document.getElementById('dimensions') as HTMLDivElement;
    this.hint = document.getElementById('hint') as HTMLDivElement;

    // Initialize
    this.init();
  }

  /**
   * Initialize the screenshot UI
   */
  private init(): void {
    // Set canvas size
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    // Setup event listeners
    this.setupEventListeners();
  }

  /**
   * Setup event listeners
   */
  private setupEventListeners(): void {
    // Mouse events
    document.addEventListener('mousedown', this.handleMouseDown.bind(this));
    document.addEventListener('mousemove', this.handleMouseMove.bind(this));
    document.addEventListener('mouseup', this.handleMouseUp.bind(this));

    // Keyboard events
    document.addEventListener('keydown', this.handleKeyDown.bind(this));

    // Prevent context menu
    document.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  /**
   * Handle mouse down event
   */
  private handleMouseDown(e: MouseEvent): void {
    this.isDrawing = true;
    this.startX = e.clientX;
    this.startY = e.clientY;

    // Show selection box
    this.selection.style.display = 'block';
    this.selection.style.left = this.startX + 'px';
    this.selection.style.top = this.startY + 'px';
    this.selection.style.width = '0px';
    this.selection.style.height = '0px';

    // Hide hint
    this.hint.style.display = 'none';
  }

  /**
   * Handle mouse move event
   */
  private handleMouseMove(e: MouseEvent): void {
    if (!this.isDrawing) return;

    const currentX = e.clientX;
    const currentY = e.clientY;

    const width = currentX - this.startX;
    const height = currentY - this.startY;

    // Update selection box position and size
    if (width > 0) {
      this.selection.style.left = this.startX + 'px';
      this.selection.style.width = width + 'px';
    } else {
      this.selection.style.left = currentX + 'px';
      this.selection.style.width = Math.abs(width) + 'px';
    }

    if (height > 0) {
      this.selection.style.top = this.startY + 'px';
      this.selection.style.height = height + 'px';
    } else {
      this.selection.style.top = currentY + 'px';
      this.selection.style.height = Math.abs(height) + 'px';
    }

    // Update dimensions display
    this.dimensions.style.display = 'block';
    this.dimensions.style.left = currentX + 10 + 'px';
    this.dimensions.style.top = currentY + 10 + 'px';
    this.dimensions.textContent = `${Math.abs(width)} × ${Math.abs(height)}`;
  }

  /**
   * Handle mouse up event
   */
  private async handleMouseUp(e: MouseEvent): Promise<void> {
    if (!this.isDrawing) return;
    this.isDrawing = false;

    const endX = e.clientX;
    const endY = e.clientY;

    const x = Math.min(this.startX, endX);
    const y = Math.min(this.startY, endY);
    const width = Math.abs(endX - this.startX);
    const height = Math.abs(endY - this.startY);

    // Only proceed if selection is large enough (minimum 10x10 pixels)
    if (width > 10 && height > 10) {
      const bounds: SelectionBounds = { x, y, width, height };
      await window.electronAPI.screenshotSelected(bounds);
    } else {
      // Selection too small, cancel
      await this.cancel();
    }
  }

  /**
   * Handle keyboard events
   */
  private async handleKeyDown(e: KeyboardEvent): Promise<void> {
    if (e.key === 'Escape') {
      await this.cancel();
    }
  }

  /**
   * Cancel screenshot
   */
  private async cancel(): Promise<void> {
    await window.electronAPI.screenshotCancelled();
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new ScreenshotRenderer();
  });
} else {
  new ScreenshotRenderer();
}

