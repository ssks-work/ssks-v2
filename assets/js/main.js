(() => {
  'use strict';

  const header = document.querySelector('[data-header]');
  const year = document.getElementById('currentYear');
  const navCollapse = document.getElementById('globalNavigation');
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  if (year) year.textContent = String(new Date().getFullYear());

  const updateHeader = () => {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 20);
  };
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  document.querySelectorAll('[data-delay]').forEach((element) => {
    element.style.setProperty('--delay', `${element.dataset.delay}ms`);
  });

  const revealElements = document.querySelectorAll('.reveal:not(.is-visible)');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        currentObserver.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });

    revealElements.forEach((element) => observer.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add('is-visible'));
  }

  document.querySelectorAll('#globalNavigation a[href^="#"]').forEach((link) => {
    link.addEventListener('click', () => {
      if (!navCollapse || !navCollapse.classList.contains('show') || typeof bootstrap === 'undefined') return;
      bootstrap.Collapse.getOrCreateInstance(navCollapse).hide();
    });
  });

  if (!contactForm) return;

  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!contactForm.checkValidity()) {
      contactForm.classList.add('was-validated');
      if (formStatus) formStatus.textContent = '必須項目をご確認ください。';
      contactForm.querySelector(':invalid')?.focus();
      return;
    }

    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalButtonHtml = submitButton?.innerHTML;
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = '送信中…';
    }
    if (formStatus) formStatus.textContent = 'お問い合わせを送信しています。';

    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(contactForm)
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.message || '送信に失敗しました。');

      contactForm.reset();
      contactForm.classList.remove('was-validated');
      if (formStatus) formStatus.textContent = '送信しました。3営業日以内を目安にご連絡します。';
    } catch (error) {
      if (formStatus) {
        formStatus.textContent = `${error.message || '送信に失敗しました。'} お急ぎの場合は info@ssks.work へ直接ご連絡ください。`;
      }
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonHtml;
      }
    }
  });
})();
