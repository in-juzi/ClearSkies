import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManualService, ManualAttribute, AttributesResponse } from '../../../services/manual.service';

@Component({
  selector: 'app-attributes-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="section-content">
      <h2>Attributes</h2>
      <p class="lead">
        Attributes are the core statistics that define your character's capabilities.
        They level up automatically as you train linked skills, creating a natural progression system.
      </p>

      @if (loading()) {
        <div class="loading">Loading attributes data...</div>
      } @else if (error()) {
        <div class="error">{{ error() }}</div>
      } @else if (attributesData()) {
        <section>
          <h3>XP System</h3>
          <div class="info-box">
            <p><strong>XP per Level:</strong> {{ attributesData()!.xpSystem.xpPerLevel }} XP</p>
            <p><strong>Skill Linking:</strong> {{ attributesData()!.xpSystem.skillLinking }}</p>
            <p><strong>Level Formula:</strong> {{ attributesData()!.xpSystem.levelFormula }}</p>
          </div>
        </section>

        <section>
          <h3>Character Attributes</h3>
          <div class="attributes-grid">
            @for (attribute of attributes(); track attribute.attributeId) {
              <div class="attribute-card">
                <div class="attribute-header">
                  <img
                    [src]="'assets/' + attribute.icon"
                    [alt]="attribute.name"
                    class="attribute-icon"
                  />
                  <h4>{{ attribute.name }}</h4>
                </div>
                <p class="attribute-description">{{ attribute.description }}</p>
                <div class="attribute-meta">
                  @if (attribute.linkedSkills.length > 0) {
                    <span class="linked-skills">
                      Linked Skills: <strong>{{ attribute.linkedSkills.join(', ') }}</strong>
                    </span>
                  } @else {
                    <span class="linked-skills no-links">
                      No direct skill links (future expansion)
                    </span>
                  }
                </div>
              </div>
            }
          </div>
        </section>

        <section>
          <h3>How Attributes Work</h3>
          <ul>
            <li><strong>Automatic Progression:</strong> Attributes gain XP passively as you train linked skills</li>
            <li><strong>50% Passthrough:</strong> When a skill earns XP, its linked attribute receives 50% of that XP</li>
            <li><strong>Independent Leveling:</strong> Attributes level separately from skills (1000 XP per level)</li>
            <li><strong>Multiple Sources:</strong> Some attributes receive XP from multiple skills</li>
            <li><strong>Future Growth:</strong> More skills and attribute links will be added over time</li>
          </ul>
        </section>

        <section>
          <h3>Attribute Effects</h3>
          <p>
            As your attributes increase, they enhance various aspects of your character:
          </p>
          <ul>
            <li><strong>Combat:</strong> Strength increases melee damage, dexterity affects dodge and precision</li>
            <li><strong>Resources:</strong> Endurance affects stamina and carry capacity</li>
            <li><strong>Magic:</strong> Magic increases spell power, will boosts mana and mental resistance</li>
            <li><strong>Discovery:</strong> Perception improves find rates and awareness of hidden content</li>
            <li><strong>Social:</strong> Charisma influences vendor prices and NPC interactions</li>
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

      .attributes-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: var(--spacing-l);
      }

      .attribute-card {
        background: var(--color-bg-secondary);
        padding: var(--spacing-l);
        border-radius: var(--radius-m);
        border: var(--border-width-thin) solid var(--color-surface-border);
        transition: border-color var(--transition-normal);

        &:hover {
          border-color: var(--color-accent-gold);
        }
      }

      .attribute-header {
        display: flex;
        align-items: center;
        gap: var(--spacing-m);
        margin-bottom: var(--spacing-m);

        .attribute-icon {
          width: 40px;
          height: 40px;
        }
      }

      .attribute-description {
        font-size: var(--font-size-m);
        margin-bottom: var(--spacing-m);
      }

      .attribute-meta {
        padding-top: var(--spacing-m);
        border-top: var(--border-width-thin) solid var(--color-surface-border);
        font-size: var(--font-size-m);

        .linked-skills {
          color: var(--color-text-secondary);

          strong {
            color: var(--color-accent-purple);
            text-transform: capitalize;
          }

          &.no-links {
            font-style: italic;
            opacity: 0.7;
          }
        }
      }
    }
  `]
})
export class AttributesSectionComponent implements OnInit {
  private manualService = inject(ManualService);

  loading = signal(true);
  error = signal<string | null>(null);
  attributesData = signal<AttributesResponse | null>(null);
  attributes = signal<ManualAttribute[]>([]);

  ngOnInit(): void {
    this.loadAttributes();
  }

  private loadAttributes(): void {
    this.manualService.getAttributes().subscribe({
      next: (response) => {
        this.attributesData.set(response);
        this.attributes.set(response.attributes);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load attributes:', err);
        this.error.set('Failed to load attributes data. Please try again later.');
        this.loading.set(false);
      }
    });
  }
}
