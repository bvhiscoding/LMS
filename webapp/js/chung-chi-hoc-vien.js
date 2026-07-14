(function () {
  'use strict';
  const grid = document.getElementById('certificateGrid');
  if (!grid) return;
  const cards = Array.from(grid.querySelectorAll('.certificate-card'));
  const tabs = Array.from(document.querySelectorAll('.cert-tab'));
  const viewButtons = Array.from(document.querySelectorAll('.cert-view-switch button'));
  const sort = document.getElementById('certSort');
  const empty = document.querySelector('.cert-empty');
  const dialog = document.getElementById('certDialog');
  const toast = document.querySelector('.cert-toast');
  let activeFilter = 'all';
  let toastTimer;

  function applyFilter() {
    let visible = 0;
    cards.forEach(function (card) {
      const show = activeFilter === 'all' || card.dataset.kind === activeFilter;
      card.hidden = !show;
      if (show) visible += 1;
    });
    empty.hidden = visible !== 0;
  }

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
    dialog.querySelector('.dialog-preview').innerHTML = card.querySelector('.certificate-art').outerHTML;
    dialog.querySelector('.dialog-type').innerHTML = card.querySelector('.type-tag').outerHTML;
    dialog.querySelector('h2').textContent = card.querySelector('h2').textContent;
    const details = card.querySelectorAll('.certificate-info p');
    dialog.querySelector('.dialog-date').textContent = details[0].textContent.trim();
    dialog.querySelector('.dialog-code').textContent = details[1].textContent.trim();
  }

  grid.addEventListener('click', function (event) {
    const view = event.target.closest('.view-cert');
    const download = event.target.closest('.download-cert');
    const card = event.target.closest('.certificate-card');
    if (view && card) { fillDialog(card); dialog.showModal(); }
    if (download && card) showToast('Đã chuẩn bị tệp: ' + card.dataset.title);
  });

  dialog.querySelector('.dialog-close').addEventListener('click', function () { dialog.close(); });
  dialog.addEventListener('click', function (event) { if (event.target === dialog) dialog.close(); });
  dialog.querySelector('.dialog-download').addEventListener('click', function () { showToast('Đã chuẩn bị tệp chứng chỉ để tải xuống.'); });
  document.querySelectorAll('.page-buttons button').forEach(function (button) {
    button.addEventListener('click', function () {
      if (!/^\d+$/.test(button.textContent.trim())) return;
      document.querySelectorAll('.page-buttons button').forEach(function (item) { item.classList.remove('active'); });
      button.classList.add('active');
      showToast('Đã chuyển tới trang ' + button.textContent.trim());
    });
  });
})();
