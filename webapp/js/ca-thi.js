(() => {
  const root = document.getElementById('gv-examsession');
  if (!root) return;
  const $ = (id) => document.getElementById(id);
  const esc = (value) => String(value ?? '').replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
  const normalize = (value) => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();
  const seed = [
    { id: 1, subject: 'Sát hạch an toàn Quý III', name: 'Ca 1 - Sáng 09/07', exam: 'Mã đề 04', date: '2026-07-09', start: '09:00', end: '09:45', candidates: 42, status: 'Đang diễn ra', room: 'Phòng máy 01', description: 'Ca thi dành cho học viên khối sản xuất, thực hiện giám sát trực tuyến.' },
    { id: 2, subject: 'Sát hạch an toàn Quý III', name: 'Ca 2 - Chiều 09/07', exam: 'Mã đề 05', date: '2026-07-09', start: '14:00', end: '14:45', candidates: 45, status: 'Sắp diễn ra', room: 'Phòng máy 02', description: 'Thí sinh có mặt trước giờ thi 15 phút để kiểm tra thông tin.' },
    { id: 3, subject: 'Sát hạch an toàn Quý III', name: 'Ca 3 - Sáng 10/07', exam: 'Mã đề 06', date: '2026-07-10', start: '09:00', end: '09:45', candidates: 41, status: 'Sắp diễn ra', room: 'Hội trường A', description: 'Ca thi tập trung dành cho cán bộ kỹ thuật.' },
    { id: 4, subject: 'Sát hạch an toàn Quý III', name: 'Ca 0 - Ngày 05/07', exam: 'Mã đề 03', date: '2026-07-05', start: '08:30', end: '09:15', candidates: 40, status: 'Hoàn thành', room: 'Phòng máy 01', description: 'Đã hoàn tất chấm điểm và ghi nhận kết quả cho toàn bộ thí sinh.' },
    { id: 5, subject: 'Chuyển đổi số cơ bản', name: 'Ca 1 - Chiều 12/07', exam: 'Mã đề 07', date: '2026-07-12', start: '13:30', end: '14:30', candidates: 36, status: 'Sắp diễn ra', room: 'Trực tuyến', description: 'Thi trực tuyến có giám sát, yêu cầu kiểm tra webcam trước giờ thi.' },
    { id: 6, subject: 'Quản trị kinh doanh hiện đại', name: 'Ca 1 - Sáng 15/07', exam: 'Mã đề 04', date: '2026-07-15', start: '08:00', end: '09:00', candidates: 32, status: 'Tạm dừng', room: 'Hội trường A', description: 'Tạm dừng để điều chỉnh danh sách thí sinh.' }
  ];
  let sessions = window.LMSStore.seed('exam-sessions-v2', seed);
  let detailId = null;
  let deleteId = null;

  const body = $('examSessionBody');
  const filters = $('examSessionFilters');
  const form = $('examSessionForm');
  const sessionDialog = $('examSessionDialog');
  const detailDialog = $('examSessionDetailDialog');
  const deleteDialog = $('examSessionDeleteDialog');
  const reportDialog = $('examSessionReportDialog');

  const formatDate = (value) => {
    const [year, month, day] = String(value).split('-');
    return year && month && day ? `${day}/${month}/${year}` : value;
  };
  const statusClass = (status) => status === 'Đang diễn ra' ? 'live' : status === 'Hoàn thành' ? 'done' : status === 'Tạm dừng' ? 'paused' : '';
  const save = () => window.LMSStore.write('exam-sessions-v2', sessions);
  const closeMenus = () => {
    document.querySelectorAll('.exam-session-action-menu').forEach((menu) => { menu.hidden = true; });
    document.querySelectorAll('.exam-session-action-trigger').forEach((button) => button.setAttribute('aria-expanded', 'false'));
  };

  function filteredSessions() {
    const data = Object.fromEntries(new FormData(filters));
    const query = normalize(data.query);
    return sessions.filter((item) => (!data.status || item.status === data.status) && (!query || normalize(`${item.subject} ${item.name} ${item.exam} ${item.date} ${item.start} ${item.room}`).includes(query)));
  }

  function render() {
    const data = filteredSessions();
    body.innerHTML = data.length ? data.map((item) => `<tr><td><b>${esc(item.subject)}</b><small>${esc(item.room)}</small></td><td><b>${esc(item.name)}</b><small>${formatDate(item.date)}</small></td><td>${esc(item.exam)}</td><td>${esc(item.start)}–${esc(item.end)}</td><td><b>${Number(item.candidates)}</b></td><td><span class="exam-session-status ${statusClass(item.status)}">${esc(item.status)}</span></td><td><div class="exam-session-row-actions"><button type="button" class="exam-session-action-trigger" data-session-menu aria-label="Mở menu thao tác" aria-haspopup="menu" aria-expanded="false"><i class="fa-solid fa-ellipsis-vertical"></i></button><div class="exam-session-action-menu" role="menu" hidden><button type="button" data-session-action="view" data-id="${item.id}" role="menuitem"><i class="fa-regular fa-eye"></i>Xem chi tiết</button><button type="button" data-session-action="edit" data-id="${item.id}" role="menuitem"><i class="fa-regular fa-pen-to-square"></i>Chỉnh sửa</button><button type="button" class="danger" data-session-action="delete" data-id="${item.id}" role="menuitem"><i class="fa-regular fa-trash-can"></i>Xóa</button></div></div></td></tr>`).join('') : '<tr><td colspan="7" class="exam-session-empty">Không tìm thấy ca thi phù hợp.</td></tr>';
    $('examSessionSummary').textContent = `Hiển thị ${data.length ? 1 : 0} đến ${data.length} của ${data.length} ca thi`;
  }

  function openForm(item = null) {
    form.reset();
    $('examSessionDialogTitle').textContent = item ? 'Chỉnh sửa ca thi' : 'Thêm ca thi';
    $('examSessionSaveLabel').textContent = item ? 'Lưu thay đổi' : 'Lưu';
    const defaults = { id: '', subject: '', name: '', status: 'Sắp diễn ra', exam: '', date: '2026-07-20', start: '08:00', end: '09:00', room: '', candidates: '', description: '' };
    const values = item || defaults;
    Object.keys(defaults).forEach((key) => { if (form.elements[key]) form.elements[key].value = values[key] ?? defaults[key]; });
    $('examSessionDescriptionCount').value = String(values.description || '').length;
    sessionDialog.showModal();
    requestAnimationFrame(() => form.elements.subject.focus());
  }

  function openDetail(item) {
    detailId = item.id;
    $('examDetailCode').textContent = `${item.exam} · ${formatDate(item.date)}`;
    $('examDetailName').textContent = item.name;
    $('examDetailSubject').textContent = item.subject;
    $('examDetailStatus').textContent = item.status;
    $('examDetailList').innerHTML = `<div><dt>Ngày thi</dt><dd>${formatDate(item.date)}</dd></div><div><dt>Thời gian</dt><dd>${esc(item.start)}–${esc(item.end)}</dd></div><div><dt>Đề thi</dt><dd>${esc(item.exam)}</dd></div><div><dt>Phòng thi</dt><dd>${esc(item.room)}</dd></div><div><dt>Số thí sinh</dt><dd>${Number(item.candidates)} người</dd></div><div><dt>Trạng thái</dt><dd>${esc(item.status)}</dd></div>`;
    $('examDetailDescription').textContent = item.description || 'Không có ghi chú.';
    detailDialog.showModal();
  }

  function openDelete(item) {
    deleteId = item.id;
    $('examDeleteName').textContent = item.name;
    deleteDialog.showModal();
  }

  function reportData(scope) {
    if (scope === 'active') return sessions.filter((item) => item.status === 'Đang diễn ra' || item.status === 'Sắp diễn ra');
    if (scope === 'completed') return sessions.filter((item) => item.status === 'Hoàn thành');
    return sessions;
  }

  function renderReport() {
    const scope = $('examSessionReportForm').elements.scope.value;
    const data = reportData(scope);
    const candidates = data.reduce((total, item) => total + Number(item.candidates || 0), 0);
    const completed = data.filter((item) => item.status === 'Hoàn thành').length;
    const upcoming = data.filter((item) => item.status === 'Sắp diễn ra').length;
    $('examReportOverview').innerHTML = `<article><i class="fa-solid fa-calendar-check"></i><span>Tổng ca thi<b>${data.length}</b></span></article><article><i class="fa-solid fa-users"></i><span>Tổng thí sinh<b>${candidates}</b></span></article><article><i class="fa-solid fa-circle-check"></i><span>Đã hoàn thành<b>${completed}</b></span></article><article><i class="fa-regular fa-clock"></i><span>Sắp diễn ra<b>${upcoming}</b></span></article>`;
    $('examReportPreviewNote').textContent = `Hiển thị ${Math.min(6, data.length)} trong ${data.length} ca thi sẽ được xuất`;
    $('examReportPreviewBody').innerHTML = data.length ? data.slice(0, 6).map((item, index) => `<tr><td>${index + 1}</td><td>${esc(item.subject)}</td><td><b>${esc(item.name)}</b></td><td>${esc(item.exam)}</td><td>${formatDate(item.date)}<br><small>${esc(item.start)}–${esc(item.end)}</small></td><td>${Number(item.candidates)}</td><td><span class="exam-session-status ${statusClass(item.status)}">${esc(item.status)}</span></td></tr>`).join('') : '<tr><td colspan="7" class="exam-report-empty">Không có dữ liệu phù hợp với phạm vi đã chọn.</td></tr>';
  }

  filters.addEventListener('input', render);
  filters.addEventListener('reset', () => setTimeout(render));
  $('addExamSession').addEventListener('click', () => openForm());
  $('exportExamSessions').addEventListener('click', () => { $('examSessionReportForm').reset(); renderReport(); reportDialog.showModal(); });
  form.elements.description.addEventListener('input', (event) => { $('examSessionDescriptionCount').value = event.target.value.length; });
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    form.elements.end.setCustomValidity(data.end <= data.start ? 'Thời gian kết thúc phải sau thời gian bắt đầu.' : '');
    if (!form.reportValidity()) return;
    const current = sessions.find((item) => String(item.id) === data.id);
    const record = { subject: data.subject, name: data.name.trim(), status: data.status, exam: data.exam, date: data.date, start: data.start, end: data.end, room: data.room, candidates: Number(data.candidates), description: data.description.trim() };
    if (current) Object.assign(current, record);
    else sessions.unshift({ id: Math.max(0, ...sessions.map((item) => Number(item.id))) + 1, ...record });
    save();
    sessionDialog.close();
    render();
    window.showAppToast(current ? 'Đã cập nhật thông tin ca thi.' : 'Đã thêm ca thi mới.');
  });

  body.addEventListener('click', (event) => {
    const toggle = event.target.closest('[data-session-menu]');
    if (toggle) {
      event.stopPropagation();
      const menu = toggle.nextElementSibling;
      const wasOpen = !menu.hidden;
      closeMenus();
      if (!wasOpen) {
        const rect = toggle.getBoundingClientRect();
        const width = 172;
        const height = 126;
        menu.style.left = `${Math.max(10, Math.min(window.innerWidth - width - 10, rect.right - width))}px`;
        menu.style.top = `${rect.bottom + height > window.innerHeight - 10 ? rect.top - height - 6 : rect.bottom + 6}px`;
        menu.hidden = false;
        toggle.setAttribute('aria-expanded', 'true');
      }
      return;
    }
    const button = event.target.closest('[data-session-action]');
    if (!button) return;
    closeMenus();
    const item = sessions.find((row) => row.id === Number(button.dataset.id));
    if (!item) return;
    if (button.dataset.sessionAction === 'view') openDetail(item);
    if (button.dataset.sessionAction === 'edit') openForm(item);
    if (button.dataset.sessionAction === 'delete') openDelete(item);
  });

  $('editFromExamDetail').addEventListener('click', () => {
    const item = sessions.find((row) => row.id === detailId);
    detailDialog.close();
    if (item) openForm(item);
  });
  $('confirmDeleteExamSession').addEventListener('click', () => {
    const item = sessions.find((row) => row.id === deleteId);
    if (!item) return deleteDialog.close();
    sessions = sessions.filter((row) => row.id !== deleteId);
    save();
    deleteDialog.close();
    deleteId = null;
    render();
    window.showAppToast(`Đã xóa ca thi “${item.name}”.`);
  });

  $('examSessionReportForm').elements.scope.addEventListener('change', renderReport);
  $('examSessionReportForm').addEventListener('submit', (event) => {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    const values = Object.fromEntries(new FormData(event.currentTarget));
    const data = reportData(values.scope);
    if (!data.length) return window.showAppToast('Không có dữ liệu phù hợp để xuất.', 'error');
    const safe = (value) => { let text = String(value ?? ''); if (/^[=+\-@]/.test(text)) text = `'${text}`; return `"${text.replace(/"/g, '""')}"`; };
    const rows = [['STT', 'Chuyên đề thi', 'Ca thi', 'Đề thi', 'Ngày thi', 'Bắt đầu', 'Kết thúc', 'Phòng thi', 'Số thí sinh', 'Trạng thái', 'Mô tả'], ...data.map((item, index) => [index + 1, item.subject, item.name, item.exam, formatDate(item.date), item.start, item.end, item.room, item.candidates, item.status, item.description])];
    const csv = '\uFEFF' + rows.map((row) => row.map(safe).join(';')).join('\r\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `${normalize(values.reportName).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'bao-cao-ca-thi'}-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url));
    reportDialog.close();
    window.showAppToast(`Đã xuất báo cáo ${data.length} ca thi.`);
  });

  document.querySelectorAll('[data-close-session]').forEach((button) => button.addEventListener('click', () => sessionDialog.close()));
  document.querySelectorAll('[data-close-session-detail]').forEach((button) => button.addEventListener('click', () => detailDialog.close()));
  document.querySelectorAll('[data-close-session-delete]').forEach((button) => button.addEventListener('click', () => deleteDialog.close()));
  document.querySelectorAll('[data-close-session-report]').forEach((button) => button.addEventListener('click', () => reportDialog.close()));
  [sessionDialog, detailDialog, deleteDialog, reportDialog].forEach((dialog) => dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); }));
  document.addEventListener('click', closeMenus);
  window.addEventListener('resize', closeMenus);
  window.addEventListener('scroll', closeMenus, true);
  render();
})();
