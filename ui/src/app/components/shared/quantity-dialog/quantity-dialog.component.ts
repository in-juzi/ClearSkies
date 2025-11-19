import { Component, computed, signal, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QuantityDialogService } from '../../../services/quantity-dialog.service';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-quantity-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  templateUrl: './quantity-dialog.component.html',
  styleUrls: ['./quantity-dialog.component.scss']
})
export class QuantityDialogComponent {
  private quantityDialogService = inject(QuantityDialogService);

  dialogState = this.quantityDialogService.dialogState;
  selectedQuantity = signal<number>(1);

  isOpen = computed(() => this.dialogState().isOpen);
  itemName = computed(() => this.dialogState().itemName);
  itemIcon = computed(() => this.dialogState().itemIcon);
  maxQuantity = computed(() => this.dialogState().maxQuantity);
  actionLabel = computed(() => this.dialogState().actionLabel ?? 'Confirm');

  constructor() {
    // Update selected quantity when dialog opens
    effect(() => {
      const state = this.dialogState();
      if (state.isOpen) {
        this.selectedQuantity.set(state.defaultQuantity ?? state.maxQuantity);
      }
    });
  }

  onQuantityInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = parseInt(input.value, 10);

    // Clamp value between 1 and maxQuantity
    if (isNaN(value) || value < 1) {
      value = 1;
    } else if (value > this.maxQuantity()) {
      value = this.maxQuantity();
    }

    this.selectedQuantity.set(value);
    input.value = value.toString();
  }

  onSliderInput(event: Event): void {
    const slider = event.target as HTMLInputElement;
    const value = parseInt(slider.value, 10);
    this.selectedQuantity.set(value);
  }

  setMaxQuantity(): void {
    this.selectedQuantity.set(this.maxQuantity());
  }

  confirm(): void {
    this.quantityDialogService.confirm(this.selectedQuantity());
  }

  cancel(): void {
    this.quantityDialogService.cancel();
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.confirm();
    } else if (event.key === 'Escape') {
      event.preventDefault();
      this.cancel();
    }
  }

  onOverlayClick(event: MouseEvent): void {
    // Close dialog if clicking outside the modal content
    if (event.target === event.currentTarget) {
      this.cancel();
    }
  }
}
