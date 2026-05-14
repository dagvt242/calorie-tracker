/**
 * GoalChecker monitors daily calorie intake and provides feedback.
 * Uses Observer pattern to react to diary updates automatically.
 *
 * Principle: SRP — only responsible for goal evaluation logic.
 * Pattern: Observer — subscribes to DIARY_UPDATED events.
 */
import { appEvents, EVENTS } from '../patterns/EventEmitter.js';
import { notifications } from './NotificationService.js';

export class GoalChecker {
  constructor(diaryService, settingsService) {
    this._diary = diaryService;
    this._settings = settingsService;
    this._lastNotifiedDate = null;
  }

  start() {
    appEvents.on(EVENTS.DIARY_UPDATED, ({ date }) => this._check(date));
  }

  _check(date) {
    const settings = this._settings.getSettings();
    const totals = this._diary.getDailyTotals(date);

    const ratio = totals.calories / settings.dailyCalorieGoal;

    if (ratio >= 1.0 && ratio < 1.05 && this._lastNotifiedDate !== date) {
      this._lastNotifiedDate = date;
      notifications.success(`🎯 Денна норма досягнута! ${totals.calories} ккал`);
    } else if (ratio > 1.15 && this._lastNotifiedDate !== `over-${date}`) {
      this._lastNotifiedDate = `over-${date}`;
      notifications.error(`⚠️ Норму перевищено на ${Math.round((ratio - 1) * 100)}%`);
    }
  }
}
