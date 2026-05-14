import { BaseRepository } from './BaseRepository.js';
import { UserSettings } from '../models/UserSettings.js';

const STORAGE_KEY = 'ct_settings';

export class SettingsRepository extends BaseRepository {
  constructor() {
    super(STORAGE_KEY);
  }

  get() {
    const raw = this._load();
    return new UserSettings(raw ?? {});
  }

  save(settings) {
    this._save(settings.toJSON());
  }

  reset() {
    this._clear();
  }
}
