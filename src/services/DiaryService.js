import { DiaryEntry } from '../models/DiaryEntry.js';
import { appEvents, EVENTS } from '../patterns/EventEmitter.js';
import { NutritionCalculator } from './NutritionCalculator.js';

export class DiaryService {
  constructor(diaryRepository, foodRepository) {
    this._diary = diaryRepository;
    this._foods = foodRepository;
    this._calculator = new NutritionCalculator();
  }

  addEntry({ foodId, grams, date, mealType }) {
    const food = this._foods.getById(foodId);
    if (!food) throw new Error(`Food with id "${foodId}" not found`);

    const nutrients = food.getNutrientsFor(grams);
    const entry = new DiaryEntry({
      foodId,
      foodName: food.name,
      grams,
      date,
      mealType,
      ...nutrients,
    });

    this._diary.add(entry);
    appEvents.emit(EVENTS.DIARY_UPDATED, { date });
    return entry;
  }

  removeEntry(id, date) {
    this._diary.delete(id);
    appEvents.emit(EVENTS.DIARY_UPDATED, { date });
  }

  getEntriesForDate(date) {
    return this._diary.getByDate(date);
  }

  getDailyTotals(date) {
    const entries = this._diary.getByDate(date);
    return this._calculator.calculate(entries);
  }

  getWeeklyData(endDate) {
    const days = [];
    const end = new Date(endDate);

    for (let i = 6; i >= 0; i--) {
      const d = new Date(end);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const entries = this._diary.getByDate(dateStr);
      const totals = this._calculator.calculate(entries);
      days.push({ date: dateStr, ...totals });
    }

    return days;
  }

  getMealBreakdown(date) {
    const entries = this._diary.getByDate(date);
    const meals = {};

    entries.forEach((entry) => {
      if (!meals[entry.mealType]) {
        meals[entry.mealType] = { entries: [], totals: { calories: 0, protein: 0, fat: 0, carbs: 0 } };
      }
      meals[entry.mealType].entries.push(entry);
      meals[entry.mealType].totals.calories += entry.calories;
      meals[entry.mealType].totals.protein += entry.protein;
      meals[entry.mealType].totals.fat += entry.fat;
      meals[entry.mealType].totals.carbs += entry.carbs;
    });

    return meals;
  }
}
