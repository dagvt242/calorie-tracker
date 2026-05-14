/**
 * ThemeService applies and persists UI theme preferences.
 * Demonstrates Single Responsibility — only handles theming.
 */
import { appEvents, EVENTS } from '../patterns/EventEmitter.js';

export class ThemeService {
  constructor(settingsService) {
    this._settings = settingsService;
  }

  applyFromSettings() {
    const settings = this._settings.getSettings();
    this.apply(settings.theme);
  }

  apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
  }

  toggle() {
    const current = document.documentElement.getAttribute('data-theme') ?? 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    this.apply(next);
    this._settings.updateSettings({ theme: next });
    return next;
  }
}
