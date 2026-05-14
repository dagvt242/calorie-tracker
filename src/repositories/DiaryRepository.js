import { BaseRepository } from './BaseRepository.js';
import { DiaryEntry } from '../models/DiaryEntry.js';

const STORAGE_KEY = 'ct_diary';

export class DiaryRepository extends BaseRepository {
  constructor() {
    super(STORAGE_KEY);
  }

  getAll() {
    const raw = this._load() ?? [];
    return raw.map((item) => new DiaryEntry(item));
  }

  getByDate(date) {
    return this.getAll().filter((e) => e.date === date);
  }

  getDateRange(startDate, endDate) {
    return this.getAll().filter((e) => e.date >= startDate && e.date <= endDate);
  }

  add(entry) {
    const all = this._load() ?? [];
    all.push(entry.toJSON());
    this._save(all);
  }

  delete(id) {
    const all = this._load() ?? [];
    this._save(all.filter((e) => e.id !== id));
  }

  deleteByDate(date) {
    const all = this._load() ?? [];
    this._save(all.filter((e) => e.date !== date));
  }
}
