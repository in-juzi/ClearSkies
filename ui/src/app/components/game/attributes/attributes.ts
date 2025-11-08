import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttributesService } from '../../../services/attributes.service';
import { AttributesResponse, AttributeName } from '../../../models/user.model';

@Component({
  selector: 'app-attributes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './attributes.html',
  styleUrls: ['./attributes.scss']
})
export class AttributesComponent implements OnInit {
  attributes = signal<AttributesResponse | null>(null);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  attributeList: AttributeName[] = ['strength', 'endurance', 'magic', 'perception', 'dexterity', 'will', 'charisma'];

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

  getAttributeIcon(attributeName: string): string {
    // Return icon path for each attribute
    return `assets/icons/attr_${attributeName}.svg`;
  }

  capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // Testing method - adds 100 XP to an attribute
  testAddXP(attributeName: AttributeName): void {
    this.attributesService.addAttributeExperience(attributeName, 100).subscribe({
      next: (response) => {
        console.log('XP added:', response);
        this.loadAttributes();
      },
      error: (err) => {
        console.error('Error adding XP:', err);
      }
    });
  }
}
