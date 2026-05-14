/**
 * ExportService provides functionality for exporting diary data.
 * Implements CSV export strategy for user data portability.
 *
 * Principle: SRP — only responsible for data export formatting.
 */
export class ExportService {
  constructor(diaryRepository) {
    this._diary = diaryRepository;
  }

  exportToCsv(startDate, endDate) {
    const entries = this._diary.getDateRange(startDate, endDate);
    const header = ['Дата', 'Прийом їжі', 'Продукт', 'Вага (г)', 'Калорії', 'Білки (г)', 'Жири (г)', 'Вуглеводи (г)'];
    const MEAL_LABELS = { breakfast: 'Сніданок', lunch: 'Обід', dinner: 'Вечеря', snack: 'Перекус' };

    const rows = entries.map((e) => [
      e.date,
      MEAL_LABELS[e.mealType] ?? e.mealType,
      `"${e.foodName}"`,
      e.grams,
      e.calories,
      e.protein,
      e.fat,
      e.carbs,
    ]);

    const csvContent = [header, ...rows].map((row) => row.join(',')).join('\n');
    return csvContent;
  }

  downloadCsv(csvContent, filename) {
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  exportWeek(endDate) {
    const startDate = this._getStartOfWeek(endDate);
    const csv = this.exportToCsv(startDate, endDate);
    this.downloadCsv(csv, `calorie-tracker-${startDate}-${endDate}.csv`);
  }

  _getStartOfWeek(endDate) {
    const d = new Date(endDate + 'T00:00:00');
    d.setDate(d.getDate() - 6);
    return d.toISOString().split('T')[0];
  }
}
