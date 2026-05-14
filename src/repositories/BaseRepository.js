/**
 * BaseRepository provides a generic interface for localStorage persistence.
 *
 * Pattern: Repository
 * Abstracts data access logic so the rest of the app doesn't care
 * about HOW data is stored — only WHAT operations are available.
 */
export class BaseRepository {
  constructor(storageKey) {
    this._storageKey = storageKey;
  }

  _load() {
    try {
      const raw = localStorage.getItem(this._storageKey);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  _save(data) {
    localStorage.setItem(this._storageKey, JSON.stringify(data));
  }

  _clear() {
    localStorage.removeItem(this._storageKey);
  }
}
