export const DateUtils = {
  today() {
    return new Date().toISOString().split('T')[0];
  },

  format(dateStr, locale = 'uk-UA') {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' });
  },

  formatShort(dateStr, locale = 'uk-UA') {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString(locale, { day: 'numeric', month: 'short' });
  },

  addDays(dateStr, days) {
    const d = new Date(dateStr + 'T00:00:00');
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
  },

  isToday(dateStr) {
    return dateStr === DateUtils.today();
  },

  getWeekdayShort(dateStr, locale = 'uk-UA') {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString(locale, { weekday: 'short' });
  },
};
