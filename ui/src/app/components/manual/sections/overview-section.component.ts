import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-overview-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="section-content">
      <h2>Welcome to ClearSkies</h2>
      <p class="lead">
        A medieval fantasy browser-based game where you explore a rich world,
        master skills, craft legendary equipment, and forge your own destiny.
      </p>

      <section>
        <h3>Game Concept</h3>
        <p>
          ClearSkies is a progression-focused RPG that emphasizes skill development,
          crafting, and exploration. Train in various skills, discover new locations,
          collect resources, and create powerful equipment as you advance through the game.
        </p>
      </section>

      <section>
        <h3>Core Gameplay Loop</h3>
        <ul>
          <li><strong>Train Skills:</strong> Perform activities to gain experience in woodcutting, mining, fishing, smithing, and cooking</li>
          <li><strong>Develop Attributes:</strong> As skills improve, your core attributes (strength, endurance, etc.) grow stronger</li>
          <li><strong>Gather Resources:</strong> Collect materials from various locations with quality and trait variations</li>
          <li><strong>Craft Equipment:</strong> Forge weapons, armor, and tools to enhance your capabilities</li>
          <li><strong>Explore Locations:</strong> Discover new areas with unique resources and challenges</li>
          <li><strong>Progress:</strong> Level up skills and attributes to unlock higher-tier content</li>
        </ul>
      </section>

      <section>
        <h3>Getting Started</h3>
        <ol>
          <li><strong>Create an Account:</strong> Register to create your character</li>
          <li><strong>Start in Kennik:</strong> You begin in the town of Kennik with basic tools</li>
          <li><strong>Learn the Basics:</strong> Try activities at the dock, logging camp, or market</li>
          <li><strong>Gather Resources:</strong> Perform activities to collect items and gain XP</li>
          <li><strong>Equip Tools:</strong> Use the equipment panel to equip tools needed for activities</li>
          <li><strong>Level Up:</strong> Earn 1000 XP per skill level, with 50% flowing to linked attributes</li>
          <li><strong>Explore:</strong> Travel to new locations as you meet level requirements</li>
        </ol>
      </section>

      <section>
        <h3>Key Systems</h3>
        <div class="system-grid">
          <div class="system-card">
            <h4>Skills</h4>
            <p>Train in 5 unique skills, each linked to a core attribute. Activities award XP with diminishing returns for low-level content.</p>
          </div>
          <div class="system-card">
            <h4>Attributes</h4>
            <p>7 core attributes that define your character. Grow automatically as you train linked skills.</p>
          </div>
          <div class="system-card">
            <h4>Inventory</h4>
            <p>Items have qualities (1-5 levels) and traits (1-3 levels) that affect their value and properties.</p>
          </div>
          <div class="system-card">
            <h4>Equipment</h4>
            <p>10 equipment slots for weapons, armor, and tools. Some activities require specific equipment types.</p>
          </div>
          <div class="system-card">
            <h4>Locations</h4>
            <p>Travel between biomes (forest, mountain, sea) to access different facilities and activities.</p>
          </div>
          <div class="system-card">
            <h4>Activities</h4>
            <p>Time-based actions that award XP and loot. Requirements include skill levels and equipped tools.</p>
          </div>
        </div>
      </section>
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
        color: var(--color-accent-purple);
        margin-bottom: var(--spacing-s);
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

      ul, ol {
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

      .system-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: var(--spacing-l);
        margin-top: var(--spacing-xl);
      }

      .system-card {
        background: var(--color-bg-secondary);
        padding: var(--spacing-l);
        border-radius: var(--radius-m);
        border: var(--border-width-thin) solid var(--color-surface-border);

        p {
          margin: 0;
          font-size: var(--font-size-m);
        }
      }
    }
  `]
})
export class OverviewSectionComponent {}
