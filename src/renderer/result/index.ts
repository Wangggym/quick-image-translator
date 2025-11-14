/**
 * Result renderer process
 * Displays translation results
 */

interface TranslationResult {
  originalText: string;
  translatedText: string;
  sourceLang: string;
  targetLang: string;
  timestamp: Date;
}

class ResultRenderer {
  private originalTextEl: HTMLElement;
  private translatedTextEl: HTMLElement;
  private copyBtn: HTMLButtonElement;
  private closeBtn: HTMLButtonElement;

  private currentResult: TranslationResult | null = null;

  constructor() {
    // Get DOM elements
    this.originalTextEl = document.getElementById('original-text') as HTMLElement;
    this.translatedTextEl = document.getElementById('translated-text') as HTMLElement;
    this.copyBtn = document.getElementById('copy-btn') as HTMLButtonElement;
    this.closeBtn = document.getElementById('close-btn') as HTMLButtonElement;

    // Initialize
    this.init();
  }

  /**
   * Initialize the result UI
   */
  private init(): void {
    // Setup event listeners
    this.setupEventListeners();

    // Listen for translation results
    window.electronAPI.onTranslationResult(this.handleResult.bind(this));
  }

  /**
   * Setup event listeners
   */
  private setupEventListeners(): void {
    this.copyBtn.addEventListener('click', this.handleCopy.bind(this));
    this.closeBtn.addEventListener('click', this.handleClose.bind(this));
  }

  /**
   * Handle translation result
   */
  private handleResult(result: TranslationResult): void {
    this.currentResult = result;
    this.displayResult(result);
  }

  /**
   * Display translation result
   */
  private displayResult(result: TranslationResult): void {
    this.originalTextEl.textContent = result.originalText || 'No text detected';
    this.translatedTextEl.textContent = result.translatedText || 'No translation available';
  }

  /**
   * Handle copy button click
   */
  private async handleCopy(): Promise<void> {
    if (!this.currentResult) return;

    try {
      await navigator.clipboard.writeText(this.currentResult.translatedText);
      this.copyBtn.textContent = 'Copied!';
      setTimeout(() => {
        this.copyBtn.textContent = 'Copy Translation';
      }, 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  }

  /**
   * Handle close button click
   */
  private handleClose(): void {
    window.close();
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new ResultRenderer();
  });
} else {
  new ResultRenderer();
}

