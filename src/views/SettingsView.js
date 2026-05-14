import { DOM } from '../utils/DOM.js';

export class SettingsView {
  constructor(settingsController) {
    this._settings = settingsController;
  }

  render() {
    const s = this._settings.getSettings();
    const fields = ['dailyCalorieGoal', 'dailyProteinGoal', 'dailyFatGoal', 'dailyCarbsGoal'];
    fields.forEach((field) => {
      const el = DOM.el(`#${field}`);
      if (el) el.value = s[field];
    });
  }

  bindSave() {
    DOM.el('#save-settings-btn')?.addEventListener('click', () => {
      const data = {
        dailyCalorieGoal: DOM.el('#dailyCalorieGoal').value,
        dailyProteinGoal: DOM.el('#dailyProteinGoal').value,
        dailyFatGoal: DOM.el('#dailyFatGoal').value,
        dailyCarbsGoal: DOM.el('#dailyCarbsGoal').value,
      };

      const result = this._settings.updateSettings(data);
      const msgEl = DOM.el('#settings-msg');

      if (!result.success) {
        msgEl.className = 'alert alert-error';
        msgEl.textContent = result.errors.join('. ');
      } else {
        msgEl.className = 'alert alert-success';
        msgEl.textContent = 'Налаштування збережено!';
        setTimeout(() => { msgEl.textContent = ''; }, 2500);
      }
    });

    DOM.el('#reset-settings-btn')?.addEventListener('click', () => {
      if (confirm('Скинути всі налаштування до стандартних?')) {
        this._settings.resetSettings();
        this.render();
      }
    });
  }
}
