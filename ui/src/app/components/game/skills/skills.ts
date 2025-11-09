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

  // Skill icons mapping (path to SVG files in assets)
  skillIcons: Record<SkillName, string> = {
    woodcutting: 'assets/icons/skills/skill_woodcutting.svg',
    mining: 'assets/icons/ui/ui_dig_1.svg',
    fishing: 'assets/icons/ui/ui_fishing_new.svg',
    smithing: 'assets/icons/skills/skill_blacksmithing.svg',
    cooking: 'assets/icons/skills/skill_cooking.svg',
    herbalism: 'assets/icons/skills/skill_herbalism.svg',
    oneHanded: 'assets/icons/abilities/ability_quick_slash.svg',
    dualWield: 'assets/icons/abilities/ability_slash_2.svg',
    twoHanded: 'assets/icons/abilities/ability_hammer_smash.svg',
    ranged: 'assets/icons/abilities/ability_piercing_arrow.svg',
    casting: 'assets/icons/abilities/ability_lightning_strike.svg',
    gun: 'assets/icons/abilities/ability_plasma_shot.svg'
  };

  // Skill display names
  skillNames: Record<SkillName, string> = {
    woodcutting: 'Woodcutting',
    mining: 'Mining',
    fishing: 'Fishing',
    smithing: 'Smithing',
    cooking: 'Cooking',
    herbalism: 'Herbalism',
    oneHanded: 'One-Handed',
    dualWield: 'Dual Wield',
    twoHanded: 'Two-Handed',
    ranged: 'Ranged',
    casting: 'Casting',
    gun: 'Gun'
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
    return ['woodcutting', 'mining', 'fishing', 'smithing', 'cooking', 'herbalism', 'oneHanded', 'dualWield', 'twoHanded', 'ranged', 'casting', 'gun'];
  }

  getExperienceToNext(experience: number): number {
    return this.skillsService.getExperienceToNext(experience);
  }

  // For testing purposes - can be removed later
  testAddExperience(skillName: SkillName): void {
    this.skillsService.addSkillExperience(skillName, 100).subscribe({
      next: (response) => {
        console.log('Experience added:', response);
        console.log('Message:', response.message);

        // Log skill level up
        if (response.data.skill.leveledUp) {
          console.log(`🎉 ${skillName} leveled up to ${response.data.skill.newLevel}!`);
        }

        // Log attribute level up
        if (response.data.attribute.leveledUp) {
          console.log(`⭐ ${response.data.attribute.name} leveled up to ${response.data.attribute.newLevel}!`);
        }
      },
      error: (error) => {
        console.error('Failed to add experience:', error);
      }
    });
  }
}
