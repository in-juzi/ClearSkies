import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManualService, ManualSkill, SkillsResponse } from '../../../services/manual.service';

@Component({
  selector: 'app-skills-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="section-content">
      <h2>Skills</h2>
      <p class="lead">
        ClearSkies features 5 core skills that you can train through various activities.
        Each skill is linked to a primary attribute and contributes to your character's overall progression.
      </p>

      @if (loading()) {
        <div class="loading">Loading skills data...</div>
      } @else if (error()) {
        <div class="error">{{ error() }}</div>
      } @else if (skillsData()) {
        <section>
          <h3>XP System</h3>
          <div class="info-box">
            <p><strong>XP per Level:</strong> {{ skillsData()!.xpSystem.xpPerLevel }} XP</p>
            <p><strong>Attribute Linking:</strong> {{ skillsData()!.xpSystem.attributeLinking }}</p>
            <p><strong>Level Formula:</strong> {{ skillsData()!.xpSystem.levelFormula }}</p>
          </div>
        </section>

        <section>
          <h3>Available Skills</h3>
          <div class="skills-grid">
            @for (skill of skills(); track skill.skillId) {
              <div class="skill-card">
                <div class="skill-header">
                  <img
                    [src]="'assets/' + skill.icon"
                    [alt]="skill.name"
                    class="skill-icon"
                  />
                  <h4>{{ skill.name }}</h4>
                </div>
                <p class="skill-description">{{ skill.description }}</p>
                <div class="skill-meta">
                  <span class="attribute-link">
                    Linked to: <strong>{{ skill.mainAttribute }}</strong>
                  </span>
                </div>
              </div>
            }
          </div>
        </section>

        <section>
          <h3>How Skills Work</h3>
          <ul>
            <li><strong>Training:</strong> Perform activities (woodcutting, mining, fishing, etc.) to earn skill XP</li>
            <li><strong>Leveling:</strong> Earn 1000 XP to gain one skill level</li>
            <li><strong>Attribute XP:</strong> 50% of skill XP is automatically awarded to the linked attribute</li>
            <li><strong>XP Scaling:</strong> Activities scale XP based on your level vs the activity's requirement</li>
            <li><strong>Grace Range:</strong> Activities within 1 level of your current level award full XP</li>
            <li><strong>Diminishing Returns:</strong> Higher-level players earn less XP from low-level content</li>
          </ul>
        </section>
      }
    </div>
  `,
  styles: [`
    .section-content {
      max-width: 800px;

      h2 {
        font-size: var(--font-size-3xl);
        color: var(--color-text-primary);
        margin-bottom: var(--spacing-l);
      }

      h3 {
        font-size: var(--font-size-2xl);
        color: var(--color-text-primary);
        margin-top: var(--spacing-2xl);
        margin-bottom: var(--spacing-m);
      }

      h4 {
        font-size: var(--font-size-xl);
        color: var(--color-text-primary);
        margin: 0;
      }

      .lead {
        font-size: var(--font-size-xl);
        color: var(--color-text-secondary);
        margin-bottom: var(--spacing-2xl);
        line-height: 1.6;
      }

      p {
        color: var(--color-text-secondary);
        line-height: 1.6;
        margin-bottom: var(--spacing-l);
      }

      ul {
        color: var(--color-text-secondary);
        line-height: 1.8;
        margin-bottom: var(--spacing-l);
        padding-left: var(--spacing-xl);

        li {
          margin-bottom: var(--spacing-s);

          strong {
            color: var(--color-text-primary);
          }
        }
      }

      section {
        margin-bottom: var(--spacing-3xl);
      }

      .loading, .error {
        padding: var(--spacing-xl);
        text-align: center;
        color: var(--color-text-secondary);
      }

      .error {
        color: var(--color-error);
      }

      .info-box {
        background: var(--color-bg-secondary);
        padding: var(--spacing-l);
        border-radius: var(--radius-m);
        border: var(--border-width-thin) solid var(--color-surface-border);

        p {
          margin-bottom: var(--spacing-s);

          &:last-child {
            margin-bottom: 0;
          }

          strong {
            color: var(--color-text-primary);
          }
        }
      }

      .skills-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: var(--spacing-l);
      }

      .skill-card {
        background: var(--color-bg-secondary);
        padding: var(--spacing-l);
        border-radius: var(--radius-m);
        border: var(--border-width-thin) solid var(--color-surface-border);
        transition: border-color var(--transition-normal);

        &:hover {
          border-color: var(--color-accent-purple);
        }
      }

      .skill-header {
        display: flex;
        align-items: center;
        gap: var(--spacing-m);
        margin-bottom: var(--spacing-m);

        .skill-icon {
          width: 40px;
          height: 40px;
        }
      }

      .skill-description {
        font-size: var(--font-size-m);
        margin-bottom: var(--spacing-m);
      }

      .skill-meta {
        padding-top: var(--spacing-m);
        border-top: var(--border-width-thin) solid var(--color-surface-border);
        font-size: var(--font-size-m);

        .attribute-link {
          color: var(--color-text-secondary);

          strong {
            color: var(--color-accent-purple);
            text-transform: capitalize;
          }
        }
      }
    }
  `]
})
export class SkillsSectionComponent implements OnInit {
  private manualService = inject(ManualService);

  loading = signal(true);
  error = signal<string | null>(null);
  skillsData = signal<SkillsResponse | null>(null);
  skills = signal<ManualSkill[]>([]);

  ngOnInit(): void {
    this.loadSkills();
  }

  private loadSkills(): void {
    this.manualService.getSkills().subscribe({
      next: (response) => {
        this.skillsData.set(response);
        this.skills.set(response.skills);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load skills:', err);
        this.error.set('Failed to load skills data. Please try again later.');
        this.loading.set(false);
      }
    });
  }
}
