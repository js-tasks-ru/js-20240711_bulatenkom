export default class SortableTable {
  element;
  subElements = [];
  #data;
  #sorted = {};

  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig;
    this.#data = data;

    this.element = this.createElement(this.createTemplate(this.headerConfig, this.data, this.sorted));
    this.selectSubElements();
  }

  get data() {
    return this.#data;
  }

  set data(value) {
    this.#data = value;
    this.render();
  }

  get sorted() {
    return this.#sorted;
  }

  set sorted({ id, order }) {
    this.#sorted = { id, order };
    this.render();
  }

  render() {
    this.subElements['header'].innerHTML = this.createHeaderColumnsTemplate(this.headerConfig, this.sorted);
    this.subElements['body'].innerHTML = this.createBodyRowsTemplate(this.data);
    this.selectSubElements();
  }
  
  createElement(template) {
    const element = document.createElement('div');
    element.innerHTML = template;
    return element.firstElementChild;
  }

  createTemplate(headerConfig, data, sorted) {
    return `
      <div class="sortable-table">
        ${this.createHeaderTemplate(headerConfig, sorted)}
        ${this.createBodyTemplate(data)}
      </div>
    `;
  }

  createHeaderTemplate(headerConfig, sorted) {
    return `
      <div data-element="header" class="sortable-table__header sortable-table__row">
        ${this.createHeaderColumnsTemplate(headerConfig, sorted)}
      </div>
    `;
  }

  createHeaderColumnsTemplate(headerConfig, sorted) {
    return headerConfig.map(item =>  `
      <div class="sortable-table__cell" data-id=${item.id} data-sortable="${item.sortable}" data-order='${sorted.order ?? ''}'>
        <span>${item.title}</span>
        ${ (item.id === sorted.id) ? this.createArrowTemplate() : ''}
      </div>
    `).join('');
  }

  createArrowTemplate() {
    return `
      <span data-element="arrow" class="sortable-table__sort-arrow">
        <span class="sort-arrow"></span>
      </span>
    `;
  }

  createBodyTemplate(data) {
    return `
      <div data-element="body" class="sortable-table__body">
        ${this.createBodyRowsTemplate(data)}
      </div>
    `;
  }

  createBodyRowsTemplate(data) {
    return data
      .map(item => this.createRowTemplate(item))
      .join('');
  }

  createRowTemplate(item) {
    const columnsTemplate = this.headerConfig
      .map(header => (header.template) ? header.template(item) : `<div class="sortable-table__cell">${item[header.id]}</div>`)
      .join('');

    return `
      <a href="#" class="sortable-table__row">
        ${columnsTemplate}
      </a>
    `;
  }

  sort(field, order) {
    const sortType = this.headerConfig.find(item => item.id === field).sortType;
    this.data = sort(this.data, (v) => v[field], sortType, order);
    this.sorted = { id: field, order: order }
  }

  selectSubElements() {
    this.element.querySelectorAll('[data-element]').forEach(element => {
      this.subElements[element.dataset.element] = element;
    });
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}

function sort(arr, extractValue = (v) => v, sortType = 'string', order = 'asc') {
  const copy = [...arr];

  switch (`${sortType} ${order}`) {
      case 'string asc': copy.sort((a, b) => extractValue(a).localeCompare(extractValue(b), ['ru', 'en'], { caseFirst: "upper" }));
          break;
      case 'string desc': copy.sort((a, b) => extractValue(b).localeCompare(extractValue(a), ['ru', 'en'], { caseFirst: "upper" }));
          break;
      case 'number asc': copy.sort((a, b) => extractValue(a) - extractValue(b));
          break;
      case 'number desc': copy.sort((a, b) => extractValue(b) - extractValue(a));
          break;
      default:
          throw new Error(`${sortType} + ${order} is not supported.`);
  }
  return copy;
}