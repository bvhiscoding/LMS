(() => {
  let surveys = [
    {id:1,name:'Khảo sát nhu cầu đào tạo năm 2026',unit:'Phòng Đào tạo',period:'01/07/2025 - 31/07/2025',year:'2025',status:'Chưa thực hiện'},
    {id:2,name:'Khảo sát CNTT',unit:'Phòng CNTT',period:'10/06/2025 - 20/06/2025',year:'2025',status:'Đã hoàn thành'},
    {id:3,name:'Khảo sát năng lực giảng dạy',unit:'Phòng Đào tạo',period:'01/05/2025 - 15/05/2025',year:'2025',status:'Đã hoàn thành'},
    {id:4,name:'Khảo sát bồi dưỡng chuyên môn',unit:'Khoa Ngoại ngữ',period:'15/03/2025 - 25/03/2025',year:'2025',status:'Đã hết hạn'},
    {id:5,name:'Khảo sát chuyển đổi số trong giáo dục',unit:'Phòng CNTT',period:'01/02/2025 - 10/02/2025',year:'2025',status:'Đã hết hạn'}
  ];
  const $ = (id) => document.getElementById(id), body = $('needSurveyTableBody');
  if (!body) return;
  let page = 1, activeSurveyId = null;
  const esc = (value) => String(value).replace(/[&<>'"]/g,(char) => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
  const normalize = (value) => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').replace(/Đ/g,'D').toLowerCase();
  const statusClass = (status) => status === 'Chưa thực hiện' ? 'pending' : status === 'Đã hoàn thành' ? 'done' : 'expired';
  const filtered = () => { const query = normalize($('needSurveySearch').value),status = $('needSurveyStatus').value,year = $('needSurveyYear').value; return surveys.filter((item) => (!query || normalize(item.name).includes(query)) && (!status || item.status === status) && (!year || item.year === year)); };
  const toast = (message) => { const node = $('needSurveyToast'); node.textContent = message; node.hidden = false; clearTimeout(toast.timer); toast.timer = setTimeout(() => { node.hidden = true; },2300); };

  function actionLabel(item) { if (item.status === 'Chưa thực hiện') return ['primary','fa-regular fa-file-lines','Thực hiện','perform']; if (item.status === 'Đã hoàn thành') return ['','fa-regular fa-eye','Xem kết quả','result']; return ['','fa-regular fa-eye','Xem','view']; }
  function render() {
    const data = filtered(),pageSize = 5,pages = Math.max(1,Math.ceil(data.length / pageSize)); page = Math.min(page,pages); const rows = data.slice((page - 1) * pageSize,page * pageSize);
    body.innerHTML = rows.length ? rows.map((item,index) => { const [style,icon,label,action] = actionLabel(item); return `<tr><td>${(page - 1) * pageSize + index + 1}</td><td>${esc(item.name)}</td><td>${esc(item.unit)}</td><td>${esc(item.period)}</td><td><span class="need-survey-status ${statusClass(item.status)}">${esc(item.status)}</span></td><td><button class="need-survey-action ${style}" data-action="${action}" data-id="${item.id}"><i class="${icon}"></i>${label}</button></td></tr>`; }).join('') : '<tr><td colspan="6" class="need-survey-empty">Không tìm thấy khảo sát phù hợp</td></tr>';
    const first = data.length ? (page - 1) * pageSize + 1 : 0,last = Math.min(page * pageSize,data.length); $('needSurveySummary').textContent = `Hiển thị ${first} - ${last} trong tổng số ${data.length} khảo sát`; $('needSurveyPagination').innerHTML = `<button class="need-survey-page-button" data-page="${page - 1}" ${page === 1 ? 'disabled' : ''}><i class="fa-solid fa-chevron-left"></i></button>${Array.from({length:pages},(_,index) => `<button class="need-survey-page-button ${index + 1 === page ? 'active' : ''}" data-page="${index + 1}">${index + 1}</button>`).join('')}<button class="need-survey-page-button" data-page="${page + 1}" ${page === pages ? 'disabled' : ''}><i class="fa-solid fa-chevron-right"></i></button>`;
  }
  function openSurvey(item,mode) {
    activeSurveyId = item.id; $('needSurveyDetailTitle').textContent = item.name; $('needSurveyDetailSub').textContent = `${item.unit} · ${item.period}`; const complete = $('completeNeedSurvey');
    if (mode === 'perform') { $('needSurveyDetailBody').innerHTML = '<div class="survey-question"><b>1. Bạn ưu tiên lĩnh vực đào tạo nào?</b><label><input type="radio" name="q1" checked> Công nghệ</label><label><input type="radio" name="q1"> Kỹ năng</label></div><div class="survey-question"><b>2. Hình thức mong muốn?</b><label><input type="radio" name="q2" checked> Trực tiếp</label><label><input type="radio" name="q2"> Trực tuyến</label></div>'; complete.hidden = false; }
    else { $('needSurveyDetailBody').innerHTML = mode === 'result' ? '<div class="survey-question"><b>Kết quả tổng hợp</b><p>68% chọn đào tạo trực tiếp · 45% ưu tiên Công nghệ thông tin · 32 phản hồi.</p></div>' : '<div class="survey-question"><b>Thông tin khảo sát</b><p>Khảo sát đã hết hạn. Nội dung được giữ để tham khảo khi xây dựng kế hoạch đào tạo.</p></div>'; complete.hidden = true; }
    $('needSurveyDetailDialog').showModal();
  }

  ['needSurveySearch','needSurveyStatus','needSurveyYear'].forEach((id) => $(id).addEventListener(id === 'needSurveySearch' ? 'input' : 'change',() => { page = 1; render(); }));
  $('resetNeedSurvey').addEventListener('click',() => { $('needSurveySearch').value = $('needSurveyStatus').value = ''; $('needSurveyYear').value = '2025'; page = 1; render(); });
  $('needSurveyPagination').addEventListener('click',(event) => { const button = event.target.closest('[data-page]'); if (!button || button.disabled) return; page = Number(button.dataset.page); render(); });
  body.addEventListener('click',(event) => { const button = event.target.closest('[data-action]'); if (!button) return; const item = surveys.find((row) => row.id === Number(button.dataset.id)); if (item) openSurvey(item,button.dataset.action); });
  $('completeNeedSurvey').addEventListener('click',() => { const item = surveys.find((row) => row.id === activeSurveyId); if (item) item.status = 'Đã hoàn thành'; $('needSurveyDetailDialog').close(); toast('Đã hoàn thành khảo sát'); render(); });
  document.querySelectorAll('[data-close-survey-detail]').forEach((button) => button.addEventListener('click',() => $('needSurveyDetailDialog').close()));
  $('openNeedRegistration').addEventListener('click',() => { const form = $('needRegistrationForm'); form.reset(); form.elements.format.value = 'Trực tiếp'; form.querySelectorAll('output').forEach((output) => { output.value = '0'; }); $('needRegistrationDialog').showModal(); });
  document.querySelectorAll('[data-close-registration]').forEach((button) => button.addEventListener('click',() => $('needRegistrationDialog').close()));
  [$('needRegistrationDialog'),$('needSurveyDetailDialog')].forEach((dialog) => dialog.addEventListener('click',(event) => { if (event.target === dialog) dialog.close(); }));
  $('needRegistrationForm').querySelectorAll('textarea').forEach((textarea) => textarea.addEventListener('input',() => { const output = document.querySelector(`[data-count-for="${textarea.name}"]`); if (output) output.value = textarea.value.length; }));
  $('needRegistrationForm').addEventListener('submit',(event) => { event.preventDefault(); if (!event.currentTarget.reportValidity()) return; const data = Object.fromEntries(new FormData(event.currentTarget)); $('needRegistrationDialog').close(); toast(`Đã gửi nhu cầu “${data.course.trim()}”`); });
  console.assert(surveys.length === 5,'Need survey mock data self-check failed'); render();
})();
