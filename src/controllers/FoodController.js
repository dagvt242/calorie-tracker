import { Validator } from '../utils/Validator.js';

export class FoodController {
  constructor(foodService) {
    this._foods = foodService;
  }

  search(query) {
    return this._foods.search(query);
  }

  getAll() {
    return this._foods.getAll();
  }

  addFood(formData) {
    const errors = Validator.validateFoodForm(formData);
    if (errors.length > 0) return { success: false, errors };

    const food = this._foods.addCustomFood(formData);
    return { success: true, food };
  }

  deleteFood(id) {
    this._foods.deleteFood(id);
    return { success: true };
  }

  getCategories() {
    return this._foods.getCategories();
  }
}
