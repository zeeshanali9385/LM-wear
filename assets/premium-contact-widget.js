class PremiumContactWidget extends HTMLElement {
  connectedCallback() {
    this.fab = this.querySelector('[data-contact-fab]');
    this.panel = this.querySelector('[data-contact-panel]');
    this.tabs = this.querySelectorAll('[data-contact-tab]');
    this.panes = this.querySelectorAll('[data-contact-pane]');
    this.form = this.querySelector('[data-contact-form]');
    this.status = this.querySelector('[data-contact-status]');

    this.fab?.addEventListener('click', () => this.togglePanel());
    document.addEventListener('click', (e) => {
      if (!this.contains(e.target)) this.closePanel();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.closePanel();
    });

    this.tabs.forEach((tab) => {
      tab.addEventListener('click', () => this.switchTab(tab.dataset.contactTab));
    });

    this.form?.addEventListener('submit', (e) => this.handleSubmit(e));
  }

  togglePanel() {
    const isOpen = this.panel?.classList.contains('is-open');
    if (isOpen) {
      this.closePanel();
    } else {
      this.openPanel();
    }
  }

  openPanel() {
    this.panel?.classList.add('is-open');
    this.fab?.setAttribute('aria-expanded', 'true');
  }

  closePanel() {
    this.panel?.classList.remove('is-open');
    this.fab?.setAttribute('aria-expanded', 'false');
  }

  switchTab(tabId) {
    this.tabs.forEach((tab) => {
      tab.classList.toggle('is-active', tab.dataset.contactTab === tabId);
      tab.setAttribute('aria-selected', tab.dataset.contactTab === tabId ? 'true' : 'false');
    });
    this.panes.forEach((pane) => {
      pane.classList.toggle('is-active', pane.dataset.contactPane === tabId);
    });
  }

  async handleSubmit(event) {
    event.preventDefault();
    if (!this.form) return;

    const endpoint = this.form.action;
    if (!endpoint || endpoint.includes('your-form-id')) {
      this.showStatus('Please configure your form endpoint in Theme Settings → Premium Store.', 'error');
      return;
    }

    const submitBtn = this.form.querySelector('[type="submit"]');
    submitBtn?.setAttribute('disabled', 'true');

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: new FormData(this.form),
        headers: { Accept: 'application/json' },
      });

      if (response.ok) {
        this.form.reset();
        const successMsg = this.dataset.successMessage || 'Thank you! We will get back to you shortly.';
        this.showStatus(successMsg, 'success');
      } else {
        this.showStatus('Something went wrong. Please try again.', 'error');
      }
    } catch {
      this.showStatus('Unable to send message. Please check your connection.', 'error');
    } finally {
      submitBtn?.removeAttribute('disabled');
    }
  }

  showStatus(message, type) {
    if (!this.status) return;
    this.status.hidden = false;
    this.status.textContent = message;
    this.status.className = `contact-widget__status contact-widget__status--${type}`;
  }
}

if (!customElements.get('premium-contact-widget')) {
  customElements.define('premium-contact-widget', PremiumContactWidget);
}
