import { BaseRepository } from './BaseRepository.js';
import { Food } from '../models/Food.js';
import { defaultFoods } from '../data/defaultFoods.js';

const STORAGE_KEY = 'ct_foods';

export class FoodRepository extends BaseRepository {
  constructor() {
    super(STORAGE_KEY);
    this._ensureDefaults();
  }

  _ensureDefaults() {
    if (!this._load()) {
      this._save(defaultFoods);
    }
  }

  getAll() {
    const raw = this._load() ?? [];
    return raw.map((item) => new Food(item));
  }

  getById(id) {
    return this.getAll().find((f) => f.id === id) ?? null;
  }

  search(query) {
    const lower = query.toLowerCase();
    return this.getAll().filter((f) => f.name.toLowerCase().includes(lower));
  }

  add(food) {
    const all = this._load() ?? [];
    all.push(food.toJSON());
    this._save(all);
  }

  update(food) {
    const all = this._load() ?? [];
    const index = all.findIndex((f) => f.id === food.id);
    if (index === -1) return false;
    all[index] = food.toJSON();
    this._save(all);
    return true;
  }

  delete(id) {
    const all = this._load() ?? [];
    const filtered = all.filter((f) => f.id !== id);
    this._save(filtered);
  }
}
