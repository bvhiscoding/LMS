(() => {
  const view = document.getElementById('bankView');
  if (!view) return;
  view.dataset.realBankActions = 'true';
  const byId = (id) => document.getElementById(id);
  const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char]);

  let questions = [
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

  let exams = [
    ['DE-000123', 'Đề thi An toàn lao động - Cơ bản', 'An toàn lao động', 40, 40, 60, 'Thủ công', 'Nguyễn Văn A'],
    ['DE-000122', 'Đề thi An toàn lao động - Nâng cao', 'An toàn lao động', 50, 50, 75, 'Tự động', 'Nguyễn Văn A'],
    ['DE-000121', 'Đề thi PCCC cơ sở - Mức 2', 'Phòng cháy chữa cháy', 30, 30, 45, 'Thủ công', 'Trần Thị B'],
    ['DE-000120', 'Đề thi PCCC cơ sở - Mức 1', 'Phòng cháy chữa cháy', 25, 25, 30, 'Tự động', 'Nguyễn Văn A'],
    ['DE-000119', 'Đề thi Sơ cứu ban đầu', 'Sơ cứu y tế', 35, 35, 50, 'Tự động', 'Lê Văn C'],
    ['DE-000118', 'Đề thi An toàn điện', 'An toàn điện', 40, 40, 60, 'Thủ công', 'Trần Thị B'],
    ['DE-000117', 'Đề thi Hóa chất nguy hiểm', 'An toàn hóa chất', 45, 45, 60, 'Tự động', 'Nguyễn Văn A'],
    ['DE-000116', 'Đề thi An toàn lao động - Ôn tập', 'An toàn lao động', 60, 60, 90, 'Thủ công', 'Nguyễn Văn A']
  ].map((row, index) => ({ id: 123 - index, code: row[0], name: row[1], category: row[2], count: row[3], score: row[4], duration: row[5], method: row[6], author: row[7] }));

  questions = window.LMSStore.seed('questions',questions);
  exams = window.LMSStore.seed('exams',exams);
  const state = {
    tab: new URLSearchParams(location.search).get('tab') === 'exams' ? 'exams' : 'questions',
    page: 1, pageSize: 10, filters: {}
  };
  let activeExam = null;
  let detailPreviewZoom = 85;

  const toast = (message) => {
    const node = byId('bankToast'); node.textContent = message; node.hidden = false;
    clearTimeout(toast.timer); toast.timer = setTimeout(() => { node.hidden = true; }, 2200);
  };
  const normalize = (value) => String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase();
  const levelClass = (level) => level === 'Dễ' ? '' : level === 'Khó' ? 'hard' : 'medium';

  const questionView = () => `<div class="bank-toolbar"><h2><i class="fa-regular fa-circle-question"></i>Danh sách câu hỏi</h2><div><button class="btn ghost" data-action="import"><i class="fa-solid fa-file-arrow-up"></i>Nhập Excel</button><a class="btn primary" href="them-cau-hoi.html"><i class="fa-solid fa-plus"></i>Thêm câu hỏi</a></div></div>
    <form class="bank-filter" id="bankFilter"><label class="bank-search"><span>Tìm kiếm</span><input name="q" placeholder="Tìm kiếm câu hỏi, mã câu hỏi..."><i class="fa-solid fa-magnifying-glass"></i></label><label><span>Chuyên đề</span><select name="category"><option value="">Tất cả</option><option>An toàn lao động</option><option>Kỹ thuật mỏ</option><option>An toàn vận hành</option></select></label><label><span>Loại câu hỏi</span><select name="type"><option value="">Tất cả</option><option>Trắc nghiệm</option><option>Đúng / Sai</option><option>Tự luận</option></select></label><label><span>Mức độ</span><select name="level"><option value="">Tất cả</option><option>Dễ</option><option>Trung bình</option><option>Khó</option></select></label><label><span>Trạng thái</span><select name="status"><option value="">Tất cả</option><option>Sử dụng</option><option>Ngừng sử dụng</option></select></label><button type="button" class="btn ghost" data-action="reset"><i class="fa-solid fa-filter-circle-xmark"></i>Xóa lọc</button></form>
    ${tableShell('<th><input type="checkbox" data-select-all></th><th>Mã câu hỏi</th><th>Nội dung câu hỏi</th><th>Loại câu hỏi</th><th>Chủ đề</th><th>Mức độ</th><th>Điểm</th><th>Người tạo</th><th>Thao tác</th>')}`;

  const examView = () => `<div class="bank-toolbar"><h2><i class="fa-regular fa-file-lines"></i>Danh sách đề thi</h2><div><button class="btn ghost" data-action="import"><i class="fa-solid fa-file-arrow-up"></i>Nhập Excel</button><button class="btn ghost" data-action="filter-focus"><i class="fa-solid fa-filter"></i>Bộ lọc</button><button class="btn primary" data-action="open-random-exam"><i class="fa-solid fa-shuffle"></i>Tạo đề ngẫu nhiên</button><button class="btn primary green" data-action="open-auto-exam"><i class="fa-solid fa-wand-magic-sparkles"></i>Tạo đề tự động</button></div></div>
    <form class="bank-filter exam-filter" id="bankFilter"><label class="bank-search"><span>Tìm kiếm</span><input name="q" placeholder="Tìm kiếm theo mã đề, tên đề thi..."><i class="fa-solid fa-magnifying-glass"></i></label><label><span>Chuyên đề</span><select name="category"><option value="">Tất cả chuyên đề</option><option>An toàn lao động</option><option>Phòng cháy chữa cháy</option><option>Sơ cứu y tế</option></select></label><label><span>Hình thức tạo</span><select name="method"><option value="">Tất cả</option><option>Ngẫu nhiên</option><option>Thủ công</option><option>Tự động</option></select></label><label><span>Người tạo</span><select name="author"><option value="">Tất cả người tạo</option><option>Nguyễn Văn A</option><option>Trần Thị B</option><option>Lê Văn C</option></select></label><button type="button" class="btn ghost" data-action="reset"><i class="fa-solid fa-rotate-left"></i>Xóa bộ lọc</button></form>
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
      body.innerHTML = rows.map((item) => `<tr><td><input type="checkbox" data-record-id="${item.id}"></td><td><a href="chi-tiet-cau-hoi.html?id=${item.id}">${item.code||`CH-${String(item.id).padStart(6,'0')}`}</a></td><td>${escapeHtml(item.content)}</td><td><span class="bank-badge">${item.type}</span></td><td>${item.topic||item.category}</td><td><span class="bank-badge ${levelClass(item.level)}">${item.level}</span></td><td>${item.score}</td><td>${item.author||'Nguyễn Văn A'}<small>${item.date||new Date(item.createdAt||Date.now()).toLocaleDateString('vi-VN')}</small></td><td>${actionMenu(item, 'question')}</td></tr>`).join('');
    } else {
      body.innerHTML = rows.map((item) => `<tr><td><input type="checkbox" data-record-id="${item.id}"></td><td><button class="exam-code-link" data-action="view-exam" data-id="${item.id}">${item.code}</button></td><td>${item.name}</td><td>${item.category}</td><td>${item.count}</td><td>${Number(item.score).toFixed(1)}</td><td>${item.duration} phút</td><td><span class="bank-badge ${item.method === 'Tự động' ? 'auto' : ''}">${item.method}</span></td><td>${item.author}</td><td>${actionMenu(item, 'exam')}</td></tr>`).join('');
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
  view.addEventListener('click', async (event) => {
    const button = event.target.closest('[data-action],[data-page]'); if (!button) return;
    if (button.dataset.page) { state.page = Number(button.dataset.page); renderRows(); return; }
    const action = button.dataset.action;
    if (action === 'menu') { const menu = button.nextElementSibling; document.querySelectorAll('.bank-menu').forEach((node) => { if (node !== menu) node.hidden = true; }); menu.hidden = !menu.hidden; }
    if (action === 'reset') { button.closest('form').reset(); state.filters = {}; renderRows(); }
    if (action === 'import') byId('importDialog').showModal();
    if (action === 'open-auto-exam') { renderAutoMatrix(); byId('autoExamDialog').showModal(); }
    if (action === 'open-random-exam') byId('randomExamDialog').showModal();
    if (action === 'view-exam') openExamDetail(button.dataset.id);
    if (action === 'bulk') { const selected=[...view.querySelectorAll('[data-record-id]:checked')].map(input=>input.dataset.recordId);if(!selected.length){toast('Hãy chọn ít nhất một bản ghi');return}const accepted=await window.appDialog({title:'Thao tác hàng loạt',html:`<p class="app-dialog-note">Đã chọn <b>${selected.length}</b> ${state.tab==='questions'?'câu hỏi':'đề thi'}.</p><label class="field">Thao tác<select id="bankBulkAction"><option value="activate">Chuyển sang sử dụng</option><option value="pause">Ngừng sử dụng</option><option value="duplicate">Tạo bản sao</option><option value="delete">Xóa đã chọn</option></select></label><p>Thao tác xóa không thể hoàn tác trong danh sách hiện tại.</p>`,confirmText:'Áp dụng',cancelText:'Hủy'});if(!accepted)return;const command=byId('bankBulkAction').value,target=state.tab==='questions'?questions:exams;if(command==='delete'){const filtered=target.filter(item=>!selected.includes(String(item.id)));if(state.tab==='questions')questions=filtered;else exams=filtered}else if(command==='duplicate'){selected.forEach(id=>{const item=target.find(record=>String(record.id)===id);if(item)target.unshift({...item,id:Date.now()+Math.random(),code:`${item.code}-COPY`,name:item.name?`${item.name} - Bản sao`:undefined,status:'Ngừng sử dụng'})})}else selected.forEach(id=>{const item=target.find(record=>String(record.id)===id);if(item)item.status=command==='activate'?'Sử dụng':'Ngừng sử dụng'});window.LMSStore.write(state.tab==='questions'?'questions':'exams',target);renderRows();toast(`Đã cập nhật ${selected.length} bản ghi`); }
    if (action === 'copy') {const target=state.tab==='questions'?questions:exams,item=target.find(record=>String(record.id)===button.dataset.id);if(item){const copy={...item,id:Date.now(),code:`${item.code}-COPY`,name:item.name?`${item.name} - Bản sao`:undefined,status:'Ngừng sử dụng'};target.unshift(copy);window.LMSStore.write(state.tab==='questions'?'questions':'exams',target);renderRows();toast('Đã tạo bản sao')}}
    if (action === 'delete') {const target=state.tab==='questions'?questions:exams,item=target.find(record=>String(record.id)===button.dataset.id);if(item){const accepted=await window.appDialog({title:'Xóa dữ liệu',html:`<p class="app-dialog-danger"><b>${escapeHtml(item.code)} · ${escapeHtml(item.name||item.content)}</b></p><p>Bản ghi sẽ bị xóa khỏi ngân hàng dữ liệu.</p>`,confirmText:'Xóa',cancelText:'Hủy'});if(accepted){if(state.tab==='questions')questions=questions.filter(record=>record.id!==item.id);else exams=exams.filter(record=>record.id!==item.id);window.LMSStore.write(state.tab==='questions'?'questions':'exams',state.tab==='questions'?questions:exams);renderRows();toast('Đã xóa dữ liệu')}}}
    if (action === 'filter-focus') byId('bankFilter').querySelector('input').focus();
  });

  byId('autoMatrixBody').addEventListener('input', updateAutoTotal);
  byId('examDetailDialog').addEventListener('click', async (event) => {
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
    if (action === 'copy') {const copy={...activeExam,id:Date.now(),code:`${activeExam.code}-COPY`,name:`${activeExam.name} - Bản sao`};exams.unshift(copy);window.LMSStore.write('exams',exams);renderRows();toast('Đã sao chép đề thi');}
    if (action === 'export') {const printWindow=window.open('','_blank','width=980,height=760');if(!printWindow){toast('Trình duyệt đang chặn cửa sổ in');return}printWindow.document.write(`<html><head><title>${escapeHtml(activeExam.code)}</title><style>body{font:15px Arial;max-width:800px;margin:40px auto;line-height:1.5}.paper-answers{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:12px 0}h2{text-align:center}</style></head><body>${paperTemplate(activeExam)}</body></html>`);printWindow.document.close();printWindow.focus();setTimeout(()=>printWindow.print(),250);toast('Đã mở bản in để lưu PDF');}
    if (action === 'edit') setExamDetailMode(true);
    if (action === 'cancel-edit') { renderExamDetail(activeExam); setExamDetailMode(false); }
    if (action === 'save-edit') byId('examDetailEditForm').requestSubmit();
    if (action === 'delete') {const used=Number(activeExam.usedCount||0);if(used){toast('Đề đã được sử dụng; hãy lưu trữ thay vì xóa');return}const accepted=await window.appDialog({title:'Xóa đề thi',html:`<p class="app-dialog-danger"><b>${escapeHtml(activeExam.code)} · ${escapeHtml(activeExam.name)}</b></p><p>${activeExam.count} câu hỏi · ${activeExam.duration} phút · chưa có ca thi liên kết.</p>`,confirmText:'Xóa đề',cancelText:'Hủy'});if(accepted){exams=exams.filter(item=>item.id!==activeExam.id);window.LMSStore.write('exams',exams);byId('examDetailDialog').close();renderRows();toast('Đã xóa đề thi')}}
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
    window.LMSStore.write('exams',exams); renderExamDetail(activeExam); renderRows(); setExamDetailMode(false); toast('Đã lưu thay đổi đề thi');
  });

  document.querySelectorAll('[data-close-dialog]').forEach((button) => button.addEventListener('click', () => button.closest('dialog').close()));
  document.querySelectorAll('.bank-dialog').forEach((dialog) => dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); }));
  byId('autoExamBuilderForm').addEventListener('submit', (event) => { event.preventDefault(); if (!event.currentTarget.reportValidity()) return;const inputs=[...event.currentTarget.querySelectorAll('.auto-form-grid input,.auto-form-grid select')],total=Number(byId('autoQuestionTotal').textContent),exam={id:Date.now(),code:`DE-${String(Date.now()).slice(-6)}`,name:event.currentTarget.elements.name.value.trim(),category:inputs[1]?.value||'An toàn lao động',count:total,score:Number(inputs[3]?.value||10),duration:Number(inputs[2]?.value||45),method:'Tự động',author:'Nguyễn Văn A',matrix:[...document.querySelectorAll('[data-matrix-count]')].map(input=>Number(input.value))};exams.unshift(exam);window.LMSStore.write('exams',exams);byId('autoExamDialog').close();renderRows();toast(`Đã tạo đề ${exam.code} với ${total} câu`); });
  const randomForm = byId('randomExamForm');
  const updateRandomPassUnit = () => { const score=Number(randomForm.elements.score.value)||0,pass=Number(randomForm.elements.passScore.value)||0,percent=score?Math.round(pass/score*100):0;byId('randomPassUnit').textContent=`điểm (${percent}%)`;randomForm.elements.passScore.max=String(score); };
  randomForm.addEventListener('input', updateRandomPassUnit);
  randomForm.addEventListener('submit', (event) => { event.preventDefault();if(!event.currentTarget.reportValidity())return;const data=Object.fromEntries(new FormData(event.currentTarget)),score=Number(data.score),passScore=Number(data.passScore),count=Number(data.count),duration=Number(data.duration);if(passScore>score){toast('Điểm đạt không được lớn hơn tổng điểm');event.currentTarget.elements.passScore.focus();return}const matching=questions.filter(item=>normalize(item.category||item.topic||'')===normalize(data.category)),pool=(matching.length?matching:questions).slice();for(let i=pool.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]]}const selected=pool.slice(0,count),exam={id:Date.now(),code:`DE-${String(Date.now()).slice(-6)}`,name:data.name.trim(),description:data.description.trim(),note:data.description.trim(),category:data.category,count,score,duration,passScore,method:'Ngẫu nhiên',author:'Nguyễn Văn A',questionIds:selected.map(item=>item.id),shuffleQuestions:true,shuffleAnswers:true};exams.unshift(exam);window.LMSStore.write('exams',exams);byId('randomExamDialog').close();renderRows();toast(`Đã tạo đề ${exam.code} với ${count} câu hỏi ngẫu nhiên`);event.currentTarget.reset();updateRandomPassUnit(); });
  const importForm=byId('importForm'),importInput=importForm.querySelector('input[type=file]');importForm.dataset.realImport='true';importInput.accept='.csv,text/csv';importInput.closest('label').querySelector('b').textContent='Chọn hoặc kéo thả tệp CSV';importInput.closest('label').querySelector('small').textContent='Định dạng .csv, tối đa 10MB';
  importForm.addEventListener('submit', async (event) => {event.preventDefault();if(!event.currentTarget.reportValidity())return;const file=importInput.files[0];if(file.size>10*1024*1024){toast('Tệp vượt quá 10MB');return}const lines=(await file.text()).replace(/^\uFEFF/,'').split(/\r?\n/).filter(Boolean),headers=lines.shift()?.split(',').map(value=>normalize(value))||[],rows=lines.map((line,index)=>{const cells=line.split(',').map(value=>value.trim().replace(/^"|"$/g,'')),get=(...keys)=>{const position=headers.findIndex(header=>keys.includes(header));return position>=0?cells[position]:''};return state.tab==='questions'?{row:index+2,code:get('code','ma','mã'),content:get('content','noi dung','nội dung'),type:get('type','loai','loại')||'Trắc nghiệm',category:get('category','chuyen de','chuyên đề')||'An toàn lao động',topic:get('topic','chu de','chủ đề')||'An toàn lao động',level:get('level','muc do','mức độ')||'Trung bình',score:Number(get('score','diem','điểm')||1),status:'Sử dụng',author:'Nguyễn Văn A'}:{row:index+2,code:get('code','ma','mã'),name:get('name','ten','tên'),category:get('category','chuyen de','chuyên đề')||'An toàn lao động',count:Number(get('count','so cau','số câu')||0),score:Number(get('score','diem','điểm')||10),duration:Number(get('duration','thoi gian','thời gian')||45),method:get('method','hinh thuc','hình thức')||'Thủ công',author:'Nguyễn Văn A'}}),valid=rows.filter(item=>item.code&&(state.tab==='questions'?item.content:item.name)),duplicates=valid.filter(item=>(state.tab==='questions'?questions:exams).some(record=>normalize(record.code)===normalize(item.code))),accepted=await window.appDialog({title:'Kiểm tra dữ liệu nhập',html:`<div class="app-dialog-wide"><div class="app-dialog-summary"><span><b>${rows.length}</b>dòng dữ liệu</span><span><b>${valid.length-duplicates.length}</b>có thể nhập</span><span><b>${rows.length-valid.length+duplicates.length}</b>lỗi / trùng</span></div><p class="app-dialog-note">Chỉ dòng có mã và ${state.tab==='questions'?'nội dung câu hỏi':'tên đề thi'} hợp lệ, không trùng mã mới được nhập.</p><div style="overflow:auto;max-height:320px"><table class="bank-table"><thead><tr><th>Dòng</th><th>Mã</th><th>Nội dung</th><th>Kết quả</th></tr></thead><tbody>${rows.map(item=>{const duplicate=duplicates.includes(item),invalid=!item.code||!(item.content||item.name);return`<tr><td>${item.row}</td><td>${escapeHtml(item.code||'—')}</td><td>${escapeHtml(item.content||item.name||'—')}</td><td>${invalid?'Thiếu dữ liệu':duplicate?'Trùng mã':'Hợp lệ'}</td></tr>`}).join('')}</tbody></table></div></div>`,confirmText:`Nhập ${valid.length-duplicates.length} bản ghi`,cancelText:'Hủy'});if(!accepted)return;const imported=valid.filter(item=>!duplicates.includes(item)).map((item,index)=>({...item,id:Date.now()+index})),target=state.tab==='questions'?questions:exams;target.unshift(...imported);window.LMSStore.write(state.tab==='questions'?'questions':'exams',target);importForm.closest('dialog').close();importForm.reset();renderRows();toast(`Đã nhập ${imported.length} bản ghi`);});

  renderAutoMatrix(); updateRandomPassUnit(); render();
})();
