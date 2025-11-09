import { Component, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmDialogService } from '../../../services/confirm-dialog.service';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent {
  confirmDialogService = inject(ConfirmDialogService);

  onConfirm(): void {
    this.confirmDialogService.confirmAction();
  }

  onCancel(): void {
    this.confirmDialogService.cancelAction();
  }

  onBackdropClick(event: MouseEvent): void {
    // Only close if clicking the backdrop itself, not its children
    if (event.target === event.currentTarget) {
      this.onCancel();
    }
  }

  /**
   * Global keyboard listener for Enter and Escape keys
   * Only active when dialog is open
   */
  @HostListener('window:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    // Only handle keyboard events when dialog is open
    if (!this.confirmDialogService.state().isOpen) {
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      this.onCancel();
    } else if (event.key === 'Enter') {
      event.preventDefault();
      this.onConfirm();
    }
  }
}
