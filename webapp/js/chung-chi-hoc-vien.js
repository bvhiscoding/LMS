(function () {
  'use strict';
  const grid = document.getElementById('certificateGrid');
  if (!grid) return;
  const cards = Array.from(grid.querySelectorAll('.certificate-card'));
  const tabs = Array.from(document.querySelectorAll('.cert-tab'));
  const viewButtons = Array.from(document.querySelectorAll('.cert-view-switch button'));
  const sort = document.getElementById('certSort');
  const search = document.getElementById('certSearch');
  const searchResult = document.getElementById('certSearchResult');
  const empty = document.querySelector('.cert-empty');
  const dialog = document.getElementById('certDialog');
  const toast = document.querySelector('.cert-toast');
  let activeFilter = 'all';
  let toastTimer;
  let currentCard;

  function normalize(value) {
    return value.toLocaleLowerCase('vi').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').trim();
  }

  function applyFilter() {
    const query = normalize(search.value);
    let visible = 0;
    cards.forEach(function (card) {
      const matchesKind = activeFilter === 'all' || card.dataset.kind === activeFilter;
      const matchesQuery = !query || normalize(card.textContent).includes(query);
      const show = matchesKind && matchesQuery;
      card.hidden = !show;
      if (show) visible += 1;
    });
    empty.hidden = visible !== 0;
    empty.querySelector('p').textContent = query ? 'Không tìm thấy chứng chỉ phù hợp với từ khóa.' : 'Không có chứng chỉ phù hợp.';
    searchResult.textContent = query ? `Tìm thấy ${visible} kết quả.` : '';
  }

  search.addEventListener('input', applyFilter);
  search.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && search.value) {
      search.value = '';
      applyFilter();
    }
  });

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      tabs.forEach(function (item) { item.classList.remove('active'); item.setAttribute('aria-selected', 'false'); });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      activeFilter = tab.dataset.filter;
      applyFilter();
    });
  });

  viewButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      const list = button.dataset.view === 'list';
      grid.classList.toggle('list-view', list);
      viewButtons.forEach(function (item) { item.classList.remove('active'); item.setAttribute('aria-pressed', 'false'); });
      button.classList.add('active');
      button.setAttribute('aria-pressed', 'true');
    });
  });

  sort.addEventListener('change', function () {
    cards.sort(function (a, b) {
      if (sort.value === 'title') return a.dataset.title.localeCompare(b.dataset.title, 'vi');
      const delta = new Date(a.dataset.date) - new Date(b.dataset.date);
      return sort.value === 'oldest' ? delta : -delta;
    }).forEach(function (card) { grid.appendChild(card); });
  });

  function showToast(message) {
    toast.querySelector('span').textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 2600);
  }

  function fillDialog(card) {
    currentCard = card;
    dialog.querySelector('.dialog-preview').innerHTML = card.querySelector('.certificate-art').outerHTML;
    dialog.querySelector('.dialog-type').innerHTML = card.querySelector('.type-tag').outerHTML;
    dialog.querySelector('h2').textContent = card.querySelector('h2').textContent;
    const details = card.querySelectorAll('.certificate-info p');
    dialog.querySelector('.dialog-date').textContent = details[0].textContent.trim();
    dialog.querySelector('.dialog-code').textContent = details[1].textContent.trim();
  }

  function downloadCertificate(card) {
    const title = card?.dataset.title || 'Chứng chỉ học viên';
    const code = card?.querySelector('.certificate-info p:nth-child(2)')?.textContent.trim() || 'VBS-2026';
    const safeTitle = title.replace(/[^\p{L}\p{N}]+/gu, '-');
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800"><rect width="100%" height="100%" fill="#fffdf7"/><rect x="30" y="30" width="1140" height="740" rx="18" fill="none" stroke="#1c498c" stroke-width="8"/><text x="600" y="180" text-anchor="middle" font-family="Arial" font-size="34" fill="#1c498c">TRƯỜNG QUẢN TRỊ KINH DOANH - VINACOMIN</text><text x="600" y="310" text-anchor="middle" font-family="Arial" font-size="64" font-weight="bold">CHỨNG CHỈ</text><text x="600" y="410" text-anchor="middle" font-family="Arial" font-size="32">${title}</text><text x="600" y="500" text-anchor="middle" font-family="Arial" font-size="28">Cấp cho: Nguyễn Văn An</text><text x="600" y="600" text-anchor="middle" font-family="Arial" font-size="22">${code}</text></svg>`;
    const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }));
    Object.assign(document.createElement('a'), { href: url, download: `${safeTitle}.svg` }).click();
    URL.revokeObjectURL(url);
    showToast('Đã tải tệp: ' + title);
  }

  grid.addEventListener('click', function (event) {
    const view = event.target.closest('.view-cert');
    const download = event.target.closest('.download-cert');
    const card = event.target.closest('.certificate-card');
    if (view && card) { fillDialog(card); dialog.showModal(); }
    if (download && card) downloadCertificate(card);
  });

  dialog.querySelector('.dialog-close').addEventListener('click', function () { dialog.close(); });
  dialog.addEventListener('click', function (event) { if (event.target === dialog) dialog.close(); });
  dialog.querySelector('.dialog-download').addEventListener('click', function () { downloadCertificate(currentCard); });
  document.querySelectorAll('.page-buttons button').forEach(function (button) {
    button.addEventListener('click', function () {
      if (!/^\d+$/.test(button.textContent.trim())) return;
      if (button.textContent.trim() !== '1') return showToast('Không còn dữ liệu ở trang này.');
      document.querySelectorAll('.page-buttons button').forEach(function (item) { item.classList.remove('active'); });
      button.classList.add('active');
      showToast('Đã chuyển tới trang ' + button.textContent.trim());
    });
  });
  document.querySelectorAll('.page-buttons button').forEach(function (button) {
    if (/^[23]$/.test(button.textContent.trim())) button.hidden = true;
  });
})();
