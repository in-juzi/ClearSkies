import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkillsService } from '../../../services/skills.service';
import { SkillName, SkillWithProgress } from '../../../models/user.model';

@Component({
  selector: 'app-skills',
  imports: [CommonModule],
  templateUrl: './skills.html',
  styleUrl: './skills.scss',
})
export class Skills implements OnInit {
  private skillsService = inject(SkillsService);

  skills = this.skillsService.skills;
  loading = signal(true);
  error = signal<string | null>(null);

  // Skill icons mapping (path to PNG files in assets)
  skillIcons: Record<SkillName, string> = {
    woodcutting: 'assets/icons/skill_woodcutting.png',
    mining: 'assets/icons/ui_dig.png',
    fishing: 'assets/icons/skill_fishing.png',
    smithing: 'assets/icons/skill_smithing.png',
    cooking: 'assets/icons/skill_cooking.png'
  };

  // Skill display names
  skillNames: Record<SkillName, string> = {
    woodcutting: 'Woodcutting',
    mining: 'Mining',
    fishing: 'Fishing',
    smithing: 'Smithing',
    cooking: 'Cooking'
  };

  ngOnInit(): void {
    this.loadSkills();
  }

  loadSkills(): void {
    this.loading.set(true);
    this.error.set(null);

    this.skillsService.getSkills().subscribe({
      next: (response) => {
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Failed to load skills:', error);
        this.error.set('Failed to load skills. Please try again.');
        this.loading.set(false);
      }
    });
  }

  getSkillKeys(): SkillName[] {
    return ['woodcutting', 'mining', 'fishing', 'smithing', 'cooking'];
  }

  getExperienceToNext(experience: number): number {
    return this.skillsService.getExperienceToNext(experience);
  }

  // For testing purposes - can be removed later
  testAddExperience(skillName: SkillName): void {
    this.skillsService.addSkillExperience(skillName, 100).subscribe({
      next: (response) => {
        console.log('Experience added:', response);
        if (response.data.leveledUp) {
          console.log(`🎉 ${skillName} leveled up to ${response.data.newLevel}!`);
        }
      },
      error: (error) => {
        console.error('Failed to add experience:', error);
      }
    });
  }
}
