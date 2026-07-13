(() => {
  const units = ['Công ty Than Hà Lầm','Công ty Than Núi Béo','Công ty Than Cao Sơn','Công ty Than Đèo Nai','Công ty Than Hà Tu'];
  const seeds = [
    ['Nguyễn Văn An','HV0001',units[0],'12/05/2024','Thêm thủ công','Đang học'],['Trần Thị Bình','HV0002',units[1],'12/05/2024','Tải lên Excel','Đang học'],['Lê Văn Cường','HV0003',units[0],'-','Đăng ký trực tuyến','Chờ duyệt'],['Phạm Thị Dung','HV0004',units[2],'13/05/2024','Thêm thủ công','Đang học'],['Hoàng Văn Em','HV0005',units[3],'12/05/2024','Tải lên Excel','Đang học'],['Phạm Văn Thành','HV0006',units[4],'-','Đăng ký trực tuyến','Chờ duyệt'],['Nguyễn Thị Hương','HV0007',units[1],'12/05/2024','Thêm thủ công','Đang học'],['Đỗ Văn Lộc','HV0008',units[2],'-','Tải lên Excel','Đang học']
  ];
  const extraNames = ['Bùi Minh Khang','Vũ Thu Hà','Ngô Quốc Bảo','Đặng Thanh Tâm','Hồ Gia Huy','Dương Ngọc Mai','Trương Đức Anh','Mai Thị Lan'];
  let students = seeds.map((row,index) => ({id:index + 1,name:row[0],code:row[1],unit:row[2],joined:row[3],source:row[4],status:row[5]}));
  for (let index = students.length; index < 45; index += 1) students.push({id:index + 1,name:`${extraNames[index % extraNames.length]} ${index + 1}`,code:`HV${String(index + 1).padStart(4,'0')}`,unit:units[index % units.length],joined:index % 3 ? '14/05/2024' : '-',source:['Thêm thủ công','Tải lên Excel','Đăng ký trực tuyến'][index % 3],status:index % 5 ? 'Đang học' : 'Chờ duyệt'});

  const $ = (id) => document.getElementById(id), body = $('studentTableBody');
  if (!body) return;
  let currentPage = 1, pageSize = 8;
  const colors = ['#073fc4','#f2a300','#d51e3c','#0867ad','#08a36a','#8b24e8','#12a9b0','#8a5341'];
  const esc = (value) => String(value).replace(/[&<>'"]/g,(char) => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
  const normalize = (value) => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').replace(/Đ/g,'D').toLowerCase();
  const initials = (name) => name.trim().split(/\s+/).slice(-2).map((part) => part[0]).join('').toUpperCase();
  const filteredStudents = () => { const query = normalize($('studentSearch').value),status = $('studentStatus').value,source = $('studentSource').value,unit = $('studentUnit').value; return students.filter((student) => (!query || normalize(`${student.name} ${student.code}`).includes(query)) && (!status || student.status === status) && (!source || student.source === source) && (!unit || student.unit === unit)); };

  function populateUnits() {
    [$('studentUnit'),$('studentForm').elements.namedItem('unit')].forEach((select,index) => { const first = index ? '<option value="">Chọn đơn vị</option>' : '<option value="">-- Đơn vị --</option>'; select.innerHTML = first + units.map((unit) => `<option>${unit}</option>`).join(''); });
  }
  function closeMenus(exceptId) { document.querySelectorAll('[data-student-menu]').forEach((menu) => { if (String(menu.dataset.studentMenu) !== String(exceptId)) menu.hidden = true; }); document.querySelectorAll('[data-action="more"]').forEach((button) => button.setAttribute('aria-expanded',String(button.dataset.id === String(exceptId)))); }
  function render() {
    const filtered = filteredStudents(),totalPages = Math.max(1,Math.ceil(filtered.length / pageSize)); currentPage = Math.min(Math.max(1,currentPage),totalPages);
    const rows = filtered.slice((currentPage - 1) * pageSize,currentPage * pageSize);
    body.innerHTML = rows.length ? rows.map((student,index) => `<tr><td><input type="checkbox" data-select-student="${student.id}" aria-label="Chọn ${esc(student.name)}"></td><td>${(currentPage - 1) * pageSize + index + 1}</td><td><div class="student-person"><span class="student-avatar" style="background:${colors[(student.id - 1) % colors.length]}">${esc(initials(student.name))}</span>${esc(student.name)}</div></td><td>${esc(student.code)}</td><td>${esc(student.unit)}</td><td>${esc(student.joined)}</td><td>${esc(student.source)}</td><td><div class="student-action"><button class="student-more" data-action="more" data-id="${student.id}" aria-expanded="false" aria-label="Thao tác với ${esc(student.name)}"><i class="fa-solid fa-ellipsis"></i></button><div class="student-row-menu" data-student-menu="${student.id}" hidden><button data-action="edit" data-id="${student.id}"><i class="fa-solid fa-pen"></i> Chỉnh sửa</button><button data-action="remove" data-id="${student.id}"><i class="fa-solid fa-user-minus"></i> Xóa khỏi lớp</button></div></div></td></tr>`).join('') : '<tr><td colspan="8" class="student-empty"><i class="fa-solid fa-users-slash"></i><br>Không tìm thấy học viên phù hợp</td></tr>';
    const first = filtered.length ? (currentPage - 1) * pageSize + 1 : 0,last = Math.min(currentPage * pageSize,filtered.length);
    $('studentSummary').textContent = `Hiển thị ${first} - ${last} trong tổng số ${filtered.length} học viên`;
    $('studentPagination').innerHTML = `<button class="student-page" data-page="${currentPage - 1}" ${currentPage === 1 ? 'disabled' : ''} aria-label="Trang trước"><i class="fa-solid fa-chevron-left"></i></button>${Array.from({length:totalPages},(_,index) => `<button class="student-page ${index + 1 === currentPage ? 'active' : ''}" data-page="${index + 1}">${index + 1}</button>`).join('')}<button class="student-page" data-page="${currentPage + 1}" ${currentPage === totalPages ? 'disabled' : ''} aria-label="Trang sau"><i class="fa-solid fa-chevron-right"></i></button>`;
    $('selectAllStudents').checked = false;
  }
  function openStudentDialog(student) {
    const form = $('studentForm'); form.reset(); $('studentDialogTitle').textContent = student ? 'Chỉnh sửa học viên' : 'Thêm học viên';
    form.elements.namedItem('id').value = student?.id || ''; form.elements.namedItem('name').value = student?.name || ''; form.elements.namedItem('code').value = student?.code || `HV${String(students.length + 1).padStart(4,'0')}`; form.elements.namedItem('unit').value = student?.unit || ''; form.elements.namedItem('joined').value = student?.joined !== '-' ? (student?.joined || '12/05/2024').split('/').reverse().join('-') : ''; form.elements.namedItem('status').value = student?.status || 'Đang học'; $('studentDialog').showModal();
  }

  populateUnits();
  ['studentSearch','studentStatus','studentSource','studentUnit'].forEach((id) => $(id).addEventListener(id === 'studentSearch' ? 'input' : 'change',() => { currentPage = 1; render(); }));
  $('resetStudentFilters').addEventListener('click',() => { $('studentSearch').value = $('studentStatus').value = $('studentSource').value = $('studentUnit').value = ''; currentPage = 1; render(); });
  $('studentPagination').addEventListener('click',(event) => { const button = event.target.closest('[data-page]'); if (!button || button.disabled) return; currentPage = Number(button.dataset.page); render(); });
  $('studentPageSize').addEventListener('change',(event) => { pageSize = Number(event.target.value); currentPage = 1; render(); });
  $('selectAllStudents').addEventListener('change',(event) => body.querySelectorAll('[data-select-student]').forEach((checkbox) => { checkbox.checked = event.target.checked; }));

  $('addStudentButton').addEventListener('click',(event) => { event.stopPropagation(); $('addStudentMenu').hidden = !$('addStudentMenu').hidden; });
  $('addStudentMenu').addEventListener('click',(event) => { const button = event.target.closest('[data-add-mode]'); if (!button) return; $('addStudentMenu').hidden = true; button.dataset.addMode === 'manual' ? openStudentDialog() : $('studentExcelInput').click(); });
  $('studentExcelInput').addEventListener('change',(event) => { if (!event.target.files.length) return; const id = Math.max(...students.map((student) => student.id)) + 1; students.unshift({id,name:'Học viên nhập từ Excel',code:`HV${String(id).padStart(4,'0')}`,unit:units[0],joined:'12/05/2024',source:'Tải lên Excel',status:'Đang học'}); currentPage = 1; event.target.value = ''; render(); });
  document.addEventListener('click',(event) => { if (!event.target.closest('.student-head-actions')) $('addStudentMenu').hidden = true; if (!event.target.closest('.student-action')) closeMenus(); });

  body.addEventListener('click',(event) => { const button = event.target.closest('[data-action]'); if (!button) return; const student = students.find((item) => item.id === Number(button.dataset.id)); if (!student) return; if (button.dataset.action === 'more') { const menu = document.querySelector(`[data-student-menu="${student.id}"]`),opening = menu.hidden; closeMenus(opening ? student.id : null); menu.hidden = !opening; } if (button.dataset.action === 'edit') { closeMenus(); openStudentDialog(student); } if (button.dataset.action === 'remove' && window.confirm(`Xóa ${student.name} khỏi lớp học?`)) { students = students.filter((item) => item.id !== student.id); closeMenus(); render(); } });
  document.querySelectorAll('[data-close-student]').forEach((button) => button.addEventListener('click',() => $('studentDialog').close()));
  $('studentForm').addEventListener('submit',(event) => { event.preventDefault(); const data = Object.fromEntries(new FormData(event.currentTarget)),duplicate = students.some((student) => student.code.toLowerCase() === data.code.trim().toLowerCase() && String(student.id) !== data.id),codeInput = event.currentTarget.elements.namedItem('code'); codeInput.setCustomValidity(duplicate ? 'Mã học viên đã tồn tại.' : ''); if (!event.currentTarget.reportValidity()) return; const existing = students.find((student) => String(student.id) === data.id),record = {name:data.name.trim(),code:data.code.trim(),unit:data.unit,joined:data.joined ? data.joined.split('-').reverse().join('/') : '-',source:existing?.source || 'Thêm thủ công',status:data.status}; if (existing) Object.assign(existing,record); else students.unshift({id:Math.max(...students.map((student) => student.id)) + 1,...record}); $('studentDialog').close(); currentPage = 1; render(); });
  $('studentForm').elements.namedItem('code').addEventListener('input',(event) => event.target.setCustomValidity(''));
  $('exportStudents').addEventListener('click',() => { const quote = (value) => `"${String(value).replace(/"/g,'""')}"`,rows = [['Họ và tên','Mã học viên','Đơn vị','Ngày tham gia','Nguồn thêm','Trạng thái'],...filteredStudents().map((student) => [student.name,student.code,student.unit,student.joined,student.source,student.status])],blob = new Blob(['\ufeff' + rows.map((row) => row.map(quote).join(',')).join('\r\n')],{type:'text/csv;charset=utf-8'}),url = URL.createObjectURL(blob),link = document.createElement('a'); link.href = url; link.download = 'danh-sach-hoc-vien.csv'; link.click(); URL.revokeObjectURL(url); });
  console.assert(students.length === 45,'Student mock data self-check failed');
  render();
})();
