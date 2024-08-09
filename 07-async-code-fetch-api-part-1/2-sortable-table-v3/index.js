import {default as SortableTableV2} from '../../06-events-practice/1-sortable-table-v2/index.js';
import throttle from './utils/throttle.js';
import PageFetcher from './utils/page-fetcher.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class SortableTable extends SortableTableV2 {
  isSortLocally;
  url;
  pageFetcher;

  constructor(headersConfig, {
    url,
    isSortLocally = false,
    sorted = {
      id: headersConfig.find(item => item.sortable).id,
      order: 'asc'
    },
  } = {}) {
    super(headersConfig, { 
      data: [] 
    });
    this.isSortLocally = isSortLocally;
    this.url = url;
    this.sorted = sorted;
    this.pageFetcher = new PageFetcher(url, BACKEND_URL, 30, sorted);

    this.addEventListener(document, 'scroll', throttle(this.onDocumentScroll.bind(this), 500));
    this.render();
  }

  onDocumentScroll() {
    const bcr = document.documentElement.getBoundingClientRect();
    const clientHeight = document.documentElement.clientHeight;
    const total = bcr.height - clientHeight;
    const progress = scrollY;
    if (progress / total > 0.8 && this.pageFetcher.hasNext()) {
      this.render();
    }
  }

  // actual rendering of table data and headers happens on {this.data} mutation (see SortableTableV1)
  render() {
    this.showLoader();
    return this.loadNextData()
      .then(this.updateView.bind(this))
      .then(this.hideLoader.bind(this));
  }

  loadNextData() {
    return this.pageFetcher.next()
            .then(data => this.data = this.data.concat(data));
  }

  showLoader() {
    this.element.classList.add('sortable-table_loading');
  }

  updateView() {
    this.data.length === 0 ? this.element.classList.add("sortable-table_empty") : this.element.classList.remove("sortable-table_empty");
  }

  hideLoader() {
    this.element.classList.remove('sortable-table_loading');
  }

  sort(id, order) {
    if (this.isSortLocally) {
      this.sortOnClient(id, order);
    } else {
      this.sortOnServer(id, order);
    }
  }

  sortOnClient(id, order) {
    super.sort(id, order);
  }

  sortOnServer(id, order) {
    this.sorted = { id, order };
    this.pageFetcher = new PageFetcher(this.url, BACKEND_URL, 30, this.sorted);
    this.pageFetcher.next()
      .then(data => this.data = data);
  }

  createTemplate(headerConfig, data, sorted) {
    return `
      <div class="sortable-table">
        ${this.createHeaderTemplate(headerConfig, sorted)}
        ${this.createBodyTemplate(data)}
        ${this.createLoaderTemplate()}
        ${this.createEmptyPlaceHolderTemplate()}
      </div>
    `;
  }

  createLoaderTemplate() {
    return `
      <div data-elem="loading" class="loading-line sortable-table__loading-line"></div>
    `;
  }

  createEmptyPlaceHolderTemplate() {
    return `
      <div data-elem="emptyPlaceholder" class="sortable-table__empty-placeholder"><div>Нет данных</div></div>
    `;
  }
}