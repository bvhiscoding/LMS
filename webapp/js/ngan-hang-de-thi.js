(() => {
  const view = document.getElementById('bankView');
  if (!view) return;
  const byId = (id) => document.getElementById(id);
  const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char]);

  const questions = [
    ['CH-001245', 'An toàn lao động là gì?', 'Trắc nghiệm', 'Dễ', 0.5],
    ['CH-001246', 'Mục tiêu của công tác an toàn lao động là?', 'Trắc nghiệm', 'Trung bình', 0.5],
    ['CH-001247', 'Theo bạn, yếu tố nào sau đây không phải là nguy cơ mất an toàn?', 'Trắc nghiệm', 'Khó', 0.5],
    ['CH-001248', 'Điền vào chỗ trống: Người lao động có quyền từ chối công việc khi...', 'Tự luận', 'Trung bình', 1],
    ['CH-001249', 'Đúng hay Sai: Người lao động phải tuân thủ quy trình an toàn.', 'Đúng / Sai', 'Dễ', 0.5],
    ['CH-001250', 'Trang bị bảo hộ cá nhân nào bắt buộc khi làm việc trên cao?', 'Trắc nghiệm', 'Trung bình', 1],
    ['CH-001251', 'Nồng độ khí CH4 vượt mức nào thì phải dừng làm việc?', 'Trắc nghiệm', 'Khó', 1],
    ['CH-001252', 'Trình bày quy trình báo cáo sự cố mất an toàn.', 'Tự luận', 'Khó', 2]
  ].map((row, index) => ({
    id: 248 - index,
    code: row[0], content: row[1], type: row[2], level: row[3], score: row[4],
    topic: ['An toàn lao động', 'Thông gió hầm lò', 'An toàn cá nhân'][index % 3],
    category: ['An toàn lao động', 'Kỹ thuật mỏ', 'An toàn vận hành'][index % 3],
    author: ['Nguyễn Văn A', 'Trần Thị B', 'Lê Văn C'][index % 3],
    date: `${20 - Math.floor(index / 2)}/05/2024`, status: index === 7 ? 'Ngừng sử dụng' : 'Sử dụng'
  }));

  const exams = [
    ['DE-000123', 'Đề thi An toàn lao động - Cơ bản', 'An toàn lao động', 40, 40, 60, 'Thủ công', 'Nguyễn Văn A'],
    ['DE-000122', 'Đề thi An toàn lao động - Nâng cao', 'An toàn lao động', 50, 50, 75, 'Tự động', 'Nguyễn Văn A'],
    ['DE-000121', 'Đề thi PCCC cơ sở - Mức 2', 'Phòng cháy chữa cháy', 30, 30, 45, 'Thủ công', 'Trần Thị B'],
    ['DE-000120', 'Đề thi PCCC cơ sở - Mức 1', 'Phòng cháy chữa cháy', 25, 25, 30, 'Tự động', 'Nguyễn Văn A'],
    ['DE-000119', 'Đề thi Sơ cứu ban đầu', 'Sơ cứu y tế', 35, 35, 50, 'Tự động', 'Lê Văn C'],
    ['DE-000118', 'Đề thi An toàn điện', 'An toàn điện', 40, 40, 60, 'Thủ công', 'Trần Thị B'],
    ['DE-000117', 'Đề thi Hóa chất nguy hiểm', 'An toàn hóa chất', 45, 45, 60, 'Tự động', 'Nguyễn Văn A'],
    ['DE-000116', 'Đề thi An toàn lao động - Ôn tập', 'An toàn lao động', 60, 60, 90, 'Thủ công', 'Nguyễn Văn A']
  ].map((row, index) => ({ id: 123 - index, code: row[0], name: row[1], category: row[2], count: row[3], score: row[4], duration: row[5], method: row[6], author: row[7] }));

  const state = {
    tab: new URLSearchParams(location.search).get('tab') === 'exams' ? 'exams' : 'questions',
    page: 1, pageSize: 10, filters: {}, manualTab: 'bank', selectedQuestions: new Set([0, 1, 2])
  };
  let activeExam = null;
  let detailPreviewZoom = 85;

  const toast = (message) => {
    const node = byId('bankToast'); node.textContent = message; node.hidden = false;
    clearTimeout(toast.timer); toast.timer = setTimeout(() => { node.hidden = true; }, 2200);
  };
  const normalize = (value) => String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase();
  const levelClass = (level) => level === 'Dễ' ? '' : level === 'Khó' ? 'hard' : 'medium';

  const questionView = () => `<div class="bank-toolbar"><h2><i class="fa-regular fa-circle-question"></i>Danh sách câu hỏi</h2><div><button class="btn ghost" data-action="import"><i class="fa-solid fa-file-arrow-up"></i>Nhập Excel</button><a class="btn primary" href="them-cau-hoi.html"><i class="fa-solid fa-plus"></i>Thêm câu hỏi</a><button class="btn ghost" data-action="bulk">Khác <i class="fa-solid fa-chevron-down"></i></button></div></div>
    <form class="bank-filter" id="bankFilter"><label class="bank-search"><span>Tìm kiếm</span><input name="q" placeholder="Tìm kiếm câu hỏi, mã câu hỏi..."><i class="fa-solid fa-magnifying-glass"></i></label><label><span>Chuyên đề</span><select name="category"><option value="">Tất cả</option><option>An toàn lao động</option><option>Kỹ thuật mỏ</option><option>An toàn vận hành</option></select></label><label><span>Loại câu hỏi</span><select name="type"><option value="">Tất cả</option><option>Trắc nghiệm</option><option>Đúng / Sai</option><option>Tự luận</option></select></label><label><span>Mức độ</span><select name="level"><option value="">Tất cả</option><option>Dễ</option><option>Trung bình</option><option>Khó</option></select></label><label><span>Trạng thái</span><select name="status"><option value="">Tất cả</option><option>Sử dụng</option><option>Ngừng sử dụng</option></select></label><button type="button" class="btn ghost" data-action="reset"><i class="fa-solid fa-filter-circle-xmark"></i>Xóa lọc</button></form>
    ${tableShell('<th><input type="checkbox" data-select-all></th><th>Mã câu hỏi</th><th>Nội dung câu hỏi</th><th>Loại câu hỏi</th><th>Chủ đề</th><th>Mức độ</th><th>Điểm</th><th>Người tạo</th><th>Thao tác</th>')}`;

  const examView = () => `<div class="bank-toolbar"><h2><i class="fa-regular fa-file-lines"></i>Danh sách đề thi</h2><div><button class="btn ghost" data-action="import"><i class="fa-solid fa-file-arrow-up"></i>Nhập Excel</button><button class="btn ghost" data-action="filter-focus"><i class="fa-solid fa-filter"></i>Bộ lọc</button><button class="btn primary" data-action="open-manual-exam"><i class="fa-solid fa-plus"></i>Tạo đề thủ công</button><button class="btn primary green" data-action="open-auto-exam"><i class="fa-solid fa-wand-magic-sparkles"></i>Tạo đề tự động</button></div></div>
    <form class="bank-filter exam-filter" id="bankFilter"><label class="bank-search"><span>Tìm kiếm</span><input name="q" placeholder="Tìm kiếm theo mã đề, tên đề thi..."><i class="fa-solid fa-magnifying-glass"></i></label><label><span>Chuyên đề</span><select name="category"><option value="">Tất cả chuyên đề</option><option>An toàn lao động</option><option>Phòng cháy chữa cháy</option><option>Sơ cứu y tế</option></select></label><label><span>Hình thức tạo</span><select name="method"><option value="">Tất cả</option><option>Thủ công</option><option>Tự động</option></select></label><label><span>Người tạo</span><select name="author"><option value="">Tất cả người tạo</option><option>Nguyễn Văn A</option><option>Trần Thị B</option><option>Lê Văn C</option></select></label><button type="button" class="btn ghost" data-action="reset"><i class="fa-solid fa-rotate-left"></i>Xóa bộ lọc</button></form>
    ${tableShell('<th><input type="checkbox" data-select-all></th><th>Mã đề</th><th>Tên đề thi</th><th>Chuyên đề</th><th>Số câu</th><th>Tổng điểm</th><th>Thời gian</th><th>Hình thức tạo</th><th>Người tạo</th><th>Thao tác</th>')}`;

  function tableShell(headers) {
    return `<div class="bank-table-card"><div class="bank-table-wrap"><table class="bank-table"><thead><tr>${headers}</tr></thead><tbody id="bankBody"></tbody></table></div><footer class="bank-footer"><span id="bankSummary"></span><div class="bank-pagination" id="bankPagination"></div></footer></div>`;
  }

  function actionMenu(item, type) {
    return `<div class="bank-actions"><button data-action="menu" data-id="${item.id}"><i class="fa-solid fa-ellipsis"></i></button><div class="bank-menu" hidden>${type === 'exam' ? `<button data-action="view-exam" data-id="${item.id}"><i class="fa-regular fa-eye"></i>Xem chi tiết</button>` : `<a href="chi-tiet-cau-hoi.html?id=${item.id}"><i class="fa-regular fa-eye"></i>Xem chi tiết</a>`}<button data-action="copy" data-id="${item.id}"><i class="fa-regular fa-copy"></i>Sao chép</button><button data-action="delete" data-id="${item.id}" class="delete"><i class="fa-regular fa-trash-can"></i>Xóa</button></div></div>`;
  }

  function filteredData() {
    const data = state.tab === 'questions' ? questions : exams;
    return data.filter((item) => Object.entries(state.filters).every(([key, value]) => !value || (key === 'q' ? normalize(Object.values(item).join(' ')).includes(normalize(value)) : normalize(item[key]) === normalize(value))));
  }

  function renderRows() {
    const data = filteredData();
    const pages = Math.max(1, Math.ceil(data.length / state.pageSize));
    state.page = Math.min(state.page, pages);
    const rows = data.slice((state.page - 1) * state.pageSize, state.page * state.pageSize);
    const body = byId('bankBody');
    if (state.tab === 'questions') {
      body.innerHTML = rows.map((item) => `<tr><td><input type="checkbox"></td><td><a href="chi-tiet-cau-hoi.html?id=${item.id}">${item.code}</a></td><td>${escapeHtml(item.content)}</td><td><span class="bank-badge">${item.type}</span></td><td>${item.topic}</td><td><span class="bank-badge ${levelClass(item.level)}">${item.level}</span></td><td>${item.score}</td><td>${item.author}<small>${item.date}</small></td><td>${actionMenu(item, 'question')}</td></tr>`).join('');
    } else {
      body.innerHTML = rows.map((item) => `<tr><td><input type="checkbox"></td><td><button class="exam-code-link" data-action="view-exam" data-id="${item.id}">${item.code}</button></td><td>${item.name}</td><td>${item.category}</td><td>${item.count}</td><td>${item.score.toFixed(1)}</td><td>${item.duration} phút</td><td><span class="bank-badge ${item.method === 'Tự động' ? 'auto' : ''}">${item.method}</span></td><td>${item.author}</td><td>${actionMenu(item, 'exam')}</td></tr>`).join('');
    }
    if (!rows.length) body.innerHTML = `<tr><td colspan="10" class="bank-empty">Không tìm thấy dữ liệu phù hợp</td></tr>`;
    const from = data.length ? (state.page - 1) * state.pageSize + 1 : 0;
    const to = Math.min(state.page * state.pageSize, data.length);
    byId('bankSummary').textContent = `Hiển thị ${from} đến ${to} của ${data.length} ${state.tab === 'questions' ? 'câu hỏi' : 'đề thi'}`;
    byId('bankPagination').innerHTML = `<button class="bank-page" data-page="${state.page - 1}" ${state.page === 1 ? 'disabled' : ''}><i class="fa-solid fa-chevron-left"></i></button>${Array.from({ length: pages }, (_, index) => `<button class="bank-page ${state.page === index + 1 ? 'active' : ''}" data-page="${index + 1}">${index + 1}</button>`).join('')}<button class="bank-page" data-page="${state.page + 1}" ${state.page === pages ? 'disabled' : ''}><i class="fa-solid fa-chevron-right"></i></button>`;
  }

  function render() {
    document.querySelectorAll('[data-bank-tab]').forEach((button) => button.classList.toggle('active', button.dataset.bankTab === state.tab));
    view.innerHTML = state.tab === 'questions' ? questionView() : examView();
    state.filters = {}; state.page = 1; renderRows();
  }

  const matrix = [
    ['Trắc nghiệm 4 lựa chọn', 'fa-list-ul', [['Dễ', 10], ['Trung bình', 15], ['Khó', 5]]],
    ['Đúng / Sai', 'fa-circle-check', [['Dễ', 5], ['Trung bình', 0], ['Khó', 0]]],
    ['Tự luận', 'fa-pen-to-square', [['Dễ', 0], ['Trung bình', 0], ['Khó', 2]]]
  ];

  function renderAutoMatrix() {
    byId('autoMatrixBody').innerHTML = matrix.flatMap(([type, icon, levels]) => levels.map(([level, count], index) => `<tr>${index === 0 ? `<td class="matrix-type" rowspan="3"><i class="fa-solid ${icon}"></i>${type}</td>` : ''}<td>${level}</td><td><input type="number" min="0" value="${count}" data-matrix-count></td><td><button type="button" aria-label="Xóa cấu hình"><i class="fa-regular fa-trash-can"></i></button></td></tr>`)).join('');
    updateAutoTotal();
  }
  function updateAutoTotal() {
    byId('autoQuestionTotal').textContent = [...document.querySelectorAll('[data-matrix-count]')].reduce((sum, input) => sum + Number(input.value || 0), 0);
  }

  function renderManualQuestions() {
    const query = normalize(byId('manualQuestionSearch')?.value || '');
    const visible = questions.map((item, index) => ({ item, index })).filter(({ item, index }) => (!query || normalize(`${item.code} ${item.content}`).includes(query)) && (state.manualTab === 'bank' || state.selectedQuestions.has(index)));
    byId('manualQuestionBody').innerHTML = visible.map(({ item, index }) => {
      const selected = state.selectedQuestions.has(index);
      return `<tr><td><input type="checkbox" data-manual-question="${index}" ${selected ? 'checked' : ''}></td><td>${item.code}</td><td title="${escapeHtml(item.content)}">${escapeHtml(item.content)}</td><td>${item.type}</td><td><span class="question-level ${levelClass(item.level)}">${item.level}</span></td><td>${item.score.toFixed(1)}</td><td><button type="button" class="add-question ${selected ? 'selected' : ''}" data-toggle-question="${index}" aria-label="${selected ? 'Bỏ câu hỏi' : 'Thêm câu hỏi'}"><i class="fa-solid ${selected ? 'fa-check' : 'fa-plus'}"></i></button></td></tr>`;
    }).join('') || '<tr><td colspan="7" class="bank-empty">Không có câu hỏi phù hợp</td></tr>';
    const selected = [...state.selectedQuestions].map((index) => questions[index]).filter(Boolean);
    byId('manualSelectedCount').textContent = `${selected.length} câu`;
    byId('manualSelectedTabCount').textContent = selected.length;
    byId('manualSelectedScore').textContent = `${selected.reduce((sum, item) => sum + item.score, 0).toFixed(1)} / 10`;
    document.querySelectorAll('[data-manual-tab]').forEach((button) => button.classList.toggle('active', button.dataset.manualTab === state.manualTab));
  }

  function paperTemplate(exam) {
    return `<h2>ĐỀ THI CUỐI KHÓA<br>AN TOÀN LAO ĐỘNG</h2><div class="paper-meta"><p><b>Chuyên đề:</b> &nbsp; ${exam.category}<br><b>Thời gian làm bài:</b> &nbsp; ${exam.duration} phút</p><p><b>Tổng số câu:</b> &nbsp; ${exam.count} câu<br><b>Tổng điểm:</b> &nbsp; ${exam.score.toFixed(1)} điểm</p></div><p class="paper-instruction"><b>Hướng dẫn:</b> Chọn đáp án đúng nhất (câu 1 – 30). Phần TỰ LUẬN, trình bày ngắn gọn, rõ ràng.</p><h3>I. TRẮC NGHIỆM (30 câu)</h3><div class="paper-question"><b>Câu 1.</b> Mục tiêu của công tác an toàn lao động là gì?<div class="paper-answers"><span>A. Ngăn ngừa tai nạn lao động và bệnh nghề nghiệp.</span><span>B. Tăng năng suất lao động.</span><span>C. Giảm chi phí sản xuất.</span><span>D. Cả A và B đều đúng.</span></div></div><div class="paper-question"><b>Câu 2.</b> Khi phát hiện nguy cơ mất an toàn, người lao động cần làm gì đầu tiên?<div class="paper-answers"><span>A. Báo cáo ngay cho người quản lý.</span><span>B. Bỏ qua nếu chưa xảy ra sự cố.</span><span>C. Tự khắc phục nếu có thể.</span><span>D. Tiếp tục làm việc bình thường.</span></div></div><div class="paper-question"><b>Câu 3.</b> Biển báo nào sau đây là biển báo cấm?<div class="paper-signs"><span>A. <i class="paper-sign stop">×</i></span><span>B. <i class="paper-sign warning"><i class="fa-solid fa-bolt"></i></i></span><span>C. <i class="paper-sign safe"><i class="fa-solid fa-helmet-safety"></i></i></span><span>D. <i class="paper-exit"><i class="fa-solid fa-person-running"></i> LỐI THOÁT</i></span></div></div><div class="paper-question"><b>Câu 4.</b> Trang bị bảo hộ cá nhân (PPE) nào bắt buộc phải sử dụng khi làm việc trên cao?<div class="paper-answers"><span>A. Mũ bảo hộ.</span><span>B. Găng tay.</span><span>C. Dây an toàn toàn thân.</span><span>D. Giày bảo hộ.</span></div></div>`;
  }

  function renderExamDetail(exam) {
    byId('detailExamName').textContent = exam.name;
    byId('detailExamCode').textContent = exam.code;
    byId('detailQuestionCount').textContent = exam.count;
    byId('detailExamScore').textContent = exam.score.toFixed(1);
    byId('detailExamDuration').textContent = `${exam.duration} phút`;
    byId('detailExamMethod').textContent = exam.method;
    byId('detailExamInfo').innerHTML = [
      ['fa-layer-group', 'Chuyên đề', exam.category], ['fa-user', 'Người tạo', exam.author],
      ['fa-calendar-days', 'Ngày tạo', '11/07/2026 09:30'], ['fa-user-pen', 'Cập nhật bởi', exam.author],
      ['fa-shuffle', 'Trộn câu hỏi', 'Có'], ['fa-shuffle', 'Trộn đáp án', 'Có']
    ].map(([icon, label, value]) => `<div><dt><i class="fa-solid ${icon}"></i>${label}</dt><dd>${value}</dd></div>`).join('');
    byId('detailExamNote').textContent = exam.note || 'Đề thi tổng hợp kiến thức An toàn lao động dành cho học viên cuối khóa.';
    byId('detailExamPaper').innerHTML = paperTemplate(exam);
  }

  function setExamDetailMode(editing) {
    byId('examDetailDialog').classList.toggle('is-editing', editing);
    byId('examDetailReadView').hidden = editing;
    byId('examDetailEditForm').hidden = !editing;
    byId('examDetailModalTitle').textContent = editing ? 'Chỉnh sửa đề thi' : 'Chi tiết đề thi';
    byId('examDetailModalSubtitle').textContent = editing ? 'Cập nhật cấu hình và đối chiếu trực tiếp với bản xem trước' : 'Xem thông tin cấu hình và nội dung đề';
    if (editing && activeExam) {
      byId('editExamName').value = activeExam.name;
      byId('editExamCategory').value = activeExam.category;
      byId('editExamMethod').value = activeExam.method;
      byId('editExamDuration').value = activeExam.duration;
      byId('editExamScore').value = activeExam.score;
      byId('editExamNote').value = activeExam.note || 'Đề thi tổng hợp kiến thức An toàn lao động dành cho học viên cuối khóa.';
    }
    byId('examDetailFooter').innerHTML = editing
      ? '<button type="button" class="btn ghost" data-detail-action="cancel-edit"><i class="fa-solid fa-arrow-left"></i>Hủy chỉnh sửa</button><span></span><button type="button" class="btn primary" data-detail-action="save-edit"><i class="fa-solid fa-check"></i>Lưu thay đổi</button>'
      : '<button type="button" class="btn ghost danger-action" data-detail-action="delete"><i class="fa-regular fa-trash-can"></i>Xóa đề</button><span></span><button type="button" class="btn ghost" data-close-dialog>Đóng</button>';
  }

  function updateDetailPreviewZoom() {
    byId('previewZoomLabel').textContent = `${detailPreviewZoom}%`;
    byId('detailExamPaper').style.zoom = detailPreviewZoom / 100;
  }

  function openExamDetail(id) {
    activeExam = exams.find((item) => item.id === Number(id)) || exams[0];
    renderExamDetail(activeExam);
    setExamDetailMode(false);
    detailPreviewZoom = 85;
    updateDetailPreviewZoom();
    byId('examDetailDialog').showModal();
  }

  document.querySelector('.exam-bank-tabs').addEventListener('click', (event) => {
    const button = event.target.closest('[data-bank-tab]'); if (!button) return;
    state.tab = button.dataset.bankTab; history.replaceState(null, '', `?tab=${state.tab}`); render();
  });

  view.addEventListener('input', (event) => {
    if (event.target.form?.id !== 'bankFilter') return;
    state.filters = Object.fromEntries(new FormData(event.target.form)); state.page = 1; renderRows();
  });
  view.addEventListener('change', (event) => {
    if (event.target.matches('[data-select-all]')) document.querySelectorAll('#bankBody input[type=checkbox]').forEach((checkbox) => { checkbox.checked = event.target.checked; });
  });
  view.addEventListener('click', (event) => {
    const button = event.target.closest('[data-action],[data-page]'); if (!button) return;
    if (button.dataset.page) { state.page = Number(button.dataset.page); renderRows(); return; }
    const action = button.dataset.action;
    if (action === 'menu') { const menu = button.nextElementSibling; document.querySelectorAll('.bank-menu').forEach((node) => { if (node !== menu) node.hidden = true; }); menu.hidden = !menu.hidden; }
    if (action === 'reset') { button.closest('form').reset(); state.filters = {}; renderRows(); }
    if (action === 'import') byId('importDialog').showModal();
    if (action === 'open-auto-exam') { renderAutoMatrix(); byId('autoExamDialog').showModal(); }
    if (action === 'open-manual-exam') { state.manualTab = 'bank'; renderManualQuestions(); byId('manualExamDialog').showModal(); }
    if (action === 'view-exam') openExamDetail(button.dataset.id);
    if (action === 'bulk') toast('Đã mở nhóm thao tác hàng loạt');
    if (action === 'filter-focus') byId('bankFilter').querySelector('input').focus();
  });

  byId('autoMatrixBody').addEventListener('input', updateAutoTotal);
  byId('manualExamDialog').addEventListener('click', (event) => {
    const tab = event.target.closest('[data-manual-tab]');
    if (tab) { state.manualTab = tab.dataset.manualTab; renderManualQuestions(); return; }
    const toggle = event.target.closest('[data-toggle-question]');
    if (toggle) { const index = Number(toggle.dataset.toggleQuestion); state.selectedQuestions.has(index) ? state.selectedQuestions.delete(index) : state.selectedQuestions.add(index); renderManualQuestions(); return; }
    if (event.target.closest('[data-show-selected]')) { state.manualTab = 'selected'; renderManualQuestions(); }
    if (event.target.closest('[data-save-draft]')) toast('Đã lưu bản nháp đề thi');
    if (event.target.closest('[data-preview-manual]')) openExamDetail(exams[0].id);
  });
  byId('manualExamDialog').addEventListener('change', (event) => {
    if (event.target.matches('[data-manual-question]')) { const index = Number(event.target.dataset.manualQuestion); event.target.checked ? state.selectedQuestions.add(index) : state.selectedQuestions.delete(index); renderManualQuestions(); }
    if (event.target.id === 'manualSelectAll') { questions.forEach((_, index) => event.target.checked ? state.selectedQuestions.add(index) : state.selectedQuestions.delete(index)); renderManualQuestions(); }
  });
  byId('manualQuestionSearch').addEventListener('input', renderManualQuestions);
  byId('examDetailDialog').addEventListener('click', (event) => {
    if (event.target.closest('[data-close-dialog]')) {
      if (byId('examDetailDialog').open) byId('examDetailDialog').close();
      return;
    }
    const zoom = event.target.closest('[data-preview-zoom]')?.dataset.previewZoom;
    if (zoom) {
      detailPreviewZoom = Math.max(55, Math.min(115, detailPreviewZoom + (zoom === 'in' ? 10 : -10)));
      updateDetailPreviewZoom();
      return;
    }
    const action = event.target.closest('[data-detail-action]')?.dataset.detailAction;
    if (!action) return;
    if (action === 'copy') toast('Đã sao chép đề thi');
    if (action === 'export') toast('Đã tạo bản xuất PDF');
    if (action === 'edit') setExamDetailMode(true);
    if (action === 'cancel-edit') { renderExamDetail(activeExam); setExamDetailMode(false); }
    if (action === 'save-edit') byId('examDetailEditForm').requestSubmit();
    if (action === 'delete' && confirm('Xóa đề thi này?')) {
      const index = exams.indexOf(activeExam);
      if (index >= 0) exams.splice(index, 1);
      byId('examDetailDialog').close(); renderRows(); toast('Đã xóa đề thi');
    }
  });
  byId('examDetailEditForm').addEventListener('input', () => {
    if (!activeExam) return;
    const preview = { ...activeExam, name: byId('editExamName').value || activeExam.name, category: byId('editExamCategory').value, duration: Number(byId('editExamDuration').value || activeExam.duration), score: Number(byId('editExamScore').value || activeExam.score) };
    byId('detailExamPaper').innerHTML = paperTemplate(preview);
  });
  byId('examDetailEditForm').addEventListener('submit', (event) => {
    event.preventDefault();
    if (!event.currentTarget.reportValidity() || !activeExam) return;
    activeExam.name = byId('editExamName').value.trim();
    activeExam.category = byId('editExamCategory').value;
    activeExam.duration = Number(byId('editExamDuration').value);
    activeExam.score = Number(byId('editExamScore').value);
    activeExam.note = byId('editExamNote').value.trim();
    renderExamDetail(activeExam); renderRows(); setExamDetailMode(false); toast('Đã lưu thay đổi đề thi');
  });

  document.querySelectorAll('[data-close-dialog]').forEach((button) => button.addEventListener('click', () => button.closest('dialog').close()));
  document.querySelectorAll('.bank-dialog').forEach((dialog) => dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); }));
  byId('autoExamBuilderForm').addEventListener('submit', (event) => { event.preventDefault(); if (!event.currentTarget.reportValidity()) return; byId('autoExamDialog').close(); toast('Đã tạo đề thi tự động'); });
  byId('manualExamBuilderForm').addEventListener('submit', (event) => { event.preventDefault(); if (!event.currentTarget.reportValidity()) return; exams.unshift({ id: Date.now(), code: `DE-${String(Date.now()).slice(-6)}`, name: event.currentTarget.elements.name.value, category: 'An toàn lao động', count: state.selectedQuestions.size, score: 10, duration: 45, method: 'Thủ công', author: 'Nguyễn Văn A' }); byId('manualExamDialog').close(); renderRows(); toast('Đã lưu đề thi thủ công'); });
  byId('importForm').addEventListener('submit', (event) => { event.preventDefault(); });

  renderAutoMatrix(); renderManualQuestions(); render();
})();
