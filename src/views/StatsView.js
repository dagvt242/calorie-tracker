import { DOM } from '../utils/DOM.js';
import { DateUtils } from '../utils/DateUtils.js';
import { AverageStrategy, NutritionCalculator } from '../services/NutritionCalculator.js';

/**
 * StatsView displays weekly statistics summary.
 * Uses AverageStrategy to compute weekly averages.
 */
export class StatsView {
  constructor(diaryController, settingsController) {
    this._diary = diaryController;
    this._settings = settingsController;
    this._avgCalc = new NutritionCalculator(new AverageStrategy());
  }

  render() {
    const currentDate = this._diary.getCurrentDate();
    const weeklyData = this._diary.getPageData().weeklyData;
    const settings = this._settings.getSettings();

    this._renderWeeklyTable(weeklyData, settings);
    this._renderAverages(weeklyData, settings);
    this._renderBestDay(weeklyData, settings);
  }

  _renderWeeklyTable(weeklyData, settings) {
    const container = DOM.el('#stats-table-body');
    if (!container) return;
    DOM.clear(container);

    weeklyData.forEach((day) => {
      const pct = Math.min(100, Math.round((day.calories / settings.dailyCalorieGoal) * 100));
      const isOver = day.calories > settings.dailyCalorieGoal;
      const row = DOM.create('tr');

      const cells = [
        { text: DateUtils.formatShort(day.date), mono: false },
        { text: DateUtils.getWeekdayShort(day.date), mono: false, muted: true },
        { text: `${day.calories} ккал`, mono: true, color: isOver ? 'var(--accent2)' : 'var(--accent)' },
        { text: `${day.protein}г`, mono: true, color: 'var(--accent4)' },
        { text: `${day.fat}г`, mono: true, color: 'var(--accent2)' },
        { text: `${day.carbs}г`, mono: true, color: 'var(--accent3)' },
        { text: `${pct}%`, mono: true, color: pct >= 90 && pct <= 110 ? 'var(--accent)' : 'var(--text-muted)' },
      ];

      cells.forEach(({ text, mono, muted, color }) => {
        const td = DOM.create('td', {
          textContent: text,
          style: [
            mono ? 'font-family:var(--font-mono);font-size:0.75rem' : 'font-size:0.875rem',
            muted ? 'color:var(--text-muted)' : '',
            color ? `color:${color}` : '',
            'padding:10px 12px',
          ].filter(Boolean).join(';'),
        });
        row.appendChild(td);
      });

      container.appendChild(row);
    });
  }

  _renderAverages(weeklyData, settings) {
    const activeDays = weeklyData.filter((d) => d.calories > 0);
    if (activeDays.length === 0) return;

    const avg = this._avgCalc.calculate(activeDays);

    const fields = [
      { id: 'avg-cal', value: `${avg.calories} ккал`, label: `Норма: ${settings.dailyCalorieGoal} ккал` },
      { id: 'avg-protein', value: `${avg.protein}г`, label: `Норма: ${settings.dailyProteinGoal}г` },
      { id: 'avg-fat', value: `${avg.fat}г`, label: `Норма: ${settings.dailyFatGoal}г` },
      { id: 'avg-carbs', value: `${avg.carbs}г`, label: `Норма: ${settings.dailyCarbsGoal}г` },
    ];

    fields.forEach(({ id, value, label }) => {
      const el = DOM.el(`#${id}`);
      if (!el) return;
      DOM.el('.avg-value', el).textContent = value;
      DOM.el('.avg-label', el).textContent = label;
    });

    const daysEl = DOM.el('#stats-active-days');
    if (daysEl) daysEl.textContent = `Активних днів: ${activeDays.length} з 7`;
  }

  _renderBestDay(weeklyData, settings) {
    const el = DOM.el('#stats-best-day');
    if (!el) return;

    const activeDays = weeklyData.filter((d) => d.calories > 0);
    if (activeDays.length === 0) {
      el.textContent = '—';
      return;
    }

    const best = activeDays.reduce((prev, curr) => {
      const prevDiff = Math.abs(prev.calories - settings.dailyCalorieGoal);
      const currDiff = Math.abs(curr.calories - settings.dailyCalorieGoal);
      return currDiff < prevDiff ? curr : prev;
    });

    el.textContent = `${DateUtils.formatShort(best.date)} · ${best.calories} ккал`;
  }
}
