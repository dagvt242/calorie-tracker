/**
 * UserSettings model storing user's daily goals and preferences
 */
export class UserSettings {
  constructor({
    dailyCalorieGoal = 2000,
    dailyProteinGoal = 150,
    dailyFatGoal = 65,
    dailyCarbsGoal = 250,
    theme = 'dark',
  } = {}) {
    this.dailyCalorieGoal = Number(dailyCalorieGoal);
    this.dailyProteinGoal = Number(dailyProteinGoal);
    this.dailyFatGoal = Number(dailyFatGoal);
    this.dailyCarbsGoal = Number(dailyCarbsGoal);
    this.theme = theme;
  }

  toJSON() {
    return {
      dailyCalorieGoal: this.dailyCalorieGoal,
      dailyProteinGoal: this.dailyProteinGoal,
      dailyFatGoal: this.dailyFatGoal,
      dailyCarbsGoal: this.dailyCarbsGoal,
      theme: this.theme,
    };
  }
}
