import { DOM } from '../utils/DOM.js';
import { appEvents, EVENTS } from '../patterns/EventEmitter.js';

export class Router {
  constructor(views) {
    this._views = views;
    this._current = null;
  }

  init() {
    DOM.els('.nav-item[data-view]').forEach((item) => {
      item.addEventListener('click', () => this.navigate(item.dataset.view));
    });
    this.navigate('diary');
  }

  navigate(viewName) {
    DOM.els('.view').forEach((v) => v.classList.remove('active'));
    DOM.els('.nav-item').forEach((n) => n.classList.remove('active'));

    const viewEl = DOM.el(`#view-${viewName}`);
    const navEl = DOM.el(`.nav-item[data-view="${viewName}"]`);

    if (viewEl) viewEl.classList.add('active');
    if (navEl) navEl.classList.add('active');

    this._current = viewName;
    appEvents.emit(EVENTS.VIEW_CHANGED, { view: viewName });

    if (viewName === 'diary' && this._views.diary) this._views.diary.render();
    if (viewName === 'foods' && this._views.foods) this._views.foods.render();
    if (viewName === 'settings' && this._views.settings) this._views.settings.render();
    if (viewName === 'stats' && this._views.stats) this._views.stats.render();
  }
}
