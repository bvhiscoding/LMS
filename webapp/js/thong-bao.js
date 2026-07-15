(() => {
  const root = document.getElementById('notif');
  if (!root) return;
  const rows = [...root.querySelectorAll('.card > .list-row')];
  const markAll = root.querySelector('.page-head button');
  const subtitle = root.querySelector('.page-head .sub');
  const routes = ['lam-bai-thi.html', 'khoa-hoc-cua-toi.html', 'chung-chi-hoc-vien.html', 'thao-luan.html'];
  const unread = row => row.style.background && row.style.background !== 'transparent';
  const renderCount = () => {
    const count = rows.filter(unread).length;
    subtitle.textContent = count ? `Bạn có ${count} thông báo chưa đọc.` : 'Bạn đã đọc tất cả thông báo.';
    markAll.disabled = count === 0;
  };
  rows.forEach((row, index) => {
    row.tabIndex = 0;
    row.setAttribute('role', 'link');
    const open = () => { row.style.background = 'transparent'; renderCount(); location.href = routes[index]; };
    row.addEventListener('click', open);
    row.addEventListener('keydown', event => { if (event.key === 'Enter') open(); });
  });
  markAll.addEventListener('click', () => { rows.forEach(row => { row.style.background = 'transparent'; }); renderCount(); window.showAppToast('Đã đánh dấu tất cả thông báo là đã đọc.'); });
  renderCount();
})();
