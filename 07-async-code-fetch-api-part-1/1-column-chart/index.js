import fetchJson from './utils/fetch-json.js';
import {default as ColumnChartV1} from '../../04-oop-basic-intro-to-dom/1-column-chart/index.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ColumnChart extends ColumnChartV1 {
    url;
    subElements = [];

    constructor({
        url,
        range: { from = new Date(), to = new Date() } = {},
        label,
        link,
        formatHeading
    } = {}) {
        super({
            data: [],
            label,
            link,
            formatHeading
        });
        this.url = url;
        this.selectSubElements();
        this.update(from, to);
    }

    selectSubElements() {
        this.element.querySelectorAll('[data-element]').forEach(element => {
            this.subElements[element.dataset.element] = element;
        });
    }

    update(from, to) {
        this.root.classList.toggle('column-chart_loading', true);
        const fetchedData = this.fetchData(from, to);

        return fetchedData
                .then(data => Object.entries(data).sort().map(([k, v]) => v))
                .then(super.update.bind(this))
                .then(() => this.selectSubElements())
                .then(() => this.root.classList.remove('column-chart_loading'))
                .then(() => fetchedData);
    }

    fetchData(from, to) {
        const url = new URL(this.url, BACKEND_URL);
        url.searchParams.set('from', from);
        url.searchParams.set('to', to);

        return fetchJson(url);
    }
}
