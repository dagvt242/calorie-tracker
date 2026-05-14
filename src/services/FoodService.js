import { Food } from '../models/Food.js';
import { appEvents, EVENTS } from '../patterns/EventEmitter.js';

export class FoodService {
  constructor(foodRepository) {
    this._repo = foodRepository;
  }

  getAll() {
    return this._repo.getAll();
  }

  search(query) {
    if (!query || query.trim() === '') return this._repo.getAll();
    return this._repo.search(query.trim());
  }

  addCustomFood(data) {
    const food = new Food(data);
    this._repo.add(food);
    appEvents.emit(EVENTS.FOOD_DB_UPDATED);
    return food;
  }

  deleteFood(id) {
    this._repo.delete(id);
    appEvents.emit(EVENTS.FOOD_DB_UPDATED);
  }

  getCategories() {
    const foods = this._repo.getAll();
    return [...new Set(foods.map((f) => f.category))];
  }

  getByCategory(category) {
    return this._repo.getAll().filter((f) => f.category === category);
  }
}
