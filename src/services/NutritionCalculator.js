/**
 * NutritionCalculator provides interchangeable strategies for
 * computing daily nutrition summaries and progress.
 *
 * Pattern: Strategy
 * Each calculation method is a separate strategy that can be
 * swapped independently of the rest of the system.
 */

export class SumStrategy {
  calculate(entries) {
    return entries.reduce(
      (acc, e) => ({
        calories: acc.calories + e.calories,
        protein: acc.protein + e.protein,
        fat: acc.fat + e.fat,
        carbs: acc.carbs + e.carbs,
      }),
      { calories: 0, protein: 0, fat: 0, carbs: 0 }
    );
  }
}

export class AverageStrategy {
  calculate(entries) {
    if (entries.length === 0) return { calories: 0, protein: 0, fat: 0, carbs: 0 };
    const sum = new SumStrategy().calculate(entries);
    return {
      calories: Math.round(sum.calories / entries.length),
      protein: Math.round(sum.protein / entries.length * 10) / 10,
      fat: Math.round(sum.fat / entries.length * 10) / 10,
      carbs: Math.round(sum.carbs / entries.length * 10) / 10,
    };
  }
}

export class NutritionCalculator {
  constructor(strategy = new SumStrategy()) {
    this._strategy = strategy;
  }

  setStrategy(strategy) {
    this._strategy = strategy;
  }

  calculate(entries) {
    return this._strategy.calculate(entries);
  }

  getProgress(totals, goals) {
    return {
      calories: Math.min(100, Math.round((totals.calories / goals.dailyCalorieGoal) * 100)),
      protein: Math.min(100, Math.round((totals.protein / goals.dailyProteinGoal) * 100)),
      fat: Math.min(100, Math.round((totals.fat / goals.dailyFatGoal) * 100)),
      carbs: Math.min(100, Math.round((totals.carbs / goals.dailyCarbsGoal) * 100)),
    };
  }
}
