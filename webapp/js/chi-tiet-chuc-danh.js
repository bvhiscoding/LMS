(() => {
  const panel = document.querySelector('#detailPanel');
  const tabs = document.querySelector('#detailTabs');
  const learningDialog = document.querySelector('#learningDialog');
  const skillDialog = document.querySelector('#skillDialog');
  const learningList = document.querySelector('#learningList');
  const toast = document.querySelector('#competencyToast');

  const skills = [
    ['Năng lực lãnh đạo', 'Level 4', 'Bắt buộc'], ['Năng lực quản lý', 'Level 4', 'Bắt buộc'],
    ['Năng lực giao tiếp', 'Level 3', 'Bắt buộc'], ['Năng lực giải quyết vấn đề', 'Level 3', 'Khuyến nghị'],
    ['Năng lực chuyên môn', 'Level 4', 'Bắt buộc'], ['Năng lực tư duy chiến lược', 'Level 3', 'Khuyến nghị']
  ];
  const learningCatalog = [
    { name:'Kỹ năng quản lý thời gian', topic:'Kỹ năng quản lý', type:'Khóa học', image:'../../public/course-covers/time-management.jpg' },
    { name:'Quản trị đội ngũ hiệu quả', topic:'Quản trị nhân sự', type:'Khóa học', image:'../../public/course-covers/leadership.jpg' },
    { name:'Phân tích và ra quyết định', topic:'Kỹ năng quản lý', type:'Khóa học', image:'../../public/course-covers/analytics.jpg' },
    { name:'Video: Chiến lược kinh doanh', topic:'Chiến lược', type:'Video', icon:'fa-circle-play' },
    { name:'Tài liệu: Quy trình bán hàng', topic:'Kỹ năng bán hàng', type:'Tài liệu', icon:'fa-file-pdf' },
    { name:'Kỹ năng đàm phán', topic:'Kỹ năng mềm', type:'Khóa học', image:'../../public/course-covers/digital.jpg' },
    { name:'Excel nâng cao cho quản lý', topic:'Tin học văn phòng', type:'Khóa học', image:'../../public/course-covers/excel.jpg' },
    { name:'Kỹ năng thuyết trình chuyên nghiệp', topic:'Kỹ năng mềm', type:'Khóa học', image:'../../public/course-covers/leadership.jpg' },
    { name:'Video: Xây dựng đội ngũ', topic:'Quản trị nhân sự', type:'Video', icon:'fa-circle-play' },
    { name:'Tài liệu: Báo cáo bán hàng', topic:'Kỹ năng bán hàng', type:'Tài liệu', icon:'fa-file-pdf' }
  ];
  const learning = learningCatalog.map(item => item.name);
  const skillCatalog = [
    { name:'Năng lực lãnh đạo', group:'Lãnh đạo & Quản lý', type:'Bắt buộc', level:'Level 4', icon:'fa-chess-king', tone:'leadership' },
    { name:'Năng lực quản lý', group:'Lãnh đạo & Quản lý', type:'Bắt buộc', level:'Level 4', icon:'fa-people-roof', tone:'leadership' },
    { name:'Năng lực giao tiếp', group:'Năng lực cốt lõi', type:'Bắt buộc', level:'Level 3', icon:'fa-comments', tone:'core' },
    { name:'Năng lực giải quyết vấn đề', group:'Năng lực cốt lõi', type:'Khuyến nghị', level:'Level 3', icon:'fa-puzzle-piece', tone:'core' },
    { name:'Tư duy chiến lược', group:'Lãnh đạo & Quản lý', type:'Khuyến nghị', level:'Level 3', icon:'fa-chess', tone:'leadership' },
    { name:'Phân tích và ra quyết định', group:'Năng lực cốt lõi', type:'Bắt buộc', level:'Level 3', icon:'fa-chart-line', tone:'core' },
    { name:'Quản trị đội ngũ hiệu quả', group:'Lãnh đạo & Quản lý', type:'Bắt buộc', level:'Level 4', icon:'fa-users-gear', tone:'leadership' },
    { name:'Lập kế hoạch kinh doanh', group:'Năng lực chuyên môn', type:'Bắt buộc', level:'Level 4', icon:'fa-list-check', tone:'professional' },
    { name:'Kỹ năng đàm phán', group:'Năng lực chuyên môn', type:'Khuyến nghị', level:'Level 3', icon:'fa-handshake', tone:'professional' },
    { name:'Quản lý hiệu suất', group:'Lãnh đạo & Quản lý', type:'Bắt buộc', level:'Level 4', icon:'fa-gauge-high', tone:'leadership' },
    { name:'Phân tích tài chính', group:'Năng lực chuyên môn', type:'Khuyến nghị', level:'Level 3', icon:'fa-coins', tone:'professional' },
    { name:'Ứng dụng chuyển đổi số', group:'Năng lực chuyên môn', type:'Khuyến nghị', level:'Level 3', icon:'fa-laptop-code', tone:'professional' }
  ];
  const selectedSkills = new Set([0, 1, 3]);
  const pickerState = { page:1, pageSize:7, query:'', group:'', type:'' };
  const selectedLearning = new Set([0, 1, 3]);
  const learningState = { page:1, pageSize:7, query:'', topic:'', type:'' };
  let current = 'info';

  const infoView = () => `<div class="detail-grid"><article class="detail-card"><h2>Thông tin chức danh</h2><div class="detail-info"><p><span>Tên chức danh</span><b>Trưởng phòng Kinh doanh</b></p><p><span>Mã chức danh</span><b>TP.KD.01</b></p><p><span>Đơn vị áp dụng</span><b>Phòng Kinh doanh</b></p><p><span>Mô tả</span><b>Chịu trách nhiệm quản lý, điều hành các hoạt động kinh doanh của phòng.</b></p><p><span>Trạng thái</span><b><span class="tag green">Đang hoạt động</span></b></p><p><span>Ngày cập nhật</span><b>20/05/2024 14:20</b></p></div></article><article class="detail-card"><h2>Tóm tắt</h2><div class="summary-cards"><div>Nội dung học<b>24</b></div><div>Năng lực yêu cầu<b>${skills.length}</b></div><div>Năng lực bắt buộc<b>${skills.filter(item => item[2] === 'Bắt buộc').length}</b></div><div>Đã gắn nội dung<b>100%</b></div></div><h2 style="margin-top:18px">Ghi chú</h2><p style="color:var(--muted);font-size:9px">Chưa có ghi chú.</p></article></div>`;
  const skillsView = () => `<article class="detail-card"><div class="detail-toolbar"><h2>Khung năng lực của chức danh</h2><button class="btn primary" data-add-skill><i class="fa-solid fa-link"></i> Gán năng lực</button></div><div class="competency-table-wrap"><table class="competency-table"><thead><tr><th>Năng lực</th><th>Cấp độ yêu cầu</th><th>Loại yêu cầu</th><th>Trạng thái</th><th>Thao tác</th></tr></thead><tbody>${skills.map((item,index) => `<tr><td><span class="skill-name"><i class="fa-solid fa-people-group"></i>${item[0]}</span></td><td><span class="tag">${item[1]}</span></td><td>${item[2]}</td><td><span class="tag green">Đang hoạt động</span></td><td><span class="table-actions"><button aria-label="Chỉnh sửa"><i class="fa-regular fa-pen-to-square"></i></button><button class="danger" data-remove-skill="${index}" aria-label="Gỡ năng lực"><i class="fa-regular fa-trash-can"></i></button></span></td></tr>`).join('')}</tbody></table></div></article>`;
  const learningView = () => `<article class="detail-card"><div class="detail-toolbar"><h2>Nội dung học tập đã gắn</h2><button class="btn primary" data-add-learning><i class="fa-solid fa-plus"></i> Gắn nội dung học tập</button></div><div class="competency-table-wrap"><table class="competency-table"><thead><tr><th>Nội dung học tập</th><th>Chủ đề</th><th>Loại</th><th>Bắt buộc</th><th>Thao tác</th></tr></thead><tbody>${learning.slice(0,5).map((item,index) => `<tr><td><span class="skill-name"><i class="fa-solid fa-book-open"></i>${item}</span></td><td>Kỹ năng quản lý</td><td><span class="tag">${index === 3 ? 'Video' : 'Khóa học'}</span></td><td>${index < 3 ? 'Có' : 'Không'}</td><td><span class="table-actions"><button class="danger"><i class="fa-regular fa-trash-can"></i></button></span></td></tr>`).join('')}</tbody></table></div></article>`;

  function render() {
    panel.innerHTML = current === 'info' ? infoView() : current === 'skills' ? skillsView() : learningView();
    tabs.querySelectorAll('button').forEach(button => button.classList.toggle('active', button.dataset.tab === current));
  }
  function renderLearning() {
    const query = learningState.query.toLocaleLowerCase('vi');
    const filtered = learningCatalog.map((item,index) => ({item,index})).filter(({item}) => (!query || `${item.name} ${item.topic}`.toLocaleLowerCase('vi').includes(query)) && (!learningState.topic || item.topic === learningState.topic) && (!learningState.type || item.type === learningState.type));
    const pages = Math.max(1, Math.ceil(filtered.length / learningState.pageSize));
    learningState.page = Math.min(learningState.page, pages);
    const visible = filtered.slice((learningState.page - 1) * learningState.pageSize, learningState.page * learningState.pageSize);
    learningList.innerHTML = visible.map(({item,index}) => { const tone=item.type === 'Video' ? 'video' : item.type === 'Tài liệu' ? 'document' : ''; return `<label class="learning-picker-row${selectedLearning.has(index) ? ' selected' : ''}"><input type="checkbox" data-learning-index="${index}" ${selectedLearning.has(index) ? 'checked' : ''}><span class="learning-thumb ${tone}">${item.image ? `<img src="${item.image}" alt="">` : `<i class="fa-regular ${item.icon}"></i>`}</span><span class="learning-picker-copy"><strong>${item.name}</strong><small>Chủ đề: ${item.topic}</small></span><span class="learning-type ${tone}">${item.type}</span></label>`; }).join('');
    learningList.hidden = visible.length === 0;
    document.querySelector('#learningPickerEmpty').hidden = visible.length > 0;
    document.querySelector('#learningPagination').innerHTML = `<button type="button" data-learning-page="${learningState.page - 1}" ${learningState.page === 1 ? 'disabled' : ''}><i class="fa-solid fa-chevron-left"></i></button>${Array.from({length:pages},(_,i) => `<button type="button" data-learning-page="${i + 1}" class="${learningState.page === i + 1 ? 'active' : ''}">${i + 1}</button>`).join('')}<button type="button" data-learning-page="${learningState.page + 1}" ${learningState.page === pages ? 'disabled' : ''}><i class="fa-solid fa-chevron-right"></i></button>`;
    document.querySelector('#learningSelectedCount').textContent = selectedLearning.size;
    document.querySelector('#saveLearning').textContent = `Lưu (${selectedLearning.size})`;
  }
  function filteredCatalog() {
    const query = pickerState.query.toLocaleLowerCase('vi');
    return skillCatalog.map((item,index) => ({ item,index })).filter(({item}) => (!query || `${item.name} ${item.group}`.toLocaleLowerCase('vi').includes(query)) && (!pickerState.group || item.group === pickerState.group) && (!pickerState.type || item.type === pickerState.type));
  }
  function updateSelectionSummary() {
    document.querySelector('#skillSelectedCount').textContent = selectedSkills.size;
    document.querySelector('#saveSkills').textContent = `Lưu (${selectedSkills.size})`;
  }
  function renderSkillPicker() {
    const filtered = filteredCatalog();
    const pages = Math.max(1, Math.ceil(filtered.length / pickerState.pageSize));
    pickerState.page = Math.min(pickerState.page, pages);
    const visible = filtered.slice((pickerState.page - 1) * pickerState.pageSize, pickerState.page * pickerState.pageSize);
    document.querySelector('#skillPickerList').innerHTML = visible.map(({item,index}) => `<label class="skill-picker-row${selectedSkills.has(index) ? ' selected' : ''}"><input type="checkbox" data-skill-index="${index}" ${selectedSkills.has(index) ? 'checked' : ''}><span class="skill-picker-icon ${item.tone}"><i class="fa-solid ${item.icon}"></i></span><span class="skill-picker-copy"><strong>${item.name}</strong><small>Nhóm: ${item.group} · ${item.level}</small></span><span class="skill-kind${item.type === 'Khuyến nghị' ? ' recommended' : ''}">${item.type}</span></label>`).join('');
    document.querySelector('#skillPickerList').hidden = visible.length === 0;
    document.querySelector('#skillPickerEmpty').hidden = visible.length > 0;
    document.querySelector('#skillPagination').innerHTML = `<button type="button" data-skill-page="${pickerState.page - 1}" ${pickerState.page === 1 ? 'disabled' : ''}><i class="fa-solid fa-chevron-left"></i></button>${Array.from({length:pages},(_,i) => `<button type="button" data-skill-page="${i + 1}" class="${pickerState.page === i + 1 ? 'active' : ''}">${i + 1}</button>`).join('')}<button type="button" data-skill-page="${pickerState.page + 1}" ${pickerState.page === pages ? 'disabled' : ''}><i class="fa-solid fa-chevron-right"></i></button>`;
    updateSelectionSummary();
  }
  function show(message) { toast.textContent = message; toast.hidden = false; setTimeout(() => { toast.hidden = true; }, 1800); }

  tabs.addEventListener('click', event => { const button = event.target.closest('[data-tab]'); if (button) { current = button.dataset.tab; render(); } });
  panel.addEventListener('click', event => {
    if (event.target.closest('[data-add-learning]')) { learningState.page=1;learningState.query='';learningState.topic='';learningState.type='';document.querySelector('#learningSearch').value='';document.querySelector('#learningTopicFilter').value='';document.querySelector('#learningTypeFilter').value='';renderLearning();learningDialog.showModal(); }
    else if (event.target.closest('[data-add-skill]')) { pickerState.page = 1; pickerState.query = ''; pickerState.group = ''; pickerState.type = ''; document.querySelector('#skillSearch').value = ''; document.querySelector('#skillGroupFilter').value = ''; document.querySelector('#skillTypeFilter').value = ''; renderSkillPicker(); skillDialog.showModal(); }
    else { const remove = event.target.closest('[data-remove-skill]'); if (remove) { skills.splice(Number(remove.dataset.removeSkill),1); render(); show('Đã gỡ năng lực khỏi chức danh'); } }
  });
  document.querySelector('#skillSearch').addEventListener('input', event => { pickerState.query = event.target.value.trim(); pickerState.page = 1; renderSkillPicker(); });
  document.querySelector('#skillGroupFilter').addEventListener('change', event => { pickerState.group = event.target.value; pickerState.page = 1; renderSkillPicker(); });
  document.querySelector('#skillTypeFilter').addEventListener('change', event => { pickerState.type = event.target.value; pickerState.page = 1; renderSkillPicker(); });
  document.querySelector('#skillPickerList').addEventListener('change', event => { if (!event.target.matches('[data-skill-index]')) return; const index = Number(event.target.dataset.skillIndex); event.target.checked ? selectedSkills.add(index) : selectedSkills.delete(index); renderSkillPicker(); });
  document.querySelector('#skillPagination').addEventListener('click', event => { const button = event.target.closest('[data-skill-page]'); if (!button || button.disabled) return; pickerState.page = Number(button.dataset.skillPage); renderSkillPicker(); });
  document.querySelector('#clearSkillSelection').addEventListener('click', () => { selectedSkills.clear(); renderSkillPicker(); });
  document.querySelectorAll('[data-close-skill]').forEach(button => button.addEventListener('click', () => skillDialog.close()));
  document.querySelector('#saveSkills').addEventListener('click', () => { selectedSkills.forEach(index => { const item = skillCatalog[index]; if (!skills.some(skill => skill[0] === item.name)) skills.push([item.name,item.level,item.type]); }); skillDialog.close(); if (current === 'skills') render(); show(`Đã lưu ${selectedSkills.size} năng lực cho chức danh`); });
  document.querySelector('#learningSearch').addEventListener('input', event => { learningState.query=event.target.value.trim();learningState.page=1;renderLearning(); });
  document.querySelector('#learningTopicFilter').addEventListener('change', event => { learningState.topic=event.target.value;learningState.page=1;renderLearning(); });
  document.querySelector('#learningTypeFilter').addEventListener('change', event => { learningState.type=event.target.value;learningState.page=1;renderLearning(); });
  learningList.addEventListener('change', event => { if(!event.target.matches('[data-learning-index]'))return;const index=Number(event.target.dataset.learningIndex);event.target.checked?selectedLearning.add(index):selectedLearning.delete(index);renderLearning(); });
  document.querySelector('#learningPagination').addEventListener('click', event => { const button=event.target.closest('[data-learning-page]');if(!button||button.disabled)return;learningState.page=Number(button.dataset.learningPage);renderLearning(); });
  document.querySelector('#clearLearningSelection').addEventListener('click', () => { selectedLearning.clear();renderLearning(); });
  learningDialog.querySelectorAll('[data-close]').forEach(button => button.addEventListener('click', () => learningDialog.close()));
  document.querySelector('#saveLearning').addEventListener('click', () => { learningDialog.close();show(`Đã lưu ${selectedLearning.size} nội dung học tập đã chọn`); });
  document.querySelector('#editPosition').addEventListener('click', () => show('Đã chuyển sang chế độ chỉnh sửa'));
  document.querySelector('#deletePosition').addEventListener('click', () => show('Đây là thao tác xóa demo, dữ liệu không bị lưu'));
  skillDialog.addEventListener('click', event => { if (event.target === skillDialog) skillDialog.close(); });
  learningDialog.addEventListener('click', event => { if (event.target === learningDialog) learningDialog.close(); });
  render();
})();
