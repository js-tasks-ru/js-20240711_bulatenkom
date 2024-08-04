import {default as SortableTableV1} from "../../05-dom-document-loading/2-sortable-table-v1/index.js";

export default class SortableTable extends SortableTableV1 {
  constructor(headersConfig = [], {
    data = [],
    sorted = {}
  } = {}) {
    super(headersConfig, data);
    this.sort(sorted.id, sorted.order);

    this.subElements['header'].addEventListener('pointerdown', this.onHeaderClick.bind(this));
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
}
