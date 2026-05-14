import { Validator } from '../utils/Validator.js';

export class SettingsController {
  constructor(settingsService) {
    this._settings = settingsService;
  }

  getSettings() {
    return this._settings.getSettings();
  }

  updateSettings(formData) {
    const errors = Validator.validateSettingsForm(formData);
    if (errors.length > 0) return { success: false, errors };

    const settings = this._settings.updateSettings(formData);
    return { success: true, settings };
  }

  resetSettings() {
    const settings = this._settings.resetSettings();
    return { success: true, settings };
  }
}
