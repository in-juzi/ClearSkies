import { Injectable, signal } from '@angular/core';

export interface ConfirmDialogOptions {
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
}

interface DialogState {
  isOpen: boolean;
  options: ConfirmDialogOptions;
  resolver?: (value: boolean) => void;
}

@Injectable({
  providedIn: 'root'
})
export class ConfirmDialogService {
  private dialogState = signal<DialogState>({
    isOpen: false,
    options: { message: '' }
  });

  // Public read-only signal
  state = this.dialogState.asReadonly();

  /**
   * Show a confirmation dialog and wait for user response
   * @param options Dialog configuration
   * @returns Promise that resolves to true if confirmed, false if cancelled
   */
  confirm(options: ConfirmDialogOptions): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      this.dialogState.set({
        isOpen: true,
        options: {
          title: options.title || 'Confirm Action',
          message: options.message,
          confirmLabel: options.confirmLabel || 'Confirm',
          cancelLabel: options.cancelLabel || 'Cancel'
        },
        resolver: resolve
      });
    });
  }

  /**
   * User confirmed the action
   */
  confirmAction(): void {
    const state = this.dialogState();
    if (state.resolver) {
      state.resolver(true);
    }
    this.closeDialog();
  }

  /**
   * User cancelled the action
   */
  cancelAction(): void {
    const state = this.dialogState();
    if (state.resolver) {
      state.resolver(false);
    }
    this.closeDialog();
  }

  /**
   * Close the dialog without resolving (treats as cancel)
   */
  private closeDialog(): void {
    this.dialogState.set({
      isOpen: false,
      options: { message: '' }
    });
  }
}
