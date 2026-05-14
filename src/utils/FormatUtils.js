/**
 * FormatUtils provides pure formatting functions for display values.
 * No side effects — safe to use anywhere.
 *
 * Principle: SRP — formatting only, no business logic.
 * Refactoring: Extract Method — moved formatting out of view classes.
 */
export const FormatUtils = {
  /**
   * Format a number to a fixed decimal count, trimming trailing zeros.
   */
  nutrient(value, decimals = 1) {
    const n = Number(value);
    if (isNaN(n)) return '0';
    return parseFloat(n.toFixed(decimals)).toString();
  },

  /**
   * Format calories as a rounded integer string.
   */
  calories(value) {
    return Math.round(Number(value)).toString();
  },

  /**
   * Format grams with unit label.
   */
  grams(value) {
    return `${Math.round(Number(value))} г`;
  },

  /**
   * Clamp a percentage to 0–100 range.
   */
  percentage(value, total) {
    if (!total || total === 0) return 0;
    return Math.min(100, Math.max(0, Math.round((value / total) * 100)));
  },

  /**
   * Return a readable calorie deficit/surplus string.
   */
  balance(consumed, goal) {
    const diff = goal - consumed;
    if (diff > 0) return `залишилось ${diff} ккал`;
    if (diff < 0) return `перевищення на ${Math.abs(diff)} ккал`;
    return 'норма виконана';
  },

  /**
   * Capitalise the first letter of a string.
   */
  capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  },
};
