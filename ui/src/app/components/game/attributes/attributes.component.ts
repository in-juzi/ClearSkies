import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttributesService } from '../../../services/attributes.service';
import { AttributesResponse, AttributeName, AttributeWithProgress } from '../../../models/user.model';
import { ALL_ATTRIBUTES, ATTRIBUTE_ICONS } from '../../../constants/game-data.constants';

@Component({
  selector: 'app-attributes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './attributes.component.html',
  styleUrls: ['./attributes.component.scss']
})
export class AttributesComponent implements OnInit {
  attributes = signal<AttributesResponse | null>(null);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  // Use centralized constants
  attributeList: AttributeName[] = [...ALL_ATTRIBUTES];

  constructor(private attributesService: AttributesService) {}

  ngOnInit(): void {
    this.loadAttributes();
  }

  loadAttributes(): void {
    this.loading.set(true);
    this.attributesService.getAllAttributes().subscribe({
      next: (data) => {
        this.attributes.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading attributes:', err);
        this.error.set('Failed to load attributes');
        this.loading.set(false);
      }
    });
  }

  getAttributeIcon(attributeName: AttributeName): string {
    // Use centralized icon mapping
    return ATTRIBUTE_ICONS[attributeName];
  }

  capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  getProgressPercent(attribute: AttributeWithProgress): number {
    return this.attributesService.getAttributeProgressPercent(attribute);
  }

  getTotalXP(attribute: AttributeWithProgress): number {
    return this.attributesService.getTotalXP(attribute);
  }
}
