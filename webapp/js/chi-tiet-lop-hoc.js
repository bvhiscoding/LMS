(() => {
  const byId = (id) => document.getElementById(id);
  const view = byId('classTabView');
  if (!view) return;
  view.dataset.realStudentActions = 'true';

  const validTabs = ['overview', 'students', 'content', 'attendance', 'tests', 'completion', 'history'];
  let activeTab = location.hash.slice(1);
  if (!validTabs.includes(activeTab)) activeTab = 'overview';

  let students = Array.from({ length: 28 }, (_, index) => ({
    id: index + 1,
    code: `HV${String(index + 1).padStart(4, '0')}`,
    name: ['Nguyễn Văn Tuấn', 'Phạm Thị Lan', 'Lê Quang Minh', 'Hoàng Thị Hương', 'Vũ Thanh Tùng', 'Ngô Kim Chi', 'Đỗ Quốc Hùng', 'Bùi Lan Anh'][index % 8],
    unit: ['Công ty Than Hạ Long', 'Công ty Than Uông Bí', 'Công ty CP Than Mạo Khê', 'Phòng ATVSLĐ - TKV'][index % 4],
    approval: ['Đã duyệt', 'Đã duyệt', 'Chờ duyệt', 'Đã duyệt', 'Từ chối'][index % 5],
    learning: ['Đang học', 'Đang học', 'Chưa bắt đầu', 'Hoàn thành', '-'][index % 5]
  }));
  const topics = [
    ['Tổng quan về an toàn lao động', 4],
    ['Nhận diện rủi ro và đánh giá nguy cơ', 3],
    ['Biện pháp kiểm soát và phòng ngừa', 4],
    ['Đánh giá cuối khóa và thực hành', 2]
  ];
  const tests = [
    ['Kiểm tra kiến thức cơ bản', 'Tổng quan về an toàn lao động', 20, 20, '20 phút'],
    ['Đánh giá nhận diện rủi ro', 'Nhận diện rủi ro và đánh giá nguy cơ', 25, 25, '30 phút'],
    ['Kiểm tra biện pháp kiểm soát', 'Biện pháp kiểm soát và phòng ngừa', 30, 30, '40 phút'],
    ['Kiểm tra cuối khóa', 'Đánh giá cuối khóa và thực hành', 40, 40, '60 phút']
  ];
  const selectedStudents = new Set();
  let actionDialogMode = 'form';
  let confirmedAction = null;
  let testPhase = 'source';
  let testMode = 'random';
  let uploadedFileName = 'de-thi-an-toan-lao-dong.docx';

  const toast = (message) => {
    const node = byId('classToast');
    node.textContent = message;
    node.hidden = false;
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => { node.hidden = true; }, 2200);
  };

  const overviewTemplate = () => {
    const info = [
      ['Mã lớp', 'AT-2026-13'], ['Ngày bắt đầu', '05/08/2026'],
      ['Tên lớp', 'An toàn lao động – Đợt 1'], ['Ngày kết thúc', '30/08/2026'],
      ['Khóa học', 'An toàn lao động trong khai thác mỏ'], ['Sĩ số tối đa', '45 học viên'],
      ['Hình thức học', 'Offline'], ['Số lượng đã đăng ký', '28 học viên'],
      ['Đơn vị tổ chức', 'Phòng Đào tạo'], ['Số lượng đang học', '20 học viên'],
      ['Giảng viên phụ trách', 'Trần Minh'], ['Địa điểm học', 'Tòa A – Tầng 3 – Phòng 302']
    ];
    return `<div class="class-overview">
      <section class="class-card"><h2>Thông tin lớp học</h2><div class="class-overview-main">
        ${info.map(([label, value]) => `<div class="class-info-row"><span>${label}</span><b>${value}</b></div>`).join('')}
      </div></section>
      <section class="class-card"><h2>Tiến độ lớp học</h2><div class="class-progress-ring"></div></section>
      <div class="class-overview-lower">
        <section class="class-card"><h2>Trạng thái học viên</h2><div class="class-mini-list"><p>20 đang học (71.4%)</p><p>3 hoàn thành (10.7%)</p><p>5 chưa bắt đầu (17.9%)</p></div></section>
        <section class="class-card"><h2>Điều kiện tham gia lớp</h2><div class="class-mini-list"><p><i class="fa-solid fa-check"></i> Khóa tiên quyết: Nhập môn an toàn mỏ</p><p><i class="fa-solid fa-check"></i> Năng lực đầu vào: Cấp độ 1</p><p>Hạn đăng ký: 03/08/2026 17:00</p></div></section>
        <section class="class-card"><h2>Giảng viên & trợ giảng</h2><div class="class-mini-list"><p><b>Trần Minh</b><br>Giảng viên phụ trách</p><p><b>Lê Hùng</b><br>Trợ giảng</p><p><b>Nguyễn Thị Lan</b><br>Trợ giảng</p></div></section>
      </div>
    </div>`;
  };

  const studentRows = () => students.map((student) => `<tr data-student-row="${student.id}">
    <td><input type="checkbox" data-student-select="${student.id}" ${selectedStudents.has(student.id) ? 'checked' : ''}></td>
    <td>${student.code}</td><td><span class="student-name"><i>${student.name.split(' ').slice(-2).map((word) => word[0]).join('')}</i>${student.name}</span></td>
    <td>${student.unit}</td><td><span class="approval ${student.approval === 'Chờ duyệt' ? 'pending' : student.approval === 'Từ chối' ? 'rejected' : ''}">${student.approval}</span></td>
    <td>${student.learning}</td><td>02/08/2026 10:15</td><td><div class="class-student-actions"><button class="btn ghost student-action-toggle" type="button" data-class-action="student-menu" data-student-id="${student.id}" aria-label="Mở thao tác cho ${student.name}" aria-expanded="false"><i class="fa-solid fa-ellipsis"></i></button><div class="class-student-menu" hidden><button type="button" data-class-action="${student.approval === 'Đã duyệt' ? 'unapprove-student' : 'approve-student'}" data-student-id="${student.id}"><i class="fa-solid ${student.approval === 'Đã duyệt' ? 'fa-user-xmark' : 'fa-user-check'}"></i>${student.approval === 'Đã duyệt' ? 'Bỏ duyệt' : 'Duyệt học viên'}</button><button type="button" class="danger" data-class-action="remove-student" data-student-id="${student.id}"><i class="fa-regular fa-trash-can"></i>Xóa khỏi lớp</button></div></div></td>
  </tr>`).join('');

  const studentsTemplate = () => `<div class="class-toolbar">
    <input placeholder="Tìm theo mã, họ tên, email..."><select><option>Tất cả trạng thái duyệt</option><option>Đã duyệt</option><option>Chờ duyệt</option></select><select><option>Tất cả trạng thái học</option></select>
    <button class="btn ghost" data-class-action="add-student"><i class="fa-solid fa-user-plus"></i>Thêm học viên</button><button class="btn primary" data-class-action="import-student"><i class="fa-solid fa-cloud-arrow-up"></i>Nhập Excel</button>
  </div><section class="class-data-card students-card"><table class="class-data-table"><thead><tr><th></th><th>Mã học viên</th><th>Họ tên</th><th>Đơn vị</th><th>Trạng thái duyệt</th><th>Trạng thái học</th><th>Ngày đăng ký</th><th>Thao tác</th></tr></thead><tbody>${studentRows()}</tbody></table></section>
  <div class="class-bulk"><b>Đã chọn <span id="selectedCount">${selectedStudents.size}</span> học viên</b><button class="btn ghost" data-class-action="approve">Duyệt</button><button class="btn ghost" data-class-action="reject">Bỏ duyệt</button><button class="btn danger" data-class-action="remove-students">Xóa khỏi lớp</button></div>`;

  const contentTemplate = () => `<div class="class-toolbar"><input placeholder="Tìm kiếm chủ đề..."><select><option>Tất cả phân nhóm</option></select><span></span><button class="btn primary" data-class-action="add-topic"><i class="fa-solid fa-plus"></i>Thêm chủ đề</button></div>
    ${topics.map(([name, count], index) => `<article class="class-topic"><header><i class="fa-solid fa-grip-vertical"></i><span>${index + 1}</span><h3>${name}<small>${count} nội dung</small></h3><button class="btn ghost" data-class-action="add-content"><i class="fa-solid fa-plus"></i>Thêm nội dung</button></header></article>`).join('')}`;

  const attendanceTemplate = () => `<div class="class-attendance"><aside class="attendance-sessions"><h2>Danh sách buổi học</h2>
    ${['Tổng quan về an toàn lao động', 'Nhận diện nguy cơ', 'Biện pháp phòng ngừa', 'Thực hành an toàn', 'Đánh giá cuối khóa'].map((name, index) => `<button class="attendance-session ${index === 0 ? 'active' : ''}"><b>Buổi ${index + 1}: ${name}</b>${5 + index * 2}/08/2026 · 08:00 - 10:00</button>`).join('')}</aside>
    <section class="attendance-main"><header class="attendance-head"><div><h2>Buổi 1: Tổng quan an toàn lao động</h2><small>05/08/2026 · 08:00 - 10:00 · Phòng 302</small></div><span class="class-status running">Đang mở điểm danh</span></header>
    <nav class="attendance-methods"><button class="active">QR Code</button><button>Camera</button><button>Thủ công</button></nav><div class="attendance-qr"><div class="qr-demo"></div><div><p>Mã điểm danh</p><h2>ATLD01-050625</h2><p>Thời gian còn lại</p><h2 style="color:#1a9a55">09:32</h2></div></div>
    <table class="class-data-table"><thead><tr><th>Học viên</th><th>Mã học viên</th><th>Trạng thái</th><th>Thời gian</th><th>Phương thức</th></tr></thead><tbody>${students.slice(0, 6).map((student, index) => `<tr><td>${student.name}</td><td>${student.code}</td><td><span class="approval ${index === 2 ? 'pending' : ''}">${index === 2 ? 'Đi muộn' : 'Có mặt'}</span></td><td>08:0${index}:15</td><td>QR Code</td></tr>`).join('')}</tbody></table></section></div>`;

  const testsTemplate = () => `<div class="class-toolbar"><input placeholder="Tìm theo tên bài kiểm tra..."><select><option>Tất cả chủ đề</option></select><select><option>Tất cả loại bài kiểm tra</option></select><span></span><button class="btn primary" data-class-action="add-test"><i class="fa-solid fa-plus"></i>Thêm bài kiểm tra</button></div>
    <section class="class-data-card"><table class="class-data-table"><thead><tr><th>Tên bài kiểm tra</th><th>Chủ đề</th><th>Số câu</th><th>Tổng điểm</th><th>Thời gian</th><th>Ngày bắt đầu</th><th>Thao tác</th></tr></thead><tbody>
    ${tests.map((test) => `<tr><td><span class="student-name"><i class="test-icon"><i class="fa-regular fa-file-lines"></i></i>${test[0]}</span></td><td>${test[1]}</td><td>${test[2]}</td><td>${test[3]} điểm</td><td>${test[4]}</td><td>05/08/2026 09:00</td><td><button class="btn ghost" data-class-action="test-menu"><i class="fa-solid fa-ellipsis"></i></button></td></tr>`).join('')}
    </tbody></table></section>`;

  const completionTemplate = () => `<p class="class-card" style="margin-bottom:12px">Thiết lập các điều kiện để học viên được công nhận hoàn thành lớp học.</p><section class="class-card"><h2>Điều kiện hoàn thành</h2><div class="completion-grid">
    <label><input type="checkbox" checked><span><b>Hoàn thành 100% nội dung bắt buộc</b><br>13 nội dung trong lớp</span></label><label><input type="checkbox" checked><span><b>Điểm trung bình tối thiểu 70%</b><br>Tính từ 4 bài kiểm tra</span></label><label><input type="checkbox"><span><b>Tham gia ít nhất 80% số buổi</b><br>10 trong 12 buổi học</span></label><label><input type="checkbox" checked><span><b>Đạt bài kiểm tra cuối khóa</b><br>Điểm tối thiểu 7/10</span></label>
    </div><button class="btn primary" style="margin-top:14px" data-class-action="save-completion">Lưu điều kiện</button></section>`;

  const historyTemplate = () => `<section class="class-card"><h2>Lịch sử hoạt động</h2>${[['Tạo lớp học', 'Trần Minh · 01/08/2026 08:00'], ['Thêm 28 học viên', 'Lê Hùng · 02/08/2026 10:15'], ['Cập nhật lịch học', 'Trần Minh · 03/08/2026 14:20']].map(([title, time]) => `<div class="activity-row"><i class="fa-solid fa-clock-rotate-left"></i><div><b>${title}</b><br>${time}</div></div>`).join('')}</section>`;

  function renderTab() {
    document.querySelectorAll('[data-class-tab]').forEach((button) => button.classList.toggle('active', button.dataset.classTab === activeTab));
    const studentTab = document.querySelector('[data-class-tab="students"]');
    if (studentTab) studentTab.textContent = `Học viên (${students.length})`;
    const templates = { overview: overviewTemplate, students: studentsTemplate, content: contentTemplate, attendance: attendanceTemplate, tests: testsTemplate, completion: completionTemplate, history: historyTemplate };
    view.innerHTML = templates[activeTab]();
  }

  const methodCard = (mode, icon, tone, title, description) => `<button type="button" class="test-method-card ${testMode === mode ? 'active' : ''}" data-test-source="${mode}">
    <span class="method-icon ${tone}"><i class="fa-solid ${icon}"></i></span><span><b>${title}</b><small>${description}</small></span><i class="fa-solid fa-circle-check method-check"></i>
  </button>`;

  const sourceShell = (content) => `<div class="test-source-layout"><aside class="test-method-sidebar"><h3>Chọn cách tạo bài kiểm tra</h3>
    ${methodCard('bank', 'fa-file-lines', 'blue', 'Chọn từ Ngân hàng đề thi', 'Chọn một đề thi có sẵn trong ngân hàng đề thi của hệ thống.')}
    ${methodCard('random', 'fa-shuffle', 'green', 'Tạo ngẫu nhiên từ Ngân hàng câu hỏi', 'Thiết lập cấu trúc đề thi, hệ thống sẽ tự động chọn câu hỏi ngẫu nhiên.')}
    ${methodCard('upload', 'fa-cloud-arrow-up', 'orange', 'Tải đề lên từ file', 'Tải file Word/Excel/PDF theo mẫu để nhập câu hỏi vào hệ thống.')}
    <div class="test-method-note">${testMode === 'upload' ? '<strong><i class="fa-solid fa-circle-info"></i>Thông tin hỗ trợ</strong><ul><li>Hỗ trợ file: .docx, .xlsx, .pdf</li><li>Dung lượng tối đa: 20MB</li><li>Hệ thống tự động nhận dạng câu hỏi</li></ul>' : '<strong><i class="fa-regular fa-circle-question"></i>Lưu ý</strong>Sau khi tạo, bạn có thể chỉnh sửa câu hỏi, cấu trúc và các chi tiết khác trước khi lưu và công bố bài kiểm tra.'}</div>
  </aside><section class="test-source-content">${content}</section></div>`;

  const bankSource = () => `<h3>1. Chọn đề thi từ ngân hàng</h3><div class="source-field" style="margin-bottom:18px"><label>Tìm kiếm đề thi</label><input placeholder="Nhập tên hoặc mã đề thi..."></div><div class="bank-list">
    ${[['Đề kiểm tra an toàn lao động - Cơ bản', '30 câu · 45 phút · 100 điểm'], ['Đề đánh giá nhận diện rủi ro', '25 câu · 30 phút · 100 điểm'], ['Đề kiểm tra quy trình vận hành', '40 câu · 60 phút · 100 điểm']].map(([name, meta], index) => `<button type="button" class="bank-test ${index === 0 ? 'active' : ''}"><i class="fa-regular fa-file-lines"></i><span><b>${name}</b><small>${meta}</small></span>${index === 0 ? '<i class="fa-solid fa-circle-check"></i>' : ''}</button>`).join('')}
  </div>`;

  const distributionRows = [
    ['Một lựa chọn', [3, 2, 1], 6, 1, 6], ['Nhiều lựa chọn', [3, 2, 1], 6, 1, 6], ['Đúng / Sai', [2, 2, 1], 5, 1, 5],
    ['Điền khuyết (Loại 1)', [1, 1, 1], 3, 1.5, 4.5], ['Điền khuyết (Loại 2)', [1, 1, 1], 3, 1.5, 4.5], ['Tự luận', [0, 1, 1], 2, 4, 8],
    ['Gạch chân', [1, 1, 0], 2, 1, 2], ['Ghép đôi', [1, 1, 0], 2, 1, 2], ['Mệnh đề Đúng / Sai', [1, 1, 0], 1, 3, 3]
  ];

  const randomSource = () => `<div class="test-section"><h3>1. Chọn nguồn câu hỏi</h3><div class="source-field-grid">
    <div class="source-field"><label>Chọn chủ đề <em>*</em></label><div class="topic-chip-box"><span class="topic-chip">Tổng quan về an toàn lao động <i class="fa-solid fa-xmark"></i></span><span class="topic-chip">Nhận diện rủi ro và đánh giá nguy cơ <i class="fa-solid fa-xmark"></i></span><i class="fa-solid fa-chevron-down"></i></div></div>
    <div class="source-field"><label>Chọn ngân hàng câu hỏi <em>*</em></label><select><option>Ngân hàng câu hỏi mặc định</option></select></div>
    <div class="source-field"><label>Tổng số câu hỏi <em>*</em></label><div class="input-unit"><input type="number" value="30"><span>câu</span></div><small class="source-help">Ngân hàng có đủ 1.268 câu phù hợp</small></div>
  </div></div>
  <div class="test-section"><div class="section-title-row"><h3>2. Cơ cấu câu hỏi</h3><div class="distribution-mode"><span>Phân bổ theo:</span><label><input type="radio" checked name="distribution"> Loại câu hỏi</label><label><input type="radio" name="distribution"> Mức độ chi tiết</label></div></div>
    <div class="random-table-wrap"><table class="random-table"><thead><tr><th>Loại câu hỏi</th><th>Mức độ (Dễ / TB / Khó)</th><th>Số câu</th><th>Điểm mỗi câu</th><th>Tổng điểm</th><th></th></tr></thead><tbody>
      ${distributionRows.map(([type, levels, count, point, total]) => `<tr><td>${type}</td><td><span class="difficulty-inputs">${levels.map((level) => `<span>${level}</span>`).join('')}</span></td><td><span class="number-box">${count}</span></td><td><span class="number-box">${point}</span></td><td><span class="number-box">${total}</span></td><td><button type="button" class="trash"><i class="fa-regular fa-trash-can"></i></button></td></tr>`).join('')}
    </tbody></table><div class="random-summary"><span>Đã phân bổ: <b>30 / 30</b> câu</span><span>Tổng điểm: <b>77 điểm</b></span></div></div>
  </div><div><h3>3. Tùy chọn nâng cao <small>(không bắt buộc)</small></h3><div class="advanced-grid"><div class="advanced-checks"><label><input type="checkbox" checked> Xáo trộn thứ tự câu hỏi</label><label><input type="checkbox" checked> Xáo trộn đáp án</label><label><input type="checkbox" checked> Không lặp câu hỏi giữa các mã đề</label></div><div class="advanced-settings"><span>Số mã đề muốn tạo</span><input type="number" value="1"><span>Khi thiếu câu ở mức độ đã chọn</span><select><option>Ưu tiên lấy câu ở mức độ gần nhất</option></select></div></div></div>`;

  const uploadSource = () => `<div class="upload-panel"><h3>1. Tải file đề thi</h3><div class="upload-drop" data-upload-drop><i class="fa-solid fa-cloud-arrow-up"></i><b>Kéo và thả file vào đây</b><span>hoặc</span><button type="button" class="btn primary" data-pick-file>Chọn file từ máy tính</button><input id="classTestUpload" type="file" accept=".docx,.xlsx,.pdf" hidden></div><p class="upload-support">Hỗ trợ file: .docx, .xlsx, .pdf (tối đa 20MB)</p>
    <div class="uploaded-file"><i class="fa-regular fa-file-lines"></i><div><b>${uploadedFileName}</b><small>12.4 MB</small></div><button type="button" aria-label="Xóa file"><i class="fa-regular fa-trash-can"></i></button></div>
    <div class="detected-summary"><header><div><i class="fa-regular fa-file-code"></i><b>Tổng số câu hỏi nhận dạng được</b></div><strong>30 câu</strong></header><ul><li>Trắc nghiệm: 28 câu</li><li>Tự luận: 2 câu</li></ul></div></div>`;

  const optionAnswers = (correctIndex, labels) => labels.map((label, index) => `<span class="answer ${index === correctIndex ? 'correct' : ''}"><i class="fa-${index === correctIndex ? 'solid fa-circle-check' : 'regular fa-circle'}"></i>${label}</span>`).join('');
  const questionCard = (number, type, point, question, answers, correctIndex) => `<article class="question-card"><header><b>Câu ${number} - ${type} - ${point} điểm</b><span class="question-actions"><button type="button"><i class="fa-solid fa-pen"></i> Sửa</button><button type="button"><i class="fa-regular fa-trash-can"></i> Xóa</button></span></header><p>${question}</p><div class="answer-list">${optionAnswers(correctIndex, answers)}</div></article>`;

  const configTemplate = () => `<div class="test-config-layout"><section class="test-config-panel"><h3>Thông tin bài kiểm tra</h3><div class="test-form-grid">
    <div class="test-field"><label>Tên bài kiểm tra <em>*</em></label><input id="testName" value="Kiểm tra An toàn lao động - HK1"></div><div class="test-field"><label>Gắn vào chủ đề <em>*</em></label><select><option>Bài 3: An toàn trong lao động</option></select></div>
    <div class="test-field"><label>Số câu hỏi</label><input value="30 câu" disabled></div><div class="test-field"><label>Tổng điểm</label><input value="100 điểm" disabled></div>
    <div class="test-field"><label>Thời gian làm bài <em>*</em></label><div class="input-unit"><input type="number" value="45"><span>phút</span></div></div><div class="test-field"><label>Số lần làm bài <em>*</em></label><div class="input-unit"><input type="number" value="1"><span>lần</span></div></div>
    <div class="test-field"><label>Điểm đạt <em>*</em></label><div class="input-unit"><input type="number" value="50"><span>điểm</span></div></div><div class="test-field"><label>Thời gian mở bài</label><input type="datetime-local"></div><div class="test-field"><label>Thời gian kết thúc</label><input type="datetime-local"></div>
  </div><h3 class="config-heading">Cấu hình hiển thị & làm bài</h3><div class="config-options">
    <div class="option-card"><h4>Hiển thị câu hỏi</h4><label><input type="checkbox" checked> Xáo trộn thứ tự câu hỏi</label><div class="option-inline"><span>Số câu hỏi trên mỗi trang</span><select><option>5 câu</option></select></div></div>
    <div class="option-card"><h4>Hiển thị kết quả</h4><label><input type="radio" checked name="result"> Hiển thị điểm sau khi hoàn thành bài</label><label><input type="radio" name="result"> Không hiển thị điểm</label></div>
    <div class="option-card"><h4>Quyền xem lại bài</h4><label><input type="radio" name="review"> Không cho phép xem lại</label><label><input type="radio" name="review"> Cho phép xem lại, ẩn điểm chi tiết</label><label><input type="radio" checked name="review"> Cho phép xem lại và hiển thị điểm</label></div>
    <div class="option-card"><h4>Kiểm soát làm bài</h4><label><input type="checkbox" checked> Bắt buộc làm bài toàn màn hình</label><label><input type="checkbox" checked> Không cho phép chuyển tab/cửa sổ khác</label><label><input type="checkbox" checked> Cảnh báo khi vi phạm</label><div class="option-inline"><span>Số lần vi phạm tối đa</span><input type="number" value="3"></div></div>
  </div></section><section class="test-config-panel"><h3>Nội dung đề kiểm tra</h3><div class="question-summary"><span>Tổng số câu: <b>30</b></span><span>Tổng điểm: <b>100</b></span></div><div class="question-toolbar"><label class="question-search"><i class="fa-solid fa-magnifying-glass"></i><input placeholder="Tìm câu hỏi..."></label><button type="button" class="btn ghost"><i class="fa-solid fa-plus"></i>Thêm câu hỏi</button></div><div class="question-list">
    ${questionCard(1, 'Một lựa chọn', 2, 'Theo quy định, người lao động có quyền từ chối làm công việc hoặc rời bỏ nơi làm việc khi thấy...', ['A. Có nguy cơ trực tiếp đe dọa đến tính mạng, sức khỏe của mình.', 'B. Không được trả lương đúng hạn.', 'C. Công việc không đúng với hợp đồng lao động.', 'D. Người quản lý yêu cầu làm thêm giờ.'], 0)}
    ${questionCard(2, 'Đúng/Sai', 1, 'Người lao động phải tuân thủ các quy định về an toàn, vệ sinh lao động tại nơi làm việc.', ['Đúng', 'Sai'], 0)}
    ${questionCard(3, 'Một lựa chọn', 2, 'Trang bị bảo hộ lao động phải được kiểm tra định kỳ ít nhất bao lâu một lần?', ['A. 03 tháng một lần.', 'B. 06 tháng một lần.', 'C. 12 tháng một lần.', 'D. 24 tháng một lần.'], 0)}
  </div><div class="question-pages"><button type="button"><i class="fa-solid fa-chevron-left"></i></button><button type="button" class="active">1</button><button type="button">2</button><button type="button">3</button><button type="button">...</button><button type="button">6</button><button type="button"><i class="fa-solid fa-chevron-right"></i></button></div></section></div>`;

  const reviewQuestion = (number, type, point, question, answers, correctIndex, correctText) => `<article class="review-question"><aside class="review-question-meta"><strong>Câu ${number}</strong><span>${type}</span><small>${point} điểm</small></aside><div class="review-question-body"><p>${question}</p>${answers.map((answer, index) => `<div class="review-answer ${index === correctIndex ? 'correct' : ''}"><i class="fa-${index === correctIndex ? 'solid fa-circle-check' : 'regular fa-circle'}"></i>${answer}${index === correctIndex ? '<i class="fa-solid fa-circle-check" style="margin-left:auto"></i>' : ''}</div>`).join('')}<div class="review-correct-note">Đáp án đúng: ${correctText}</div></div></article>`;

  const reviewTemplate = () => `<div class="test-review"><section class="review-overview"><div class="review-top"><div class="review-identity"><i class="fa-solid fa-file-circle-check"></i><div><h3>Kiểm tra An toàn lao động - HK1 <span class="approval">Đã lưu</span></h3><p><i class="fa-regular fa-folder-open"></i> Bài 3: An toàn trong lao động</p><p>Kiểm tra kiến thức về an toàn lao động trong học kỳ 1.</p></div></div>
    ${[['fa-list-check', 'Tổng số câu', '30 câu'], ['fa-award', 'Tổng điểm', '100 điểm'], ['fa-clock', 'Thời gian làm bài', '45 phút'], ['fa-computer-mouse', 'Số lần làm bài', '1 lần'], ['fa-bullseye', 'Điểm đạt', '50 điểm']].map(([icon, label, value]) => `<div class="review-metric"><span><i class="fa-solid ${icon}"></i>${label}</span><b>${value}</b></div>`).join('')}</div><div class="review-schedule"><div><span><i class="fa-regular fa-calendar"></i> Thời gian bắt đầu</span><b>08:00, 20/05/2026</b></div><div><span><i class="fa-regular fa-calendar-check"></i> Thời gian kết thúc</span><b>08:45, 20/05/2026</b></div><div><span><i class="fa-solid fa-book-open"></i> Chủ đề / Môn học được giao</span><b>An toàn lao động</b></div></div></section>
    <h3 class="review-heading"><i class="fa-regular fa-file-lines"></i>NỘI DUNG BÀI KIỂM TRA</h3><p class="review-intro">Dưới đây là toàn bộ nội dung đề kiểm tra.</p>
    ${reviewQuestion(1, 'Một lựa chọn', 2, 'Theo quy định, người lao động có quyền từ chối làm công việc hoặc rời bỏ nơi làm việc khi thấy có nguy cơ trực tiếp đe dọa đến tính mạng, sức khỏe của mình.', ['A. Có nguy cơ trực tiếp đe dọa đến tính mạng, sức khỏe của mình.', 'B. Không được trả lương đúng hạn.', 'C. Công việc không đúng với hợp đồng lao động.', 'D. Người quản lý yêu cầu làm thêm giờ.'], 0, 'A')}
    ${reviewQuestion(2, 'Đúng/Sai', 1, 'Người lao động phải tuân thủ các quy định về an toàn, vệ sinh lao động tại nơi làm việc.', ['Đúng', 'Sai'], 0, 'Đúng')}
    ${reviewQuestion(3, 'Một lựa chọn', 2, 'Trang bị bảo hộ lao động phải được kiểm tra định kỳ ít nhất bao lâu một lần?', ['A. 03 tháng một lần.', 'B. 06 tháng một lần.', 'C. 12 tháng một lần.', 'D. 24 tháng một lần.'], 0, 'A')}
  </div>`;

  function renderTestWizard() {
    const title = byId('classTestTitle');
    const subtitle = byId('classTestSubtitle');
    const back = byId('testBack');
    const next = byId('testNext');
    byId('classTestFooter').classList.toggle('config-footer', testPhase === 'config');
    if (testPhase === 'source') {
      title.textContent = 'Tạo mới bài kiểm tra';
      subtitle.hidden = true;
      back.disabled = false;
      back.innerHTML = '<i class="fa-solid fa-arrow-left"></i> Quay lại';
      next.innerHTML = 'Tiếp tục <i class="fa-solid fa-arrow-right"></i>';
      const sources = { bank: bankSource, random: randomSource, upload: uploadSource };
      byId('classTestStep').innerHTML = sourceShell(sources[testMode]());
    } else if (testPhase === 'config') {
      title.textContent = 'Thiết lập bài kiểm tra';
      subtitle.hidden = false;
      back.disabled = false;
      back.innerHTML = 'Hủy';
      next.innerHTML = 'Lưu bài kiểm tra';
      byId('classTestStep').innerHTML = configTemplate();
    } else {
      title.textContent = 'Chi tiết bài kiểm tra';
      subtitle.hidden = true;
      back.disabled = false;
      back.innerHTML = '<i class="fa-solid fa-arrow-left"></i> Quay lại';
      next.innerHTML = '<i class="fa-solid fa-check"></i> Hoàn tất';
      byId('classTestStep').innerHTML = reviewTemplate();
    }
  }

  function openTestWizard() {
    testPhase = 'source';
    testMode = 'random';
    renderTestWizard();
    byId('classTestDialog').showModal();
  }

  function openActionDialog(title, body) {
    actionDialogMode = 'form';
    confirmedAction = null;
    delete byId('classActionForm').dataset.confirmAction;
    byId('classDialogTitle').textContent = title;
    byId('classDialogBody').innerHTML = body;
    byId('classActionForm').querySelector('footer .primary').textContent = 'Lưu';
    byId('classActionForm').querySelector('footer .primary').classList.remove('danger');
    byId('classActionDialog').showModal();
  }

  function openConfirmDialog({ title, message, detail = '', confirmText, danger = false, onConfirm }) {
    actionDialogMode = 'confirm';
    confirmedAction = onConfirm;
    byId('classActionForm').dataset.confirmAction = 'true';
    byId('classDialogTitle').textContent = title;
    byId('classDialogBody').innerHTML = `<div class="class-confirm-content"><span class="class-confirm-icon ${danger ? 'danger' : 'success'}"><i class="fa-solid ${danger ? 'fa-triangle-exclamation' : 'fa-user-check'}"></i></span><div><p>${message}</p>${detail ? `<small>${detail}</small>` : ''}</div></div>`;
    const submitButton = byId('classActionForm').querySelector('footer .primary');
    submitButton.textContent = confirmText;
    submitButton.classList.toggle('danger', danger);
    byId('classActionDialog').showModal();
  }

  const closeStudentMenus = (except = null) => {
    view.querySelectorAll('.class-student-menu').forEach((menu) => {
      if (menu === except) return;
      menu.hidden = true;
      menu.previousElementSibling?.setAttribute('aria-expanded', 'false');
    });
  };

  const selectedStudentRecords = () => students.filter((student) => selectedStudents.has(student.id));

  const changeApproval = (ids, approval) => {
    students = students.map((student) => ids.includes(student.id) ? { ...student, approval } : student);
    selectedStudents.clear();
    renderTab();
  };

  const removeStudents = (ids) => {
    students = students.filter((student) => !ids.includes(student.id));
    ids.forEach((id) => selectedStudents.delete(id));
    renderTab();
  };

  document.querySelector('.class-tabs').addEventListener('click', (event) => {
    const button = event.target.closest('[data-class-tab]');
    if (!button) return;
    activeTab = button.dataset.classTab;
    history.replaceState(null, '', `#${activeTab}`);
    renderTab();
  });

  view.addEventListener('input', (event) => {
    if (!event.target.matches('.class-toolbar input,.class-toolbar select')) return;
    const toolbar = event.target.closest('.class-toolbar');
    const query = (toolbar.querySelector('input')?.value || '').toLocaleLowerCase('vi');
    view.querySelectorAll('tbody tr').forEach((row) => { row.hidden = !row.textContent.toLocaleLowerCase('vi').includes(query); });
  });

  view.addEventListener('change', (event) => {
    if (!event.target.matches('[data-student-select]')) return;
    const id = Number(event.target.dataset.studentSelect);
    event.target.checked ? selectedStudents.add(id) : selectedStudents.delete(id);
    byId('selectedCount').textContent = selectedStudents.size;
  });

  view.addEventListener('click', (event) => {
    const button = event.target.closest('[data-class-action]');
    if (!button) return;
    const action = button.dataset.classAction;
    if (action === 'student-menu') {
      event.stopPropagation();
      const menu = button.nextElementSibling;
      const willOpen = menu.hidden;
      closeStudentMenus(menu);
      menu.hidden = !willOpen;
      button.setAttribute('aria-expanded', String(willOpen));
      return;
    }
    if (action === 'add-test') openTestWizard();
    if (action === 'add-student') openActionDialog('Thêm học viên', '<label>Học viên<select><option>Trần Văn Nam - HV1001</option><option>Lê Thị Mai - HV1002</option></select></label><label>Trạng thái duyệt<select><option>Đã duyệt</option><option>Chờ duyệt</option></select></label>');
    if (action === 'import-student') openActionDialog('Nhập học viên từ Excel', '<label>Chọn tệp Excel<input type="file" accept=".xlsx"></label>');
    if (action === 'add-topic') openActionDialog('Thêm chủ đề', '<label>Tên chủ đề<input name="name" required></label><label>Phân nhóm<select><option>Kiến thức cơ bản</option><option>Đánh giá</option></select></label>');
    if (action === 'add-content') openActionDialog('Thêm nội dung', '<label>Tên nội dung<input required></label><label>Loại nội dung<select><option>Video</option><option>PDF</option><option>SCORM</option></select></label>');
    if (action === 'approve' || action === 'reject') {
      const records = selectedStudentRecords();
      if (!records.length) { toast('Vui lòng chọn ít nhất một học viên'); return; }
      const approving = action === 'approve';
      openConfirmDialog({
        title: approving ? 'Duyệt học viên' : 'Bỏ duyệt học viên',
        message: `${approving ? 'Duyệt' : 'Bỏ duyệt'} ${records.length} học viên đã chọn?`,
        detail: records.slice(0, 3).map((student) => `${student.code} - ${student.name}`).join(' · '),
        confirmText: approving ? 'Duyệt học viên' : 'Bỏ duyệt',
        onConfirm: () => {
          changeApproval(records.map((student) => student.id), approving ? 'Đã duyệt' : 'Chờ duyệt');
          toast(`Đã ${approving ? 'duyệt' : 'bỏ duyệt'} ${records.length} học viên`);
        }
      });
      return;
    }
    if (action === 'approve-student' || action === 'unapprove-student') {
      const student = students.find((item) => item.id === Number(button.dataset.studentId));
      if (!student) return;
      const approving = action === 'approve-student';
      closeStudentMenus();
      openConfirmDialog({
        title: approving ? 'Duyệt học viên' : 'Bỏ duyệt học viên',
        message: `${approving ? 'Duyệt' : 'Bỏ duyệt'} học viên ${student.name}?`,
        detail: `${student.code} · ${student.unit}`,
        confirmText: approving ? 'Duyệt học viên' : 'Bỏ duyệt',
        onConfirm: () => {
          changeApproval([student.id], approving ? 'Đã duyệt' : 'Chờ duyệt');
          toast(`${student.name} đã được ${approving ? 'duyệt' : 'chuyển về chờ duyệt'}`);
        }
      });
      return;
    }
    if (action === 'remove-student' || action === 'remove-students') {
      const records = action === 'remove-student'
        ? students.filter((student) => student.id === Number(button.dataset.studentId))
        : selectedStudentRecords();
      if (!records.length) { toast('Vui lòng chọn ít nhất một học viên'); return; }
      closeStudentMenus();
      openConfirmDialog({
        title: 'Xóa học viên khỏi lớp',
        message: `Xóa ${records.length === 1 ? records[0].name : `${records.length} học viên đã chọn`} khỏi lớp học?`,
        detail: 'Học viên bị xóa sẽ không còn truy cập nội dung và kết quả của lớp này.',
        confirmText: 'Xóa khỏi lớp',
        danger: true,
        onConfirm: () => {
          removeStudents(records.map((student) => student.id));
          toast(`Đã xóa ${records.length} học viên khỏi lớp`);
        }
      });
      return;
    }
    if (action === 'save-completion') toast('Đã lưu điều kiện hoàn thành');
    if (action === 'test-menu') toast('Đã mở menu thao tác bài kiểm tra');
  });

  byId('classTestStep').addEventListener('click', (event) => {
    const source = event.target.closest('[data-test-source]');
    if (source) { testMode = source.dataset.testSource; renderTestWizard(); return; }
    if (event.target.closest('[data-pick-file]')) byId('classTestUpload')?.click();
    if (event.target.closest('.question-toolbar .btn')) toast('Đã mở trình thêm câu hỏi');
  });

  byId('classTestStep').addEventListener('change', (event) => {
    if (event.target.id !== 'classTestUpload' || !event.target.files?.length) return;
    uploadedFileName = event.target.files[0].name;
    renderTestWizard();
  });

  document.addEventListener('click', (event) => {
    if (!event.target.closest('.class-student-actions')) closeStudentMenus();
  });

  document.querySelectorAll('[data-close-class-dialog]').forEach((button) => button.addEventListener('click', () => byId('classActionDialog').close()));
  byId('classActionDialog').addEventListener('click', (event) => { if (event.target === event.currentTarget) event.currentTarget.close(); });
  document.querySelectorAll('[data-close-test]').forEach((button) => button.addEventListener('click', () => byId('classTestDialog').close()));
  byId('classActionForm').addEventListener('submit', (event) => {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    if (actionDialogMode === 'confirm') {
      const action = confirmedAction;
      confirmedAction = null;
      byId('classActionDialog').close();
      action?.();
      return;
    }
    byId('classActionDialog').close();
    toast('Đã lưu dữ liệu');
  });
  byId('classTestForm').addEventListener('submit', (event) => event.preventDefault());

  byId('testBack').addEventListener('click', () => {
    if (testPhase === 'review') { testPhase = 'config'; renderTestWizard(); return; }
    if (testPhase === 'config') { byId('classTestDialog').close(); return; }
    if (testPhase === 'source') byId('classTestDialog').close();
  });
  byId('testNext').addEventListener('click', () => {
    if (testPhase === 'source') { testPhase = 'config'; renderTestWizard(); return; }
    if (testPhase === 'config') { testPhase = 'review'; renderTestWizard(); return; }
    tests.unshift(['Kiểm tra An toàn lao động - HK1', 'Bài 3: An toàn trong lao động', 30, 100, '45 phút']);
    byId('classTestDialog').close();
    activeTab = 'tests';
    renderTab();
    toast('Đã tạo bài kiểm tra thành công');
  });

  byId('copyClass').addEventListener('click', () => toast('Đã sao chép lớp học'));
  byId('deleteClass').addEventListener('click', () => { if (confirm('Xóa lớp học này?')) location.href = 'quan-ly-lop-hoc.html'; });
  renderTab();
})();
