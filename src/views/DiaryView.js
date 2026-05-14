import { DOM } from '../utils/DOM.js';
import { DateUtils } from '../utils/DateUtils.js';

const MEAL_LABELS = {
  breakfast: '🌅 Сніданок',
  lunch: '☀️ Обід',
  dinner: '🌙 Вечеря',
  snack: '🍎 Перекус',
};

export class DiaryView {
  constructor(diaryController, foodController) {
    this._diary = diaryController;
    this._foods = foodController;
    this._selectedFoodId = null;
  }

  render() {
    const data = this._diary.getPageData();
    this._renderMacroCards(data.totals, data.settings);
    this._renderWeeklyChart(data.weeklyData, data.date, data.settings);
    this._renderMeals(data.mealBreakdown);
  }

  _renderMacroCards(totals, settings) {
    const cards = [
      { id: 'cal', value: totals.calories, goal: settings.dailyCalorieGoal, unit: 'ккал', label: 'Калорії' },
      { id: 'protein', value: totals.protein, goal: settings.dailyProteinGoal, unit: 'г', label: 'Білки' },
      { id: 'fat', value: totals.fat, goal: settings.dailyFatGoal, unit: 'г', label: 'Жири' },
      { id: 'carbs', value: totals.carbs, goal: settings.dailyCarbsGoal, unit: 'г', label: 'Вуглеводи' },
    ];

    cards.forEach(({ id, value, goal, unit, label }) => {
      const pct = Math.min(100, Math.round((value / goal) * 100));
      const card = DOM.el(`#macro-${id}`);
      if (!card) return;
      DOM.el('.macro-value', card).textContent = `${Math.round(value)}${unit}`;
      DOM.el('.macro-goal', card).textContent = `з ${goal}${unit} · ${pct}%`;
      DOM.el('.progress-fill', card).style.width = `${pct}%`;
    });
  }

  _renderWeeklyChart(weeklyData, currentDate, settings) {
    const container = DOM.el('#weekly-chart');
    if (!container) return;
    DOM.clear(container);

    const max = Math.max(...weeklyData.map((d) => d.calories), 1);

    weeklyData.forEach((day) => {
      const heightPct = Math.max(4, (day.calories / max) * 100);
      const isToday = day.date === currentDate;
      const wrapper = DOM.create('div', { className: 'chart-bar-wrapper' });
      const val = DOM.create('div', { className: 'chart-bar-val', textContent: day.calories > 0 ? day.calories : '' });
      const bar = DOM.create('div', { className: `chart-bar${isToday ? ' today' : ''}` });
      bar.style.height = `${heightPct}%`;
      bar.title = `${DateUtils.formatShort(day.date)}: ${day.calories} ккал`;
      const label = DOM.create('div', {
        className: 'chart-bar-label',
        textContent: DateUtils.getWeekdayShort(day.date),
      });
      wrapper.append(val, bar, label);
      container.appendChild(wrapper);
    });
  }

  _renderMeals(mealBreakdown) {
    const container = DOM.el('#meals-container');
    if (!container) return;
    DOM.clear(container);

    const mealOrder = ['breakfast', 'lunch', 'dinner', 'snack'];

    mealOrder.forEach((mealType) => {
      const section = DOM.create('div', { className: 'meal-section' });
      const meal = mealBreakdown[mealType];
      const cals = meal?.totals?.calories ?? 0;

      const header = DOM.create('div', { className: 'meal-header' });
      const left = DOM.create('div', { className: 'meal-header-left' });
      left.append(
        DOM.create('span', { className: 'meal-name', textContent: MEAL_LABELS[mealType] }),
        DOM.create('span', { className: 'meal-cals', textContent: cals > 0 ? `${cals} ккал` : '' })
      );

      const addBtn = DOM.create('button', {
        className: 'btn-add-meal',
        textContent: '+ Додати',
        onClick: () => this._openAddModal(mealType),
      });

      header.append(left, addBtn);
      section.appendChild(header);

      if (meal?.entries?.length > 0) {
        meal.entries.forEach((entry) => {
          section.appendChild(this._createEntryRow(entry));
        });
      }

      container.appendChild(section);
    });
  }

  _createEntryRow(entry) {
    const row = DOM.create('div', { className: 'entry-row' });
    const name = DOM.create('span', { className: 'entry-name', textContent: entry.foodName });
    const grams = DOM.create('span', { className: 'entry-grams', textContent: `${entry.grams} г` });
    const macros = DOM.create('div', { className: 'entry-macros' });
    macros.append(
      DOM.create('span', { textContent: `${entry.calories} ккал` }),
      DOM.create('span', { textContent: `Б:${entry.protein}г` }),
      DOM.create('span', { textContent: `Ж:${entry.fat}г` }),
      DOM.create('span', { textContent: `В:${entry.carbs}г` })
    );
    const del = DOM.create('button', {
      className: 'btn-delete',
      textContent: '✕',
      onClick: () => {
        this._diary.removeEntry(entry.id);
        this.render();
      },
    });

    row.append(name, grams, macros, del);
    return row;
  }

  _openAddModal(mealType) {
    const overlay = DOM.el('#add-entry-modal');
    DOM.el('#modal-meal-type').value = mealType;
    DOM.el('#entry-grams').value = '';
    DOM.el('#food-search-input').value = '';
    DOM.clear(DOM.el('#food-search-results'));
    this._selectedFoodId = null;
    DOM.el('#selected-food-info').textContent = '';
    DOM.show(overlay);
  }

  bindModalClose() {
    DOM.el('#add-entry-modal').addEventListener('click', (e) => {
      if (e.target === e.currentTarget) DOM.hide(e.currentTarget);
    });
    DOM.el('#cancel-entry-btn').addEventListener('click', () => {
      DOM.hide(DOM.el('#add-entry-modal'));
    });
  }

  bindFoodSearch() {
    DOM.el('#food-search-input').addEventListener('input', (e) => {
      const results = this._foods.search(e.target.value);
      this._renderSearchResults(results);
    });
  }

  _renderSearchResults(foods) {
    const container = DOM.el('#food-search-results');
    DOM.clear(container);
    foods.slice(0, 8).forEach((food) => {
      const item = DOM.create('div', { className: 'food-result-item' });
      item.append(
        DOM.create('span', { className: 'food-result-name', textContent: food.name }),
        DOM.create('span', { className: 'food-result-cal', textContent: `${food.calories} ккал/100г` })
      );
      item.addEventListener('click', () => {
        this._selectedFoodId = food.id;
        DOM.el('#food-search-input').value = food.name;
        DOM.el('#selected-food-info').textContent =
          `Б: ${food.protein}г · Ж: ${food.fat}г · В: ${food.carbs}г на 100г`;
        DOM.clear(container);
      });
      container.appendChild(item);
    });
  }

  bindAddEntry() {
    DOM.el('#confirm-entry-btn').addEventListener('click', () => {
      const grams = DOM.el('#entry-grams').value;
      const mealType = DOM.el('#modal-meal-type').value;
      const result = this._diary.addEntry({ foodId: this._selectedFoodId, grams, mealType });

      if (!result.success) {
        DOM.el('#entry-error').textContent = result.errors.join(', ');
        return;
      }

      DOM.el('#entry-error').textContent = '';
      DOM.hide(DOM.el('#add-entry-modal'));
      this.render();
    });
  }
}
