(() => {
  const root = document.getElementById('hv-progress') || document.querySelector('.progress-page') || document.querySelector('main');
  if (!root) return;
  root.querySelectorAll('a[href="#"]').forEach(link => {
    link.removeAttribute('href'); link.setAttribute('role', 'button'); link.tabIndex = 0;
    link.addEventListener('click', event => {
      const row = event.currentTarget.closest('tr'); const name = row?.querySelector('td:nth-child(2), .cert-name')?.textContent.trim() || 'Kết quả học tập';
      if (event.currentTarget.textContent.includes('Tải')) {
        const url = URL.createObjectURL(new Blob([`CHỨNG CHỈ\n${name}\nNguyễn Văn An\nVBS - TKV 2026`], { type: 'text/plain;charset=utf-8' }));
        Object.assign(document.createElement('a'), { href: url, download: 'chung-chi-vbs.txt' }).click(); URL.revokeObjectURL(url);
      } else window.appDialog({ title: name, message: row?.innerText.replace(/\s+/g, ' ') || 'Thông tin chi tiết kết quả.', confirmText: 'Đóng', cancelText: '' });
    });
  });
  root.querySelectorAll('.search-box input').forEach(input => input.addEventListener('input', () => {
    const table = input.closest('.panel-card')?.querySelector('table'); const term = input.value.toLocaleLowerCase('vi');
    table?.querySelectorAll('tbody tr').forEach(row => row.hidden = !row.textContent.toLocaleLowerCase('vi').includes(term));
  }));
  root.querySelectorAll('.filter-box').forEach(button => button.addEventListener('click', () => window.appDialog({ title: 'Bộ lọc', message: 'Dữ liệu hiện đang được lọc theo học kỳ và trạng thái đang chọn trên trang.', confirmText: 'Đã hiểu', cancelText: '' })));
  root.querySelectorAll('.pages').forEach(pages => pages.addEventListener('click', event => { const button = event.target.closest('button'); if (!button) return; pages.querySelectorAll('button').forEach(item => item.classList.toggle('active', item === button)); window.showAppToast(`Đã chuyển trang ${button.textContent.trim()}.`); }));
  root.querySelector('.detail-close')?.addEventListener('click', event => event.currentTarget.closest('.assignment-detail').hidden = true);
})();
