/**
 * Food model representing a food item with nutritional information
 */
export class Food {
  constructor({ id, name, calories, protein, fat, carbs, category }) {
    this.id = id ?? crypto.randomUUID();
    this.name = name;
    this.calories = Number(calories);
    this.protein = Number(protein);
    this.fat = Number(fat);
    this.carbs = Number(carbs);
    this.category = category ?? 'other';
  }

  getNutrientsFor(grams) {
    const ratio = grams / 100;
    return {
      calories: Math.round(this.calories * ratio),
      protein: Math.round(this.protein * ratio * 10) / 10,
      fat: Math.round(this.fat * ratio * 10) / 10,
      carbs: Math.round(this.carbs * ratio * 10) / 10,
    };
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      calories: this.calories,
      protein: this.protein,
      fat: this.fat,
      carbs: this.carbs,
      category: this.category,
    };
  }
}
