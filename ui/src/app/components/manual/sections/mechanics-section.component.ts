import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mechanics-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="section-content">
      <h2>Game Mechanics</h2>
      <p class="lead">
        Understanding the core systems and mechanics will help you progress efficiently
        and make the most of your time in ClearSkies.
      </p>

      <section>
        <h3>XP & Leveling System</h3>
        <div class="mechanic-card">
          <h4>Skills & Attributes</h4>
          <ul>
            <li><strong>1000 XP per Level:</strong> Both skills and attributes require exactly 1000 XP to level up</li>
            <li><strong>Attribute Linking:</strong> When a skill gains XP, 50% is automatically awarded to its linked attribute</li>
            <li><strong>Example:</strong> Earn 100 woodcutting XP → Strength gains 50 XP automatically</li>
            <li><strong>Level Formula:</strong> Level = floor(XP / 1000) + 1</li>
          </ul>
        </div>

        <div class="mechanic-card">
          <h4>XP Scaling (Diminishing Returns)</h4>
          <ul>
            <li><strong>Grace Range:</strong> Activities 0-1 levels above your skill award full XP</li>
            <li><strong>Scaling Starts:</strong> At +2 levels, XP begins to scale down</li>
            <li><strong>Formula:</strong> Uses polynomial decay (1 / (1 + 0.3 * (diff - 1)))</li>
            <li><strong>Example:</strong> At +5 levels, you receive ~50% XP from the activity</li>
            <li><strong>Minimum:</strong> Always receive at least 1 XP (symbolic reward)</li>
            <li><strong>Purpose:</strong> Encourages progression to higher-level content</li>
          </ul>
        </div>
      </section>

      <section>
        <h3>Equipment System</h3>
        <div class="mechanic-card">
          <h4>Equipment Slots (10 Total)</h4>
          <ul>
            <li><strong>Head:</strong> Helms, coifs, hoods</li>
            <li><strong>Body:</strong> Tunics, armor, robes</li>
            <li><strong>Main Hand:</strong> Primary weapon or tool</li>
            <li><strong>Off Hand:</strong> Shield, secondary weapon, or tool</li>
            <li><strong>Belt:</strong> Utility belts, sashes</li>
            <li><strong>Gloves:</strong> Gauntlets, gloves</li>
            <li><strong>Boots:</strong> Footwear, greaves</li>
            <li><strong>Necklace:</strong> Amulets, pendants</li>
            <li><strong>Ring (Right):</strong> Right hand ring slot</li>
            <li><strong>Ring (Left):</strong> Left hand ring slot</li>
          </ul>
        </div>

        <div class="mechanic-card">
          <h4>Equipment Rules</h4>
          <ul>
            <li><strong>One Item Per Slot:</strong> Each slot can hold only one item at a time</li>
            <li><strong>Auto-Unequip:</strong> Equipping to an occupied slot automatically unequips the current item</li>
            <li><strong>Equipped Status:</strong> Equipped items are marked in your inventory</li>
            <li><strong>Tool Requirements:</strong> Some activities require specific tool subtypes (woodcutting-axe, fishing-rod, etc.)</li>
            <li><strong>Any Slot Works:</strong> Tool requirements check all equipment slots, not just mainHand</li>
          </ul>
        </div>
      </section>

      <section>
        <h3>Inventory Management</h3>
        <div class="mechanic-card">
          <h4>Item Stacking</h4>
          <ul>
            <li><strong>Identical Items Stack:</strong> Items with the same quality/trait levels combine into one stack</li>
            <li><strong>Different Levels Separate:</strong> Oak log with Quality L3 won't stack with Quality L4</li>
            <li><strong>Unlimited Stacking:</strong> Stackable items can be stacked infinitely</li>
            <li><strong>Equipment Don't Stack:</strong> Equipment items are marked as non-stackable</li>
          </ul>
        </div>

        <div class="mechanic-card">
          <h4>Quality & Trait System</h4>
          <ul>
            <li><strong>Quality Levels:</strong> 1 (Poor) to 5 (Perfect), affect vendor prices</li>
            <li><strong>Trait Levels:</strong> 1 to 3, with escalating effects</li>
            <li><strong>Multiple Qualities:</strong> Items can have multiple quality types (e.g., woodGrain + moisture)</li>
            <li><strong>Multiple Traits:</strong> Items can have multiple traits simultaneously</li>
            <li><strong>Vendor Pricing:</strong> Each quality/trait level has a price multiplier</li>
          </ul>
        </div>
      </section>

      <section>
        <h3>Drop Table System</h3>
        <div class="mechanic-card">
          <h4>How Loot Works</h4>
          <ul>
            <li><strong>Weighted Random:</strong> Each item in a drop table has a weight (higher weight = more common)</li>
            <li><strong>Quality Bonuses:</strong> Activities can add +1 or +2 to quality levels based on skill</li>
            <li><strong>Reusable Tables:</strong> Multiple activities can share the same drop table</li>
            <li><strong>Nothing Drops:</strong> Some drops are "dropNothing" for balanced loot rates</li>
            <li><strong>Example:</strong> Common ore (85%), rare gem (10%), nothing (5%)</li>
          </ul>
        </div>
      </section>

      <section>
        <h3>Activity System</h3>
        <div class="mechanic-card">
          <h4>Activity Requirements</h4>
          <ul>
            <li><strong>Skill Level:</strong> Minimum skill level to start the activity</li>
            <li><strong>Equipped Tools:</strong> Must have tool subtype equipped (e.g., woodcutting-axe for chopping)</li>
            <li><strong>Inventory Items:</strong> Must have specific items with minimum quantity (e.g., 3 torches)</li>
            <li><strong>Location:</strong> Must be at the correct location to access the facility</li>
          </ul>
        </div>

        <div class="mechanic-card">
          <h4>Activity Completion</h4>
          <ul>
            <li><strong>Time-Based:</strong> Activities take 5-50 seconds to complete</li>
            <li><strong>Server-Side Tracking:</strong> Completion time is tracked by the server</li>
            <li><strong>Automatic Claiming:</strong> Rewards are claimed automatically when time expires</li>
            <li><strong>Can Cancel:</strong> You can cancel an in-progress activity at any time</li>
            <li><strong>One at a Time:</strong> Can only perform one activity at a time</li>
          </ul>
        </div>
      </section>

      <section>
        <h3>Progression Tips</h3>
        <ul>
          <li><strong>Match Your Level:</strong> Focus on activities within 1-2 levels of your skill for best XP</li>
          <li><strong>Upgrade Tools:</strong> Better tools may unlock new activities or improve efficiency</li>
          <li><strong>Explore Early:</strong> Discover new locations to access diverse resources</li>
          <li><strong>Track Attributes:</strong> Balanced skill training leads to well-rounded attributes</li>
          <li><strong>Quality Matters:</strong> Higher quality items sell for more gold at vendors</li>
          <li><strong>Save Rare Traits:</strong> Epic trait items have significant value multipliers</li>
        </ul>
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
        margin-bottom: var(--spacing-m);
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

      .mechanic-card {
        background: var(--color-bg-secondary);
        padding: var(--spacing-l);
        border-radius: var(--radius-m);
        border: var(--border-width-thin) solid var(--color-surface-border);
        margin-bottom: var(--spacing-l);

        &:last-child {
          margin-bottom: 0;
        }

        h4 {
          margin-top: 0;
        }

        ul {
          margin-bottom: 0;
        }
      }
    }
  `]
})
export class MechanicsSectionComponent {}
