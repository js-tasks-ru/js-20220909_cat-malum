import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ColumnChart {
	element;
	chartHeight = 50;
	subElements = {};

	constructor({
		label = '',
		link = '',
		formatHeading = data => data,
		url = '',
		range = {
			from: new Date(),
			to: new Date()
		}
	} = {}) {
		this.label = label;
		this.formatHeading = formatHeading;
		this.link = link;
		this.url = new URL(url, BACKEND_URL);
		this.range = range;

		this.render();
		this.update(this.range.from, this.range.to);
	}

	getTemplate() {
		return `
			<div class="column-chart column-chart_loading" style="--chart-height: ${this.chartHeight}">
				<div class="column-chart__title">
					Total ${this.label}
					${this.getLink()}
				</div>
				<div class="column-chart__container">
					<div data-element="header" class="column-chart__header"></div>
					<div data-element="body" class="column-chart__chart"></div>
				</div>
			</div>
		`;
	}

	render() {
		const wrapper = document.createElement('div');
		
		wrapper.innerHTML = this.getTemplate();

		this.element = wrapper.firstElementChild;
		this.subElements = this.getSubElements(this.element);
	}

	async loadData(from, to) {
		this.url.searchParams.set('from', from.toISOString());
		this.url.searchParams.set('to', to.toISOString());
  
		return await fetchJson(this.url);
	}

	setNewRange(from, to) {
		this.range.from = from;
		this.range.to = to;
	}

	getHeaderValue(data) {
		return this.formatHeading(Object.values(data).reduce((accum, item) => (accum + item), 0));
	}

	getSubElements(element) {
		const elements = element.querySelectorAll('[data-element]');
  
		return [...elements].reduce((accum, subElement) => {
		  accum[subElement.dataset.element] = subElement;
  
		  return accum;
		}, {});
	}

	getColumnBody(data) {
		const maxValue = Math.max(...Object.values(data));
		const scale = this.chartHeight / maxValue;

		return Object.values(data)
			.map(item => {
				const percent = ((item / maxValue) * 100).toFixed(0);

				return `
					<div style="--value: ${Math.floor(item * scale)}" data-tooltip="${percent}%"></div>
				`;
			})
			.join('');
	}

	getLink() {
		return this.link 
		? `<a class="column-chart__link" href="${this.link}">View all</a>`
		: '';
	}

	async update(from, to) {
		this.element.classList.add('column-chart_loading');
		
		const data = await this.loadData(from, to);

		this.setNewRange(from, to);

		if (data && Object.values(data).length) {
			this.subElements.header.textContent = this.getHeaderValue(data);
			this.subElements.body.innerHTML = this.getColumnBody(data);
	
			this.element.classList.remove('column-chart_loading');
		}

		this.data = data;
		return this.data;
	}

	remove() {
		this.element.remove();
	}

	destroy() {
		this.element.remove();
	}
}
