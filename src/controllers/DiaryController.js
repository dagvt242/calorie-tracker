import { appEvents, EVENTS } from '../patterns/EventEmitter.js';
import { Validator } from '../utils/Validator.js';
import { DateUtils } from '../utils/DateUtils.js';

export class DiaryController {
  constructor(diaryService, settingsService) {
    this._diary = diaryService;
    this._settings = settingsService;
    this._currentDate = DateUtils.today();
  }

  getCurrentDate() {
    return this._currentDate;
  }

  setDate(date) {
    this._currentDate = date;
    appEvents.emit(EVENTS.DATE_CHANGED, { date });
  }

  navigateDay(offset) {
    this.setDate(DateUtils.addDays(this._currentDate, offset));
  }

  getPageData() {
    const settings = this._settings.getSettings();
    const entries = this._diary.getEntriesForDate(this._currentDate);
    const totals = this._diary.getDailyTotals(this._currentDate);
    const progress = this._diary.getWeeklyData(this._currentDate); // reuse calculator
    const mealBreakdown = this._diary.getMealBreakdown(this._currentDate);
    const weeklyData = this._diary.getWeeklyData(this._currentDate);

    return { settings, entries, totals, mealBreakdown, weeklyData, date: this._currentDate };
  }

  addEntry(formData) {
    const errors = Validator.validateEntryForm(formData);
    if (errors.length > 0) return { success: false, errors };

    try {
      const entry = this._diary.addEntry({ ...formData, date: this._currentDate });
      return { success: true, entry };
    } catch (err) {
      return { success: false, errors: [err.message] };
    }
  }

  removeEntry(id) {
    this._diary.removeEntry(id, this._currentDate);
    return { success: true };
  }
}
