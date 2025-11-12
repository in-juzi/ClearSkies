import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

/**
 * Pipe to format chat messages with markdown-like syntax
 * - Converts \n to <br>
 * - Converts **text** to <strong>text</strong>
 * - Sanitizes HTML to prevent XSS attacks
 */
@Pipe({
  name: 'messageFormat',
  standalone: true
})
export class MessageFormatPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(message: string): SafeHtml {
    if (!message) {
      return '';
    }

    // Escape HTML to prevent XSS
    let formatted = this.escapeHtml(message);

    // Convert **text** to <strong>text</strong>
    formatted = formatted.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

    // Convert \n to <br>
    formatted = formatted.replace(/\\n/g, '<br>');

    // Sanitize and return as SafeHtml
    return this.sanitizer.sanitize(1, formatted) || '';
  }

  /**
   * Escape HTML special characters to prevent XSS
   */
  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}
