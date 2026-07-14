(() => {
  const units = ['Khoa An toàn','Khoa Quản trị kinh doanh','Khoa Công nghệ','Khoa Cơ khí','Phòng Đào tạo'];
  const departments = ['An toàn lao động','Quản trị KD','Kỹ năng lãnh đạo','Công nghệ thông tin','Khoa học cơ bản','Cơ khí chế tạo','Điện - Điện tử','Tiếng Anh'];
  const seed = [
    ['Trần Minh','An toàn lao động','Nội bộ','tranminh@univ.edu.vn','0912 345 678',units[0],8,320,4.8],
    ['Lê Thị Hoa','Quản trị KD','Nội bộ','lethihoa@univ.edu.vn','0903 456 789',units[1],6,245,4.6],
    ['Phạm Quốc','Kỹ năng lãnh đạo','Thỉnh giảng','phamquoc@univ.edu.vn','0987 654 321',units[1],4,120,4.9],
    ['Nguyễn Văn An','Công nghệ thông tin','Nội bộ','nguyenvanan@univ.edu.vn','0912 222 333',units[2],7,280,4.7],
    ['Đỗ Thị Phương','Khoa học cơ bản','Nội bộ','dothiphuong@univ.edu.vn','0912 987 654',units[4],5,210,4.5],
    ['Hoàng Văn Em','Cơ khí chế tạo','Nội bộ','hoangvanem@univ.edu.vn','0978 123 456',units[3],6,198,4.6],
    ['Lê Văn Cường','Điện - Điện tử','Nội bộ','levancuong@univ.edu.vn','0934 567 890',units[2],7,256,4.8],
    ['Phạm Thị Dung','Tiếng Anh','Thỉnh giảng','phamthidung@univ.edu.vn','0987 654 321',units[4],5,185,4.4]
  ];
  const extraNames = ['Bùi Minh Khang','Vũ Thu Hà','Ngô Quốc Bảo','Đặng Thanh Tâm','Hồ Gia Huy','Dương Ngọc Mai','Trương Đức Anh','Mai Thị Lan'];
  let instructors = seed.map((row,index) => ({id:index + 1,name:row[0],department:row[1],type:row[2],email:row[3],phone:row[4],unit:row[5],classes:row[6],students:row[7],rating:row[8],status:'Hoạt động'}));
  for (let index = 8; index < 48; index += 1) instructors.push({id:index + 1,name:`${extraNames[index % extraNames.length]} ${index + 1}`,department:departments[index % departments.length],type:index < 34 ? 'Nội bộ' : 'Thỉnh giảng',email:`giangvien${index + 1}@univ.edu.vn`,phone:`09${String(10000000 + index * 137).slice(-8)}`,unit:units[index % units.length],classes:3 + index % 7,students:90 + index * 5,rating:Number((4.2 + index % 8 / 10).toFixed(1)),status:index % 11 ? 'Hoạt động' : 'Tạm ngưng'});

  const $ = (id) => document.getElementById(id), grid = $('instructorGrid');
  if (!grid) return;
  let page = 1, pageSize = 8, type = '', view = 'grid';
  const colors = ['#0753ad','#11a85f','#7c2ce0','#d68a13','#087f8c','#bf3f67','#4c63c6','#8a5a3b'];
  const esc = (value) => String(value).replace(/[&<>'"]/g,(char) => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
  const normalize = (value) => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').replace(/Đ/g,'D').toLowerCase();
  const initials = (name) => name.trim().split(/\s+/).slice(-2).map((part) => part[0]).join('').toUpperCase();
  const filtered = () => { const query = normalize($('instructorSearch').value),unit = $('instructorUnit').value,department = $('instructorDepartment').value,status = $('instructorStatus').value,rating = Number($('instructorRating').value); return instructors.filter((item) => (!query || normalize(`${item.name} ${item.email} ${item.phone}`).includes(query)) && (!unit || item.unit === unit) && (!department || item.department === department) && (!status || item.status === status) && (!type || item.type === type) && item.rating >= rating); };
  const toast = (message) => { const node = $('instructorToast'); node.textContent = message; node.hidden = false; clearTimeout(toast.timer); toast.timer = setTimeout(() => { node.hidden = true; },2200); };
  const closeMenus = (except) => document.querySelectorAll('[data-instructor-menu]').forEach((menu) => { if (String(menu.dataset.instructorMenu) !== String(except)) menu.hidden = true; });

  function render() {
    const data = filtered(),pages = Math.max(1,Math.ceil(data.length / pageSize)); page = Math.min(page,pages);
    const rows = data.slice((page - 1) * pageSize,page * pageSize);
    grid.className = `instructor-grid${view === 'list' ? ' list' : ''}`;
    grid.innerHTML = rows.length ? rows.map((item) => `<article class="instructor-card">
      <button class="instructor-card-more" data-action="more" data-id="${item.id}" aria-label="Thêm thao tác"><i class="fa-solid fa-ellipsis"></i></button>
      <div class="instructor-card-menu" data-instructor-menu="${item.id}" hidden><button data-action="toggle-status" data-id="${item.id}"><i class="fa-solid fa-pause"></i> ${item.status === 'Hoạt động' ? 'Tạm ngưng' : 'Kích hoạt'}</button><button data-action="copy" data-id="${item.id}"><i class="fa-solid fa-copy"></i> Sao chép email</button></div>
      <div class="instructor-card-head"><span class="instructor-avatar" style="background:${colors[(item.id - 1) % colors.length]}">${esc(initials(item.name))}</span><div class="instructor-card-title"><h2>${esc(item.name)}</h2><p>${esc(item.department)} &nbsp;•&nbsp; ${esc(item.type)}</p><small>${esc(item.email)} &nbsp;•&nbsp; ${esc(item.phone)}</small></div></div>
      <div class="instructor-stats"><div><span>Lớp</span><b>${item.classes}</b></div><div><span>Học viên</span><b>${item.students}</b></div><div><span>Đánh giá</span><b class="rating"><i class="fa-solid fa-star"></i>${item.rating.toFixed(1)}</b></div></div>
      <div class="instructor-actions"><button class="btn ghost sm schedule" data-action="schedule" data-id="${item.id}">Xem lịch giảng</button><button class="icon-action" data-action="schedule" data-id="${item.id}" aria-label="Lịch giảng"><i class="fa-regular fa-calendar"></i></button><button class="icon-action" data-action="students" data-id="${item.id}" aria-label="Học viên"><i class="fa-solid fa-user-group"></i></button><button class="icon-action" data-action="edit" data-id="${item.id}" aria-label="Chỉnh sửa"><i class="fa-solid fa-pen"></i></button><button class="icon-action delete" data-action="delete" data-id="${item.id}" aria-label="Xóa"><i class="fa-regular fa-trash-can"></i></button></div>
    </article>`).join('') : '<div class="instructor-empty"><div><i class="fa-solid fa-user-slash"></i>Không tìm thấy giảng viên phù hợp</div></div>';
    const first = data.length ? (page - 1) * pageSize + 1 : 0,last = Math.min(page * pageSize,data.length);
    $('instructorSummary').textContent = `Hiển thị ${first} - ${last} trong tổng số ${data.length} giảng viên`;
    $('instructorPagination').innerHTML = `<button class="instructor-page-button" data-page="${page - 1}" ${page === 1 ? 'disabled' : ''}><i class="fa-solid fa-chevron-left"></i></button>${Array.from({length:pages},(_,index) => `<button class="instructor-page-button ${index + 1 === page ? 'active' : ''}" data-page="${index + 1}">${index + 1}</button>`).join('')}<button class="instructor-page-button" data-page="${page + 1}" ${page === pages ? 'disabled' : ''}><i class="fa-solid fa-chevron-right"></i></button>`;
  }
  function fillSelects() {
    $('instructorUnit').innerHTML += units.map((item) => `<option>${item}</option>`).join('');
    $('instructorDepartment').innerHTML += departments.map((item) => `<option>${item}</option>`).join('');
    const form = $('instructorForm'); form.elements.unit.innerHTML = '<option value="">Chọn khoa / phòng</option>' + units.map((item) => `<option>${item}</option>`).join(''); form.elements.department.innerHTML = '<option value="">Chọn bộ môn</option>' + departments.map((item) => `<option>${item}</option>`).join('');
  }
  function openForm(item) {
    const form = $('instructorForm'); form.reset(); $('instructorDialogTitle').textContent = item ? 'Chỉnh sửa giảng viên' : 'Thêm giảng viên';
    ['id','name','type','email','phone','unit','department','status','rating'].forEach((key) => { form.elements[key].value = item?.[key] ?? (key === 'type' ? 'Nội bộ' : key === 'status' ? 'Hoạt động' : key === 'rating' ? '4.5' : ''); });
    $('instructorDialog').showModal();
  }
  function openInfo(item,mode) {
    $('instructorInfoTitle').textContent = mode === 'schedule' ? `Lịch giảng · ${item.name}` : `Học viên của ${item.name}`;
    $('instructorInfoSub').textContent = `${item.department} · ${item.unit}`;
    $('instructorInfoBody').innerHTML = mode === 'schedule' ? `<ul><li>20/05/2024 · An toàn lao động · Phòng 301</li><li>22/05/2024 · Kỹ năng làm việc nhóm · Phòng 204</li><li>25/05/2024 · Đào tạo trực tuyến · Microsoft Teams</li></ul>` : `<p>Đang phụ trách <b>${item.students}</b> học viên trong <b>${item.classes}</b> lớp. Đây là dữ liệu demo.</p>`;
    $('instructorInfoDialog').showModal();
  }

  fillSelects();
  ['instructorSearch','instructorUnit','instructorDepartment','instructorStatus','instructorRating'].forEach((id) => $(id).addEventListener(id === 'instructorSearch' ? 'input' : 'change',() => { page = 1; render(); }));
  $('toggleInstructorFilters').addEventListener('click',() => { const hidden = !$('instructorAdvanced').hidden; $('instructorAdvanced').hidden = hidden; $('toggleInstructorFilters').setAttribute('aria-expanded',String(!hidden)); });
  $('resetInstructorFilters').addEventListener('click',() => { ['instructorSearch','instructorUnit','instructorDepartment','instructorStatus'].forEach((id) => { $(id).value = ''; }); $('instructorRating').value = '0'; type = ''; page = 1; document.querySelectorAll('[data-type]').forEach((button) => button.classList.toggle('active',!button.dataset.type)); render(); });
  $('instructorTypeTabs').addEventListener('click',(event) => { const button = event.target.closest('[data-type]'); if (!button) return; type = button.dataset.type; page = 1; document.querySelectorAll('[data-type]').forEach((item) => item.classList.toggle('active',item === button)); render(); });
  document.querySelector('.instructor-view-switch').addEventListener('click',(event) => { const button = event.target.closest('[data-view]'); if (!button) return; view = button.dataset.view; document.querySelectorAll('[data-view]').forEach((item) => item.classList.toggle('active',item === button)); render(); });
  $('instructorPagination').addEventListener('click',(event) => { const button = event.target.closest('[data-page]'); if (!button || button.disabled) return; page = Number(button.dataset.page); render(); });
  $('instructorPageSize').addEventListener('change',(event) => { pageSize = Number(event.target.value); page = 1; render(); });
  $('addInstructor').addEventListener('click',() => openForm());
  grid.addEventListener('click',async (event) => { const button = event.target.closest('[data-action]'); if (!button) return; const item = instructors.find((row) => row.id === Number(button.dataset.id)); if (!item) return; const action = button.dataset.action;
    if (action === 'more') { const menu = document.querySelector(`[data-instructor-menu="${item.id}"]`),opening = menu.hidden; closeMenus(opening ? item.id : null); menu.hidden = !opening; return; }
    closeMenus();
    if (action === 'schedule' || action === 'students') openInfo(item,action);
    if (action === 'edit') openForm(item);
    if (action === 'delete' && window.confirm(`Xóa giảng viên ${item.name}?`)) { instructors = instructors.filter((row) => row.id !== item.id); toast('Đã xóa giảng viên'); render(); }
    if (action === 'toggle-status') { item.status = item.status === 'Hoạt động' ? 'Tạm ngưng' : 'Hoạt động'; toast(`Đã chuyển sang ${item.status.toLowerCase()}`); render(); }
    if (action === 'copy') { await navigator.clipboard?.writeText(item.email); toast('Đã sao chép email'); }
  });
  document.addEventListener('click',(event) => { if (!event.target.closest('.instructor-card-more') && !event.target.closest('.instructor-card-menu')) closeMenus(); });
  document.querySelectorAll('[data-close-instructor]').forEach((button) => button.addEventListener('click',() => $('instructorDialog').close()));
  document.querySelectorAll('[data-close-info]').forEach((button) => button.addEventListener('click',() => $('instructorInfoDialog').close()));
  [$('instructorDialog'),$('instructorInfoDialog')].forEach((dialog) => dialog.addEventListener('click',(event) => { if (event.target === dialog) dialog.close(); }));
  $('instructorForm').addEventListener('submit',(event) => { event.preventDefault(); if (!event.currentTarget.reportValidity()) return; const data = Object.fromEntries(new FormData(event.currentTarget)),existing = instructors.find((row) => String(row.id) === data.id),record = {name:data.name.trim(),type:data.type,email:data.email.trim(),phone:data.phone.trim(),unit:data.unit,department:data.department,status:data.status,rating:Number(data.rating),classes:existing?.classes || 0,students:existing?.students || 0}; if (existing) Object.assign(existing,record); else instructors.unshift({id:Math.max(...instructors.map((row) => row.id)) + 1,...record}); $('instructorDialog').close(); page = 1; toast(existing ? 'Đã cập nhật giảng viên' : 'Đã thêm giảng viên'); render(); });
  console.assert(instructors.length === 48 && instructors.filter((item) => item.type === 'Nội bộ').length === 32,'Instructor mock data self-check failed');
  render();
})();
