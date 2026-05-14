/**
 * DiaryEntry model representing a single meal log entry
 */
export class DiaryEntry {
  constructor({ id, foodId, foodName, grams, calories, protein, fat, carbs, date, mealType }) {
    this.id = id ?? crypto.randomUUID();
    this.foodId = foodId;
    this.foodName = foodName;
    this.grams = Number(grams);
    this.calories = Number(calories);
    this.protein = Number(protein);
    this.fat = Number(fat);
    this.carbs = Number(carbs);
    this.date = date ?? new Date().toISOString().split('T')[0];
    this.mealType = mealType ?? 'breakfast';
  }

  toJSON() {
    return {
      id: this.id,
      foodId: this.foodId,
      foodName: this.foodName,
      grams: this.grams,
      calories: this.calories,
      protein: this.protein,
      fat: this.fat,
      carbs: this.carbs,
      date: this.date,
      mealType: this.mealType,
    };
  }
}
