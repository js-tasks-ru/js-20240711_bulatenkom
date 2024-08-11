export default class ColumnChart {

    constructor(props = {}) {
        this.data = props.data || [];
        this.label = props.label || '';
        this.link = props.link;
        this.value = props.value;
        this.formatHeading = props.formatHeading;
        this.chartHeight = 50;

        this.element = this.generateComponentAsHTML();
    }

    update(newData) {
        this.data = newData;
        this.updateBodyElement();
    }

    updateBodyElement() {
        const body = this.chart.querySelector('[data-element=body]');
        body.innerHTML = this.createChartBodyColumnsTemplate();
    }

    createChartElement() {
        const template = document.createElement('template');
        template.insertAdjacentHTML('afterbegin', `
        <div class="column-chart__container">
            ${this.createChartHeaderElement().outerHTML}
            ${this.createChartBodyElement().outerHTML}
        </div>`);
        return template.firstElementChild;
    }

    createChartHeaderElement() {
        const value = (this.formatHeading) ? this.formatHeading(this.value) : this.value;

        const template = document.createElement('template');
        template.insertAdjacentHTML('afterbegin', `<div data-element="header" class="column-chart__header">${value}</div>`);
        return template.firstElementChild;        
    }

    createChartBodyElement() {
        const template = document.createElement('template');
        template.insertAdjacentHTML('afterbegin', `<div data-element="body" class="column-chart__chart"></div>`);
        const body = template.firstElementChild;
            
        body.insertAdjacentHTML('afterbegin', this.createChartBodyColumnsTemplate());

        return body; 
    }

    createChartBodyColumnsTemplate() {
        return this.getColumnProps(this.data)
            .map(({value, percent}) => `<div style="--value: ${value}" data-tooltip="${percent}"></div>`)
            .join('');
    }

    createTitleElement() {
        const template = document.createElement('template');
        template.insertAdjacentHTML('afterbegin', `<div class="column-chart__title">${this.label}</div>`);
        if (this.link) {
            template.firstElementChild.insertAdjacentHTML('beforeend', `<a href="${this.link}" class="column-chart__link">View all</a>`);
        }
        return template.firstElementChild;
    }

    createRootElement() {
        let customClasses = '';
        if (!this.data || this.data.length === 0) customClasses += 'column-chart_loading';

        const template = document.createElement('template');
        template.insertAdjacentHTML('afterbegin', `<div class="column-chart ${customClasses}" style="--chart-height: 50"></div>`);
        return template.firstElementChild;
    }

    generateComponentAsHTML() {
        this.root = this.createRootElement();
        const title = this.createTitleElement();
        this.chart = this.createChartElement();

        this.root.append(title, this.chart);
        return this.root;
    }

    getColumnProps(data) {
        const maxValue = Math.max(...data);
        const scale = 50 / maxValue;
      
        return data.map(item => {
          return {
            percent: (item / maxValue * 100).toFixed(0) + '%',
            value: String(Math.floor(item * scale))
          };
        });
    }

    destroy() {
        this.remove();
    }

    remove() {
        this.element.remove();
    }
}
