(() => {
  const seeds = [
    ['2024-05-20T10:30:15','Nguyễn Văn A','admin','Đăng nhập','Đăng nhập thành công','192.168.1.100','Thành công'],
    ['2024-05-20T10:26:30','Trần Thị Bích','giangvien01','Cập nhật người dùng','Cập nhật thông tin người dùng: Lê Văn Cường','192.168.1.101','Thành công'],
    ['2024-05-20T10:20:45','Nguyễn Văn A','admin','Tạo mới','Tạo mới khóa học: An toàn lao động trong sản xuất','192.168.1.100','Thành công'],
    ['2024-05-20T10:15:20','Phạm Thị Dung','quanlydaotao','Phân quyền','Cập nhật quyền cho vai trò: Giảng viên','192.168.1.102','Thành công'],
    ['2024-05-20T09:58:10','Lê Văn Cường','giangvien02','Nộp bài kiểm tra','Nộp bài kiểm tra: Kiểm tra an toàn - Bài số 1','192.168.1.103','Thành công'],
    ['2024-05-20T09:45:05','Hoàng Văn E','hocvien045','Đăng nhập','Đăng nhập thất bại','192.168.1.104','Thất bại'],
    ['2024-05-20T09:40:22','Vũ Thị Lan','giangvien03','Xóa dữ liệu','Xóa khóa học: Kỹ năng giao tiếp','192.168.1.101','Thất bại'],
    ['2024-05-20T09:30:11','Nguyễn Văn A','admin','Cấu hình hệ thống','Cập nhật cấu hình hệ thống: Email & Thông báo','192.168.1.100','Thành công'],
    ['2024-05-20T09:25:45','Trần Thị Bích','giangvien01','Xuất dữ liệu','Xuất báo cáo kết quả học tập','192.168.1.101','Thành công'],
    ['2024-05-20T09:20:33','Hoàng Văn E','hocvien045','Xem dữ liệu','Xem kết quả bài kiểm tra: Kiểm tra giữa kỳ','192.168.1.104','Thành công']
  ];
  const templates = seeds.slice(1).map((row) => row.slice(1));
  const logs = seeds.map((row, index) => ({id:index + 1,time:row[0],name:row[1],username:row[2],action:row[3],content:row[4],ip:row[5],status:row[6]}));
  const startTime = new Date('2024-05-20T09:20:32').getTime();
  for (let index = logs.length; index < 5248; index += 1) {
    const [name,username,action,content,ip,status] = templates[index % templates.length];
    logs.push({id:index + 1,time:new Date(startTime - (index - seeds.length) * 1000).toISOString().slice(0,19),name,username,action,content:`${content} #${index + 1}`,ip,status});
  }

  const $ = (id) => document.getElementById(id);
  const body = $('auditTableBody');
  if (!body) return;
  const pageSize = 10;
  let currentPage = 1;
  let searchTerm = '';
  const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
  const normalize = (value) => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').replace(/Đ/g,'D').toLowerCase();
  const initials = (name) => name.trim().split(/\s+/).slice(-2).map((part) => part[0]).join('').toUpperCase();
  const formatTime = (value) => { const [date,time] = value.split('T'), [year,month,day] = date.split('-'); return `${day}/${month}/${year} ${time}`; };
  const actionClass = (action) => ({'Đăng nhập':'action-login','Cập nhật người dùng':'action-update','Tạo mới':'action-create','Phân quyền':'action-permission','Nộp bài kiểm tra':'action-submit','Xóa dữ liệu':'action-delete','Cấu hình hệ thống':'action-config','Xuất dữ liệu':'action-export','Xem dữ liệu':'action-view'}[action] || 'action-view');

  [...new Set(logs.map((log) => log.username))].sort().forEach((username) => { const option = document.createElement('option'); option.value = username; option.textContent = username; $('userFilter').appendChild(option); });

  function filteredLogs() {
    const from = $('dateFrom').value, to = $('dateTo').value, action = $('actionFilter').value, user = $('userFilter').value, status = $('statusFilter').value, query = normalize(searchTerm);
    return logs.filter((log) => (!from || log.time.slice(0,10) >= from) && (!to || log.time.slice(0,10) <= to) && (!action || log.action === action) && (!user || log.username === user) && (!status || log.status === status) && (!query || normalize(`${log.content} ${log.ip} ${log.name} ${log.username}`).includes(query)));
  }
  function pageItems(totalPages) {
    if (totalPages <= 7) return Array.from({length:totalPages}, (_, index) => index + 1);
    if (currentPage <= 4) return [1,2,3,4,5,'…',totalPages];
    if (currentPage >= totalPages - 3) return [1,'…',totalPages - 4,totalPages - 3,totalPages - 2,totalPages - 1,totalPages];
    return [1,'…',currentPage - 1,currentPage,currentPage + 1,'…',totalPages];
  }
  function render() {
    const filtered = filteredLogs(), totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
    currentPage = Math.min(Math.max(1,currentPage),totalPages);
    const rows = filtered.slice((currentPage - 1) * pageSize,currentPage * pageSize);
    body.innerHTML = rows.length ? rows.map((log) => `<tr><td>${formatTime(log.time)}</td><td><div class="audit-user"><span class="audit-avatar">${escapeHtml(initials(log.name))}</span><span><b>${escapeHtml(log.name)}</b><small>(${escapeHtml(log.username)})</small></span></div></td><td><span class="audit-action ${actionClass(log.action)}">${escapeHtml(log.action)}</span></td><td>${escapeHtml(log.content)}</td><td>${escapeHtml(log.ip)}</td><td><span class="audit-status ${log.status === 'Thành công' ? 'success' : 'failed'}">${escapeHtml(log.status)}</span></td></tr>`).join('') : '<tr><td colspan="6" class="audit-empty"><i class="fa-solid fa-clipboard-list"></i><br>Không tìm thấy nhật ký phù hợp</td></tr>';
    const first = filtered.length ? (currentPage - 1) * pageSize + 1 : 0, last = Math.min(currentPage * pageSize,filtered.length);
    $('auditSummary').textContent = `Hiển thị ${first} - ${last} trong tổng số ${filtered.length.toLocaleString('vi-VN')} bản ghi`;
    $('auditPagination').innerHTML = `<button class="audit-page" data-page="${currentPage - 1}" ${currentPage === 1 ? 'disabled' : ''} aria-label="Trang trước"><i class="fa-solid fa-chevron-left"></i></button>${pageItems(totalPages).map((page) => page === '…' ? '<span class="audit-ellipsis">...</span>' : `<button class="audit-page ${page === currentPage ? 'active' : ''}" data-page="${page}">${page}</button>`).join('')}<button class="audit-page" data-page="${currentPage + 1}" ${currentPage === totalPages ? 'disabled' : ''} aria-label="Trang sau"><i class="fa-solid fa-chevron-right"></i></button>`;
  }

  $('auditFilters').addEventListener('submit', (event) => { event.preventDefault(); searchTerm = $('auditSearch').value.trim(); currentPage = 1; render(); });
  ['dateFrom','dateTo','actionFilter','userFilter','statusFilter'].forEach((id) => $(id).addEventListener('change', () => { currentPage = 1; render(); }));
  $('auditPagination').addEventListener('click', (event) => { const button = event.target.closest('[data-page]'); if (!button || button.disabled) return; currentPage = Number(button.dataset.page); render(); });
  $('exportLogs').addEventListener('click', () => {
    const quote = (value) => `"${String(value).replace(/"/g,'""')}"`, rows = [['Thời gian','Người dùng','Tài khoản','Hành động','Nội dung','Địa chỉ IP','Trạng thái'],...filteredLogs().map((log) => [formatTime(log.time),log.name,log.username,log.action,log.content,log.ip,log.status])];
    const blob = new Blob(['\ufeff' + rows.map((row) => row.map(quote).join(',')).join('\r\n')],{type:'text/csv;charset=utf-8'}), url = URL.createObjectURL(blob), link = document.createElement('a');
    link.href = url; link.download = 'nhat-ky-he-thong.csv'; link.click(); URL.revokeObjectURL(url);
  });
  console.assert(pageItems(525).join(',') === '1,2,3,4,5,…,525','Audit pagination self-check failed');
  render();
})();
