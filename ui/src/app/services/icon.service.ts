import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { MATERIAL_COLORS, getMaterialColors, ColorChannels } from '../constants/material-colors.constants';
import { ItemIcon } from '../models/inventory.model';

/**
 * Service for managing item icons with multi-channel SVG colorization
 *
 * Provides icon path resolution and path-level colorization by fetching SVG content,
 * injecting CSS classes and custom properties to apply different colors to different
 * parts of the icon (handle, blade, edge, etc.)
 */
@Injectable({
  providedIn: 'root'
})
export class IconService {
  private svgCache = new Map<string, string>();
  private httpClient = inject(HttpClient);
  private sanitizer = inject(DomSanitizer);

  /**
   * Get full asset path for an icon
   */
  getIconPath(icon: ItemIcon | string): string {
    if (typeof icon === 'string') {
      return `assets/icons/${icon}`;
    }
    return `assets/icons/${icon.path}`;
  }

  /**
   * Get color channels for an item icon
   */
  getColorChannels(icon: ItemIcon): ColorChannels {
    return getMaterialColors(icon.material);
  }

  /**
   * Fetch and colorize SVG with multi-channel support
   *
   * @param iconPath - Relative path to SVG (e.g., 'item-categories/item_cat_axe_SPLIT.svg')
   * @param colorChannels - Color channels to apply to different paths
   * @returns Observable<SafeHtml> ready for innerHTML binding
   */
  fetchColorizedSvg(iconPath: string, colorChannels: ColorChannels): Observable<SafeHtml> {
    const fullPath = `assets/icons/${iconPath}`;
    // Create deterministic cache key by sorting color channel keys
    const sortedChannels = Object.keys(colorChannels).sort().reduce((acc, key) => {
      acc[key] = (colorChannels as any)[key];
      return acc;
    }, {} as any);
    const cacheKey = `${fullPath}:${JSON.stringify(sortedChannels)}`;

    // Check cache first
    if (this.svgCache.has(cacheKey)) {
      return of(this.sanitizer.bypassSecurityTrustHtml(this.svgCache.get(cacheKey)!));
    }

    return this.httpClient.get(fullPath, { responseType: 'text' }).pipe(
      map(svgContent => {
        const colorized = this.applyCssClassesToSvg(svgContent, colorChannels);
        this.svgCache.set(cacheKey, colorized);
        return this.sanitizer.bypassSecurityTrustHtml(colorized);
      }),
      catchError(error => {
        console.error(`Failed to load SVG: ${fullPath}`, error);
        return of(this.sanitizer.bypassSecurityTrustHtml(this.getFallbackSvg()));
      })
    );
  }

  /**
   * Apply CSS classes and custom properties to SVG paths
   *
   * Strategy:
   * 1. Skip first path (background)
   * 2. Read data-channel attribute from each path (e.g., data-channel="handle")
   * 3. Apply color directly as inline style (scoped to this SVG instance)
   * 4. No global CSS classes needed - each SVG is self-contained
   */
  private applyCssClassesToSvg(svgContent: string, channels: ColorChannels): string {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgContent, 'image/svg+xml');
    const svgElement = doc.querySelector('svg');

    if (!svgElement) {
      return svgContent;
    }

    const paths = svgElement.querySelectorAll('path');

    // Skip first path (background), process remaining paths
    paths.forEach((path, index) => {
      if (index === 0) {
        return; // Skip background
      }

      // Read data-channel attribute (e.g., "handle", "blade", "edge")
      const channelName = path.getAttribute('data-channel') || 'primary';

      // Special handling for "empty" channel - use inherit
      if (channelName === 'empty') {
        path.setAttribute('fill', 'inherit');
        return;
      }

      // Get color from channels object, fallback to primary
      const color = (channels as any)[channelName] || channels.primary;

      // Apply color directly as inline style (scoped to this path)
      path.setAttribute('fill', color);
    });

    return new XMLSerializer().serializeToString(svgElement);
  }

  /**
   * Fallback SVG for error cases
   */
  private getFallbackSvg(): string {
    return `<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <rect fill="#666" width="512" height="512"/>
      <text x="256" y="256" fill="#fff" font-size="48" text-anchor="middle" dominant-baseline="middle">?</text>
    </svg>`;
  }

  /**
   * Clear SVG cache (useful for testing or memory management)
   */
  clearCache(): void {
    this.svgCache.clear();
  }
}
