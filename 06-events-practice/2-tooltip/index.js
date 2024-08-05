class Tooltip {
  #handlers = new Map();
  element;

  constructor() {
    if (Tooltip.prototype.instance) {
      return Tooltip.prototype.instance;
    }
    Tooltip.prototype.instance = this;
  }

  initialize () {
    this.addEventListener(document, 'pointerover', this.onPointerOver);
    this.addEventListener(document, 'pointerout', this.onPointerOut);
    this.addEventListener(document, 'pointermove', this.onPointerMove);
  }

  addEventListener(element, eventType, handler) {
    const h = handler.bind(this);
    element.addEventListener(eventType, h)
    this.#handlers.set(h, {
      element,
      eventType
    });
  }

  onPointerOver(event) {
    const tooltipElement = event.target.closest('[data-tooltip]')
    if (tooltipElement) {
      this.render(tooltipElement.dataset.tooltip)
    }
  }

  onPointerOut() {
    if (this.element) {
      this.element.remove()
    };
  }

  onPointerMove(event) {
    this.element.style.left = 10 + event.clientX + 'px';
    this.element.style.top = 10 + event.clientY + 'px';
  }

  render(text) {
    this.element = this.createElement();
    this.element.textContent = text;
    document.body.append(this.element);
  }

  createElement() {
    const element = document.createElement('div');
    element.classList.add('tooltip');
    return element;
  }

  removeEventListeners() {
    for (const [handler, { element, eventType }] of this.#handlers) {
      element.removeEventListener(eventType, handler);
    }
  }

  destroy() {
    this.removeEventListeners();
    this.element.remove();
  }
}

export default Tooltip;
