/**
 * EventEmitter implements the Observer pattern.
 * Allows decoupled communication between application layers.
 *
 * Pattern: Observer
 * Used to notify UI components when data changes without tight coupling.
 */
export class EventEmitter {
  constructor() {
    this._listeners = {};
  }

  on(event, listener) {
    if (!this._listeners[event]) {
      this._listeners[event] = [];
    }
    this._listeners[event].push(listener);
    return () => this.off(event, listener);
  }

  off(event, listener) {
    if (!this._listeners[event]) return;
    this._listeners[event] = this._listeners[event].filter((l) => l !== listener);
  }

  emit(event, data) {
    if (!this._listeners[event]) return;
    this._listeners[event].forEach((listener) => listener(data));
  }

  once(event, listener) {
    const unsubscribe = this.on(event, (data) => {
      listener(data);
      unsubscribe();
    });
  }
}

export const appEvents = new EventEmitter();

export const EVENTS = {
  DIARY_UPDATED: 'diary:updated',
  FOOD_DB_UPDATED: 'foodDb:updated',
  SETTINGS_UPDATED: 'settings:updated',
  DATE_CHANGED: 'date:changed',
  VIEW_CHANGED: 'view:changed',
};
