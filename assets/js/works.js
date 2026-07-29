(() => {
  'use strict';

  const containers = document.querySelectorAll('[data-works-source]');
  if (!containers.length) return;

  const escapeHtml = (value = '') => String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

  const createCard = (work) => {
    const image = work.image
      ? `<div class="work-thumb"><img src="${escapeHtml(work.image)}" alt="${escapeHtml(work.imageAlt || work.title)}" loading="lazy"></div>`
      : `<div class="work-thumb work-thumb-placeholder"><span>${escapeHtml(work.placeholder || work.categoryLabel || 'PROJECT')}</span></div>`;

    return `<a class="work-card reveal is-visible" href="${escapeHtml(work.url || './works.html')}" data-category="${escapeHtml(work.category || 'other')}">
      ${image}
      <div class="work-card-body">
        <p class="work-category">${escapeHtml(work.categoryLabel || '')}${work.year ? ` / ${escapeHtml(work.year)}` : ''}</p>
        <h${containers.length > 1 ? '3' : '2'}>${escapeHtml(work.title)}</h${containers.length > 1 ? '3' : '2'}>
        <p>${escapeHtml(work.summary || '')}</p>
        <span class="work-link">VIEW PROJECT →</span>
      </div>
    </a>`;
  };

  const showError = (container) => {
    container.innerHTML = '<p class="works-empty">実績データを読み込めませんでした。公開環境でご確認ください。</p>';
  };

  fetch('./assets/data/works.json', { cache: 'no-store' })
    .then((response) => {
      if (!response.ok) throw new Error('works.json could not be loaded');
      return response.json();
    })
    .then((items) => {
      const published = items.filter((item) => item.published !== false);

      containers.forEach((container) => {
        const limit = Number(container.dataset.limit || 0);
        let selected = published;
        if (container.dataset.featured === 'true') {
          selected = selected.filter((item) => item.featured === true);
        }
        if (limit > 0) selected = selected.slice(0, limit);
        container.innerHTML = selected.length
          ? selected.map(createCard).join('')
          : '<p class="works-empty">公開中の実績はありません。</p>';
      });

      const buttons = document.querySelectorAll('[data-filter]');
      buttons.forEach((button) => {
        button.addEventListener('click', () => {
          buttons.forEach((item) => item.classList.remove('is-active'));
          button.classList.add('is-active');
          const filter = button.dataset.filter;
          document.querySelectorAll('#worksGrid [data-category]').forEach((card) => {
            card.hidden = filter !== 'all' && card.dataset.category !== filter;
          });
        });
      });
    })
    .catch(() => containers.forEach(showError));
})();
