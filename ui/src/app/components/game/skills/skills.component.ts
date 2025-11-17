import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkillsService } from '../../../services/skills.service';
import { SkillName, SkillWithProgress } from '../../../models/user.model';
import { ALL_SKILLS, SKILL_DISPLAY_NAMES, SKILL_ICONS } from '../../../constants/game-data.constants';

@Component({
  selector: 'app-skills',
  imports: [CommonModule],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.scss',
})
export class SkillsComponent implements OnInit {
  private skillsService = inject(SkillsService);

  skills = this.skillsService.skills;
  loading = signal(true);
  error = signal<string | null>(null);

  // Use centralized constants
  skillIcons = SKILL_ICONS;
  skillNames = SKILL_DISPLAY_NAMES;

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
    return [...ALL_SKILLS];
  }

  getExperienceToNext(skill: SkillWithProgress): number {
    return this.skillsService.getExperienceToNext(skill);
  }

  getProgressPercent(skill: SkillWithProgress): number {
    return this.skillsService.getSkillProgressPercent(skill);
  }

  getTotalXP(skill: SkillWithProgress): number {
    return this.skillsService.getTotalXP(skill);
  }
}
