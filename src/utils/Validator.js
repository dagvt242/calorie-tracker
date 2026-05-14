export const Validator = {
  isPositiveNumber(value) {
    const n = Number(value);
    return !isNaN(n) && n > 0;
  },

  isNonEmptyString(value) {
    return typeof value === 'string' && value.trim().length > 0;
  },

  validateFoodForm(data) {
    const errors = [];
    if (!Validator.isNonEmptyString(data.name)) errors.push('Назва продукту обовʼязкова');
    if (!Validator.isPositiveNumber(data.calories)) errors.push('Калорії мають бути > 0');
    if (isNaN(Number(data.protein)) || Number(data.protein) < 0) errors.push('Білки некоректні');
    if (isNaN(Number(data.fat)) || Number(data.fat) < 0) errors.push('Жири некоректні');
    if (isNaN(Number(data.carbs)) || Number(data.carbs) < 0) errors.push('Вуглеводи некоректні');
    return errors;
  },

  validateEntryForm(data) {
    const errors = [];
    if (!data.foodId) errors.push('Оберіть продукт');
    if (!Validator.isPositiveNumber(data.grams)) errors.push('Вага має бути > 0');
    return errors;
  },

  validateSettingsForm(data) {
    const errors = [];
    const fields = ['dailyCalorieGoal', 'dailyProteinGoal', 'dailyFatGoal', 'dailyCarbsGoal'];
    fields.forEach((field) => {
      if (!Validator.isPositiveNumber(data[field])) errors.push(`Поле ${field} має бути > 0`);
    });
    return errors;
  },
};
