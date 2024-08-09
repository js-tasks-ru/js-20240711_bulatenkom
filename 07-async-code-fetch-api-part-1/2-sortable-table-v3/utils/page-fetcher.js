import fetchJson from "./fetch-json.js";

export default class PageFetcher {
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

	  return this.fetch()
				.then(page => {
				  if (page.length < this.pageSize) {
					  this.#hasNext = false;
				  }
				  this.pageCounter++;
				  return page;
				});
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