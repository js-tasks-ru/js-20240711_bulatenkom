import {default as SortableTableV1} from "../../05-dom-document-loading/2-sortable-table-v1/index.js";

export default class SortableTable extends SortableTableV1 {
  #handlers = new Map();

  constructor(headersConfig = [], {
    data = [],
    sorted = {}
  } = {}) {
    super(headersConfig, data);
    this.sort(sorted.id, sorted.order);

    this.addEventListener(this.subElements['header'], 'pointerdown', this.onHeaderClick);
  }

  onHeaderClick(event) {
    const sortableElement = event.target.closest('[data-sortable=true]')
    if (sortableElement) {
      const order = sortableElement.dataset.order === 'asc' ? 'desc' : 'asc';
      const id = sortableElement.dataset.id;
      const arrowElement = this.subElements['arrow'];
      this.sort(id, order);
      sortableElement.append(arrowElement);
    }
  }

  addEventListener(element, eventType, handler) {
    const h = handler.bind(this);
    element.addEventListener(eventType, h)
    this.#handlers.set(h, {
      element,
      eventType
    });
  }

  removeEventListeners() {
    for (const [handler, { element, eventType }] of this.#handlers) {
      element.removeEventListener(eventType, handler);
    }
  }

  destroy() {
    this.removeEventListeners();
    super.destroy();
  }
}
