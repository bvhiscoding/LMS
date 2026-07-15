(() => {
  const surveySeed = [
    {id:1,name:'Khảo sát nhu cầu đào tạo năm 2026',unit:'Phòng Đào tạo',period:'01/07/2025 - 31/07/2025',year:'2025',status:'Chưa thực hiện'},
    {id:2,name:'Khảo sát CNTT',unit:'Phòng CNTT',period:'10/06/2025 - 20/06/2025',year:'2025',status:'Đã hoàn thành'},
    {id:3,name:'Khảo sát năng lực giảng dạy',unit:'Phòng Đào tạo',period:'01/05/2025 - 15/05/2025',year:'2025',status:'Đã hoàn thành'},
    {id:4,name:'Khảo sát bồi dưỡng chuyên môn',unit:'Khoa Ngoại ngữ',period:'15/03/2025 - 25/03/2025',year:'2025',status:'Đã hết hạn'},
    {id:5,name:'Khảo sát chuyển đổi số trong giáo dục',unit:'Phòng CNTT',period:'01/02/2025 - 10/02/2025',year:'2025',status:'Đã hết hạn'}
  ];
  let surveys = window.LMSStore.seed('need-surveys',surveySeed);
  const $ = (id) => document.getElementById(id), body = $('needSurveyTableBody');
  if (!body) return;
  let page = 1, activeSurveyId = null;
  const esc = (value) => String(value).replace(/[&<>'"]/g,(char) => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
  const normalize = (value) => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').replace(/Đ/g,'D').toLowerCase();
  const statusClass = (status) => status === 'Chưa thực hiện' ? 'pending' : status === 'Đã duyệt' ? 'approved' : status === 'Đã hoàn thành' ? 'done' : 'expired';
  const filtered = () => { const query = normalize($('needSurveySearch').value),status = $('needSurveyStatus').value,year = $('needSurveyYear').value; return surveys.filter((item) => (!query || normalize(item.name).includes(query)) && (!status || item.status === status) && (!year || item.year === year)); };
  const toast = (message) => { const node = $('needSurveyToast'); node.textContent = message; node.hidden = false; clearTimeout(toast.timer); toast.timer = setTimeout(() => { node.hidden = true; },2300); };
  const requestSeed = [
    {id:201,code:'NCDT-2026-001',course:'Quản trị dự án chuyên nghiệp',field:'Quản trị',priority:'Cao',date:'2026-09-15',goal:'Nâng cao kỹ năng lập kế hoạch, kiểm soát tiến độ và quản trị rủi ro dự án.',reason:'Phục vụ công tác quản lý dự án tại đơn vị.',status:'Đã gửi'},
    {id:202,code:'NCDT-2026-002',course:'An toàn vệ sinh lao động nâng cao',field:'An toàn lao động',priority:'Cao',date:'2026-08-20',goal:'Cập nhật quy định và phương pháp nhận diện rủi ro trong môi trường sản xuất.',reason:'Bổ sung kiến thức an toàn định kỳ.',status:'Đang xem xét'},
    {id:203,code:'NCDT-2026-003',course:'Phân tích dữ liệu với Power BI',field:'Công nghệ thông tin',priority:'Trung bình',date:'2026-10-05',goal:'Xây dựng báo cáo quản trị và dashboard phục vụ điều hành.',reason:'Đáp ứng nhu cầu chuyển đổi số tại đơn vị.',status:'Đã phê duyệt'},
    {id:204,code:'NCDT-2026-004',course:'Tiếng Anh giao tiếp trong công việc',field:'Ngoại ngữ',priority:'Trung bình',date:'2026-11-01',goal:'Cải thiện khả năng giao tiếp và trao đổi tài liệu chuyên môn bằng tiếng Anh.',reason:'Phục vụ công việc với đối tác nước ngoài.',status:'Đã gửi'}
  ];
  const savedRequests = window.LMSStore.all('training-requests',[]),savedRequestCodes = new Set(savedRequests.map((item) => item.code));
  let requests = [...savedRequests,...requestSeed.filter((item) => !savedRequestCodes.has(item.code))];
  if (requests.length !== savedRequests.length) window.LMSStore.write('training-requests',requests);

  const periodicSeed = [
    {id:101,code:'KS2025-07',name:'Khảo sát nhu cầu đào tạo năm 2026',description:'Thu thập nhu cầu đào tạo cho kế hoạch 2026',unit:'Phòng Đào tạo, Phòng CNTT, Phòng Kế toán',unitCount:15,start:'2025-07-01',end:'2025-07-31',completed:85,total:120,status:'Đang thực hiện'},
    {id:102,code:'KS2025-06',name:'Khảo sát CNTT',description:'Đánh giá nhu cầu đào tạo CNTT năm 2025',unit:'Phòng CNTT',unitCount:1,start:'2025-06-10',end:'2025-06-20',completed:45,total:48,status:'Đã hoàn thành'},
    {id:103,code:'KS2025-05',name:'Khảo sát năng lực giảng dạy',description:'Khảo sát năng lực giảng dạy quý II/2025',unit:'Khoa Ngoại ngữ, Khoa Kinh tế',unitCount:10,start:'2025-05-01',end:'2025-05-15',completed:98,total:110,status:'Đã hoàn thành'},
    {id:104,code:'KS2025-03',name:'Khảo sát bồi dưỡng chuyên môn',description:'Nhu cầu bồi dưỡng chuyên môn năm 2025',unit:'Khoa Ngoại ngữ',unitCount:1,start:'2025-03-15',end:'2025-03-25',completed:110,total:110,status:'Đã kết thúc'},
    {id:105,code:'KS2025-02',name:'Khảo sát chuyển đổi số trong giáo dục',description:'Nhu cầu đào tạo về chuyển đổi số',unit:'Phòng CNTT, Phòng Đào tạo',unitCount:2,start:'2025-02-01',end:'2025-02-10',completed:60,total:120,status:'Đã kết thúc'},
    {id:106,code:'KS2024-12',name:'Khảo sát nhu cầu đào tạo cuối năm 2024',description:'Tổng hợp nhu cầu đào tạo cuối năm',unit:'Toàn bộ đơn vị',unitCount:18,start:'2024-12-01',end:'2024-12-15',completed:150,total:150,status:'Đã kết thúc'}
  ];
  let periodicSurveys = window.LMSStore.seed('periodic-surveys',periodicSeed),periodicPage = 1,periodicPageSize = 6;
  const periodicBody = $('periodicSurveyTableBody'),periodicFilters = $('periodicSurveyFilters');
  const periodicQuestionSeed = [
    {text:'Bạn đánh giá mức độ hữu ích của các chương trình đào tạo hiện tại?',type:'Thang điểm (1-5)',tone:''},
    {text:'Bạn mong muốn được đào tạo những nội dung/kỹ năng nào? (Chọn nhiều)',type:'Checkbox',tone:'green'},
    {text:'Theo bạn, hình thức đào tạo nào phù hợp nhất?',type:'Trắc nghiệm 1 đáp án',tone:'blue'},
    {text:'Bạn đề xuất chủ đề đào tạo khác (nếu có)',type:'Tự luận',tone:'orange'},
    {text:'Bạn có sẵn sàng tham gia các chương trình đào tạo trong năm tới?',type:'Trắc nghiệm 1 đáp án',tone:'blue'}
  ];
  let periodicQuestions = periodicQuestionSeed.map((question) => ({...question}));
  const formatDate = (value) => { const parts = String(value).split('-'); return parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : value; };
  const periodicStatusClass = (status) => status === 'Đang thực hiện' ? 'running' : status === 'Đã hoàn thành' ? 'completed' : 'ended';
  const periodicFiltered = () => { const form = new FormData(periodicFilters),query = normalize(form.get('query')); return periodicSurveys.filter((item) => (!query || normalize(`${item.code} ${item.name} ${item.description}`).includes(query)) && (!form.get('status') || item.status === form.get('status')) && (!form.get('year') || item.start.startsWith(form.get('year'))) && (!form.get('unit') || normalize(item.unit).includes(normalize(form.get('unit'))))); };

  function closePeriodicMenus() {
    document.querySelectorAll('.periodic-row-menu').forEach((menu) => { menu.hidden = true; });
    document.querySelectorAll('.periodic-more').forEach((button) => button.setAttribute('aria-expanded','false'));
  }
  function openPeriodicMenu(button) {
    const menu = document.getElementById(button.getAttribute('aria-controls')),opening = menu.hidden;
    closePeriodicMenus();
    if (!opening) return;
    menu.hidden = false; button.setAttribute('aria-expanded','true');
    const rect = button.getBoundingClientRect(),openUp = rect.bottom + menu.offsetHeight + 8 > window.innerHeight;
    menu.style.top = `${openUp ? rect.top - menu.offsetHeight - 6 : rect.bottom + 6}px`;
    menu.style.left = `${Math.max(12,rect.right - menu.offsetWidth)}px`;
  }
  function renderPeriodic() {
    const data = periodicFiltered(),pages = Math.max(1,Math.ceil(data.length / periodicPageSize)); periodicPage = Math.min(periodicPage,pages); const pageRows = data.slice((periodicPage - 1) * periodicPageSize,periodicPage * periodicPageSize);
    periodicBody.innerHTML = pageRows.length ? pageRows.map((item,index) => {
      const percent = Math.min(100,Math.round(item.completed / item.total * 100));
      const result = item.status === 'Đang thực hiện' ? ['fa-regular fa-eye','Xem'] : ['fa-solid fa-chart-column','Xem kết quả'];
      return `<tr><td>${(periodicPage - 1) * periodicPageSize + index + 1}</td><td><b>${esc(item.code)}</b></td><td class="periodic-survey-name"><b>${esc(item.name)}</b><small>${esc(item.description)}</small></td><td class="periodic-survey-units">${esc(item.unit)}<br><small>${item.unitCount} đơn vị</small></td><td>${formatDate(item.start)} - ${formatDate(item.end)}</td><td><div class="periodic-progress"><span><b>${item.completed} / ${item.total}</b><b>${percent}%</b></span><div class="periodic-progress-track"><i style="width:${percent}%"></i></div></div></td><td><span class="periodic-status ${periodicStatusClass(item.status)}">${esc(item.status)}</span></td><td><div class="periodic-actions"><button type="button" class="periodic-more" data-periodic-action="menu" data-id="${item.id}" aria-label="Thao tác với ${esc(item.name)}" aria-expanded="false" aria-controls="periodic-menu-${item.id}"><i class="fa-solid fa-ellipsis"></i></button><div class="periodic-row-menu" id="periodic-menu-${item.id}" hidden><button type="button" data-periodic-action="view" data-id="${item.id}"><i class="${result[0]}"></i>${result[1]}</button><button type="button" data-periodic-action="edit" data-id="${item.id}"><i class="fa-solid fa-pen"></i>Chỉnh sửa</button><button type="button" class="danger" data-periodic-action="delete" data-id="${item.id}"><i class="fa-regular fa-trash-can"></i>Xóa</button></div></div></td></tr>`;
    }).join('') : '<tr><td colspan="8" class="periodic-empty">Không tìm thấy khảo sát định kỳ phù hợp.</td></tr>';
    const first = data.length ? (periodicPage - 1) * periodicPageSize + 1 : 0,last = Math.min(periodicPage * periodicPageSize,data.length); $('periodicSurveySummary').textContent = `Hiển thị ${first} - ${last} trong tổng số ${data.length} khảo sát`; $('periodicSurveyPagination').innerHTML = `<button class="periodic-page-button" data-periodic-page="${periodicPage - 1}" ${periodicPage === 1 ? 'disabled' : ''} aria-label="Trang trước"><i class="fa-solid fa-chevron-left"></i></button>${Array.from({length:pages},(_,index) => `<button class="periodic-page-button ${index + 1 === periodicPage ? 'active' : ''}" data-periodic-page="${index + 1}">${index + 1}</button>`).join('')}<button class="periodic-page-button" data-periodic-page="${periodicPage + 1}" ${periodicPage === pages ? 'disabled' : ''} aria-label="Trang sau"><i class="fa-solid fa-chevron-right"></i></button>`;
  }
  function setSurveyTab(tabName) {
    document.querySelectorAll('[data-survey-tab]').forEach((button) => { const active = button.dataset.surveyTab === tabName; button.classList.toggle('active',active); button.setAttribute('aria-selected',String(active)); });
    document.querySelectorAll('[data-survey-panel]').forEach((panel) => { panel.hidden = panel.dataset.surveyPanel !== tabName; });
    $('openPeriodicSurvey').hidden = tabName !== 'periodic';
  }
  function openPeriodicDialog(item) {
    const form = $('periodicSurveyForm'); form.reset(); form.dataset.editId = item?.id || '';
    form.closest('dialog').querySelector('h2').textContent = item ? 'Chỉnh sửa khảo sát định kỳ' : 'Tạo khảo sát định kỳ';
    const year = item?.start?.slice(0,4) || String(new Date().getFullYear());
    form.elements.year.value = year;
    form.elements.code.value = item?.code || `KS${year}-${String(periodicSurveys.length + 1).padStart(2,'0')}`;
    periodicQuestions = (item?.questions?.length ? item.questions : periodicQuestionSeed).map((question) => ({...question}));
    if (item) {
      form.elements.title.value = item.name; form.elements.description.value = item.description; form.elements.start.value = item.start; form.elements.end.value = item.end; form.elements.unit.value = ['Phòng Đào tạo','Phòng CNTT','Khoa Ngoại ngữ','Toàn bộ đơn vị'].find((unit) => item.unit.includes(unit)) || 'Toàn bộ đơn vị'; form.elements.note.value = item.note || '';
      if (item.audiences?.length) form.querySelectorAll('[name="audience"]').forEach((checkbox) => { checkbox.checked = item.audiences.includes(checkbox.value); });
      Object.entries(item.settings || {}).forEach(([name,checked]) => { if (form.elements[name]) form.elements[name].checked = checked; });
    }
    $('selectAllAudience').checked = [...form.querySelectorAll('[name="audience"]')].every((checkbox) => checkbox.checked);
    renderPeriodicQuestions();
    $('periodicSurveyDialog').showModal();
  }
  function renderPeriodicQuestions() {
    $('periodicQuestionList').innerHTML = periodicQuestions.map((question,index) => `<article class="periodic-question-card"><i class="fa-solid fa-grip-vertical periodic-question-drag" aria-hidden="true"></i><div class="periodic-question-copy"><strong>${index + 1}. ${esc(question.text)}</strong><span class="periodic-question-type ${esc(question.tone || '')}">${esc(question.type)}</span></div><div class="periodic-question-actions"><button type="button" data-question-action="edit" data-index="${index}" aria-label="Chỉnh sửa câu hỏi"><i class="fa-solid fa-pen"></i></button><button type="button" data-question-action="copy" data-index="${index}" aria-label="Sao chép câu hỏi"><i class="fa-regular fa-copy"></i></button><button type="button" class="danger" data-question-action="delete" data-index="${index}" aria-label="Xóa câu hỏi"><i class="fa-regular fa-trash-can"></i></button></div></article>`).join('');
    $('periodicQuestionCount').textContent = periodicQuestions.length;
  }
  async function editPeriodicQuestion(index,question = null) {
    const current = question || periodicQuestions[index];
    const accepted = await window.appDialog({title:question ? 'Thêm câu hỏi' : 'Chỉnh sửa câu hỏi',html:`<label class="field">Nội dung câu hỏi<textarea id="periodicQuestionText" rows="3">${esc(current.text)}</textarea></label><label class="field">Loại câu hỏi<select id="periodicQuestionType"><option ${current.type === 'Thang điểm (1-5)' ? 'selected' : ''}>Thang điểm (1-5)</option><option ${current.type === 'Checkbox' ? 'selected' : ''}>Checkbox</option><option ${current.type === 'Trắc nghiệm 1 đáp án' ? 'selected' : ''}>Trắc nghiệm 1 đáp án</option><option ${current.type === 'Tự luận' ? 'selected' : ''}>Tự luận</option></select></label>`,confirmText:question ? 'Thêm câu hỏi' : 'Lưu thay đổi'});
    if (!accepted) return;
    const text = $('periodicQuestionText')?.value.trim(),type = $('periodicQuestionType')?.value;
    if (!text) { toast('Vui lòng nhập nội dung câu hỏi'); return; }
    const tone = type === 'Checkbox' ? 'green' : type === 'Tự luận' ? 'orange' : type === 'Trắc nghiệm 1 đáp án' ? 'blue' : '';
    if (question) periodicQuestions.push({text,type,tone}); else periodicQuestions[index] = {text,type,tone};
    renderPeriodicQuestions();
  }
  function openPeriodicDetail(item) {
    const percent = Math.min(100,Math.round(item.completed / item.total * 100)); $('needSurveyDetailTitle').textContent = item.name; $('needSurveyDetailSub').textContent = `${item.code} · ${formatDate(item.start)} - ${formatDate(item.end)}`; $('needSurveyDetailBody').innerHTML = `<div class="survey-question"><b>Phạm vi áp dụng</b><p>${esc(item.unit)} · ${item.unitCount} đơn vị</p></div><div class="survey-question"><b>Tiến độ phản hồi</b><p>${item.completed}/${item.total} phản hồi · ${percent}% hoàn thành</p></div><div class="survey-question"><b>Mô tả</b><p>${esc(item.description)}</p></div>`; $('completeNeedSurvey').hidden = true; $('needSurveyDetailDialog').showModal();
  }

  const requestSection = document.createElement('section');
  requestSection.className = 'need-survey-card';
  requestSection.innerHTML = '<h2>Nhu cầu đào tạo của tôi</h2><div class="need-survey-table-wrap"><table class="need-survey-table training-request-table"><thead><tr><th>Mã yêu cầu</th><th>Khóa học / chương trình</th><th>Lĩnh vực</th><th>Ưu tiên</th><th>Thời gian mong muốn</th><th>Trạng thái</th></tr></thead><tbody id="trainingRequestBody"></tbody></table></div>';
  $('needSurveyTableBody').closest('.need-survey-card').after(requestSection);
  const renderRequests = () => {
    const requestStatusClass = (status) => status === 'Đã phê duyệt' ? 'done' : status === 'Đang xem xét' ? 'reviewing' : 'pending';
    $('trainingRequestBody').innerHTML = requests.length ? requests.map((item) => `<tr><td><b>${esc(item.code)}</b></td><td><b>${esc(item.course)}</b><br><small>${esc(item.goal || item.reason)}</small></td><td>${esc(item.field)}</td><td>${esc(item.priority)}</td><td>${esc(item.date ? formatDate(item.date) : 'Chưa xác định')}</td><td><span class="need-survey-status ${requestStatusClass(item.status)}">${esc(item.status)}</span></td></tr>`).join('') : '<tr><td colspan="6" class="need-survey-empty">Chưa có nhu cầu đào tạo nào được gửi.</td></tr>';
  };
  const reportRequests=(scope)=>scope==='approved'?requests.filter((item)=>item.status==='Đã phê duyệt'):scope==='high'?requests.filter((item)=>item.priority==='Cao'):requests;
  function renderTrainingRequestReport(){const form=$('trainingRequestReportForm'),data=reportRequests(form.elements.scope.value),participants=data.reduce((total,item)=>total+Number(item.participants||1),0),high=data.filter((item)=>item.priority==='Cao').length,approved=data.filter((item)=>item.status==='Đã phê duyệt').length;$('needReportSummary').innerHTML=`<article><i class="fa-regular fa-file-lines"></i><span>Tổng đăng ký<b>${data.length}</b></span></article><article><i class="fa-solid fa-users"></i><span>Số người dự kiến<b>${participants}</b></span></article><article><i class="fa-solid fa-arrow-up"></i><span>Ưu tiên cao<b>${high}</b></span></article><article><i class="fa-solid fa-circle-check"></i><span>Đã phê duyệt<b>${approved}</b></span></article>`;$('needReportPreviewNote').textContent=`Hiển thị ${Math.min(5,data.length)} trong ${data.length} đăng ký sẽ được xuất`;$('needReportPreviewBody').innerHTML=data.length?data.slice(0,5).map((item,index)=>`<tr><td>${index+1}</td><td><b>${esc(item.code)}</b></td><td>${esc(item.course)}</td><td>${esc(item.field)}</td><td>${Number(item.participants||1)}</td><td><span class="report-priority ${item.priority==='Cao'?'high':''}">${esc(item.priority)}</span></td><td>${esc(item.status)}</td></tr>`).join(''):'<tr><td colspan="7" class="need-report-empty">Không có dữ liệu phù hợp với phạm vi đã chọn.</td></tr>'}
  $('exportTrainingRequests').addEventListener('click',()=>{if(!requests.length){toast('Chưa có đăng ký nhu cầu đào tạo để xuất');return}const form=$('trainingRequestReportForm');form.reset();renderTrainingRequestReport();$('trainingRequestReportDialog').showModal()});
  $('trainingRequestReportForm').elements.scope.addEventListener('change',renderTrainingRequestReport);
  document.querySelectorAll('[data-close-need-report]').forEach((button)=>button.addEventListener('click',()=>$('trainingRequestReportDialog').close()));
  $('trainingRequestReportDialog').addEventListener('click',(event)=>{if(event.target===event.currentTarget)event.currentTarget.close()});
  $('trainingRequestReportForm').addEventListener('submit',(event)=>{event.preventDefault();if(!event.currentTarget.reportValidity())return;const formData=Object.fromEntries(new FormData(event.currentTarget)),data=reportRequests(formData.scope);if(!data.length){toast('Không có dữ liệu phù hợp để xuất');return}const safeCsv=(value)=>{let text=String(value??'');if(/^[=+\-@]/.test(text))text=`'${text}`;return `"${text.replace(/"/g,'""')}"`},headers=['STT','Mã yêu cầu','Khóa học / chương trình','Lĩnh vực','Hình thức','Đơn vị tổ chức','Số người dự kiến','Đối tượng / chức danh','Mức độ ưu tiên','Thời gian mong muốn','Trạng thái','Lý do đăng ký','Mục tiêu mong muốn'],rows=data.map((item,index)=>[index+1,item.code,item.course,item.field,item.format||'Chưa xác định',item.organizer||'Chưa xác định',item.participants||1,item.audience||'Chưa xác định',item.priority,item.date?formatDate(item.date):'Chưa xác định',item.status,item.reason||'',item.goal||'']),csv='\uFEFF'+[headers,...rows].map((row)=>row.map(safeCsv).join(';')).join('\r\n'),blob=new Blob([csv],{type:'text/csv;charset=utf-8'}),url=URL.createObjectURL(blob),link=document.createElement('a'),fileName=normalize(formData.reportName).replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'bao-cao-nhu-cau-dao-tao';link.href=url;link.download=`${fileName}-${new Date().toISOString().slice(0,10)}.csv`;document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),0);$('trainingRequestReportDialog').close();toast(`Đã xuất báo cáo tổng hợp ${data.length} đăng ký`)});

  function closeNeedSurveyMenus() {
    document.querySelectorAll('.need-survey-row-menu').forEach((menu) => { menu.hidden = true; });
    document.querySelectorAll('.need-survey-more').forEach((button) => button.setAttribute('aria-expanded','false'));
  }
  function openNeedSurveyMenu(button) {
    const menu = document.getElementById(button.getAttribute('aria-controls')),opening = menu.hidden;
    closeNeedSurveyMenus();
    if (!opening) return;
    menu.hidden = false; button.setAttribute('aria-expanded','true');
    const rect = button.getBoundingClientRect(),openUp = rect.bottom + menu.offsetHeight + 8 > window.innerHeight;
    menu.style.top = `${openUp ? rect.top - menu.offsetHeight - 6 : rect.bottom + 6}px`;
    menu.style.left = `${Math.max(12,rect.right - menu.offsetWidth)}px`;
  }
  async function editNeedSurvey(item) {
    const selected = (value) => item.status === value ? 'selected' : '';
    const accepted = await window.appDialog({title:'Chỉnh sửa khảo sát theo nhu cầu',html:`<label class="field">Tên khảo sát<input id="editNeedSurveyName" value="${esc(item.name)}"></label><label class="field">Đơn vị áp dụng<input id="editNeedSurveyUnit" value="${esc(item.unit)}"></label><label class="field">Thời gian<input id="editNeedSurveyPeriod" value="${esc(item.period)}"></label><label class="field">Năm<select id="editNeedSurveyYear"><option ${item.year === '2025' ? 'selected' : ''}>2025</option><option ${item.year === '2026' ? 'selected' : ''}>2026</option></select></label><label class="field">Trạng thái<select id="editNeedSurveyStatus"><option ${selected('Chưa thực hiện')}>Chưa thực hiện</option><option ${selected('Đã duyệt')}>Đã duyệt</option><option ${selected('Đã hoàn thành')}>Đã hoàn thành</option><option ${selected('Đã hết hạn')}>Đã hết hạn</option></select></label>`,confirmText:'Lưu thay đổi',cancelText:'Hủy'});
    if (!accepted) return;
    const name=$('editNeedSurveyName').value.trim(),unit=$('editNeedSurveyUnit').value.trim(),period=$('editNeedSurveyPeriod').value.trim();
    if (!name || !unit || !period) { toast('Vui lòng nhập đầy đủ tên, đơn vị và thời gian'); return; }
    Object.assign(item,{name,unit,period,year:$('editNeedSurveyYear').value,status:$('editNeedSurveyStatus').value}); window.LMSStore.write('need-surveys',surveys); render(); toast('Đã cập nhật khảo sát theo nhu cầu');
  }
  async function deleteNeedSurvey(item) {
    const accepted = window.appDialog ? await window.appDialog({title:'Xóa khảo sát theo nhu cầu',html:`<p class="app-dialog-danger">Xóa khảo sát <b>${esc(item.name)}</b>? Dữ liệu này sẽ không còn xuất hiện trong danh sách.</p>`,confirmText:'Xóa',cancelText:'Hủy'}) : window.confirm(`Xóa khảo sát ${item.name}?`);
    if (!accepted) return;
    surveys = surveys.filter((row) => row.id !== item.id); window.LMSStore.write('need-surveys',surveys); render(); toast('Đã xóa khảo sát theo nhu cầu');
  }
  async function approveNeedSurvey(item) {
    const accepted = await window.appDialog({title:'Duyệt khảo sát theo nhu cầu',html:`<div class="need-survey-approval-summary"><p><b>${esc(item.name)}</b></p><dl><dt>Đơn vị áp dụng</dt><dd>${esc(item.unit)}</dd><dt>Thời gian</dt><dd>${esc(item.period)}</dd><dt>Trạng thái hiện tại</dt><dd><span class="need-survey-status pending">${esc(item.status)}</span></dd></dl></div><label class="field">Ghi chú phê duyệt<textarea id="needSurveyApprovalNote" maxlength="300" placeholder="Nhập ghi chú hoặc yêu cầu bổ sung (nếu có)"></textarea></label><p class="app-dialog-note">Sau khi xác nhận, khảo sát sẽ chuyển sang trạng thái “Đã duyệt”.</p>`,confirmText:'Duyệt khảo sát',cancelText:'Hủy'});
    if (!accepted) return;
    item.status='Đã duyệt'; item.approvalNote=$('needSurveyApprovalNote')?.value.trim() || ''; item.approvedAt=new Date().toISOString(); item.approvedBy='Nguyễn Văn An'; window.LMSStore.write('need-surveys',surveys); render(); toast('Đã duyệt khảo sát theo nhu cầu');
  }
  function render() {
    const data = filtered(),pageSize = 5,pages = Math.max(1,Math.ceil(data.length / pageSize)); page = Math.min(page,pages); const rows = data.slice((page - 1) * pageSize,page * pageSize);
    body.innerHTML = rows.length ? rows.map((item,index) => `<tr><td>${(page - 1) * pageSize + index + 1}</td><td>${esc(item.name)}</td><td>${esc(item.unit)}</td><td>${esc(item.period)}</td><td><span class="need-survey-status ${statusClass(item.status)}">${esc(item.status)}</span></td><td><div class="need-survey-row-actions"><button type="button" class="need-survey-more" data-need-action="menu" data-id="${item.id}" aria-label="Thao tác với ${esc(item.name)}" aria-expanded="false" aria-controls="need-survey-menu-${item.id}"><i class="fa-solid fa-ellipsis"></i></button><div class="need-survey-row-menu" id="need-survey-menu-${item.id}" hidden><button type="button" data-need-action="view" data-id="${item.id}"><i class="fa-regular fa-eye"></i>Xem</button>${item.status === 'Chưa thực hiện' ? `<button type="button" data-need-action="perform" data-id="${item.id}"><i class="fa-regular fa-file-lines"></i>Thực hiện</button><button type="button" data-need-action="approve" data-id="${item.id}"><i class="fa-solid fa-circle-check"></i>Duyệt</button>` : ''}<button type="button" data-need-action="edit" data-id="${item.id}"><i class="fa-solid fa-pen"></i>Chỉnh sửa</button><button type="button" class="danger" data-need-action="delete" data-id="${item.id}"><i class="fa-regular fa-trash-can"></i>Xóa</button></div></div></td></tr>`).join('') : '<tr><td colspan="6" class="need-survey-empty">Không tìm thấy khảo sát phù hợp</td></tr>';
    const first = data.length ? (page - 1) * pageSize + 1 : 0,last = Math.min(page * pageSize,data.length); $('needSurveySummary').textContent = `Hiển thị ${first} - ${last} trong tổng số ${data.length} khảo sát`; $('needSurveyPagination').innerHTML = `<button class="need-survey-page-button" data-page="${page - 1}" ${page === 1 ? 'disabled' : ''}><i class="fa-solid fa-chevron-left"></i></button>${Array.from({length:pages},(_,index) => `<button class="need-survey-page-button ${index + 1 === page ? 'active' : ''}" data-page="${index + 1}">${index + 1}</button>`).join('')}<button class="need-survey-page-button" data-page="${page + 1}" ${page === pages ? 'disabled' : ''}><i class="fa-solid fa-chevron-right"></i></button>`;
  }
  function openSurvey(item,mode) {
    activeSurveyId = item.id; $('needSurveyDetailTitle').textContent = item.name; $('needSurveyDetailSub').textContent = `${item.unit} · ${item.period}`; const complete = $('completeNeedSurvey');
    if (mode === 'perform') { $('needSurveyDetailBody').innerHTML = '<div class="survey-question"><b>1. Bạn ưu tiên lĩnh vực đào tạo nào?</b><label><input type="radio" name="q1" checked> Công nghệ</label><label><input type="radio" name="q1"> Kỹ năng</label></div><div class="survey-question"><b>2. Hình thức mong muốn?</b><label><input type="radio" name="q2" checked> Trực tiếp</label><label><input type="radio" name="q2"> Trực tuyến</label></div>'; complete.hidden = false; }
    else { const viewContent = item.status === 'Đã duyệt' ? `<div class="survey-question"><b>Thông tin phê duyệt</b><p>Khảo sát đã được ${esc(item.approvedBy || 'Giảng viên / CBQL')} duyệt.${item.approvalNote ? ` Ghi chú: ${esc(item.approvalNote)}` : ''}</p></div>` : item.status === 'Đã hết hạn' ? '<div class="survey-question"><b>Thông tin khảo sát</b><p>Khảo sát đã hết hạn. Nội dung được giữ để tham khảo khi xây dựng kế hoạch đào tạo.</p></div>' : '<div class="survey-question"><b>Thông tin khảo sát</b><p>Khảo sát đang chờ thực hiện và phê duyệt.</p></div>'; $('needSurveyDetailBody').innerHTML = mode === 'result' ? '<div class="survey-question"><b>Kết quả tổng hợp</b><p>68% chọn đào tạo trực tiếp · 45% ưu tiên Công nghệ thông tin · 32 phản hồi.</p></div>' : viewContent; complete.hidden = true; }
    $('needSurveyDetailDialog').showModal();
  }

  ['needSurveySearch','needSurveyStatus','needSurveyYear'].forEach((id) => $(id).addEventListener(id === 'needSurveySearch' ? 'input' : 'change',() => { page = 1; render(); }));
  $('resetNeedSurvey').addEventListener('click',() => { $('needSurveySearch').value = $('needSurveyStatus').value = ''; $('needSurveyYear').value = '2025'; page = 1; render(); });
  $('needSurveyPagination').addEventListener('click',(event) => { const button = event.target.closest('[data-page]'); if (!button || button.disabled) return; page = Number(button.dataset.page); render(); });
  body.addEventListener('click',async(event) => { const button = event.target.closest('[data-need-action]'); if (!button) return; const action=button.dataset.needAction,item=surveys.find((row) => row.id === Number(button.dataset.id)); if (!item) return; if (action === 'menu') { openNeedSurveyMenu(button); return; } closeNeedSurveyMenus(); if (action === 'view') openSurvey(item,item.status === 'Đã hoàn thành' ? 'result' : 'view'); if (action === 'perform') openSurvey(item,'perform'); if (action === 'approve') await approveNeedSurvey(item); if (action === 'edit') await editNeedSurvey(item); if (action === 'delete') await deleteNeedSurvey(item); });
  document.addEventListener('click',(event) => { if (!event.target.closest('.need-survey-row-actions')) closeNeedSurveyMenus(); });
  document.addEventListener('keydown',(event) => { if (event.key !== 'Escape') return; const toggle=document.querySelector('.need-survey-more[aria-expanded="true"]'); closeNeedSurveyMenus(); toggle?.focus(); });
  document.addEventListener('scroll',closeNeedSurveyMenus,true); window.addEventListener('resize',closeNeedSurveyMenus);
  $('completeNeedSurvey').addEventListener('click',() => { const item = surveys.find((row) => row.id === activeSurveyId); if (item) { item.status = 'Đã hoàn thành'; window.LMSStore.write('need-surveys',surveys); window.LMSStore.save('survey-responses',{id:`need-${item.id}`,surveyId:item.id,answers:{priority:document.querySelector('[name="q1"]:checked')?.parentElement.textContent.trim(),format:document.querySelector('[name="q2"]:checked')?.parentElement.textContent.trim()},submittedAt:new Date().toISOString(),status:'Đã gửi'}); } $('needSurveyDetailDialog').close(); toast('Đã hoàn thành và lưu kết quả khảo sát'); render(); });
  document.querySelectorAll('[data-close-survey-detail]').forEach((button) => button.addEventListener('click',() => $('needSurveyDetailDialog').close()));
  const registrationBody = $('needRegistrationForm').querySelector('.need-registration-body');
  registrationBody.querySelector('[name="organizer"]').closest('label').insertAdjacentHTML('afterend','<label><span>Số người dự kiến <b>*</b></span><input name="participants" type="number" min="1" max="5000" value="1" required></label><label><span>Đối tượng / chức danh</span><input name="audience" placeholder="Ví dụ: Nhân viên mới, quản lý cấp trung"></label>');
  $('openNeedRegistration').addEventListener('click',() => { const form = $('needRegistrationForm'); form.reset(); form.elements.format.value = 'Trực tiếp'; form.querySelectorAll('output').forEach((output) => { output.value = '0'; }); $('needRegistrationDialog').showModal(); });
  document.querySelectorAll('[data-close-registration]').forEach((button) => button.addEventListener('click',() => $('needRegistrationDialog').close()));
  [$('needRegistrationDialog'),$('needSurveyDetailDialog')].forEach((dialog) => dialog.addEventListener('click',(event) => { if (event.target === dialog) dialog.close(); }));
  $('needRegistrationForm').querySelectorAll('textarea').forEach((textarea) => textarea.addEventListener('input',() => { const output = document.querySelector(`[data-count-for="${textarea.name}"]`); if (output) output.value = textarea.value.length; }));
  $('needRegistrationForm').addEventListener('submit',(event) => { event.preventDefault(); if (!event.currentTarget.reportValidity()) return; const data = Object.fromEntries(new FormData(event.currentTarget)),request={id:Date.now(),code:`NCDT-${new Date().getFullYear()}-${String(requests.length+1).padStart(3,'0')}`,course:data.course.trim(),field:data.field,format:data.format,organizer:data.organizer.trim(),participants:Number(data.participants),audience:data.audience.trim(),priority:data.priority,reason:data.reason.trim(),goal:data.goal.trim(),date:data.date,note:data.note.trim(),status:'Đã gửi',createdAt:new Date().toISOString()}; requests.unshift(request); window.LMSStore.write('training-requests',requests); $('needRegistrationDialog').close(); renderRequests(); toast(`Đã gửi nhu cầu “${data.course.trim()}”`); });
  document.querySelectorAll('[data-survey-tab]').forEach((button) => button.addEventListener('click',() => setSurveyTab(button.dataset.surveyTab)));
  periodicFilters.addEventListener('input',() => { periodicPage = 1; renderPeriodic(); });
  periodicFilters.addEventListener('reset',() => setTimeout(() => { periodicPage = 1; renderPeriodic(); }));
  $('periodicSurveyPageSize').addEventListener('change',(event) => { periodicPageSize = Number(event.target.value); periodicPage = 1; renderPeriodic(); });
  $('periodicSurveyPagination').addEventListener('click',(event) => { const button = event.target.closest('[data-periodic-page]'); if (!button || button.disabled) return; periodicPage = Number(button.dataset.periodicPage); renderPeriodic(); });
  $('periodicAdvancedFilter').addEventListener('click',() => toast('Bộ lọc hiện tại đã bao gồm trạng thái, năm và đơn vị'));
  $('openPeriodicSurvey').addEventListener('click',() => openPeriodicDialog());
  document.querySelectorAll('[data-close-periodic]').forEach((button) => button.addEventListener('click',() => $('periodicSurveyDialog').close()));
  $('periodicSurveyDialog').addEventListener('click',(event) => { if (event.target === $('periodicSurveyDialog')) $('periodicSurveyDialog').close(); });
  $('selectAllAudience').addEventListener('change',(event) => $('periodicSurveyForm').querySelectorAll('[name="audience"]').forEach((checkbox) => { checkbox.checked = event.target.checked; }));
  document.querySelectorAll('[data-question-tab]').forEach((button) => button.addEventListener('click',() => {
    document.querySelectorAll('[data-question-tab]').forEach((tab) => tab.classList.toggle('active',tab === button));
    if (button.dataset.questionTab === 'upload') toast('Bạn có thể tải tệp câu hỏi từ chức năng này');
  }));
  $('addPeriodicQuestion').addEventListener('click',() => editPeriodicQuestion(periodicQuestions.length,{text:'',type:'Trắc nghiệm 1 đáp án',tone:'blue'}));
  $('periodicQuestionList').addEventListener('click',async(event) => {
    const button = event.target.closest('[data-question-action]'); if (!button) return;
    const index = Number(button.dataset.index),action = button.dataset.questionAction;
    if (action === 'edit') await editPeriodicQuestion(index);
    if (action === 'copy') { periodicQuestions.splice(index + 1,0,{...periodicQuestions[index],text:`${periodicQuestions[index].text} (Bản sao)`}); renderPeriodicQuestions(); }
    if (action === 'delete') { periodicQuestions.splice(index,1); renderPeriodicQuestions(); }
  });
  $('previewPeriodicSurvey').addEventListener('click',() => window.appDialog({title:'Xem trước khảo sát',html:`<div class="periodic-preview"><p><b>${esc($('periodicSurveyForm').elements.title.value || 'Khảo sát chưa đặt tên')}</b></p>${periodicQuestions.map((question,index) => `<p>${index + 1}. ${esc(question.text)} <small>· ${esc(question.type)}</small></p>`).join('')}</div>`,confirmText:'Đóng',cancelText:''}));
  $('periodicSurveyForm').addEventListener('submit',(event) => {
    event.preventDefault(); const form = event.currentTarget,data = Object.fromEntries(new FormData(form)),audiences=[...form.querySelectorAll('[name="audience"]:checked')].map((checkbox) => checkbox.value); form.elements.end.setCustomValidity(data.end < data.start ? 'Ngày kết thúc phải sau ngày bắt đầu.' : ''); if (!form.reportValidity()) return;
    if (!audiences.length) { toast('Vui lòng chọn ít nhất một đối tượng thực hiện'); return; }
    if (!periodicQuestions.length) { toast('Vui lòng thêm ít nhất một câu hỏi'); return; }
    const duplicate = periodicSurveys.some((item) => normalize(item.code) === normalize(data.code) && String(item.id) !== form.dataset.editId); form.elements.code.setCustomValidity(duplicate ? 'Mã khảo sát đã tồn tại.' : ''); if (!form.reportValidity()) return;
    const existing = periodicSurveys.find((item) => String(item.id) === form.dataset.editId),record={code:data.code.trim(),name:data.title.trim(),description:data.description.trim() || 'Khảo sát định kỳ theo kế hoạch đào tạo',unit:data.unit,unitCount:data.unit === 'Toàn bộ đơn vị' ? 18 : 1,start:data.start,end:data.end,audiences,questions:periodicQuestions.map((question) => ({...question})),note:data.note?.trim() || '',settings:{notify:Boolean(data.notify),allowEdit:Boolean(data.allowEdit),anonymous:Boolean(data.anonymous),showResult:Boolean(data.showResult),requiredAll:Boolean(data.requiredAll)},completed:existing?.completed || 0,total:existing?.total || 120,status:existing?.status || 'Đang thực hiện'};
    if (existing) Object.assign(existing,record); else periodicSurveys.unshift({id:Date.now(),...record}); window.LMSStore.write('periodic-surveys',periodicSurveys); $('periodicSurveyDialog').close(); periodicPage = 1; renderPeriodic(); toast(existing ? 'Đã cập nhật khảo sát định kỳ' : 'Đã tạo khảo sát định kỳ');
  });
  $('periodicSurveyForm').elements.code.addEventListener('input',(event) => event.target.setCustomValidity(''));
  $('periodicSurveyForm').elements.end.addEventListener('input',(event) => event.target.setCustomValidity(''));
  periodicBody.addEventListener('click',async(event) => {
    const button = event.target.closest('[data-periodic-action]'); if (!button) return; const action = button.dataset.periodicAction,item = periodicSurveys.find((row) => row.id === Number(button.dataset.id)); if (!item) return;
    if (action === 'menu') { openPeriodicMenu(button); return; } closePeriodicMenus();
    if (action === 'view') openPeriodicDetail(item);
    if (action === 'edit') openPeriodicDialog(item);
    if (action === 'delete') { const accepted = window.appDialog ? await window.appDialog({title:'Xóa khảo sát định kỳ',html:`<p class="app-dialog-danger">Xóa <b>${esc(item.code)} · ${esc(item.name)}</b>? Dữ liệu tiến độ của khảo sát này sẽ bị loại khỏi danh sách.</p>`,confirmText:'Xóa',cancelText:'Hủy'}) : window.confirm(`Xóa khảo sát ${item.name}?`); if (accepted) { periodicSurveys=periodicSurveys.filter((row) => row.id !== item.id); window.LMSStore.write('periodic-surveys',periodicSurveys); renderPeriodic(); toast('Đã xóa khảo sát định kỳ'); } }
  });
  document.addEventListener('click',(event) => { if (!event.target.closest('.periodic-actions')) closePeriodicMenus(); });
  document.addEventListener('keydown',(event) => { if (event.key !== 'Escape') return; const toggle=document.querySelector('.periodic-more[aria-expanded="true"]'); closePeriodicMenus(); toggle?.focus(); });
  document.addEventListener('scroll',closePeriodicMenus,true); window.addEventListener('resize',closePeriodicMenus);
  renderRequests(); render(); renderPeriodic(); setSurveyTab('periodic');
})();
