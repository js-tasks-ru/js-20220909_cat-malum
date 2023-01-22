export default class SortableTable {
  element;
  subElements = {};

  constructor(headerConfig, {
    data = [],
    sorted = {
      id: headerConfig.find(item => item.sortable).id,
      order: 'asc'
    }
  } = {}) {
    this.headerConfig = headerConfig;
    this.data = data;
    this.sorted = sorted;

    this.render();
  }

  getTemplateHeader(headerConfig) {
    return headerConfig.map(item => {
      return `
        <div class="sortable-table__cell"
        data-id="${item.id}"
        data-sortable="${item.sortable}"
        data-order="${this.sorted.order === item.id ? this.sorted.order : 'asc'}">
          <span>${item.title}</span>
          ${this.getHeaderSortArrows(item.id)}
        </div>
      `;
    }).join('');
  }

  getHeaderSortArrows(id) {
    const order = this.sorted.id === id ? this.sorted.order : '';

    return order
      ? `<span data-element="arrow" class="sortable-table__sort-arrow">
          <span class="sort-arrow"></span>
        </span>`
      : '';
  }

  getTemplateBody(data) {
    return data.map(item => {
      return `
        <a href="/products/${item.id}" class="sortable-table__row">
          ${this.getTemplateRow(item)}
        </a>
      `;
    }).join('');
  }

  getTemplateRow(item) {
    return this.headerConfig.map(({id, template}) => {
      return template
        ? `<div class="sortable-table__cell">
            <img class="sortable-table-image" alt="Image" src="#">
          </div>` //template(item[id])
        : `<div class="sortable-table__cell">${item[id]}</div>`;
    }).join('');
  }

  getTemplate(data) {
    return `
      <div data-element="productsContainer" class="products-list__container">
        <div class="sortable-table">
          <div data-element="header" class="sortable-table__header sortable-table__row">
            ${this.getTemplateHeader(this.headerConfig)}
          </div>
          <div data-element="body" class="sortable-table__body">
            ${this.getTemplateBody(data)}
          </div>
        </div>
      </div>
    `;
  }

  render() {
    const {id, order} = this.sorted;
    const sortedData = this.sortData(id, order);
    const wrapper = document.createElement('div');

    wrapper.innerHTML = this.getTemplate(sortedData);

    this.element = wrapper.firstElementChild;

    this.subElements = this.getSubElements(this.element);

    this.initEventListeners();
  }

  sortData(id, order) {
    const data = [...this.data];
    const column = this.headerConfig.find(item => item.id === id);
    const { sortType } = column;
    const direction = order === 'asc' ? 1 : -1;

    return data.sort((a, b) => {
      switch (sortType) {
        case 'number':
          return direction * (a[id] - b[id]);
        case 'string':
          return direction * a[id].localeCompare(b[id], ['ru', 'en']);
        default:
          throw new Error('Uknown sortType');
      }
    });
  }

  sortOnclick(event) {
    const column = event.target.closest('[data-sortable="true"]');
    const toggleOrder = order => {
      const orders = {
        asc: 'desc',
        desc: 'asc'
      };

      return orders[order];
    };

    if (column) {
      const { id, order } = column.dataset;
      const newOrder = toggleOrder(order);
      const sortedData = this.sortData(id, newOrder);
      const arrow = column.querySelector('.sortable-table__sort-arrow');

      column.dataset.order = newOrder;

      if (!arrow) {
        column.append(this.subElements.arrow);
      }

      this.subElements.body.innerHTML = this.getTemplateBody(sortedData);
    }
  }

  initEventListeners() {
    this.element.addEventListener('pointerdown', event => this.sortOnclick(event));
  }

  getSubElements(element) {
    const elements = element.querySelectorAll('[data-element]');
  
		return [...elements].reduce((accum, subElement) => {
		  accum[subElement.dataset.element] = subElement;
  
		  return accum;
		}, {});
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.element = null;
    this.subElements = null;
  }
}
