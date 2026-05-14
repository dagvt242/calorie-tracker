import { UserSettings } from '../models/UserSettings.js';
import { appEvents, EVENTS } from '../patterns/EventEmitter.js';

export class SettingsService {
  constructor(settingsRepository) {
    this._repo = settingsRepository;
  }

  getSettings() {
    return this._repo.get();
  }

  updateSettings(data) {
    const current = this._repo.get();
    const updated = new UserSettings({ ...current.toJSON(), ...data });
    this._repo.save(updated);
    appEvents.emit(EVENTS.SETTINGS_UPDATED, updated);
    return updated;
  }

  resetSettings() {
    this._repo.reset();
    const defaults = new UserSettings();
    appEvents.emit(EVENTS.SETTINGS_UPDATED, defaults);
    return defaults;
  }
}
