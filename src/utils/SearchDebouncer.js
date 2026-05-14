/**
 * SearchDebouncer wraps any search callback with a debounce delay.
 * Prevents excessive function calls during rapid user input.
 *
 * Refactoring technique: Extract Class — pulled out from DiaryView
 * to keep view classes lean and reuse debounce logic.
 *
 * Principle: DRY — single reusable implementation for all search inputs.
 */
export class SearchDebouncer {
  constructor(callback, delay = 250) {
    this._callback = callback;
    this._delay = delay;
    this._timer = null;
  }

  call(value) {
    if (this._timer) clearTimeout(this._timer);
    this._timer = setTimeout(() => {
      this._callback(value);
      this._timer = null;
    }, this._delay);
  }

  cancel() {
    if (this._timer) {
      clearTimeout(this._timer);
      this._timer = null;
    }
  }
}
