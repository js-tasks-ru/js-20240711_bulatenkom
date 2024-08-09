import fetchJson from './utils/fetch-json.js';
import {default as SortableTableV2} from '../../06-events-practice/1-sortable-table-v2/index.js';

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
    this.pageFetcher = new SortableTable.PageFetcher(url, BACKEND_URL, 30, sorted);

    this.addEventListener(document, 'scroll', this.onDocumentScroll);
    this.element.addEventListener('created', this.onCreated.bind(this), { once: true });
    this.element.dispatchEvent(new CustomEvent('created'));
  }

  onDocumentScroll() {
    const bcr = document.documentElement.getBoundingClientRect();
    const clientHeight = document.documentElement.clientHeight;
    const total = bcr.height - clientHeight;
    const progress = scrollY;
    if (progress / total > 0.8 && this.pageFetcher.hasNext()) {
      this.loadNextData();
    }
  }

  onCreated() {
    this.loadNextData();
  }

  loadNextData = throttle(() => {
    return this.pageFetcher.next()
      .then(data => this.data = this.data.concat(data));
  }, 500)

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
    this.pageFetcher = new SortableTable.PageFetcher(this.url, BACKEND_URL, 30, this.sorted);
    this.pageFetcher.next()
      .then(data => this.data = data);
  }

  static PageFetcher = class {
    pageCounter = 0;
    pageSize;
    #hasNext = true;
    sort;
    url;

    constructor(path, baseUrl, pageSize, sort) {
      this.url = new URL(path, baseUrl);
      this.pageSize = pageSize;
      this.sort = sort;
    }

    hasNext() {
      return this.#hasNext;
    }

    next() {
      if (!this.#hasNext) return Promise.resolve([]);

      const page = this.fetch();
      return page
              .then(page => {
                if (page.length < this.pageSize) this.#hasNext = false;
              })
              .then(() => this.pageCounter++)
              .then(() => page);
    }

    fetch() {
      const url = new URL(this.url);
      url.searchParams.set('_sort', this.sort.id);
      url.searchParams.set('_order', this.sort.order);
      url.searchParams.set('_start', this.pageCounter * this.pageSize);
      url.searchParams.set('_end', this.pageCounter * this.pageSize + this.pageSize);
      return fetchJson(url)
    }
  }
}

function throttle(func, ms) {

  let isThrottled = false,
    savedArgs,
    savedThis;

  function wrapper() {

    if (isThrottled) {
      savedArgs = arguments;
      savedThis = this;
      return;
    }

    func.apply(this, arguments);

    isThrottled = true;

    setTimeout(function() {
      isThrottled = false;
      if (savedArgs) {
        wrapper.apply(savedThis, savedArgs);
        savedArgs = savedThis = null;
      }
    }, ms);
  }

  return wrapper;
}