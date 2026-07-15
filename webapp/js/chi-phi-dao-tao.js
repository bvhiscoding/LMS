(() => {
  const panel = document.querySelector('#costPanel');
  const tabs = document.querySelector('#costTabs');
  const filters = document.querySelector('#costFilters');
  const dialog = document.querySelector('#costDialog');
  const toast = document.querySelector('#costToast');
  let rows = [
    ['KNA-2026-01', 'Kỹ năng giao tiếp hiệu quả', 'Kỹ năng mềm', 'Trung tâm CNTT', 120000000, 115500000, 100000000, 'Đã thanh toán'],
    ['ATTT-2026-02', 'An toàn thông tin cơ bản', 'CNTT', 'Trung tâm CNTT', 95000000, 92000000, 80000000, 'Thanh toán một phần'],
    ['QLDA-2026-03', 'Quản lý dự án chuyên nghiệp', 'Quản lý', 'Phòng Đào tạo', 150000000, 148700000, 120000000, 'Chưa thanh toán'],
    ['BHXH-2026-04', 'Bảo hiểm xã hội bắt buộc', 'Quản lý', 'Phòng Đào tạo', 80000000, 82400000, 82400000, 'Đã thanh toán'],
    ['VP-2026-05', 'Tin học văn phòng nâng cao', 'CNTT', 'Trung tâm CNTT', 110000000, 105200000, 60000000, 'Thanh toán một phần'],
    ['KNA-2026-06', 'Kỹ năng thuyết trình', 'Kỹ năng mềm', 'Phòng Đào tạo', 60000000, 0, 0, 'Chưa thanh toán']
  ];
  let current = 'overview';
  let toastTimer;

  const money = value => value.toLocaleString('vi-VN') + ' đ';
  const statusClass = value => value === 'Thanh toán một phần' ? 'partial' : value === 'Chưa thanh toán' ? 'unpaid' : '';

  function filteredRows() {
    const form = new FormData(filters);
    const query = (form.get('q') || '').toLowerCase();
    return rows.filter(row =>
      (!query || `${row[0]} ${row[1]}`.toLowerCase().includes(query)) &&
      (!form.get('course') || row[2] === form.get('course')) &&
      (!form.get('unit') || row[3] === form.get('unit')) &&
      (!form.get('status') || row[7] === form.get('status'))
    );
  }

  function actionMenu(row) {
    const code = row[0];
    return `<div class="cost-actions">
      <button class="cost-action-toggle" type="button" data-cost-action="menu" data-code="${code}" aria-label="Mở thao tác cho lớp ${code}" aria-expanded="false" aria-controls="cost-menu-${code}"><i class="fa-solid fa-ellipsis-vertical" aria-hidden="true"></i></button>
      <div class="cost-action-menu" id="cost-menu-${code}" role="menu" hidden>
        <button type="button" role="menuitem" data-cost-action="view" data-code="${code}"><i class="fa-regular fa-eye" aria-hidden="true"></i><span>Xem chi tiết</span></button>
        <button type="button" role="menuitem" data-cost-action="edit" data-code="${code}"><i class="fa-regular fa-pen-to-square" aria-hidden="true"></i><span>Chỉnh sửa</span></button>
        <button type="button" role="menuitem" class="danger" data-cost-action="delete" data-code="${code}"><i class="fa-regular fa-trash-can" aria-hidden="true"></i><span>Xóa</span></button>
      </div>
    </div>`;
  }

  function table(mode) {
    const data = filteredRows();
    const body = data.map((row, index) => `<tr>
      <td>${row[0]}</td><td>${row[1]}</td>
      ${mode === 'report' ? `<td>${index % 2 ? 'Chi phí học liệu' : 'Chi phí giảng viên'}</td><td>${index % 2 ? 'Tài liệu học tập' : 'Thù lao giảng viên'}</td>` : `<td>${row[2]}</td><td>${row[3]}</td>`}
      <td>${money(row[4])}</td><td>${money(row[5])}</td><td>${money(row[6])}</td><td>${money(Math.max(0, row[5] - row[6]))}</td>
      <td><span class="cost-status ${statusClass(row[7])}">${row[7]}</span></td><td>${actionMenu(row)}</td>
    </tr>`).join('') || '<tr><td colspan="10" class="cost-empty">Không tìm thấy dữ liệu phù hợp</td></tr>';
    return `<div class="table-wrap"><table class="cost-table"><thead><tr><th>Mã lớp</th><th>Tên lớp</th>${mode === 'report' ? '<th>Danh mục</th><th>Nội dung chi</th>' : '<th>Khóa học</th><th>Đơn vị tổ chức</th>'}<th>Dự toán</th><th>Thực tế</th><th>Đã thanh toán</th><th>Còn lại</th><th>Trạng thái</th><th>Thao tác</th></tr></thead><tbody>${body}</tbody></table></div>`;
  }

  const legend = '<div class="donut"></div><div class="cost-legend"><p><span><i></i>Giảng viên</span><b>43%</b></p><p><span><i></i>Học liệu/thiết bị</span><b>26%</b></p><p><span><i></i>Địa điểm & khác</span><b>31%</b></p></div>';

  function render() {
    tabs.querySelectorAll('button').forEach(button => button.classList.toggle('active', button.dataset.tab === current));
    if (current === 'overview') {
      panel.innerHTML = `<div class="cost-grid"><article class="cost-card">${table('class')}</article><aside class="cost-card"><h2>Cơ cấu chi phí</h2>${legend}</aside></div>`;
    } else if (current === 'classes') {
      panel.innerHTML = `<article class="cost-card"><h2>Danh sách lớp học</h2>${table('class')}</article>`;
    } else {
      panel.innerHTML = `<div class="report-top"><div>Tổng chi phí tra cứu<b>2,185 tỷ</b></div><div>Số lớp có dữ liệu<b>32 lớp</b></div><div>Khoản chờ thanh toán<b>433,3 triệu</b></div></div><div class="cost-grid"><article class="cost-card"><h2>Kết quả tra cứu</h2>${table('report')}</article><aside class="cost-card"><h2>Báo cáo nhanh</h2>${legend}</aside></div>`;
    }
  }

  function closeMenus() {
    panel.querySelectorAll('.cost-action-menu').forEach(menu => { menu.hidden = true; });
    panel.querySelectorAll('.cost-action-toggle').forEach(button => button.setAttribute('aria-expanded', 'false'));
  }

  function openMenu(button) {
    const menu = document.getElementById(button.getAttribute('aria-controls'));
    const shouldOpen = menu.hidden;
    closeMenus();
    if (!shouldOpen) return;
    menu.hidden = false;
    button.setAttribute('aria-expanded', 'true');
    const trigger = button.getBoundingClientRect();
    const opensUp = trigger.bottom + menu.offsetHeight + 8 > window.innerHeight;
    menu.style.top = `${opensUp ? trigger.top - menu.offsetHeight - 6 : trigger.bottom + 6}px`;
    menu.style.left = `${Math.max(12, trigger.right - menu.offsetWidth)}px`;
    menu.querySelector('[role="menuitem"]')?.focus();
  }

  async function deleteRow(row) {
    const accepted = window.appDialog
      ? await window.appDialog({ title: 'Xóa dữ liệu chi phí', html: `<p class="app-dialog-danger">Xóa dữ liệu chi phí của lớp <b>${row[0]} · ${row[1]}</b>? Bản ghi sẽ bị xóa khỏi cả ba tab.</p>`, confirmText: 'Xóa', cancelText: 'Hủy' })
      : window.confirm(`Xóa dữ liệu chi phí của lớp ${row[0]} · ${row[1]}?`);
    if (!accepted) return;
    rows = rows.filter(item => item[0] !== row[0]);
    render();
    show(`Đã xóa dữ liệu chi phí lớp ${row[0]}`);
  }

  tabs.addEventListener('click', event => {
    const button = event.target.closest('[data-tab]');
    if (button) { current = button.dataset.tab; render(); }
  });
  filters.addEventListener('input', render);
  filters.addEventListener('reset', () => setTimeout(render));
  document.querySelector('#openCost').addEventListener('click', () => dialog.showModal());
  dialog.querySelectorAll('[data-close]').forEach(button => button.addEventListener('click', () => dialog.close()));
  document.querySelector('#costForm').addEventListener('submit', event => { event.preventDefault(); dialog.close(); show('Đã lưu khoản chi phí'); });
  document.querySelector('#exportCost').addEventListener('click', () => show('Đã tạo báo cáo demo'));

  panel.addEventListener('click', async event => {
    const button = event.target.closest('[data-cost-action]');
    if (!button) return;
    if (button.dataset.costAction === 'menu') return openMenu(button);
    const row = rows.find(item => item[0] === button.dataset.code);
    if (!row) return;
    closeMenus();
    if (button.dataset.costAction === 'view') show(`Đang xem ${row[0]}`);
    if (button.dataset.costAction === 'edit') show(`Đang chỉnh sửa ${row[0]}`);
    if (button.dataset.costAction === 'delete') await deleteRow(row);
  });
  document.addEventListener('click', event => { if (!event.target.closest('.cost-actions')) closeMenus(); });
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    const toggle = panel.querySelector('.cost-action-toggle[aria-expanded="true"]');
    closeMenus();
    toggle?.focus();
  });
  window.addEventListener('resize', closeMenus);
  document.addEventListener('scroll', closeMenus, true);

  function show(message) {
    toast.textContent = message;
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { toast.hidden = true; }, 2200);
  }

  render();
})();
