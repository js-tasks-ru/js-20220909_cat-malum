class Tooltip {
  static instance;
  element;

  constructor() {
    if (Tooltip.instance) {
      return Tooltip.instance;
    }

    Tooltip.instance = this;
  }

  initialize () {
    this.initEventListeners();
  }

  render(html) {
    this.element = document.createElement('div');
    this.element.textContent = 'This is tooltip';
    this.element.classList.add('tooltip');

    document.body.append(this.element);
    this.element.textContent = html;
  }

  initEventListeners() {
    document.addEventListener('pointerover', this.onPointerOver);
    document.addEventListener('pointerout', this.onPointerOut);
  }

  onPointerOver = event => {
    if (event.target.closest('[data-tooltip]')) {
      const target = event.target.closest('[data-tooltip]');

      this.render(target.dataset.tooltip);

      document.addEventListener('pointermove', this.onPointerMove);
    }
  };

  onPointerMove = event => {
    this.elemMove(event);
  };

  onPointerOut = () => {
    this.remove();
    document.removeEventListener('pointermove', this.onPointerMove);
  };

  elemMove(event) {
    let mouseX = event.clientX;
    let mouseY = event.clientY;
    
    this.element.style.left = mouseX + 15 + 'px';
    this.element.style.top = mouseY + 15 + 'px';
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    document.removeEventListener('pointerover', this.onPointerOver);
    document.removeEventListener('pointermove', this.onPointerMove);
    document.removeEventListener('pointerout', this.onPointerOut);
    this.remove();
    this.element = null;
  }
}

export default Tooltip;
