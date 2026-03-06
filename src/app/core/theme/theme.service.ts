import { Injectable, inject, signal, PLATFORM_ID } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';

const STORAGE_KEY = 'pospay-theme';

export type ThemeMode = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);

  readonly isDark = signal<boolean>(false);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const stored = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
      const dark = stored === 'dark' || (!stored && this.prefersDark());
      this.isDark.set(dark);
      this.applyToDocument(dark);
    }
  }

  toggle(): void {
    const next = !this.isDark();
    this.isDark.set(next);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(STORAGE_KEY, next ? 'dark' : 'light');
      this.applyToDocument(next);
    }
  }

  setDark(dark: boolean): void {
    this.isDark.set(dark);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light');
      this.applyToDocument(dark);
    }
  }

  private prefersDark(): boolean {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  private applyToDocument(dark: boolean): void {
    const body = this.document?.body;
    if (!body) return;
    if (dark) {
      body.classList.add('dark-theme');
    } else {
      body.classList.remove('dark-theme');
    }
  }
}
