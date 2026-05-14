export const DOM = {
  el(selector, parent = document) {
    return parent.querySelector(selector);
  },

  els(selector, parent = document) {
    return [...parent.querySelectorAll(selector)];
  },

  create(tag, attrs = {}, children = []) {
    const el = document.createElement(tag);
    Object.entries(attrs).forEach(([key, val]) => {
      if (key === 'className') el.className = val;
      else if (key === 'innerHTML') el.innerHTML = val;
      else if (key === 'textContent') el.textContent = val;
      else if (key.startsWith('on')) el.addEventListener(key.slice(2).toLowerCase(), val);
      else el.setAttribute(key, val);
    });
    children.forEach((child) => {
      if (typeof child === 'string') el.appendChild(document.createTextNode(child));
      else if (child) el.appendChild(child);
    });
    return el;
  },

  clear(el) {
    while (el.firstChild) el.removeChild(el.firstChild);
  },

  show(el) {
    el.style.display = '';
    el.classList.remove('hidden');
  },

  hide(el) {
    el.classList.add('hidden');
  },

  toggle(el, condition) {
    condition ? DOM.show(el) : DOM.hide(el);
  },
};
