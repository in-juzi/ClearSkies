import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, of } from 'rxjs';
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';
import { IconService } from '../../../services/icon.service';
import { ItemIcon } from '../../../models/inventory.model';
import { ColorChannels, getMaterialColors, MATERIAL_COLORS } from '../../../constants/material-colors.constants';

/**
 * Reusable icon component for displaying colorized SVG icons
 *
 * Supports multi-channel colorization where different parts of the icon
 * (handle, blade, edge) receive different colors based on material type.
 *
 * Usage:
 * ```html
 * <!-- With item icon config -->
 * <app-icon [icon]="item.icon" [size]="40"></app-icon>
 *
 * <!-- With manual path and material -->
 * <app-icon path="item-categories/item_cat_sword.svg" material="iron" [size]="32"></app-icon>
 *
 * <!-- With custom color channels -->
 * <app-icon
 *   path="item-categories/item_cat_potion.svg"
 *   [colorChannels]="{ primary: '#DC143C', handle: '#8B0000' }"
 *   [size]="48">
 * </app-icon>
 *
 * <!-- Disable colorization (show white icon) -->
 * <app-icon [icon]="item.icon" [disableColor]="true" [size]="40"></app-icon>
 * ```
 */
@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="icon-container"
      [style.width.px]="size"
      [style.height.px]="size"
      [innerHTML]="svgContent$ | async"
      [class]="customClass"
      [class.icon-error]="hasError"
    ></div>
  `,
  styles: [`
    :host {
      display: inline-block;
      line-height: 0;
    }

    .icon-container {
      display: block;
      line-height: 0;
    }

    .icon-container ::ng-deep svg {
      width: 100%;
      height: 100%;
      display: block;
    }

    .icon-error {
      opacity: 0.3;
      filter: grayscale(100%);
    }
  `]
})
export class IconComponent implements OnInit, OnChanges {
  /** Item icon configuration object */
  @Input() icon?: ItemIcon;

  /** Icon path (relative to assets/icons/) */
  @Input() path?: string;

  /** Material name for colorization */
  @Input() material?: string;

  /** Custom color channels (overrides material colors) */
  @Input() colorChannels?: ColorChannels;

  /** Icon size in pixels */
  @Input() size = 40;

  /** Alt text for accessibility */
  @Input() alt?: string;

  /** Additional CSS classes */
  @Input() customClass = '';

  /** Disable colorization (show original white icon) */
  @Input() disableColor = false;

  // Computed properties
  svgContent$!: Observable<SafeHtml>;
  hasError = false;

  constructor(
    private iconService: IconService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.updateIcon();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.updateIcon();
  }

  private updateIcon(): void {
    let iconPath = '';
    let channels: ColorChannels;

    // Determine icon path and color channels
    if (this.icon) {
      iconPath = this.icon.path;
      channels = this.colorChannels || getMaterialColors(this.icon.material);
    } else if (this.path) {
      iconPath = this.path;
      channels = this.colorChannels ||
                 (this.material ? getMaterialColors(this.material) : MATERIAL_COLORS['generic']);
    } else {
      // Fallback to generic icon
      iconPath = 'item-categories/item_cat_material.svg';
      channels = MATERIAL_COLORS['generic'];
    }

    // Fetch and colorize SVG
    if (this.disableColor) {
      // Simple loading without colorization - use img tag
      const imgHtml = `<img src="assets/icons/${iconPath}" alt="${this.alt || 'Icon'}" style="width: 100%; height: 100%; display: block;" />`;
      this.svgContent$ = of(this.sanitizer.bypassSecurityTrustHtml(imgHtml));
    } else {
      // Multi-channel colorization
      this.svgContent$ = this.iconService.fetchColorizedSvg(iconPath, channels);
    }
  }

  onError(): void {
    this.hasError = true;
    console.warn(`Failed to render icon`);
  }
}
