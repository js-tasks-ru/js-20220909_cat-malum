export default class ColumnChart {
	chartHeight = 50;
	element;

	constructor({
		data = [],
      label = '',
      value = 0,
      link = '',
		formatHeading = data => data
	} = {}) {
		this.data = data;
		this.label = label;
		this.value = formatHeading(value);
		this.link = link;

		this.render(this.data);
	}

	getTemplate(data) {
		return `
			<div id="orders" class="dashboard__chart_orders column-chart_loading">
				<div class="column-chart" style="--chart-height: ${this.chartHeight}">
					<div class="column-chart__title">
						Total ${this.label}
						${this.getLink()}
					</div>
					<div class="column-chart__container">
						<div data-element="header" class="column-chart__header">
							${this.value}
						</div>
						<div data-element="body" class="column-chart__chart">
							${this.getColumn(data)}
						</div>
					</div>
				</div>
			</div>
		`;
	}

	render(data) {
		const wrapper = document.createElement('div');
		
		wrapper.innerHTML = this.getTemplate(data);

		this.element = wrapper.firstElementChild;

		if (this.data.length) {
			this.element.classList.remove('column-chart_loading');
		}
	}

	getLink() {
		return this.link ? `<a class="column-chart__link" href="${this.link}">View all</a>` : '';
	}

	getColumn(data) {
		const maxValue = Math.max(...data);
		const scale = 50 / maxValue;

		return data
			.map(item => {
				const percent = (item / maxValue * 100).toFixed(0) + '%';

				return `<div style="--value: ${String(Math.floor(item * scale))}" data-tooltip="${percent}"></div>`;
			})
			.join('');
	}

	update(data = []) {
		this.data = data;
		this.render(data);
	}

	remove() {
		this.element.remove();
	}

	destroy() {
		this.remove()
		this.element = null;
	}
}
