import { Injectable, signal } from '@angular/core';

export interface QuantityDialogConfig {
  itemName: string;
  itemIcon?: {
    path: string;
    material?: string;
  };
  maxQuantity: number;
  defaultQuantity?: number;
  actionLabel?: string; // "Withdraw", "Deposit", etc.
}

interface QuantityDialogState extends QuantityDialogConfig {
  isOpen: boolean;
  resolve?: (quantity: number | null) => void;
}

@Injectable({
  providedIn: 'root'
})
export class QuantityDialogService {
  dialogState = signal<QuantityDialogState>({
    isOpen: false,
    itemName: '',
    maxQuantity: 1
  });

  /**
   * Opens the quantity dialog and returns a promise that resolves with the selected quantity
   * or null if cancelled
   */
  open(config: QuantityDialogConfig): Promise<number | null> {
    return new Promise((resolve) => {
      this.dialogState.set({
        ...config,
        defaultQuantity: config.defaultQuantity ?? config.maxQuantity,
        actionLabel: config.actionLabel ?? 'Confirm',
        isOpen: true,
        resolve
      });
    });
  }

  /**
   * Confirms the dialog with the selected quantity
   */
  confirm(quantity: number): void {
    const state = this.dialogState();
    if (state.resolve) {
      state.resolve(quantity);
    }
    this.close();
  }

  /**
   * Cancels the dialog
   */
  cancel(): void {
    const state = this.dialogState();
    if (state.resolve) {
      state.resolve(null);
    }
    this.close();
  }

  /**
   * Closes the dialog
   */
  private close(): void {
    this.dialogState.update(state => ({
      ...state,
      isOpen: false,
      resolve: undefined
    }));
  }
}
