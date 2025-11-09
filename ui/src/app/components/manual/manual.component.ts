import { Component, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ManualDialogService } from '../../services/manual-dialog.service';
import { OverviewSectionComponent } from './sections/overview-section.component';
import { SkillsSectionComponent } from './sections/skills-section.component';
import { AttributesSectionComponent } from './sections/attributes-section.component';
import { ItemsSectionComponent } from './sections/items-section.component';
import { LocationsSectionComponent } from './sections/locations-section.component';
import { MechanicsSectionComponent } from './sections/mechanics-section.component';

type Section = 'overview' | 'skills' | 'attributes' | 'items' | 'locations' | 'mechanics';

@Component({
  selector: 'app-manual',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    OverviewSectionComponent,
    SkillsSectionComponent,
    AttributesSectionComponent,
    ItemsSectionComponent,
    LocationsSectionComponent,
    MechanicsSectionComponent
  ],
  templateUrl: './manual.component.html',
  styleUrl: './manual.component.scss'
})
export class ManualComponent {
  private manualDialogService = inject(ManualDialogService);

  // Input to determine if component is in dialog mode or standalone page mode
  dialogMode = input(false);

  activeSection = signal<Section>('overview');

  sections: { id: Section; label: string; icon: string }[] = [
    { id: 'overview', label: 'Overview', icon: 'ui/ui_quest_complete' },
    { id: 'skills', label: 'Skills', icon: 'skills/skill_woodcutting' },
    { id: 'attributes', label: 'Attributes', icon: 'attributes/attr_strength' },
    { id: 'items', label: 'Items', icon: 'item-categories/item_cat_axe' },
    { id: 'locations', label: 'Locations', icon: 'ui/ui_world_map' },
    { id: 'mechanics', label: 'Mechanics', icon: 'ui/ui_build' }
  ];

  selectSection(section: Section): void {
    this.activeSection.set(section);
  }

  close(): void {
    if (this.dialogMode()) {
      this.manualDialogService.close();
    }
  }
}
