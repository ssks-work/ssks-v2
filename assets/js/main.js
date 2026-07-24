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

  if (contactForm) {
    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();

      if (!contactForm.checkValidity()) {
        contactForm.classList.add('was-validated');
        if (formStatus) formStatus.textContent = '必須項目をご確認ください。';
        const firstInvalid = contactForm.querySelector(':invalid');
        firstInvalid?.focus();
        return;
      }

      const formData = new FormData(contactForm);
      const name = String(formData.get('name') || '').trim();
      const company = String(formData.get('company') || '').trim();
      const email = String(formData.get('email') || '').trim();
      const message = String(formData.get('message') || '').trim();

      const subject = `【SSKSサイト】${name}様からのご相談`;
      const body = [
        'SSKS Webサイトからのご相談',
        '',
        `お名前：${name}`,
        `会社名：${company || '未入力'}`,
        `メールアドレス：${email}`,
        '',
        '相談内容：',
        message
      ].join('\n');

      if (formStatus) formStatus.textContent = 'メール作成画面を開きます。';
      window.location.href = `mailto:rintaro@ssks.work?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
  }
})();
