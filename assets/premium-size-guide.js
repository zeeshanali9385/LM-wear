class SizeGuideModal extends HTMLElement {
  connectedCallback() {
    this.modal = this.querySelector('[data-size-guide-modal]');
    this.triggers = document.querySelectorAll(`[data-size-guide-trigger="${this.dataset.productId}"]`);

    this.triggers.forEach((trigger) => {
      trigger.addEventListener('click', () => this.open());
    });

    this.modal?.querySelector('[data-size-guide-close]')?.addEventListener('click', () => this.close());
    this.modal?.addEventListener('click', (e) => {
      if (e.target === this.modal) this.close();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal?.classList.contains('is-open')) this.close();
    });
  }

  open() {
    this.modal?.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    this.modal?.querySelector('[data-size-guide-close]')?.focus();
  }

  close() {
    this.modal?.classList.remove('is-open');
    document.body.style.overflow = '';
  }
}

if (!customElements.get('size-guide-modal')) {
  customElements.define('size-guide-modal', SizeGuideModal);
}
