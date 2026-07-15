(() => {
  const byId = (id) => document.getElementById(id);
  const escapeHtml=(value)=>String(value??'').replace(/[&<>"']/g,(char)=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const view = byId('classTabView');
  if (!view) return;
  view.dataset.realStudentActions = 'true';

  const validTabs = ['overview', 'students', 'content', 'attendance', 'grades', 'tests', 'completion', 'history'];
  document.querySelector('[data-class-tab="tests"]')?.insertAdjacentHTML('beforebegin','<button data-class-tab="grades">Điểm</button>');
  let activeTab = location.hash.slice(1);
  if (!validTabs.includes(activeTab)) activeTab = 'overview';

  const classId = Number(new URLSearchParams(location.search).get('id') || 1);
  let students = Array.from({ length: 28 }, (_, index) => ({
    id: index + 1,
    code: `HV${String(index + 1).padStart(4, '0')}`,
    name: ['Nguyễn Văn Tuấn', 'Phạm Thị Lan', 'Lê Quang Minh', 'Hoàng Thị Hương', 'Vũ Thanh Tùng', 'Ngô Kim Chi', 'Đỗ Quốc Hùng', 'Bùi Lan Anh'][index % 8],
    unit: ['Công ty Than Hạ Long', 'Công ty Than Uông Bí', 'Công ty CP Than Mạo Khê', 'Phòng ATVSLĐ - TKV'][index % 4],
    approval: ['Đã duyệt', 'Đã duyệt', 'Chờ duyệt', 'Đã duyệt', 'Từ chối'][index % 5],
    learning: ['Đang học', 'Đang học', 'Chưa bắt đầu', 'Hoàn thành', '-'][index % 5]
  }));
  let topics = [
    ['Tổng quan về an toàn lao động', 4],
    ['Nhận diện rủi ro và đánh giá nguy cơ', 3],
    ['Biện pháp kiểm soát và phòng ngừa', 4],
    ['Đánh giá cuối khóa và thực hành', 2]
  ];
  let tests = [
    ['Kiểm tra kiến thức cơ bản', 'Tổng quan về an toàn lao động', 20, 20, '20 phút'],
    ['Đánh giá nhận diện rủi ro', 'Nhận diện rủi ro và đánh giá nguy cơ', 25, 25, '30 phút'],
    ['Kiểm tra biện pháp kiểm soát', 'Biện pháp kiểm soát và phòng ngừa', 30, 30, '40 phút'],
    ['Kiểm tra cuối khóa', 'Đánh giá cuối khóa và thực hành', 40, 40, '60 phút']
  ];
  students = window.LMSStore.seed(`class-${classId}-students`,students);
  topics = window.LMSStore.seed(`class-${classId}-topics`,topics);
  tests = window.LMSStore.seed(`class-${classId}-tests`,tests);
  const gradeSeed=students.map((student,index)=>{const testScore=Number((5.4+(index%6)*.6).toFixed(1)),examScore=Number((5.1+(index%5)*.7).toFixed(1)),average=Number((testScore*.4+examScore*.6).toFixed(1));return{studentId:student.id,testScore,examScore,average,result:average>=5?'Đạt':'Chưa đạt',note:index%4===0?'Cần theo dõi thêm phần thực hành':'',session:'Buổi 6 (05/08/2026)'};});
  let grades=window.LMSStore.seed(`class-${classId}-grades`,gradeSeed);
  let completion = window.LMSStore.read(`class-${classId}-completion`,{content:true,average:true,attendance:false,final:true,averageScore:70,attendanceRate:80,finalScore:7});
  let draftQuestions = window.LMSStore.all(`class-${classId}-draft-questions`,[]);
  const selectedStudents = new Set();
  const selectedManualAttendance = new Set();
  let actionDialogMode = 'form';
  let confirmedAction = null;
  let actionTargetIndex = 0;
  let testPhase = 'source';
  let testMode = 'random';
  let uploadedFileName = 'de-thi-an-toan-lao-dong.docx';
  let attendanceMethod = 'qr';
  const attendanceSessionSeed=[
    {id:1,name:'Tổng quan về an toàn lao động',date:'2026-08-05',startTime:'08:00',endTime:'10:00',location:'Phòng 302',method:'QR Code',status:'Đang mở',note:'Điểm danh đầu buổi học.'},
    {id:2,name:'Nhận diện nguy cơ',date:'2026-08-07',startTime:'08:00',endTime:'10:00',location:'Phòng 302',method:'QR Code',status:'Sắp diễn ra',note:''},
    {id:3,name:'Biện pháp phòng ngừa',date:'2026-08-09',startTime:'08:00',endTime:'10:00',location:'Phòng 302',method:'Thủ công',status:'Sắp diễn ra',note:''},
    {id:4,name:'Thực hành an toàn',date:'2026-08-11',startTime:'08:00',endTime:'10:00',location:'Xưởng thực hành',method:'Camera',status:'Sắp diễn ra',note:'Chuẩn bị đầy đủ trang thiết bị bảo hộ.'},
    {id:5,name:'Đánh giá cuối khóa',date:'2026-08-13',startTime:'08:00',endTime:'10:00',location:'Phòng 302',method:'QR Code',status:'Sắp diễn ra',note:''}
  ];
  let attendanceSessions=window.LMSStore.seed(`class-${classId}-attendance-sessions`,attendanceSessionSeed);
  let selectedAttendanceSessionId=attendanceSessions[0]?.id||null,attendanceSessionEditId=null;
  let cameraSettings = {captureCount:3,scheduleMode:'times',captureTimes:['08:10','09:00','09:45'],startAfter:10,interval:20,notify:true,keepPhotos:true,allowRetake:true,...window.LMSStore.read(`class-${classId}-camera-attendance`,{})};
  let gradeTargetId=null;

  document.body.insertAdjacentHTML('beforeend',`<dialog class="grade-dialog" id="gradeDialog"><form id="gradeForm"><header><h2 id="gradeDialogTitle">Chỉnh sửa điểm</h2><button type="button" data-close-grade aria-label="Đóng"><i class="fa-solid fa-xmark"></i></button></header><div class="grade-dialog-body"><section class="grade-student-summary" id="gradeStudentSummary"></section><section class="grade-entry-section"><h3>Nhập/Chỉnh sửa điểm</h3><div class="grade-score-grid"><label>Bài kiểm tra (40%)<input name="testScore" type="number" min="0" max="10" step="0.1" required><small>Thang điểm: 0 - 10</small></label><label>Bài thi (60%)<input name="examScore" type="number" min="0" max="10" step="0.1" required><small>Thang điểm: 0 - 10</small></label><label>Điểm TB (10)<span class="grade-average-field"><input name="average" readonly><i class="fa-solid fa-lock"></i></span><small>Tự động tính</small></label></div></section><section class="grade-result-grid"><label>Kết quả<select name="result"><option>Đạt</option><option>Chưa đạt</option></select></label><label>Ghi chú (nếu có)<textarea name="note" maxlength="500" rows="4" placeholder="Nhập ghi chú..."></textarea><small><output id="gradeNoteCount">0</output>/500</small></label></section><div class="grade-formula-note"><i class="fa-solid fa-circle-info"></i><p>Điểm trung bình được hệ thống tự động tính theo công thức:<b>Điểm TB = (Bài kiểm tra × 40%) + (Bài thi × 60%)</b></p></div></div><footer><button type="button" class="btn ghost" data-close-grade>Hủy</button><button class="btn primary" id="saveGradeButton">Lưu thay đổi</button></footer></form></dialog>`);

  document.body.insertAdjacentHTML('beforeend',`<dialog class="grade-dialog grade-entry-dialog" id="gradeEntryDialog"><form id="gradeEntryForm"><header><div><h2>Nhập điểm học viên</h2><p>Tạo kết quả điểm mới cho học viên trong lớp.</p></div><button type="button" data-close-grade-entry aria-label="Đóng"><i class="fa-solid fa-xmark"></i></button></header><div class="grade-dialog-body"><label class="grade-student-picker">Chọn học viên<select name="studentId" id="gradeEntryStudent" required>${students.map((student)=>`<option value="${student.id}">${student.name} - ${student.code}</option>`).join('')}</select></label><section class="grade-student-summary" id="gradeEntryStudentSummary"></section><section class="grade-entry-section"><h3>Nhập điểm</h3><div class="grade-score-grid"><label>Bài kiểm tra (40%)<input name="testScore" type="number" min="0" max="10" step="0.1" required><small>Thang điểm: 0 - 10</small></label><label>Bài thi (60%)<input name="examScore" type="number" min="0" max="10" step="0.1" required><small>Thang điểm: 0 - 10</small></label><label>Điểm TB (10)<span class="grade-average-field"><input name="average" readonly><i class="fa-solid fa-lock"></i></span><small>Tự động tính</small></label></div></section><section class="grade-result-grid"><label>Kết quả<select name="result"><option>Đạt</option><option>Chưa đạt</option></select></label><label>Ghi chú (nếu có)<textarea name="note" maxlength="500" rows="4" placeholder="Nhập ghi chú..."></textarea><small><output id="gradeEntryNoteCount">0</output>/500</small></label></section><div class="grade-formula-note"><i class="fa-solid fa-circle-info"></i><p>Điểm trung bình được hệ thống tự động tính theo công thức:<b>Điểm TB = (Bài kiểm tra × 40%) + (Bài thi × 60%)</b></p></div></div><footer><button type="button" class="btn ghost" data-close-grade-entry>Hủy</button><button class="btn primary">Lưu điểm</button></footer></form></dialog><dialog class="grade-dialog grade-detail-dialog" id="gradeDetailDialog"><form method="dialog"><header><div><h2>Chi tiết điểm học viên</h2><p>Thông tin kết quả và ghi chú của học viên.</p></div><button type="button" data-close-grade-detail aria-label="Đóng"><i class="fa-solid fa-xmark"></i></button></header><div class="grade-dialog-body" id="gradeDetailBody"></div><footer><button type="button" class="btn primary" data-close-grade-detail>Đóng</button></footer></form></dialog>`);

  document.body.insertAdjacentHTML('beforeend',`<dialog class="attendance-session-dialog" id="attendanceSessionDialog"><form id="attendanceSessionForm"><header><div><h2>Thông tin buổi điểm danh</h2><p id="attendanceSessionDialogTitle">Thêm mới buổi điểm danh cho lớp học.</p></div><button type="button" data-close-attendance-session aria-label="Đóng"><i class="fa-solid fa-xmark"></i></button></header><div class="attendance-session-form-layout"><section><label><span>Lớp học <b>*</b></span><select name="className" required><option value="AT-2026-13">AT-2026-13 · An toàn lao động – Đợt 1</option></select></label><label><span>Buổi học <b>*</b></span><input name="name" required maxlength="120" placeholder="Nhập tên buổi học"></label><label><span>Ngày học <b>*</b></span><input name="date" type="date" required></label><label><span>Thời gian bắt đầu <b>*</b></span><input name="startTime" type="time" required></label><label><span>Thời gian kết thúc <b>*</b></span><input name="endTime" type="time" required></label><label><span>Địa điểm <b>*</b></span><input name="location" required maxlength="100" placeholder="Nhập địa điểm"></label><label class="attendance-session-textarea"><span>Ghi chú</span><textarea name="note" maxlength="255" rows="4" placeholder="Nhập ghi chú (nếu có)"></textarea><small><output data-attendance-count="note">0</output>/255</small></label></section><section><label class="attendance-session-textarea"><span>Mô tả buổi học</span><textarea name="description" maxlength="255" rows="4" placeholder="Nhập mô tả buổi học (nếu có)"></textarea><small><output data-attendance-count="description">0</output>/255</small></label><fieldset class="attendance-radio-group"><legend>Cho phép điểm danh bằng QR</legend><label><input type="radio" name="allowQr" value="yes" checked>Có</label><label><input type="radio" name="allowQr" value="no">Không</label></fieldset><div class="attendance-qr-time-box" id="attendanceQrTimeBox"><header>Thiết lập thời gian quét QR <i class="fa-regular fa-circle-question"></i></header><div><label><span>Thời gian mở QR <b>*</b></span><input name="qrStart" type="time" value="07:45"></label><label><span>Thời gian đóng QR <b>*</b></span><input name="qrEnd" type="time" value="08:30"></label></div></div><fieldset class="attendance-radio-group"><legend>Cho phép điểm danh thủ công</legend><label><input type="radio" name="allowManual" value="yes" checked>Có</label><label><input type="radio" name="allowManual" value="no">Không</label></fieldset><label><span>Trạng thái <b>*</b></span><select name="status" required><option value="Đang mở">Hoạt động</option><option value="Sắp diễn ra">Sắp diễn ra</option><option value="Đã kết thúc">Ngừng hoạt động</option></select></label></section></div><footer><button type="button" class="btn ghost" data-close-attendance-session><i class="fa-solid fa-xmark"></i>Hủy</button><button type="submit" class="btn primary" id="saveAttendanceSession"><i class="fa-regular fa-floppy-disk"></i>Lưu</button></footer></form></dialog>`);

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

  const attendanceRows = (method = 'QR Code') => students.slice(0,6).map((student,index) => `<tr><td><span class="attendance-student"><span>${student.name.split(' ').slice(-2).map((part) => part[0]).join('')}</span>${student.name}</span></td><td>${student.code}</td><td><span class="approval ${index === 2 ? 'pending' : ''}">${index === 2 ? 'Đi muộn' : 'Có mặt'}</span></td><td>08:0${index}:15</td><td>${method}</td></tr>`).join('');
  const qrAttendancePayload='https://elearning.vbs.edu.vn/attendance/check-in?class=1&session=ATLD01-050625';
  const qrAttendanceMatrix='1111111000011010000011110010001111111|1000001011110110010000101110101000001|1011101011001101101111100000001011101|1011101010101101010011100100101011101|1011101000011101001110010000101011101|1000001001110100111010101010101000001|1111111010101010101010101010101111111|0000000010110000001010000010000000000|1000001010100100111011100110111001110|1111110100100000100111100001000110010|1010011110111111100000100111011000111|1010010011011010001000001011111110001|0011011000101001100110011011101101001|1011100010001101101110110001100101000|0110001011001011100001100101001111011|0111100100101111100000100001011101110|0000011000101011001010001110011010101|0010000101100010101100100111010101110|1001011101101100111100010001000000101|1110010100101001100010000000001001001|0000111010001110010010111111011011100|1111100011111011011100110001000010100|1110001000010101110001001101001111011|1111100010100011111010010011010111011|0111101101100100010100100001001100001|1111000110100100011101111001010100100|1011101110001001110000101111111110011|1010010100111100101010110010011101100|1001111100110111010010011110111111110|0000000010110001001110011101100010000|1111111001001111011101110110101010001|1000001000000010100000111011100010001|1011101001111011001010001111111110100|1011101000011110000111110011111001001|1011101001101110011010100101000001111|1000001001010001100010110001101010001|1111111010100000100010000001100100001'.split('|');
  const qrAttendanceSvg=()=>{const modules=qrAttendanceMatrix.length,path=qrAttendanceMatrix.flatMap((row,y)=>[...row].map((cell,x)=>cell==='1'?`M${x} ${y}h1v1h-1z`:'' )).join('');return `<svg viewBox="-4 -4 ${modules+8} ${modules+8}" role="img" aria-labelledby="attendanceQrTitle" shape-rendering="crispEdges"><title id="attendanceQrTitle">Mã QR điểm danh buổi học ATLD01-050625</title><rect x="-4" y="-4" width="${modules+8}" height="${modules+8}" fill="#fff"/><path d="${path}" fill="#111827"/></svg>`};
  const qrAttendancePanel = () => `<div class="attendance-qr"><div class="qr-demo" data-qr-value="${qrAttendancePayload}">${qrAttendanceSvg()}</div><div><p>Mã điểm danh</p><h2>ATLD01-050625</h2><p class="qr-scan-hint"><i class="fa-solid fa-mobile-screen-button"></i>Quét bằng camera điện thoại để mở trang điểm danh</p><p>Thời gian còn lại</p><h2 style="color:#1a9a55">09:32</h2></div></div><table class="class-data-table"><thead><tr><th>Học viên</th><th>Mã học viên</th><th>Trạng thái</th><th>Thời gian</th><th>Phương thức</th></tr></thead><tbody>${attendanceRows()}</tbody></table>`;
  const cameraAttendancePanel = () => `<div class="camera-attendance-dashboard">
    <section class="camera-config-card"><header><span><i class="fa-solid fa-camera"></i></span><div><h3>Thiết lập chụp ảnh điểm danh</h3><p>Yêu cầu học viên chụp ảnh khuôn mặt bằng webcam tại các thời điểm trong buổi học.</p></div></header><div class="camera-config-grid">
      <label>Số lần học viên cần chụp<select id="cameraCaptureCount"><option ${cameraSettings.captureCount===1?'selected':''}>1</option><option ${cameraSettings.captureCount===3?'selected':''}>3</option><option ${cameraSettings.captureCount===5?'selected':''}>5</option></select><small>Mỗi học viên sẽ nhận yêu cầu mở webcam theo số lần đã chọn.</small></label>
      <fieldset class="capture-schedule"><legend>Lịch yêu cầu chụp ảnh</legend><div class="capture-schedule-modes"><label class="${cameraSettings.scheduleMode==='times'?'active':''}"><input type="radio" name="captureScheduleMode" value="times" ${cameraSettings.scheduleMode==='times'?'checked':''}><span><i class="fa-regular fa-clock"></i><b>Theo mốc thời gian</b><small>Chọn giờ chụp cụ thể trong buổi học</small></span></label><label class="${cameraSettings.scheduleMode==='interval'?'active':''}"><input type="radio" name="captureScheduleMode" value="interval" ${cameraSettings.scheduleMode==='interval'?'checked':''}><span><i class="fa-solid fa-arrows-rotate"></i><b>Lặp lại theo phút</b><small>Tự động yêu cầu sau mỗi khoảng thời gian</small></span></label></div>
      ${cameraSettings.scheduleMode === 'interval' ? `<div class="schedule-detail interval-detail"><label>Bắt đầu sau<select id="cameraStartAfter"><option value="5" ${cameraSettings.startAfter===5?'selected':''}>5 phút</option><option value="10" ${cameraSettings.startAfter===10?'selected':''}>10 phút</option><option value="15" ${cameraSettings.startAfter===15?'selected':''}>15 phút</option></select></label><label>Lặp lại sau mỗi<select id="cameraInterval"><option value="10" ${cameraSettings.interval===10?'selected':''}>10 phút</option><option value="20" ${cameraSettings.interval===20?'selected':''}>20 phút</option><option value="30" ${cameraSettings.interval===30?'selected':''}>30 phút</option><option value="45" ${cameraSettings.interval===45?'selected':''}>45 phút</option></select></label><p><i class="fa-solid fa-circle-info"></i> Học viên sẽ nhận tối đa ${cameraSettings.captureCount} yêu cầu trong buổi học.</p></div>` : `<div class="schedule-detail time-detail"><p>Chọn ${cameraSettings.captureCount} mốc thời gian trong khung giờ 08:00 - 10:00</p><div>${Array.from({length:cameraSettings.captureCount},(_,index) => `<label><span>Lần ${index+1}</span><input type="time" data-camera-capture-time value="${cameraSettings.captureTimes?.[index] || ['08:10','09:00','09:45','09:50','09:55'][index]}"></label>`).join('')}</div></div>`}
      </fieldset>
      <div class="camera-switches"><label><input id="cameraNotify" type="checkbox" ${cameraSettings.notify?'checked':''}><i></i><span>Gửi thông báo nhắc học viên chụp ảnh</span></label><label><input id="cameraAllowRetake" type="checkbox" ${cameraSettings.allowRetake!==false?'checked':''}><i></i><span>Cho phép chụp lại trước khi gửi</span></label><label><input id="cameraKeepPhotos" type="checkbox" ${cameraSettings.keepPhotos?'checked':''}><i></i><span>Lưu ảnh chụp sau khi kết thúc buổi học</span></label></div>
    </div><footer><button class="btn ghost" data-class-action="save-camera-settings"><i class="fa-regular fa-floppy-disk"></i>Lưu thiết lập</button><button class="btn primary" data-class-action="request-webcam-photo"><i class="fa-solid fa-paper-plane"></i>Yêu cầu chụp ảnh</button></footer></section>
    <section class="classroom-capture-card"><header><div><b>Ảnh chụp chính diện lớp học</b><small>Ảnh tĩnh do giảng viên tải lên hoặc chụp tại lớp</small></div><span><i class="fa-solid fa-check"></i> Đã chụp</span></header><figure><img src="../../assets/attendance/classroom-front-capture.png" alt="Ảnh tĩnh chụp chính diện toàn bộ lớp học"><figcaption><span><i class="fa-regular fa-calendar"></i> 05/08/2026 · 08:06</span><b>Lần chụp 1/${cameraSettings.captureCount}</b></figcaption></figure><footer><button class="btn ghost" data-class-action="replace-class-photo"><i class="fa-solid fa-arrow-rotate-right"></i>Thay ảnh lớp học</button></footer></section>
    <section class="webcam-capture-card"><header><div><h3>Ảnh khuôn mặt học viên chụp qua webcam</h3><p>Ảnh được học viên gửi trực tiếp từ webcam máy tính khi nhận yêu cầu điểm danh.</p></div><span class="webcam-summary"><b>3/28</b> đã gửi lần 1</span></header><div class="webcam-capture-list">${students.slice(0,3).map((student,index) => `<article><div class="webcam-face person-${index}"><span><i class="fa-solid fa-camera"></i> Webcam</span></div><div><b>${student.name}</b><small>${student.code}</small><p><i class="fa-regular fa-clock"></i> 08:0${7+index}:2${index} · Lần 1/${cameraSettings.captureCount}</p></div><strong><i class="fa-solid fa-check"></i> Đã gửi</strong><button aria-label="Xem ảnh của ${student.name}"><i class="fa-solid fa-up-right-and-down-left-from-center"></i></button></article>`).join('')}</div><button class="camera-review-more">Xem danh sách 28 học viên <i class="fa-solid fa-arrow-right"></i></button></section>
  </div>`;
  const manualAttendancePanel = () => `<section class="manual-attendance"><header><div><h3>Điểm danh thủ công</h3><p>Chọn một hoặc nhiều học viên để cập nhật điểm danh cùng lúc.</p></div><div><button class="btn ghost" data-class-action="manual-reset">Đặt lại</button><button class="btn primary" data-class-action="manual-save"><i class="fa-regular fa-floppy-disk"></i>Lưu điểm danh</button></div></header><div class="manual-toolbar"><label><i class="fa-solid fa-magnifying-glass"></i><input data-attendance-search placeholder="Tìm tên hoặc mã học viên..."></label><span>${students.length} học viên</span><button data-class-action="manual-all-present"><i class="fa-solid fa-check-double"></i>Đánh dấu tất cả có mặt</button></div><div class="manual-bulk-actions"><span>Đã chọn <b id="manualSelectedCount">${selectedManualAttendance.size}</b> học viên</span><select data-manual-bulk-status aria-label="Trạng thái điểm danh hàng loạt"><option>Có mặt</option><option>Đi muộn</option><option>Vắng mặt</option><option>Có phép</option></select><input data-manual-bulk-time type="time" value="08:00" aria-label="Thời gian điểm danh hàng loạt"><button type="button" data-class-action="manual-bulk-apply" ${selectedManualAttendance.size?'':'disabled'}><i class="fa-solid fa-check"></i>Áp dụng cho đã chọn</button></div><div class="manual-table-wrap"><table class="class-data-table manual-table"><thead><tr><th class="manual-check-cell"><input type="checkbox" data-manual-select-all aria-label="Chọn tất cả học viên" ${selectedManualAttendance.size===students.length&&students.length?'checked':''}></th><th>Học viên</th><th>Mã học viên</th><th>Đơn vị</th><th>Trạng thái</th><th>Thời gian</th><th>Ghi chú</th></tr></thead><tbody>${students.map((student,index) => `<tr data-manual-row="${student.id}"><td class="manual-check-cell"><input type="checkbox" data-manual-select="${student.id}" aria-label="Chọn ${student.name}" ${selectedManualAttendance.has(student.id)?'checked':''}></td><td><span class="attendance-student"><span>${student.name.split(' ').slice(-2).map((part) => part[0]).join('')}</span>${student.name}</span></td><td>${student.code}</td><td>${student.unit}</td><td><select data-manual-status><option ${index%10<7?'selected':''}>Có mặt</option><option ${index%10===7?'selected':''}>Đi muộn</option><option ${index%10>7?'selected':''}>Vắng mặt</option><option>Có phép</option></select></td><td><input data-manual-time type="time" value="${index%10<8?'08:0'+index%10:''}"></td><td><input placeholder="Thêm ghi chú"></td></tr>`).join('')}</tbody></table></div></section>`;
  const attendancePanel = () => attendanceMethod === 'camera' ? cameraAttendancePanel() : attendanceMethod === 'manual' ? manualAttendancePanel() : qrAttendancePanel();
  const formatAttendanceDate=(value)=>{const [year,month,day]=String(value).split('-');return day&&month&&year?`${day}/${month}/${year}`:value};
  const attendanceTemplate = () => {const selected=attendanceSessions.find((session)=>session.id===selectedAttendanceSessionId)||attendanceSessions[0];if(selected)selectedAttendanceSessionId=selected.id;return `<div class="class-attendance"><aside class="attendance-sessions"><header><h2>Danh sách buổi học</h2><button type="button" data-class-action="add-attendance-session"><i class="fa-solid fa-plus"></i><span>Thêm mới</span></button></header><div class="attendance-session-list">${attendanceSessions.length?attendanceSessions.map((session,index)=>`<article class="attendance-session ${session.id===selected?.id?'active':''}"><button type="button" class="attendance-session-select" data-class-action="select-attendance-session" data-session-id="${session.id}"><b>Buổi ${index+1}: ${escapeHtml(session.name)}</b><span>${formatAttendanceDate(session.date)} · ${session.startTime} - ${session.endTime}</span><small><i class="fa-solid fa-location-dot"></i>${escapeHtml(session.location)}</small></button><div class="attendance-session-actions"><button type="button" data-class-action="attendance-session-menu" data-session-id="${session.id}" aria-label="Thao tác buổi ${index+1}" aria-expanded="false"><i class="fa-solid fa-ellipsis-vertical"></i></button><div class="attendance-session-menu" hidden><button type="button" data-class-action="view-attendance-session" data-session-id="${session.id}"><i class="fa-regular fa-eye"></i>Xem chi tiết</button><button type="button" data-class-action="edit-attendance-session" data-session-id="${session.id}"><i class="fa-solid fa-pen"></i>Chỉnh sửa</button><button type="button" class="danger" data-class-action="delete-attendance-session" data-session-id="${session.id}"><i class="fa-regular fa-trash-can"></i>Xóa</button></div></div></article>`).join(''):'<div class="attendance-session-empty"><i class="fa-regular fa-calendar-plus"></i><b>Chưa có buổi điểm danh</b><span>Nhấn “Thêm mới” để tạo buổi đầu tiên.</span></div>'}</div></aside>${selected?`<section class="attendance-main"><header class="attendance-head"><div><h2>Buổi ${attendanceSessions.indexOf(selected)+1}: ${escapeHtml(selected.name)}</h2><small>${formatAttendanceDate(selected.date)} · ${selected.startTime} - ${selected.endTime} · ${escapeHtml(selected.location)}</small></div><span class="class-status ${selected.status==='Đang mở'?'running':''}">${escapeHtml(selected.status)}</span></header><nav class="attendance-methods"><button class="${attendanceMethod==='qr'?'active':''}" data-attendance-method="qr"><i class="fa-solid fa-qrcode"></i>QR Code</button><button class="${attendanceMethod==='camera'?'active':''}" data-attendance-method="camera"><i class="fa-solid fa-camera"></i>Camera</button><button class="${attendanceMethod==='manual'?'active':''}" data-attendance-method="manual"><i class="fa-regular fa-rectangle-list"></i>Thủ công</button></nav><div class="attendance-method-view">${attendancePanel()}</div></section>`:'<section class="attendance-main attendance-main-empty"><i class="fa-regular fa-calendar-xmark"></i><h2>Chưa có dữ liệu điểm danh</h2><p>Hãy tạo một buổi điểm danh để bắt đầu.</p></section>'}</div>`};

  const testsTemplate = () => `<div class="class-toolbar"><input placeholder="Tìm theo tên bài kiểm tra..."><select><option>Tất cả chủ đề</option></select><select><option>Tất cả loại bài kiểm tra</option></select><span></span><button class="btn primary" data-class-action="add-test"><i class="fa-solid fa-plus"></i>Thêm bài kiểm tra</button></div>
    <section class="class-data-card tests-card"><table class="class-data-table"><thead><tr><th>Tên bài kiểm tra</th><th>Chủ đề</th><th>Số câu</th><th>Tổng điểm</th><th>Thời gian</th><th>Ngày bắt đầu</th><th>Thao tác</th></tr></thead><tbody>
    ${tests.map((test,index) => `<tr><td><span class="student-name"><i class="test-icon"><i class="fa-regular fa-file-lines"></i></i>${test[0]}</span></td><td>${test[1]}</td><td>${test[2]}</td><td>${test[3]} điểm</td><td>${test[4]}</td><td>05/08/2026 09:00</td><td><div class="class-test-actions"><button class="btn ghost" data-class-action="test-menu" data-test-index="${index}" aria-label="Mở thao tác ${test[0]}" aria-expanded="false"><i class="fa-solid fa-ellipsis"></i></button><div class="class-test-menu" hidden><button type="button" data-class-action="edit-test" data-test-index="${index}"><i class="fa-solid fa-pen"></i>Chỉnh sửa</button><button type="button" data-class-action="copy-test" data-test-index="${index}"><i class="fa-regular fa-copy"></i>Sao chép</button><button type="button" data-class-action="result-test" data-test-index="${index}"><i class="fa-solid fa-chart-column"></i>Xem kết quả</button><button type="button" class="danger" data-class-action="delete-test" data-test-index="${index}"><i class="fa-regular fa-trash-can"></i>Xóa</button></div></div></td></tr>`).join('')}
    </tbody></table></section>`;

  const gradeFor=(studentId)=>grades.find((grade)=>grade.studentId===studentId);
  const gradesTemplate=()=>`<div class="grade-overview"><article><span>Tổng học viên</span><b>${students.length}</b></article><article><span>Đã nhập điểm</span><b>${grades.length}</b></article><article><span>Đạt</span><b>${grades.filter((grade)=>grade.result==='Đạt').length}</b></article><article><span>Chưa đạt</span><b>${grades.filter((grade)=>grade.result==='Chưa đạt').length}</b></article></div><div class="grade-toolbar"><label><i class="fa-solid fa-magnifying-glass"></i><input data-grade-search placeholder="Tìm tên hoặc mã học viên..."></label><select data-grade-filter><option value="">Tất cả kết quả</option><option>Đạt</option><option>Chưa đạt</option><option>Chưa nhập điểm</option></select><button class="btn primary" data-class-action="add-grade"><i class="fa-solid fa-plus"></i>Nhập điểm học viên</button></div><section class="class-data-card grade-table-card"><table class="class-data-table grade-table"><thead><tr><th>Học viên</th><th>Đơn vị</th><th>Lớp học</th><th>Buổi học</th><th>Bài kiểm tra (40%)</th><th>Bài thi (60%)</th><th>Điểm TB</th><th>Kết quả</th><th>Thao tác</th></tr></thead><tbody>${students.map((student)=>{const grade=gradeFor(student.id);return `<tr data-grade-result="${grade?.result||'Chưa nhập điểm'}"><td><span class="student-name"><i>${student.name.split(' ').slice(-2).map((part)=>part[0]).join('')}</i><span><b>${student.name}</b><small>${student.code}</small></span></span></td><td>${student.unit}</td><td>AT-2026-13</td><td>${grade?.session||'Buổi 6 (05/08/2026)'}</td><td>${grade?grade.testScore.toFixed(1):'—'}</td><td>${grade?grade.examScore.toFixed(1):'—'}</td><td><b class="grade-average">${grade?grade.average.toFixed(1):'—'}</b></td><td><span class="grade-result ${grade?.result==='Đạt'?'passed':grade?'failed':'empty'}">${grade?.result||'Chưa nhập'}</span></td><td><div class="class-grade-actions"><button type="button" class="btn ghost grade-action-toggle" data-class-action="grade-menu" data-student-id="${student.id}" aria-label="Thao tác điểm của ${student.name}" aria-expanded="false"><i class="fa-solid fa-ellipsis"></i></button><div class="class-grade-menu" hidden><button type="button" data-class-action="view-grade" data-student-id="${student.id}"><i class="fa-regular fa-eye"></i>Xem chi tiết</button><button type="button" data-class-action="edit-grade" data-student-id="${student.id}"><i class="fa-solid fa-pen"></i>Chỉnh sửa</button><button type="button" class="danger" data-class-action="delete-grade" data-student-id="${student.id}" ${grade?'':'disabled'}><i class="fa-regular fa-trash-can"></i>Xóa</button></div></div></td></tr>`}).join('')}</tbody></table></section>`;

  const completionTemplate = () => `<p class="class-card" style="margin-bottom:12px">Thiết lập các điều kiện để học viên được công nhận hoàn thành lớp học. Thay đổi được lưu riêng cho lớp này.</p><section class="class-card"><h2>Điều kiện hoàn thành</h2><div class="completion-grid">
    <label><input type="checkbox" data-condition="content" ${completion.content?'checked':''}><span><b>Hoàn thành 100% nội dung bắt buộc</b><br>13 nội dung trong lớp</span></label><label><input type="checkbox" data-condition="average" ${completion.average?'checked':''}><span><b>Điểm trung bình tối thiểu</b><br><input data-condition-value="averageScore" type="number" min="0" max="100" value="${completion.averageScore}"> % từ ${tests.length} bài kiểm tra</span></label><label><input type="checkbox" data-condition="attendance" ${completion.attendance?'checked':''}><span><b>Tham gia số buổi tối thiểu</b><br><input data-condition-value="attendanceRate" type="number" min="0" max="100" value="${completion.attendanceRate}"> % số buổi học</span></label><label><input type="checkbox" data-condition="final" ${completion.final?'checked':''}><span><b>Đạt bài kiểm tra cuối khóa</b><br>Điểm tối thiểu <input data-condition-value="finalScore" type="number" min="0" max="10" step="0.5" value="${completion.finalScore}"> /10</span></label>
    </div><button class="btn primary" style="margin-top:14px" data-class-action="save-completion">Lưu điều kiện</button></section>`;

  const historyTemplate = () => `<section class="class-card"><h2>Lịch sử hoạt động</h2>${[['Tạo lớp học', 'Trần Minh · 01/08/2026 08:00'], ['Thêm 28 học viên', 'Lê Hùng · 02/08/2026 10:15'], ['Cập nhật lịch học', 'Trần Minh · 03/08/2026 14:20']].map(([title, time]) => `<div class="activity-row"><i class="fa-solid fa-clock-rotate-left"></i><div><b>${title}</b><br>${time}</div></div>`).join('')}</section>`;

  function renderTab() {
    document.querySelectorAll('[data-class-tab]').forEach((button) => button.classList.toggle('active', button.dataset.classTab === activeTab));
    const studentTab = document.querySelector('[data-class-tab="students"]');
    if (studentTab) studentTab.textContent = `Học viên (${students.length})`;
    const templates = { overview: overviewTemplate, students: studentsTemplate, content: contentTemplate, attendance: attendanceTemplate, grades: gradesTemplate, tests: testsTemplate, completion: completionTemplate, history: historyTemplate };
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

  function openActionDialog(title, body, mode = 'form') {
    actionDialogMode = mode;
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

  const gradeStudentSummary=(student,session='Buổi 6 (05/08/2026)')=>`<div class="grade-student-identity"><i>${student.name.split(' ').slice(-2).map((part)=>part[0]).join('')}</i><span><b>${student.name}</b><small>MS: ${student.code}</small></span></div><div><i class="fa-regular fa-building"></i><span>Đơn vị<b>${student.unit}</b></span></div><div><i class="fa-regular fa-id-badge"></i><span>Lớp học<b>AT-2026-13</b></span></div><div><i class="fa-regular fa-calendar"></i><span>Buổi học<b>${session}</b></span></div>`;

  function openGradeDialog(studentId) {
    const student=students.find((item)=>item.id===studentId),grade=gradeFor(studentId);
    if(!student)return;
    if(!grade){toast('Học viên chưa có điểm. Vui lòng dùng chức năng Nhập điểm.');return;}
    gradeTargetId=studentId;
    const form=byId('gradeForm');
    byId('gradeDialogTitle').textContent='Chỉnh sửa điểm';
    byId('gradeStudentSummary').innerHTML=gradeStudentSummary(student,grade.session);
    form.elements.testScore.value=grade.testScore;form.elements.examScore.value=grade.examScore;form.elements.average.value=grade.average;form.elements.result.value=grade.result;form.elements.note.value=grade.note||'';
    byId('gradeNoteCount').value=(grade.note||'').length;
    byId('gradeDialog').showModal();
  }

  function renderGradeEntryStudent(){const student=students.find((item)=>item.id===Number(byId('gradeEntryStudent').value));if(student)byId('gradeEntryStudentSummary').innerHTML=gradeStudentSummary(student);}
  function openGradeEntryDialog(studentId=students[0]?.id){
    const form=byId('gradeEntryForm');form.reset();byId('gradeEntryStudent').value=String(studentId);byId('gradeEntryNoteCount').value=0;renderGradeEntryStudent();byId('gradeEntryDialog').showModal();
  }
  function openGradeDetailDialog(studentId){
    const student=students.find((item)=>item.id===studentId),grade=gradeFor(studentId);if(!student)return;if(!grade){toast('Học viên chưa có điểm để xem.');return;}
    byId('gradeDetailBody').innerHTML=`<section class="grade-student-summary">${gradeStudentSummary(student,grade.session)}</section><section class="grade-detail-scores"><article><span>Bài kiểm tra <small>40%</small></span><b>${grade.testScore.toFixed(1)}</b><em>/ 10</em></article><article><span>Bài thi <small>60%</small></span><b>${grade.examScore.toFixed(1)}</b><em>/ 10</em></article><article class="average"><span>Điểm trung bình</span><b>${grade.average.toFixed(1)}</b><em>/ 10</em></article></section><section class="grade-detail-result"><div><span>Kết quả</span><b class="grade-result ${grade.result==='Đạt'?'passed':'failed'}">${grade.result}</b></div><div><span>Ghi chú</span><p>${grade.note||'Không có ghi chú.'}</p></div></section><div class="grade-formula-note"><i class="fa-solid fa-circle-info"></i><p>Điểm trung bình được tính theo công thức:<b>Điểm TB = (Bài kiểm tra × 40%) + (Bài thi × 60%)</b></p></div>`;
    byId('gradeDetailDialog').showModal();
  }

  function openAttendanceSessionForm(session=null){
    const form=byId('attendanceSessionForm');form.reset();attendanceSessionEditId=session?.id||null;
    byId('attendanceSessionDialogTitle').textContent=session?'Cập nhật thông tin buổi điểm danh đã chọn.':'Thêm mới buổi điểm danh cho lớp học.';
    byId('saveAttendanceSession').innerHTML='<i class="fa-regular fa-floppy-disk"></i>Lưu';
    if(session){['name','date','location','startTime','endTime','status','note','description'].forEach((key)=>{form.elements[key].value=session[key]||''});form.elements.allowQr.value=session.allowQr|| (session.method==='QR Code'?'yes':'no');form.elements.allowManual.value=session.allowManual|| (session.method==='Thủ công'?'yes':'no');form.elements.qrStart.value=session.qrStart||'07:45';form.elements.qrEnd.value=session.qrEnd||'08:30'}
    else{const last=attendanceSessions.at(-1),nextDate=last?new Date(`${last.date}T00:00:00`):new Date('2026-08-05T00:00:00');nextDate.setDate(nextDate.getDate()+2);form.elements.date.value=nextDate.toISOString().slice(0,10);form.elements.startTime.value='08:00';form.elements.endTime.value='10:00';form.elements.qrStart.value='07:45';form.elements.qrEnd.value='08:30';form.elements.status.value='Sắp diễn ra';form.elements.allowQr.value='yes';form.elements.allowManual.value='yes'}
    form.querySelectorAll('[data-attendance-count]').forEach((output)=>{output.value=form.elements[output.dataset.attendanceCount].value.length});syncAttendanceQrFields();form.elements.endTime.setCustomValidity('');byId('attendanceSessionDialog').showModal();
  }
  function syncAttendanceQrFields(){const form=byId('attendanceSessionForm'),disabled=form.elements.allowQr.value==='no',box=byId('attendanceQrTimeBox');box.classList.toggle('disabled',disabled);box.querySelectorAll('input').forEach((input)=>{input.disabled=disabled})}

  const closeStudentMenus = (except = null) => {
    view.querySelectorAll('.class-student-menu').forEach((menu) => {
      if (menu === except) return;
      menu.hidden = true;
      menu.previousElementSibling?.setAttribute('aria-expanded', 'false');
    });
  };
  const closeTestMenus = (except = null) => {
    view.querySelectorAll('.class-test-menu').forEach((menu) => {
      if (menu === except) return;
      menu.hidden = true;
      menu.previousElementSibling?.setAttribute('aria-expanded','false');
    });
  };
  const closeGradeMenus=(except=null)=>{view.querySelectorAll('.class-grade-menu').forEach((menu)=>{if(menu===except)return;menu.hidden=true;menu.previousElementSibling?.setAttribute('aria-expanded','false')})};
  const closeAttendanceSessionMenus=(except=null)=>{view.querySelectorAll('.attendance-session-menu').forEach((menu)=>{if(menu===except)return;menu.hidden=true;menu.previousElementSibling?.setAttribute('aria-expanded','false')})};

  const selectedStudentRecords = () => students.filter((student) => selectedStudents.has(student.id));

  const changeApproval = (ids, approval) => {
    students = students.map((student) => ids.includes(student.id) ? { ...student, approval } : student);
    window.LMSStore.write(`class-${classId}-students`,students);
    selectedStudents.clear();
    renderTab();
  };

  const removeStudents = (ids) => {
    students = students.filter((student) => !ids.includes(student.id));
    window.LMSStore.write(`class-${classId}-students`,students);
    ids.forEach((id) => selectedStudents.delete(id));
    renderTab();
  };
  const updateManualBulkSelectionUi=()=>{const count=byId('manualSelectedCount'),button=view.querySelector('[data-class-action="manual-bulk-apply"]'),master=view.querySelector('[data-manual-select-all]');if(count)count.textContent=selectedManualAttendance.size;if(button)button.disabled=!selectedManualAttendance.size;if(master){master.checked=Boolean(students.length&&selectedManualAttendance.size===students.length);master.indeterminate=selectedManualAttendance.size>0&&selectedManualAttendance.size<students.length}};

  document.querySelector('.class-tabs').addEventListener('click', (event) => {
    const button = event.target.closest('[data-class-tab]');
    if (!button) return;
    activeTab = button.dataset.classTab;
    history.replaceState(null, '', `#${activeTab}`);
    renderTab();
  });

  view.addEventListener('input', (event) => {
    if (event.target.matches('[data-grade-search],[data-grade-filter]')) {
      const query=(view.querySelector('[data-grade-search]')?.value||'').toLocaleLowerCase('vi'),result=view.querySelector('[data-grade-filter]')?.value||'';
      view.querySelectorAll('.grade-table tbody tr').forEach((row)=>{row.hidden=Boolean((query&&!row.textContent.toLocaleLowerCase('vi').includes(query))||(result&&row.dataset.gradeResult!==result))}); return;
    }
    if (event.target.matches('[data-attendance-search]')) {
      const query = event.target.value.toLocaleLowerCase('vi');
      view.querySelectorAll('.manual-table tbody tr').forEach((row) => { row.hidden = !row.textContent.toLocaleLowerCase('vi').includes(query); });
      return;
    }
    if (!event.target.matches('.class-toolbar input,.class-toolbar select')) return;
    const toolbar = event.target.closest('.class-toolbar');
    const query = (toolbar.querySelector('input')?.value || '').toLocaleLowerCase('vi');
    view.querySelectorAll('tbody tr').forEach((row) => { row.hidden = !row.textContent.toLocaleLowerCase('vi').includes(query); });
  });

  view.addEventListener('change', (event) => {
    if (event.target.name === 'captureScheduleMode') { cameraSettings.scheduleMode=event.target.value; renderTab(); return; }
    if (event.target.id === 'cameraCaptureCount') { cameraSettings.captureCount=Number(event.target.value); renderTab(); return; }
    if(event.target.matches('[data-manual-select-all]')){selectedManualAttendance.clear();if(event.target.checked)students.forEach((student)=>selectedManualAttendance.add(student.id));view.querySelectorAll('[data-manual-select]').forEach((checkbox)=>{checkbox.checked=event.target.checked});updateManualBulkSelectionUi();return}
    if(event.target.matches('[data-manual-select]')){const id=Number(event.target.dataset.manualSelect);event.target.checked?selectedManualAttendance.add(id):selectedManualAttendance.delete(id);updateManualBulkSelectionUi();return}
    if (!event.target.matches('[data-student-select]')) return;
    const id = Number(event.target.dataset.studentSelect);
    event.target.checked ? selectedStudents.add(id) : selectedStudents.delete(id);
    byId('selectedCount').textContent = selectedStudents.size;
  });

  view.addEventListener('click', (event) => {
    const attendanceTab = event.target.closest('[data-attendance-method]');
    if (attendanceTab) { attendanceMethod = attendanceTab.dataset.attendanceMethod; renderTab(); return; }
    const button = event.target.closest('[data-class-action]');
    if (!button) return;
    const action = button.dataset.classAction;
    if(action==='add-attendance-session'){openAttendanceSessionForm();return}
    if(action==='select-attendance-session'){const session=attendanceSessions.find((item)=>item.id===Number(button.dataset.sessionId));if(!session)return;selectedAttendanceSessionId=session.id;attendanceMethod=session.method==='Camera'?'camera':session.method==='Thủ công'?'manual':'qr';closeAttendanceSessionMenus();renderTab();return}
    if(action==='attendance-session-menu'){event.stopPropagation();const menu=button.nextElementSibling,opening=menu.hidden;closeAttendanceSessionMenus(menu);menu.hidden=!opening;button.setAttribute('aria-expanded',String(opening));return}
    if(['view-attendance-session','edit-attendance-session','delete-attendance-session'].includes(action)){
      const session=attendanceSessions.find((item)=>item.id===Number(button.dataset.sessionId));if(!session)return;closeAttendanceSessionMenus();
      if(action==='view-attendance-session'){window.appDialog({title:'Chi tiết buổi điểm danh',html:`<div class="attendance-session-detail"><h3>${escapeHtml(session.name)}</h3><dl><dt>Ngày diễn ra</dt><dd>${formatAttendanceDate(session.date)}</dd><dt>Thời gian</dt><dd>${session.startTime} - ${session.endTime}</dd><dt>Địa điểm</dt><dd>${escapeHtml(session.location)}</dd><dt>Phương thức</dt><dd>${escapeHtml(session.method)}</dd><dt>Trạng thái</dt><dd><span class="class-status ${session.status==='Đang mở'?'running':''}">${escapeHtml(session.status)}</span></dd><dt>Ghi chú</dt><dd>${escapeHtml(session.note||'Không có ghi chú.')}</dd></dl></div>`,confirmText:'Đóng',cancelText:''});return}
      if(action==='edit-attendance-session'){openAttendanceSessionForm(session);return}
      window.appDialog({title:'Xóa buổi điểm danh',html:`<p class="app-dialog-danger"><b>${escapeHtml(session.name)}</b></p><p>Thông tin cấu hình của buổi điểm danh sẽ bị xóa khỏi lớp học.</p>`,confirmText:'Xóa buổi điểm danh',cancelText:'Hủy'}).then((accepted)=>{if(!accepted)return;attendanceSessions=attendanceSessions.filter((item)=>item.id!==session.id);if(selectedAttendanceSessionId===session.id)selectedAttendanceSessionId=attendanceSessions[0]?.id||null;window.LMSStore.write(`class-${classId}-attendance-sessions`,attendanceSessions);renderTab();toast('Đã xóa buổi điểm danh')});return
    }
    if(action==='grade-menu'){event.stopPropagation();const menu=button.nextElementSibling,opening=menu.hidden;closeGradeMenus(menu);menu.hidden=!opening;button.setAttribute('aria-expanded',String(opening));return}
    if(action==='add-grade'){openGradeEntryDialog();return}
    if(['view-grade','edit-grade','delete-grade'].includes(action)){
      const studentId=Number(button.dataset.studentId),student=students.find((item)=>item.id===studentId),grade=gradeFor(studentId);if(!student)return;closeGradeMenus();
      if(action==='view-grade'){openGradeDetailDialog(studentId);return}
      if(action==='edit-grade'){grade?openGradeDialog(studentId):openGradeEntryDialog(studentId);return}
      if(action==='delete-grade'&&grade){window.appDialog({title:'Xóa điểm học viên',html:`<p class="app-dialog-danger">Xóa điểm của <b>${student.name}</b>?</p><p>Dữ liệu bài kiểm tra, bài thi và ghi chú sẽ bị xóa khỏi lớp.</p>`,confirmText:'Xóa điểm',cancelText:'Hủy'}).then((accepted)=>{if(!accepted)return;grades=grades.filter((item)=>item.studentId!==studentId);window.LMSStore.write(`class-${classId}-grades`,grades);renderTab();toast('Đã xóa điểm học viên')});return}
    }
    if (action === 'save-camera-settings') {
      const scheduleMode=view.querySelector('[name="captureScheduleMode"]:checked').value;
      cameraSettings={captureCount:Number(byId('cameraCaptureCount').value),scheduleMode,captureTimes:[...view.querySelectorAll('[data-camera-capture-time]')].map((input)=>input.value),startAfter:Number(byId('cameraStartAfter')?.value || cameraSettings.startAfter),interval:Number(byId('cameraInterval')?.value || cameraSettings.interval),notify:byId('cameraNotify').checked,allowRetake:byId('cameraAllowRetake').checked,keepPhotos:byId('cameraKeepPhotos').checked};
      window.LMSStore.write(`class-${classId}-camera-attendance`,cameraSettings); renderTab(); toast('Đã lưu thiết lập điểm danh qua camera'); return;
    }
    if (action === 'request-webcam-photo') { toast('Đã gửi yêu cầu chụp ảnh webcam tới 28 học viên'); return; }
    if (action === 'replace-class-photo') { toast('Đã mở chức năng thay ảnh chụp lớp học'); return; }
    if (action === 'manual-all-present') { view.querySelectorAll('[data-manual-status]').forEach((select) => { select.value='Có mặt'; }); toast('Đã đánh dấu tất cả học viên có mặt'); return; }
    if(action==='manual-bulk-apply'){if(!selectedManualAttendance.size){toast('Hãy chọn ít nhất một học viên');return}const status=view.querySelector('[data-manual-bulk-status]').value,time=view.querySelector('[data-manual-bulk-time]').value;selectedManualAttendance.forEach((id)=>{const row=view.querySelector(`[data-manual-row="${id}"]`);if(!row)return;row.querySelector('[data-manual-status]').value=status;row.querySelector('[data-manual-time]').value=['Có mặt','Đi muộn'].includes(status)?time:''});toast(`Đã cập nhật điểm danh cho ${selectedManualAttendance.size} học viên`);return}
    if (action === 'manual-reset') { selectedManualAttendance.clear();renderTab(); toast('Đã khôi phục dữ liệu điểm danh ban đầu'); return; }
    if (action === 'manual-save') { toast('Đã lưu điểm danh thủ công cho buổi học'); return; }
    if (action === 'test-menu') {
      event.stopPropagation();
      const menu = button.nextElementSibling,opening = menu.hidden;
      closeTestMenus(menu); menu.hidden = !opening;
      button.setAttribute('aria-expanded',String(opening));
      return;
    }
    if (['edit-test','copy-test','result-test','delete-test'].includes(action)) {
      const index=Number(button.dataset.testIndex),test=tests[index];
      if(!test)return; closeTestMenus();
      if(action==='edit-test'){openTestWizard();return}
      if(action==='copy-test'){tests.unshift([`${test[0]} - Bản sao`,...test.slice(1)]);window.LMSStore.write(`class-${classId}-tests`,tests);renderTab();toast('Đã sao chép bài kiểm tra');return}
      if(action==='result-test'){window.appDialog({title:`Kết quả: ${test[0]}`,html:`<div class="app-dialog-summary"><span><b>28</b>đã giao</span><span><b>24</b>đã nộp</span><span><b>82%</b>đạt</span></div><p class="app-dialog-note">${test[1]} · ${test[2]} câu · ${test[4]}</p><p>Điểm trung bình: <b>7,8/10</b>. Có 4 học viên chưa nộp bài.</p>`,confirmText:'Đóng',cancelText:''});return}
      if(action==='delete-test'){window.appDialog({title:'Xóa bài kiểm tra',html:`<p class="app-dialog-danger"><b>${test[0]}</b></p><p>Bài kiểm tra có ${test[2]} câu hỏi. Dữ liệu cấu hình sẽ bị xóa khỏi lớp.</p>`,confirmText:'Xóa bài kiểm tra',cancelText:'Hủy'}).then(accepted=>{if(!accepted)return;tests.splice(index,1);window.LMSStore.write(`class-${classId}-tests`,tests);renderTab();toast('Đã xóa bài kiểm tra')});return}
    }
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
    if (action === 'add-student') openActionDialog('Thêm học viên', '<label>Học viên<select name="student"><option value="HV1001|Trần Văn Nam">Trần Văn Nam - HV1001</option><option value="HV1002|Lê Thị Mai">Lê Thị Mai - HV1002</option></select></label><label>Đơn vị<input name="unit" value="Công ty Than Hạ Long" required></label><label>Trạng thái duyệt<select name="approval"><option>Đã duyệt</option><option>Chờ duyệt</option></select></label>', 'add-student');
    if (action === 'import-student') openActionDialog('Nhập học viên từ CSV', '<p class="app-dialog-note">Tệp CSV cần các cột: code, name, unit, approval. Các dòng thiếu mã hoặc tên sẽ bị bỏ qua.</p><label>Chọn tệp CSV<input name="file" type="file" accept=".csv,text/csv" required></label>', 'import-student');
    if (action === 'add-topic') openActionDialog('Thêm chủ đề', '<label>Tên chủ đề<input name="name" required></label><label>Phân nhóm<select name="group"><option>Kiến thức cơ bản</option><option>Đánh giá</option><option>Thực hành</option></select></label><label>Mô tả<textarea name="description" rows="3"></textarea></label><label><input name="required" type="checkbox" checked> Chủ đề bắt buộc</label>', 'add-topic');
    if (action === 'add-content') { actionTargetIndex=[...view.querySelectorAll('.class-topic')].indexOf(button.closest('.class-topic')); openActionDialog('Thêm nội dung', '<label>Tên nội dung<input name="name" required></label><label>Loại nội dung<select name="type"><option>Video</option><option>PDF</option><option>SCORM</option><option>Liên kết</option><option>Bài học văn bản</option></select></label><label>Thời lượng dự kiến<input name="duration" type="number" min="1" value="30" required></label><label>URL / nguồn nội dung<input name="source" type="url" placeholder="https://..."></label><label><input name="required" type="checkbox" checked> Nội dung bắt buộc</label>', 'add-content'); }
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
    if (action === 'save-completion') { const values=[...view.querySelectorAll('[data-condition-value]')];if(values.some(input=>!input.checkValidity())){values.find(input=>!input.checkValidity())?.reportValidity();return}completion={...completion,...Object.fromEntries([...view.querySelectorAll('[data-condition]')].map(input=>[input.dataset.condition,input.checked])),...Object.fromEntries(values.map(input=>[input.dataset.conditionValue,Number(input.value)])),updatedAt:new Date().toISOString()};window.LMSStore.write(`class-${classId}-completion`,completion);toast('Đã lưu điều kiện hoàn thành'); }
  });

  byId('classTestStep').addEventListener('click', (event) => {
    const source = event.target.closest('[data-test-source]');
    if (source) { testMode = source.dataset.testSource; renderTestWizard(); return; }
    if (event.target.closest('[data-pick-file]')) byId('classTestUpload')?.click();
    if (event.target.closest('.question-toolbar .btn')) openQuestionEditor();
  });

  byId('classTestStep').addEventListener('change', (event) => {
    if (event.target.id !== 'classTestUpload' || !event.target.files?.length) return;
    uploadedFileName = event.target.files[0].name;
    renderTestWizard();
  });

  document.addEventListener('click', (event) => {
    if (!event.target.closest('.class-student-actions')) closeStudentMenus();
    if (!event.target.closest('.class-test-actions')) closeTestMenus();
    if (!event.target.closest('.class-grade-actions')) closeGradeMenus();
    if (!event.target.closest('.attendance-session-actions')) closeAttendanceSessionMenus();
  });
  document.addEventListener('keydown',(event)=>{if(event.key==='Escape'){closeStudentMenus();closeTestMenus();closeGradeMenus();closeAttendanceSessionMenus();}});

  document.querySelectorAll('[data-close-class-dialog]').forEach((button) => button.addEventListener('click', () => byId('classActionDialog').close()));
  byId('classActionDialog').addEventListener('click', (event) => { if (event.target === event.currentTarget) event.currentTarget.close(); });
  document.querySelectorAll('[data-close-test]').forEach((button) => button.addEventListener('click', () => byId('classTestDialog').close()));
  document.querySelectorAll('[data-close-grade]').forEach((button)=>button.addEventListener('click',()=>byId('gradeDialog').close()));
  document.querySelectorAll('[data-close-grade-entry]').forEach((button)=>button.addEventListener('click',()=>byId('gradeEntryDialog').close()));
  document.querySelectorAll('[data-close-grade-detail]').forEach((button)=>button.addEventListener('click',()=>byId('gradeDetailDialog').close()));
  document.querySelectorAll('[data-close-attendance-session]').forEach((button)=>button.addEventListener('click',()=>byId('attendanceSessionDialog').close()));
  byId('gradeDialog').addEventListener('click',(event)=>{if(event.target===event.currentTarget)event.currentTarget.close()});
  byId('gradeEntryDialog').addEventListener('click',(event)=>{if(event.target===event.currentTarget)event.currentTarget.close()});
  byId('gradeDetailDialog').addEventListener('click',(event)=>{if(event.target===event.currentTarget)event.currentTarget.close()});
  byId('attendanceSessionDialog').addEventListener('click',(event)=>{if(event.target===event.currentTarget)event.currentTarget.close()});
  const bindGradeCalculator=(form,countId)=>form.addEventListener('input',(event)=>{if(event.target.name==='note')byId(countId).value=event.target.value.length;if(!['testScore','examScore'].includes(event.target.name))return;const testScore=Number(form.elements.testScore.value),examScore=Number(form.elements.examScore.value);if(form.elements.testScore.value===''||form.elements.examScore.value===''){form.elements.average.value='';return}const average=Number((testScore*.4+examScore*.6).toFixed(1));form.elements.average.value=average.toFixed(1);form.elements.result.value=average>=5?'Đạt':'Chưa đạt'});
  bindGradeCalculator(byId('gradeForm'),'gradeNoteCount');bindGradeCalculator(byId('gradeEntryForm'),'gradeEntryNoteCount');
  byId('gradeEntryStudent').addEventListener('change',renderGradeEntryStudent);
  byId('gradeForm').addEventListener('submit',(event)=>{event.preventDefault();if(!event.currentTarget.reportValidity())return;const data=Object.fromEntries(new FormData(event.currentTarget)),record={studentId:gradeTargetId,testScore:Number(data.testScore),examScore:Number(data.examScore),average:Number(data.average),result:data.result,note:data.note.trim(),session:'Buổi 6 (05/08/2026)'},existing=gradeFor(gradeTargetId);if(!existing)return;Object.assign(existing,record);window.LMSStore.write(`class-${classId}-grades`,grades);byId('gradeDialog').close();renderTab();toast('Đã cập nhật điểm học viên')});
  byId('gradeEntryForm').addEventListener('submit',(event)=>{event.preventDefault();if(!event.currentTarget.reportValidity())return;const data=Object.fromEntries(new FormData(event.currentTarget)),studentId=Number(data.studentId),record={studentId,testScore:Number(data.testScore),examScore:Number(data.examScore),average:Number(data.average),result:data.result,note:data.note.trim(),session:'Buổi 6 (05/08/2026)'},existing=gradeFor(studentId);if(existing)Object.assign(existing,record);else grades.push(record);window.LMSStore.write(`class-${classId}-grades`,grades);byId('gradeEntryDialog').close();renderTab();toast('Đã nhập điểm học viên')});
  byId('attendanceSessionForm').addEventListener('submit',(event)=>{event.preventDefault();const form=event.currentTarget;form.elements.endTime.setCustomValidity(form.elements.endTime.value<=form.elements.startTime.value?'Giờ kết thúc phải sau giờ bắt đầu.':'');if(form.elements.allowQr.value==='yes')form.elements.qrEnd.setCustomValidity(form.elements.qrEnd.value<=form.elements.qrStart.value?'Thời gian đóng QR phải sau thời gian mở QR.':'');if(!form.reportValidity())return;const data=Object.fromEntries(new FormData(form)),existing=attendanceSessions.find((item)=>item.id===attendanceSessionEditId),method=data.allowQr==='yes'?'QR Code':data.allowManual==='yes'?'Thủ công':existing?.method||'Camera',record={className:data.className,name:data.name.trim(),date:data.date,location:data.location.trim(),startTime:data.startTime,endTime:data.endTime,description:data.description.trim(),note:data.note.trim(),allowQr:data.allowQr,qrStart:data.qrStart||'',qrEnd:data.qrEnd||'',allowManual:data.allowManual,method,status:data.status};if(existing)Object.assign(existing,record);else{const item={id:Math.max(0,...attendanceSessions.map((session)=>session.id))+1,...record};attendanceSessions.push(item);selectedAttendanceSessionId=item.id}if((existing?.id||selectedAttendanceSessionId)===selectedAttendanceSessionId)attendanceMethod=record.method==='Camera'?'camera':record.method==='Thủ công'?'manual':'qr';window.LMSStore.write(`class-${classId}-attendance-sessions`,attendanceSessions);byId('attendanceSessionDialog').close();renderTab();toast(existing?'Đã cập nhật buổi điểm danh':'Đã thêm buổi điểm danh')});
  byId('attendanceSessionForm').addEventListener('input',(event)=>{const output=event.target.name&&byId('attendanceSessionForm').querySelector(`[data-attendance-count="${event.target.name}"]`);if(output)output.value=event.target.value.length;if(['startTime','endTime'].includes(event.target.name))event.currentTarget.elements.endTime.setCustomValidity('');if(['qrStart','qrEnd'].includes(event.target.name))event.currentTarget.elements.qrEnd.setCustomValidity('')});
  byId('attendanceSessionForm').addEventListener('change',(event)=>{if(event.target.name==='allowQr')syncAttendanceQrFields()});
  byId('classActionForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    if (actionDialogMode === 'confirm') {
      const action = confirmedAction;
      confirmedAction = null;
      byId('classActionDialog').close();
      action?.();
      return;
    }
    const data=Object.fromEntries(new FormData(event.currentTarget));
    if(actionDialogMode==='add-student'){const [code,name]=data.student.split('|');if(students.some(item=>item.code===code)){toast('Học viên đã có trong lớp');return}students.unshift({id:Math.max(0,...students.map(item=>item.id))+1,code,name,unit:data.unit,approval:data.approval,learning:'Chưa bắt đầu'});window.LMSStore.write(`class-${classId}-students`,students);byId('classActionDialog').close();renderTab();toast('Đã thêm học viên vào lớp');return}
    if(actionDialogMode==='import-student'){const file=event.currentTarget.elements.file.files[0],text=await file.text(),lines=text.replace(/^\uFEFF/,'').split(/\r?\n/).filter(Boolean),headers=lines.shift().split(',').map(value=>value.trim().toLowerCase()),value=(cells,key)=>cells[headers.indexOf(key)]?.trim()||'',records=lines.map(line=>{const cells=line.split(',');return{code:value(cells,'code'),name:value(cells,'name'),unit:value(cells,'unit')||'Chưa xác định',approval:value(cells,'approval')||'Chờ duyệt'}}).filter(item=>item.code&&item.name&&!students.some(student=>student.code===item.code));records.forEach(record=>students.push({...record,id:Math.max(0,...students.map(item=>item.id))+1,learning:'Chưa bắt đầu'}));window.LMSStore.write(`class-${classId}-students`,students);byId('classActionDialog').close();renderTab();toast(`Đã nhập ${records.length} học viên hợp lệ`);return}
    if(actionDialogMode==='add-topic'){topics.push([data.name.trim(),0,{group:data.group,description:data.description,required:Boolean(data.required),contents:[]}]);window.LMSStore.write(`class-${classId}-topics`,topics);byId('classActionDialog').close();renderTab();toast('Đã thêm chủ đề');return}
    if(actionDialogMode==='add-content'){const target=topics[Math.max(0,actionTargetIndex)]||topics[0];target[1]=Number(target[1]||0)+1;target[2]=target[2]||{contents:[]};target[2].contents=target[2].contents||[];target[2].contents.push({id:Date.now(),name:data.name.trim(),type:data.type,duration:Number(data.duration),source:data.source,required:Boolean(data.required)});window.LMSStore.write(`class-${classId}-topics`,topics);byId('classActionDialog').close();renderTab();toast('Đã thêm nội dung');return}
    byId('classActionDialog').close();toast('Đã lưu dữ liệu');
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
    window.LMSStore.write(`class-${classId}-tests`,tests);
    byId('classTestDialog').close();
    activeTab = 'tests';
    renderTab();
    toast('Đã tạo bài kiểm tra thành công');
  });

  async function openQuestionEditor(){const accepted=await window.appDialog({title:'Thêm câu hỏi vào bài kiểm tra',html:'<div class="app-dialog-wide"><div class="app-dialog-grid"><label class="field">Loại câu hỏi<select id="classQuestionType"><option>Một lựa chọn</option><option>Nhiều lựa chọn</option><option>Đúng / Sai</option><option>Tự luận</option></select></label><label class="field">Điểm<input id="classQuestionScore" type="number" min="0.5" step="0.5" value="1"></label><label class="field wide">Nội dung câu hỏi<textarea id="classQuestionContent" rows="4" required></textarea></label><label class="field wide">Các phương án<textarea id="classQuestionAnswers" rows="4" placeholder="Mỗi phương án một dòng"></textarea></label><label class="field wide">Giải thích đáp án<textarea id="classQuestionExplanation" rows="3"></textarea></label></div></div>',confirmText:'Thêm câu hỏi',cancelText:'Hủy'});if(!accepted)return;const content=byId('classQuestionContent').value.trim();if(!content)return toast('Nội dung câu hỏi không được để trống');draftQuestions.push({id:Date.now(),type:byId('classQuestionType').value,score:Number(byId('classQuestionScore').value),content,answers:byId('classQuestionAnswers').value.split('\n').filter(Boolean),explanation:byId('classQuestionExplanation').value.trim()});window.LMSStore.write(`class-${classId}-draft-questions`,draftQuestions);toast(`Đã thêm câu hỏi thứ ${draftQuestions.length}`)}
  byId('copyClass').addEventListener('click', async () => {const classes=window.LMSStore.all('classes',[]),source=classes.find(item=>Number(item.id)===classId)||classes[0];if(!source)return toast('Không tìm thấy dữ liệu lớp học');const accepted=await window.appDialog({title:'Sao chép lớp học',html:`<label class="field">Tên lớp mới<input id="detailCopyName" value="${source.name} - Bản sao"></label><label class="field">Mã lớp mới<input id="detailCopyCode" value="${source.code}-COPY"></label><div class="app-check-grid"><label><input id="detailCopyStudents" type="checkbox"><span><b>Học viên</b><small>${students.length} học viên</small></span></label><label><input id="detailCopyContent" type="checkbox" checked><span><b>Nội dung</b><small>${topics.length} chủ đề</small></span></label><label><input id="detailCopyTests" type="checkbox" checked><span><b>Bài kiểm tra</b><small>${tests.length} bài</small></span></label></div>`,confirmText:'Tạo bản sao',cancelText:'Hủy'});if(!accepted)return;const code=byId('detailCopyCode').value.trim();if(classes.some(item=>item.code.toLowerCase()===code.toLowerCase()))return toast('Mã lớp đã tồn tại');const id=Math.max(0,...classes.map(item=>Number(item.id)||0))+1,copy={...source,id,code,name:byId('detailCopyName').value.trim(),approved:byId('detailCopyStudents').checked?source.approved:0,status:'Sắp diễn ra'};classes.unshift(copy);window.LMSStore.write('classes',classes);if(byId('detailCopyStudents').checked)window.LMSStore.write(`class-${id}-students`,students);if(byId('detailCopyContent').checked)window.LMSStore.write(`class-${id}-topics`,topics);if(byId('detailCopyTests').checked)window.LMSStore.write(`class-${id}-tests`,tests);toast(`Đã tạo lớp ${code}`)});
  byId('deleteClass').addEventListener('click', async () => {const classes=window.LMSStore.all('classes',[]),source=classes.find(item=>Number(item.id)===classId),accepted=await window.appDialog({title:'Lưu trữ lớp học',html:`<p class="app-dialog-danger"><b>${source?.name||'Lớp học hiện tại'}</b></p><div class="app-dialog-summary"><span><b>${students.length}</b>học viên</span><span><b>${topics.length}</b>chủ đề</span><span><b>${tests.length}</b>bài kiểm tra</span></div><p>Lớp đã có dữ liệu học tập nên sẽ được chuyển sang trạng thái kết thúc thay vì xóa cứng.</p>`,confirmText:'Lưu trữ lớp',cancelText:'Hủy'});if(!accepted)return;if(source){source.status='Đã kết thúc';window.LMSStore.write('classes',classes)}location.href='quan-ly-lop-hoc.html'; });
  renderTab();
})();
