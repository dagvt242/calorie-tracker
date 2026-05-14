/**
 * NotificationService displays toast-style UI notifications.
 * Decoupled from views — any module can trigger a notification via EventEmitter.
 *
 * Principle: SRP — only responsible for notification rendering.
 */
export class NotificationService {
  constructor() {
    this._container = null;
    this._init();
  }

  _init() {
    this._container = document.createElement('div');
    Object.assign(this._container.style, {
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      zIndex: '9999',
      pointerEvents: 'none',
    });
    document.body.appendChild(this._container);
  }

  show(message, type = 'info', duration = 3000) {
    const colors = {
      success: { bg: 'rgba(124,252,159,0.12)', border: 'rgba(124,252,159,0.4)', color: '#7cfc9f' },
      error: { bg: 'rgba(255,107,107,0.12)', border: 'rgba(255,107,107,0.4)', color: '#ff6b6b' },
      info: { bg: 'rgba(116,185,255,0.12)', border: 'rgba(116,185,255,0.4)', color: '#74b9ff' },
    };

    const { bg, border, color } = colors[type] ?? colors.info;

    const toast = document.createElement('div');
    Object.assign(toast.style, {
      background: bg,
      border: `1px solid ${border}`,
      color,
      padding: '10px 16px',
      borderRadius: '8px',
      fontSize: '0.8rem',
      fontFamily: 'var(--font-body)',
      backdropFilter: 'blur(8px)',
      animation: 'slideInToast 0.2s ease',
      pointerEvents: 'auto',
    });

    toast.textContent = message;
    this._container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  success(message) { this.show(message, 'success'); }
  error(message) { this.show(message, 'error'); }
  info(message) { this.show(message, 'info'); }
}

export const notifications = new NotificationService();
