import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { ManualService, ItemsResponse, QualitiesResponse, TraitsResponse } from '../../../services/manual.service';
import { IconComponent } from '../../shared/icon/icon.component';

@Component({
  selector: 'app-items-section',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="section-content">
      <h2>Items & Inventory</h2>
      <p class="lead">
        Items in ClearSkies have dynamic qualities and traits that make each drop unique.
        Discover resources, equipment, and consumables with varying properties and values.
      </p>

      @if (loading()) {
        <div class="loading">Loading items data...</div>
      } @else if (error()) {
        <div class="error">{{ error() }}</div>
      } @else {
        <!-- Item Categories -->
        @if (itemsData()) {
          <section>
            <h3>Item Categories</h3>
            <p>Total Items: <strong>{{ itemsData()!.totalItems }}</strong></p>

            <div class="category-section">
              <h4>Resources ({{ itemsData()!.categories.resources.length }})</h4>
              <p>Raw materials gathered from activities like woodcutting, mining, and fishing.</p>
              <div class="items-grid">
                @for (item of itemsData()!.categories.resources; track item.itemId) {
                  <div class="item-card">
                    <app-icon [icon]="item.icon" [size]="48" class="item-icon" />
                    <div class="item-info">
                      <h5 [class]="'rarity-' + item.rarity">{{ item.name }}</h5>
                      <p>{{ item.description }}</p>
                      @if (item.subcategories && item.subcategories.length > 0) {
                        <div class="subcategories">
                          @for (subcategory of item.subcategories; track subcategory) {
                            <span class="subcategory-tag">{{ subcategory }}</span>
                          }
                        </div>
                      }
                    </div>
                  </div>
                }
              </div>
            </div>

            <div class="category-section">
              <h4>Equipment ({{ itemsData()!.categories.equipment.length }})</h4>
              <p>Weapons, armor, and tools that can be equipped to enhance your abilities.</p>
              <div class="items-grid">
                @for (item of itemsData()!.categories.equipment; track item.itemId) {
                  <div class="item-card">
                    <app-icon [icon]="item.icon" [size]="48" class="item-icon" />
                    <div class="item-info">
                      <h5 [class]="'rarity-' + item.rarity">{{ item.name }}</h5>
                      <p>{{ item.description }}</p>
                      @if (item.subcategories && item.subcategories.length > 0) {
                        <div class="subcategories">
                          @for (subcategory of item.subcategories; track subcategory) {
                            <span class="subcategory-tag">{{ subcategory }}</span>
                          }
                        </div>
                      }
                    </div>
                  </div>
                }
              </div>
            </div>

            <div class="category-section">
              <h4>Consumables ({{ itemsData()!.categories.consumables.length }})</h4>
              <p>Food and potions that provide temporary benefits.</p>
              <div class="items-grid">
                @for (item of itemsData()!.categories.consumables; track item.itemId) {
                  <div class="item-card">
                    <app-icon [icon]="item.icon" [size]="48" class="item-icon" />
                    <div class="item-info">
                      <h5 [class]="'rarity-' + item.rarity">{{ item.name }}</h5>
                      <p>{{ item.description }}</p>
                      @if (item.subcategories && item.subcategories.length > 0) {
                        <div class="subcategories">
                          @for (subcategory of item.subcategories; track subcategory) {
                            <span class="subcategory-tag">{{ subcategory }}</span>
                          }
                        </div>
                      }
                    </div>
                  </div>
                }
              </div>
            </div>
          </section>
        }

        <!-- Quality System -->
        @if (qualitiesData()) {
          <section>
            <h3>Quality System</h3>
            <div class="info-box">
              <p><strong>Level Range:</strong> {{ qualitiesData()!.system.levelRange }}</p>
              <p><strong>Description:</strong> {{ qualitiesData()!.system.description }}</p>
              <p><strong>Stacking:</strong> {{ qualitiesData()!.system.stacking }}</p>
            </div>

            <p>
              Qualities represent the inherent characteristics of items. Each quality type has 5 discrete levels,
              with escalating effects on vendor value and item properties. Higher levels provide increasingly powerful bonuses.
            </p>

            <div class="qualities-grid">
              @for (quality of qualitiesData()!.qualities; track quality.qualityId) {
                <div class="quality-card">
                  <h4>{{ quality.name }}</h4>
                  <p class="quality-desc">{{ quality.description }}</p>
                  <p class="applicable">Applies to: {{ quality.applicableTo.join(', ') }}</p>
                  <div class="levels">
                    @for (level of quality.levels; track level.level) {
                      <div class="level-row">
                        <span class="level-num">L{{ level.level }}</span>
                        <span class="level-name">{{ level.name }}</span>
                        <span class="level-modifier">{{ level.vendorPriceModifier }}x</span>
                      </div>
                    }
                  </div>
                </div>
              }
            </div>
          </section>
        }

        <!-- Trait System -->
        @if (traitsData()) {
          <section>
            <h3>Trait System</h3>
            <div class="info-box">
              <p><strong>Level Range:</strong> {{ traitsData()!.system.levelRange }}</p>
              <p><strong>Description:</strong> {{ traitsData()!.system.description }}</p>
              <p><strong>Stacking:</strong> {{ traitsData()!.system.stacking }}</p>
            </div>

            <p>
              Traits are special modifiers that can appear on items, with 3 levels of escalating effects.
              Higher rarity traits have lower drop chances but more powerful effects.
            </p>

            <div class="rarity-info">
              <h4>Rarity Drop Chances</h4>
              <ul>
                @for (entry of getRarityEntries(); track entry.key) {
                  <li><strong>{{ entry.key }}:</strong> {{ entry.value }}</li>
                }
              </ul>
            </div>

            <div class="traits-grid">
              @for (trait of traitsData()!.traits; track trait.traitId) {
                <div class="trait-card" [class]="'rarity-' + trait.rarity">
                  <div class="trait-header">
                    <h4>{{ trait.name }}</h4>
                    <span class="rarity-badge">{{ trait.rarity }}</span>
                  </div>
                  <p class="trait-desc">{{ trait.description }}</p>
                  <p class="applicable">Applies to: {{ trait.applicableTo.join(', ') }}</p>
                  <div class="levels">
                    @for (level of trait.levels; track level.level) {
                      <div class="level-row">
                        <span class="level-num">L{{ level.level }}</span>
                        <span class="level-name">{{ level.name }}</span>
                        <span class="level-modifier">{{ level.vendorPriceModifier }}x</span>
                      </div>
                    }
                  </div>
                </div>
              }
            </div>
          </section>
        }
      }
    </div>
  `,
  styles: [`
    .section-content {
      max-width: 900px;

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
        margin-bottom: var(--spacing-s);
      }

      h5 {
        font-size: var(--font-size-l);
        color: var(--color-text-primary);
        margin: 0 0 var(--spacing-xs) 0;

        &.rarity-common { color: #9e9e9e; }
        &.rarity-uncommon { color: #4caf50; }
        &.rarity-rare { color: #2196f3; }
        &.rarity-epic { color: #9c27b0; }
        &.rarity-legendary { color: #ff9800; }
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
        margin-bottom: var(--spacing-l);

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

      .category-section {
        margin-bottom: var(--spacing-2xl);
      }

      .items-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: var(--spacing-m);
        margin-bottom: var(--spacing-xl);
      }

      .item-card {
        background: var(--color-bg-secondary);
        padding: var(--spacing-m);
        border-radius: var(--radius-m);
        border: var(--border-width-thin) solid var(--color-surface-border);
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;

        .item-icon {
          margin-bottom: var(--spacing-s);
        }

        .item-info {
          width: 100%;

          p {
            font-size: var(--font-size-s);
            margin-bottom: var(--spacing-s);
          }
        }

        .subcategories {
          display: flex;
          flex-wrap: wrap;
          gap: var(--spacing-xs);
          margin-bottom: var(--spacing-s);

          .subcategory-tag {
            font-size: var(--font-size-xs);
            padding: 2px var(--spacing-xs);
            background: var(--color-accent-purple-dark);
            color: var(--color-text-primary);
            border-radius: var(--radius-s);
            text-transform: lowercase;
            border: var(--border-width-thin) solid var(--color-accent-purple);
          }
        }
      }

      .qualities-grid, .traits-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: var(--spacing-l);
      }

      .quality-card, .trait-card {
        background: var(--color-bg-secondary);
        padding: var(--spacing-l);
        border-radius: var(--radius-m);
        border: var(--border-width-thin) solid var(--color-surface-border);

        .quality-desc, .trait-desc {
          font-size: var(--font-size-m);
          margin-bottom: var(--spacing-s);
        }

        .applicable {
          font-size: var(--font-size-s);
          color: var(--color-text-disabled);
          font-style: italic;
          margin-bottom: var(--spacing-m);
        }

        .levels {
          border-top: var(--border-width-thin) solid var(--color-surface-border);
          padding-top: var(--spacing-m);

          .level-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: var(--spacing-xs) 0;
            font-size: var(--font-size-s);

            .level-num {
              font-weight: var(--font-weight-bold);
              color: var(--color-text-accent-secondary);
              min-width: 30px;
            }

            .level-name {
              flex: 1;
              color: var(--color-text-secondary);
            }

            .level-modifier {
              color: var(--color-accent-gold);
              font-weight: var(--font-weight-semibold);
            }
          }
        }
      }

      .trait-card {
        .trait-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-s);

          h4 {
            margin: 0;
          }

          .rarity-badge {
            padding: var(--spacing-xs) var(--spacing-s);
            border-radius: var(--radius-s);
            font-size: var(--font-size-xs);
            font-weight: var(--font-weight-semibold);
            text-transform: uppercase;
          }
        }

        &.rarity-common .rarity-badge {
          background: var(--color-rarity-common);
          color: white;
        }

        &.rarity-uncommon .rarity-badge {
          background: var(--color-rarity-uncommon);
          color: white;
        }

        &.rarity-rare .rarity-badge {
          background: var(--color-rarity-rare);
          color: white;
        }

        &.rarity-epic .rarity-badge {
          background: var(--color-rarity-epic);
          color: white;
        }
      }

      .rarity-info {
        background: var(--color-bg-secondary);
        padding: var(--spacing-l);
        border-radius: var(--radius-m);
        border: var(--border-width-thin) solid var(--color-surface-border);
        margin-bottom: var(--spacing-xl);

        h4 {
          margin-top: 0;
        }

        ul {
          margin: 0;
          padding-left: var(--spacing-xl);
          color: var(--color-text-secondary);

          li {
            margin-bottom: var(--spacing-xs);

            strong {
              color: var(--color-text-primary);
              text-transform: capitalize;
            }
          }
        }
      }
    }
  `]
})
export class ItemsSectionComponent implements OnInit {
  private manualService = inject(ManualService);

  loading = signal(true);
  error = signal<string | null>(null);
  itemsData = signal<ItemsResponse | null>(null);
  qualitiesData = signal<QualitiesResponse | null>(null);
  traitsData = signal<TraitsResponse | null>(null);

  ngOnInit(): void {
    this.loadData();
  }

  private async loadData(): Promise<void> {
    try {
      const [items, qualities, traits] = await Promise.all([
        firstValueFrom(this.manualService.getItems()),
        firstValueFrom(this.manualService.getQualities()),
        firstValueFrom(this.manualService.getTraits())
      ]);

      this.itemsData.set(items || null);
      this.qualitiesData.set(qualities || null);
      this.traitsData.set(traits || null);
      this.loading.set(false);
    } catch (err) {
      console.error('Failed to load items data:', err);
      this.error.set('Failed to load items data. Please try again later.');
      this.loading.set(false);
    }
  }

  getRarityEntries(): Array<{ key: string; value: string }> {
    if (!this.traitsData()) return [];
    return Object.entries(this.traitsData()!.system.rarities).map(([key, value]) => ({ key, value }));
  }
}
