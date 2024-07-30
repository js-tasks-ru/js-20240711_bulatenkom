export default class SortableTable {
  element;
  subElements = [];
  #data;

  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig;
    this.data = data;
  }

  get data() {
    return this.#data;
  }

  set data(value) {
    this.#data = value;

    this.element = this.createElement(this.createTemplate(this.headerConfig, this.data));
    this.selectSubElements();
  }
  
  createElement(template) {
    const element = document.createElement('div');
    element.innerHTML = template;
    return element.firstElementChild;
  }

  createTemplate(headerConfig, data) {
    return `
      <div class="sortable-table">
        ${this.createHeaderTemplate(headerConfig)}
        ${this.createBodyTemplate(data)}
      </div>
    `;
  }

  createHeaderTemplate(headerConfig) {
    const columnsTemplate = headerConfig.map(item =>  `
      <div class="sortable-table__cell" data-id=${item.id} data-sortable="${item.sortable}">
        <span>${item.title}</span>
      </div>
    `).join('');

    return `
      <div data-element="header" class="sortable-table__header sortable-table__row">
        ${columnsTemplate}
      </div>
    `;
  }

  createBodyTemplate(data) {
    const rows = data.map(item => this.createRowTemplate(item));

    return `
      <div data-element="body" class="sortable-table__body">
        ${rows.join('')}
      </div>
    `;
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