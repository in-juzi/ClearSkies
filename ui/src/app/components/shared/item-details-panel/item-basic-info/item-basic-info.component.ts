import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-item-basic-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './item-basic-info.component.html',
  styleUrl: './item-basic-info.component.scss'
})
export class ItemBasicInfoComponent {
  @Input() description: string = '';
  @Input() weight: number = 0;
  @Input() vendorPrice: number = 0;
}
