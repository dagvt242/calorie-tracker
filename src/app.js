/**
 * app.js — Composition Root
 * Wires up all dependencies and bootstraps the application.
 * All dependency injection happens here (Single Responsibility + Dependency Inversion).
 */
import { FoodRepository } from './repositories/FoodRepository.js';
import { DiaryRepository } from './repositories/DiaryRepository.js';
import { SettingsRepository } from './repositories/SettingsRepository.js';

import { FoodService } from './services/FoodService.js';
import { DiaryService } from './services/DiaryService.js';
import { SettingsService } from './services/SettingsService.js';

import { DiaryController } from './controllers/DiaryController.js';
import { FoodController } from './controllers/FoodController.js';
import { SettingsController } from './controllers/SettingsController.js';

import { DiaryView } from './views/DiaryView.js';
import { FoodDatabaseView } from './views/FoodDatabaseView.js';
import { SettingsView } from './views/SettingsView.js';
import { Router } from './views/Router.js';

import { StatsView } from './views/StatsView.js';
import { ExportService } from './services/ExportService.js';
import { GoalChecker } from './services/GoalChecker.js';
import { ThemeService } from './services/ThemeService.js';
import { notifications } from './services/NotificationService.js';
import { DateUtils } from './utils/DateUtils.js';
import { DOM } from './utils/DOM.js';

function bootstrap() {
  // Repositories
  const foodRepo = new FoodRepository();
  const diaryRepo = new DiaryRepository();
  const settingsRepo = new SettingsRepository();

  // Services
  const foodService = new FoodService(foodRepo);
  const diaryService = new DiaryService(diaryRepo, foodRepo);
  const settingsService = new SettingsService(settingsRepo);

  // Controllers
  const diaryCtrl = new DiaryController(diaryService, settingsService);
  const foodCtrl = new FoodController(foodService);
  const settingsCtrl = new SettingsController(settingsService);

  // Views
  const diaryView = new DiaryView(diaryCtrl, foodCtrl);
  const foodDbView = new FoodDatabaseView(foodCtrl);
  const settingsView = new SettingsView(settingsCtrl);

  const statsView = new StatsView(diaryCtrl, settingsCtrl);

  // Bind UI interactions
  diaryView.bindModalClose();
  diaryView.bindFoodSearch();
  diaryView.bindAddEntry();
  foodDbView.bindAddFood();
  settingsView.bindSave();

  // Date navigation
  DOM.el('#prev-day')?.addEventListener('click', () => {
    diaryCtrl.navigateDay(-1);
    updateDateDisplay(diaryCtrl.getCurrentDate());
    diaryView.render();
  });

  DOM.el('#next-day')?.addEventListener('click', () => {
    diaryCtrl.navigateDay(1);
    updateDateDisplay(diaryCtrl.getCurrentDate());
    diaryView.render();
  });

  function updateDateDisplay(date) {
    const el = DOM.el('#current-date-display');
    if (!el) return;
    el.textContent = DateUtils.format(date);
    DOM.toggle(el, true);
    if (DateUtils.isToday(date)) el.classList.add('today-badge');
    else el.classList.remove('today-badge');
  }

  updateDateDisplay(diaryCtrl.getCurrentDate());

  // Additional services
  const exportService = new ExportService(diaryRepo);
  const goalChecker = new GoalChecker(diaryService, settingsService);
  const themeService = new ThemeService(settingsService);
  goalChecker.start();
  themeService.applyFromSettings();

  // Export button
  DOM.el('#export-week-btn')?.addEventListener('click', () => {
    exportService.exportWeek(diaryCtrl.getCurrentDate());
    notifications.success('📁 Дані експортовано до CSV');
  });

  // Router
  const router = new Router({ diary: diaryView, foods: foodDbView, settings: settingsView, stats: statsView });
  router.init();
}

document.addEventListener('DOMContentLoaded', bootstrap);
