import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManualService, LocationsResponse, BiomesResponse } from '../../../services/manual.service';

@Component({
  selector: 'app-locations-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="section-content">
      <h2>Locations & Travel</h2>
      <p class="lead">
        Explore diverse locations across different biomes. Each location offers unique facilities,
        activities, and resources. Discover new areas as you level up and meet travel requirements.
      </p>

      @if (loading()) {
        <div class="loading">Loading locations data...</div>
      } @else if (error()) {
        <div class="error">{{ error() }}</div>
      } @else {
        <!-- Biomes -->
        @if (biomesData()) {
          <section>
            <h3>Biomes</h3>
            <p>
              The world is divided into distinct biomes, each with its own atmosphere,
              resources, and activities.
            </p>

            <div class="biomes-grid">
              @for (biome of biomesData()!.biomes; track biome.biomeId) {
                <div class="biome-card">
                  <h4>{{ biome.name }}</h4>
                  <p class="biome-desc">{{ biome.description }}</p>
                  <p class="ambient">{{ biome.ambientDescription }}</p>
                  @if (biome.commonResources.length > 0) {
                    <div class="resources">
                      <strong>Common Resources:</strong> {{ biome.commonResources.join(', ') }}
                    </div>
                  }
                </div>
              }
            </div>
          </section>
        }

        <!-- Locations -->
        @if (locationsData()) {
          <section>
            <h3>Locations</h3>
            <p>Total Locations: <strong>{{ locationsData()!.totalLocations }}</strong></p>

            <div class="locations-list">
              @for (location of locationsData()!.locations; track location.locationId) {
                <div class="location-card">
                  <div class="location-header">
                    <h4>{{ location.name }}</h4>
                    <span class="biome-badge">{{ location.biome }}</span>
                  </div>
                  <p class="location-desc">{{ location.description }}</p>

                  @if (location.facilities.length > 0) {
                    <div class="facilities">
                      <strong>Facilities:</strong>
                      <ul>
                        @for (facility of location.facilities; track facility) {
                          <li>{{ facility }}</li>
                        }
                      </ul>
                    </div>
                  }

                  @if (location.navigationLinks.length > 0) {
                    <div class="navigation">
                      <strong>Travel to:</strong>
                      <ul>
                        @for (link of location.navigationLinks; track link.targetLocationId) {
                          <li>{{ link.targetLocationId }} - {{ link.description }}</li>
                        }
                      </ul>
                    </div>
                  }
                </div>
              }
            </div>
          </section>
        }

        <!-- Location System Info -->
        <section>
          <h3>How Travel Works</h3>
          <ul>
            <li><strong>Discovery:</strong> Locations must be discovered before you can travel to them</li>
            <li><strong>Travel Time:</strong> Moving between locations takes time (tracked server-side)</li>
            <li><strong>Requirements:</strong> Some locations require minimum skill levels to discover</li>
            <li><strong>Navigation:</strong> Each location shows available travel destinations</li>
            <li><strong>Facilities:</strong> Locations contain facilities (markets, docks, camps) with activities</li>
            <li><strong>Starting Point:</strong> All characters start in Kennik, the central town</li>
          </ul>
        </section>

        <section>
          <h3>Activities</h3>
          <p>
            Each facility offers different activities you can perform:
          </p>
          <ul>
            <li><strong>Resource Gathering:</strong> Woodcutting, mining, fishing for raw materials</li>
            <li><strong>Crafting:</strong> Smithing and cooking to create new items (coming soon)</li>
            <li><strong>Trading:</strong> Buy and sell items at markets (coming soon)</li>
            <li><strong>Requirements:</strong> Activities may require skill levels, equipped tools, or inventory items</li>
            <li><strong>Rewards:</strong> Earn skill XP and items through drop tables</li>
            <li><strong>Time-Based:</strong> Activities take time to complete (5-50 seconds)</li>
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

      .biomes-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: var(--spacing-l);
      }

      .biome-card {
        background: var(--color-bg-secondary);
        padding: var(--spacing-l);
        border-radius: var(--radius-m);
        border: var(--border-width-thin) solid var(--color-surface-border);

        .biome-desc {
          font-size: var(--font-size-m);
          margin-bottom: var(--spacing-m);
        }

        .ambient {
          font-style: italic;
          font-size: var(--font-size-m);
          color: var(--color-text-disabled);
          margin-bottom: var(--spacing-m);
        }

        .resources {
          padding-top: var(--spacing-m);
          border-top: var(--border-width-thin) solid var(--color-surface-border);
          font-size: var(--font-size-m);
          color: var(--color-text-secondary);

          strong {
            color: var(--color-text-primary);
          }
        }
      }

      .locations-list {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-l);
      }

      .location-card {
        background: var(--color-bg-secondary);
        padding: var(--spacing-l);
        border-radius: var(--radius-m);
        border: var(--border-width-thin) solid var(--color-surface-border);

        .location-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-m);

          .biome-badge {
            padding: var(--spacing-xs) var(--spacing-m);
            background: var(--color-accent-purple);
            color: var(--color-text-primary);
            border-radius: var(--radius-s);
            font-size: var(--font-size-s);
            font-weight: var(--font-weight-semibold);
            text-transform: capitalize;
          }
        }

        .location-desc {
          font-size: var(--font-size-m);
          margin-bottom: var(--spacing-l);
        }

        .facilities, .navigation {
          margin-bottom: var(--spacing-m);

          &:last-child {
            margin-bottom: 0;
          }

          strong {
            color: var(--color-text-primary);
            display: block;
            margin-bottom: var(--spacing-xs);
          }

          ul {
            margin: 0;
            padding-left: var(--spacing-l);
            color: var(--color-text-secondary);
            font-size: var(--font-size-m);
            line-height: 1.6;

            li {
              margin-bottom: var(--spacing-xs);
              text-transform: capitalize;
            }
          }
        }

        .facilities {
          padding-bottom: var(--spacing-m);
          border-bottom: var(--border-width-thin) solid var(--color-surface-border);
        }
      }
    }
  `]
})
export class LocationsSectionComponent implements OnInit {
  private manualService = inject(ManualService);

  loading = signal(true);
  error = signal<string | null>(null);
  locationsData = signal<LocationsResponse | null>(null);
  biomesData = signal<BiomesResponse | null>(null);

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    Promise.all([
      this.manualService.getLocations().toPromise(),
      this.manualService.getBiomes().toPromise()
    ]).then(([locations, biomes]) => {
      this.locationsData.set(locations || null);
      this.biomesData.set(biomes || null);
      this.loading.set(false);
    }).catch(err => {
      console.error('Failed to load locations data:', err);
      this.error.set('Failed to load locations data. Please try again later.');
      this.loading.set(false);
    });
  }
}
