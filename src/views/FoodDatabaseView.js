import { DOM } from '../utils/DOM.js';

const CATEGORY_LABELS = {
  meat: 'М\'ясо',
  fish: 'Риба',
  dairy: 'Молочне',
  grains: 'Зернові',
  vegetables: 'Овочі',
  fruits: 'Фрукти',
  legumes: 'Бобові',
  fats: 'Жири',
  nuts: 'Горіхи',
  junk: '🍟 Фастфуд',
  sweets: '🍫 Солодощі',
  drinks: '🥤 Напої',
  other: 'Інше',
};

export class FoodDatabaseView {
  constructor(foodController) {
    this._foods = foodController;
  }

  render() {
    this._renderFoodList(this._foods.getAll());
    this._bindSearch();
  }

  _renderFoodList(foods) {
    const container = DOM.el('#food-db-list');
    if (!container) return;
    DOM.clear(container);

    if (foods.length === 0) {
      container.appendChild(this._createEmptyState());
      return;
    }

    foods.forEach((food) => {
      const item = DOM.create('div', { className: 'food-list-item' });

      const info = DOM.create('div', { style: 'flex:1' });
      const name = DOM.create('div', { textContent: food.name, style: 'font-size:0.875rem;margin-bottom:4px' });
      const macros = DOM.create('div', { className: 'food-macros-row' });
      macros.append(
        DOM.create('span', { textContent: `${food.calories} ккал` }),
        DOM.create('span', { textContent: `Б ${food.protein}г` }),
        DOM.create('span', { textContent: `Ж ${food.fat}г` }),
        DOM.create('span', { textContent: `В ${food.carbs}г` })
      );
      info.append(name, macros);

      const badge = DOM.create('span', {
        className: 'food-category-badge',
        textContent: CATEGORY_LABELS[food.category] ?? food.category,
      });

      const del = DOM.create('button', {
        className: 'btn-delete',
        textContent: '✕',
        onClick: () => {
          this._foods.deleteFood(food.id);
          this.render();
        },
      });

      item.append(info, badge, del);
      container.appendChild(item);
    });
  }

  _createEmptyState() {
    const el = DOM.create('div', { className: 'empty-state' });
    el.append(
      DOM.create('div', { className: 'empty-state-icon', textContent: '🥦' }),
      DOM.create('div', { className: 'empty-state-text', textContent: 'Продукти не знайдено' })
    );
    return el;
  }

  _bindSearch() {
    const input = DOM.el('#food-db-search');
    if (!input) return;
    input.addEventListener('input', (e) => {
      const results = this._foods.search(e.target.value);
      this._renderFoodList(results);
    });
  }

  bindAddFood() {
    DOM.el('#add-food-btn')?.addEventListener('click', () => {
      DOM.show(DOM.el('#add-food-modal'));
      DOM.el('#add-food-form').reset();
      DOM.el('#add-food-error').textContent = '';
    });

    DOM.el('#add-food-modal')?.addEventListener('click', (e) => {
      if (e.target === e.currentTarget) DOM.hide(e.currentTarget);
    });

    DOM.el('#cancel-food-btn')?.addEventListener('click', () => {
      DOM.hide(DOM.el('#add-food-modal'));
    });

    DOM.el('#confirm-food-btn')?.addEventListener('click', () => {
      const data = {
        name: DOM.el('#food-name').value,
        calories: DOM.el('#food-calories').value,
        protein: DOM.el('#food-protein').value,
        fat: DOM.el('#food-fat').value,
        carbs: DOM.el('#food-carbs').value,
        category: DOM.el('#food-category').value,
      };

      const result = this._foods.addFood(data);
      if (!result.success) {
        DOM.el('#add-food-error').textContent = result.errors.join('. ');
        return;
      }

      DOM.hide(DOM.el('#add-food-modal'));
      this.render();
    });
  }
}
