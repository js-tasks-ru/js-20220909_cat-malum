import RangePicker from './components/range-picker/src/index.js';
import SortableTable from './components/sortable-table/src/index.js';
import ColumnChart from './components/column-chart/src/index.js';
import header from './bestsellers-header.js';

import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru/';

export default class Page {
	element;
	subElements = {};
	components = {};
	url = new URL('api/dashboard/bestsellers', BACKEND_URL);

	getTemplate() {
		return `
			<div class="dashboard">
				<div class="content__top-panel">
					<h2 class="page-title">Dashboard</h2>
					<div data-element="rangePicker"></div>
				</div>
				<div data-element="chartsRoot" class="dashboard__charts">
					<div data-element="ordersChart" class="dashboard__chart_orders"></div>
					<div data-element="salesChart" class="dashboard__chart_sales"></div>
					<div data-element="customersChart" class="dashboard__chart_customers"></div>
				</div>
				<h3 class="block-title">Best sellers</h3>
			</div>
		`;
	}

	render() {
		const wrapper = document.createElement('div');

		wrapper.innerHTML = this.getTemplate();

		this.element = wrapper.firstElementChild;

		this.subElements = this.getSubElements(this.element);
		
		this.initComponents();
		this.renderComponents();
		this.initEventListeners();

		return this.element;
	}

	initComponents() {
		const from = new Date();
		const to = new Date();

		const rangePicker = new RangePicker({
			from,
			to
		});

		const ordersChart = new ColumnChart({
			url: 'api/dashboard/orders',
			range: {
			  from,
			  to
			},
			label: 'orders',
			link: '#'
		});

		const salesChart = new ColumnChart({
			url: 'api/dashboard/sales',
			range: {
			  from,
			  to
			},
			label: 'sales',
			formatHeading: data => `$${data}`
		});
 
		const customersChart = new ColumnChart({
			url: 'api/dashboard/customers',
			range: {
			  from,
			  to
			},
			label: 'customers'
		});

		const sortableTable = new SortableTable(header, {
			url: `api/dashboard/bestsellers?_start=1&_end=20&from=${from.toISOString()}&to=${to.toISOString()}`,
			isSortLocally: true
		});

		this.components = {
			rangePicker,
			ordersChart,
			salesChart,
			customersChart,
			sortableTable
		}
	}

	renderComponents() {
		Object.keys(this.components).forEach(component => {
			const root = this.subElements[component];
			const { element } = this.components[component];

			if (component === 'sortableTable') {
				this.element.append(element);
			} else {
				root.append(element);
			}
		});
	}

	async updateComponents (from, to) {
		const data = await this.loadData(from, to);

		this.components.sortableTable.update(data);
		this.components.ordersChart.update(from, to);
		this.components.salesChart.update(from, to);
		this.components.customersChart.update(from, to);
	}

	loadData (from, to) {
		this.url.searchParams.set('_start', '1');
		this.url.searchParams.set('_end', '21');
		this.url.searchParams.set('_sort', 'title');
		this.url.searchParams.set('_order', 'asc');
		this.url.searchParams.set('from', from.toISOString());
		this.url.searchParams.set('from', to.toISOString());

		return fetchJson(this.url);
	}

	initEventListeners() {
		this.components.rangePicker.element.addEventListener('date-select', event => {
			const {from, to} = event.detail;

			this.updateComponents(from, to);
		});
	}

	getSubElements(element) {
		const elements = element.querySelectorAll('[data-element]');
		
		return [...elements].reduce((accum, subElement) => {
		  accum[subElement.dataset.element] = subElement;
		  
		  return accum;
		}, {});
	}

	remove() {
		this.element.remove();
	}

	destroy() {
		this.remove();
		this.subElements = null;

		for (const component of Object.values(this.components)) {
			component.destroy();
		}
	}
}
