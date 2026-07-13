(() => {
  const baseUsers = [
    ['Nguyễn Văn A','nguyenvana@example.com','0901000001','Quản trị hệ thống','Phòng CNTT','Hoạt động','20/05/2024 10:30'],
    ['Trần Thị Bích','tranthibich@example.com','0901000002','Giảng viên','Khoa Kinh tế','Hoạt động','20/05/2024 09:15'],
    ['Lê Văn Cường','levancuong@example.com','0901000003','Học viên','Khoa Kỹ thuật','Hoạt động','19/05/2024 16:45'],
    ['Phạm Thị Dung','phamthidung@example.com','0901000004','Quản lý đơn vị','Phòng Đào tạo','Hoạt động','19/05/2024 14:20'],
    ['Hoàng Văn E','hoangvane@example.com','0901000005','Học viên','Khoa Kinh tế','Bị khóa','18/05/2024 11:05'],
    ['Nguyễn Thị Mai','nguyenthimai@example.com','0901000006','Giảng viên','Khoa Y','Hoạt động','17/05/2024 08:50'],
    ['Đỗ Minh Nam','dominhnam@example.com','0901000007','Học viên','Khoa Kỹ thuật','Hoạt động','16/05/2024 14:33'],
    ['Vũ Thị Lan','vuthilan@example.com','0901000008','Giảng viên','Khoa Ngoại ngữ','Hoạt động','16/05/2024 09:10'],
    ['Bùi Quốc Anh','buiquocanh@example.com','0901000009','Học viên','Khoa Kinh tế','Ngừng hoạt động','15/05/2024 17:40'],
    ['Phan Thị Hằng','phanthihang@example.com','0901000010','Quản lý đơn vị','Phòng Tài chính','Hoạt động','15/05/2024 10:25'],
    ['Đặng Minh Khôi','dangminhkhoi@example.com','0901000011','Học viên','Phòng CNTT','Hoạt động','14/05/2024 15:18'],
    ['Hồ Ngọc Hà','hongochaa@example.com','0901000012','Giảng viên','Khoa Ngoại ngữ','Hoạt động','14/05/2024 08:12'],
    ['Ngô Thanh Tâm','ngothanhtam@example.com','0901000013','Học viên','Khoa Y','Hoạt động','13/05/2024 13:26'],
    ['Trương Gia Hân','truonggiahan@example.com','0901000014','Học viên','Khoa Kinh tế','Hoạt động','13/05/2024 09:44'],
    ['Võ Thành Công','vothanhcong@example.com','0901000015','Quản lý đơn vị','Khoa Kỹ thuật','Hoạt động','12/05/2024 16:00'],
    ['Dương Bảo Châu','duongbaochau@example.com','0901000016','Giảng viên','Phòng Đào tạo','Bị khóa','12/05/2024 10:38'],
    ['Lý Minh Đức','lyminhduc@example.com','0901000017','Học viên','Phòng CNTT','Hoạt động','11/05/2024 11:20'],
    ['Mai Thu Trang','maithutrang@example.com','0901000018','Giảng viên','Khoa Y','Hoạt động','10/05/2024 14:48'],
    ['Tạ Quốc Việt','taquocviet@example.com','0901000019','Học viên','Khoa Kỹ thuật','Hoạt động','10/05/2024 09:30'],
    ['Đinh Thị Yến','dinhthiyen@example.com','0901000020','Học viên','Phòng Tài chính','Ngừng hoạt động','09/05/2024 17:05'],
    ['Cao Minh Quân','caominhquan@example.com','0901000021','Quản lý đơn vị','Khoa Ngoại ngữ','Hoạt động','09/05/2024 08:55'],
    ['Lâm Tuyết Nhi','lamtuyetnhi@example.com','0901000022','Giảng viên','Khoa Kinh tế','Hoạt động','08/05/2024 15:12'],
    ['Chu Anh Tuấn','chuanhtuan@example.com','0901000023','Học viên','Phòng CNTT','Hoạt động','08/05/2024 10:42'],
    ['Quách Thị Thu','quachthithu@example.com','0901000024','Học viên','Khoa Y','Hoạt động','07/05/2024 16:28'],
    ['Tôn Đức Long','tonduclong@example.com','0901000025','Giảng viên','Khoa Kỹ thuật','Hoạt động','07/05/2024 11:14'],
    ['La Hoài Phương','lahoaiphuong@example.com','0901000026','Học viên','Phòng Đào tạo','Bị khóa','06/05/2024 09:06']
  ];
  let users = baseUsers.map(([name,email,phone,role,unit,status,lastLogin], index) => ({ id:index + 1,name,email,phone,role,unit,status,lastLogin }));
  const pageSize = 10;
  let currentPage = 1;
  let pendingUserId = null;

  const $ = (id) => document.getElementById(id);
  const elements = { search:$('userSearch'),role:$('roleFilter'),status:$('statusFilter'),unit:$('unitFilter'),body:$('userTableBody'),pagination:$('pagination'),summary:$('resultSummary'),userDialog:$('userDialog'),confirmDialog:$('confirmDialog'),form:$('userForm') };
  if (!elements.body) return;

  const normalize = (value) => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g,'d').replace(/Đ/g,'D').toLowerCase();
  const initials = (name) => name.trim().split(/\s+/).slice(-2).map((part) => part[0]).join('').toUpperCase();
  const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
  const roleClass = (role) => ({'Quản trị hệ thống':'role-admin','Giảng viên':'role-teacher','Học viên':'role-student','Quản lý đơn vị':'role-manager'}[role] || 'role-student');
  const statusClass = (status) => ({'Hoạt động':'status-active','Bị khóa':'status-locked','Ngừng hoạt động':'status-inactive'}[status] || 'status-inactive');

  function filterUsers(list, filters) {
    const query = normalize(filters.query);
    return list.filter((user) => (!query || normalize(`${user.name} ${user.email} ${user.phone}`).includes(query)) && (!filters.role || user.role === filters.role) && (!filters.status || user.status === filters.status) && (!filters.unit || user.unit === filters.unit));
  }
  function paginate(list, page, size) {
    const totalPages = Math.max(1, Math.ceil(list.length / size));
    const safePage = Math.min(Math.max(1, page), totalPages);
    return { rows:list.slice((safePage - 1) * size, safePage * size),totalPages,page:safePage };
  }
  console.assert(filterUsers([{name:'Nguyễn Văn A',email:'a@a.vn',phone:''}], {query:'nguyen',role:'',status:'',unit:''}).length === 1, 'User search self-check failed');
  console.assert(paginate(Array(11), 1, 10).totalPages === 2, 'Pagination self-check failed');

  const filters = () => ({ query:elements.search.value,role:elements.role.value,status:elements.status.value,unit:elements.unit.value });
  const filteredUsers = () => filterUsers(users, filters());

  function render() {
    const filtered = filteredUsers();
    const page = paginate(filtered, currentPage, pageSize);
    currentPage = page.page;
    elements.body.innerHTML = page.rows.length ? page.rows.map((user, index) => `
      <tr><td>${(currentPage - 1) * pageSize + index + 1}</td><td><div class="user-name"><span class="user-avatar">${escapeHtml(initials(user.name))}</span>${escapeHtml(user.name)}</div></td><td>${escapeHtml(user.email)}</td><td><span class="role-pill ${roleClass(user.role)}">${escapeHtml(user.role)}</span></td><td>${escapeHtml(user.unit)}</td><td><span class="status ${statusClass(user.status)}">${escapeHtml(user.status)}</span></td><td>${escapeHtml(user.lastLogin)}</td><td><div class="user-actions">
        <button class="action-icon" data-action="edit" data-id="${user.id}" title="Sửa người dùng" aria-label="Sửa ${escapeHtml(user.name)}"><i class="fa-solid fa-pen"></i></button>
        <button class="action-icon" data-action="lock" data-id="${user.id}" title="${user.status === 'Bị khóa' ? 'Mở khóa' : 'Khóa'} người dùng" aria-label="${user.status === 'Bị khóa' ? 'Mở khóa' : 'Khóa'} ${escapeHtml(user.name)}"><i class="fa-solid fa-${user.status === 'Bị khóa' ? 'lock-open' : 'lock'}"></i></button>
        <button class="action-icon" data-action="more" data-id="${user.id}" aria-expanded="false" aria-label="Thao tác khác"><i class="fa-solid fa-ellipsis-vertical"></i></button>
        <div class="action-menu" data-menu="${user.id}" hidden><button data-action="details" data-id="${user.id}"><i class="fa-regular fa-address-card"></i> Xem thông tin</button><button data-action="reset-password" data-id="${user.id}"><i class="fa-solid fa-key"></i> Đặt lại mật khẩu</button></div>
      </div></td></tr>`).join('') : '<tr><td colspan="8" class="empty-users"><i class="fa-solid fa-users-slash"></i><br>Không tìm thấy người dùng phù hợp</td></tr>';
    const start = filtered.length ? (currentPage - 1) * pageSize + 1 : 0;
    const end = Math.min(currentPage * pageSize, filtered.length);
    elements.summary.textContent = `Hiển thị ${start} - ${end} trong tổng số ${filtered.length} người dùng`;
    elements.pagination.innerHTML = `<button class="page-button" data-page="${currentPage - 1}" ${currentPage === 1 ? 'disabled' : ''} aria-label="Trang trước"><i class="fa-solid fa-chevron-left"></i></button>${Array.from({length:page.totalPages}, (_, index) => `<button class="page-button ${index + 1 === currentPage ? 'active' : ''}" data-page="${index + 1}">${index + 1}</button>`).join('')}<button class="page-button" data-page="${currentPage + 1}" ${currentPage === page.totalPages ? 'disabled' : ''} aria-label="Trang sau"><i class="fa-solid fa-chevron-right"></i></button>`;
  }

  function closeMenus(exceptId) {
    document.querySelectorAll('[data-menu]').forEach((menu) => { if (String(menu.dataset.menu) !== String(exceptId)) menu.hidden = true; });
    document.querySelectorAll('[data-action="more"]').forEach((button) => button.setAttribute('aria-expanded', String(button.dataset.id === String(exceptId))));
  }
  function openUserDialog(user) {
    elements.form.reset();
    $('emailError').textContent = '';
    $('userDialogTitle').textContent = user ? 'Chỉnh sửa người dùng' : 'Thêm người dùng';
    const fields = elements.form.elements;
    fields.namedItem('id').value = user?.id || '';
    fields.namedItem('name').value = user?.name || '';
    fields.namedItem('email').value = user?.email || '';
    fields.namedItem('role').value = user?.role || '';
    fields.namedItem('unit').value = user?.unit || '';
    fields.namedItem('status').value = user?.status || 'Hoạt động';
    elements.userDialog.showModal();
  }
  function requestLock(user) {
    pendingUserId = user.id;
    const unlock = user.status === 'Bị khóa';
    $('confirmTitle').textContent = `${unlock ? 'Mở khóa' : 'Khóa'} người dùng?`;
    $('confirmMessage').textContent = `Bạn có chắc muốn ${unlock ? 'mở khóa' : 'khóa'} tài khoản của ${user.name}?`;
    $('confirmAction').textContent = unlock ? 'Mở khóa' : 'Khóa tài khoản';
    elements.confirmDialog.showModal();
  }

  [elements.search,elements.role,elements.status,elements.unit].forEach((control) => control.addEventListener(control === elements.search ? 'input' : 'change', () => { currentPage = 1; render(); }));
  $('resetFilters').addEventListener('click', () => { elements.search.value = elements.role.value = elements.status.value = elements.unit.value = ''; currentPage = 1; render(); });
  elements.pagination.addEventListener('click', (event) => { const button = event.target.closest('[data-page]'); if (!button || button.disabled) return; currentPage = Number(button.dataset.page); render(); });
  $('addUserButton').addEventListener('click', () => openUserDialog());
  document.querySelectorAll('[data-close-dialog]').forEach((button) => button.addEventListener('click', () => elements.userDialog.close()));
  document.querySelector('[data-close-confirm]').addEventListener('click', () => elements.confirmDialog.close());

  elements.form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(elements.form));
    const duplicate = users.some((user) => user.email.toLowerCase() === data.email.trim().toLowerCase() && String(user.id) !== data.id);
    $('emailError').textContent = duplicate ? 'Email này đã tồn tại trong hệ thống.' : '';
    if (duplicate || !elements.form.reportValidity()) return;
    const existing = users.find((user) => String(user.id) === data.id);
    if (existing) Object.assign(existing, {name:data.name.trim(),email:data.email.trim(),role:data.role,unit:data.unit,status:data.status});
    else users.unshift({id:Math.max(0,...users.map((user) => user.id)) + 1,name:data.name.trim(),email:data.email.trim(),phone:'Chưa cập nhật',role:data.role,unit:data.unit,status:data.status,lastLogin:'Chưa đăng nhập'});
    currentPage = 1;
    elements.userDialog.close();
    render();
  });

  elements.body.addEventListener('click', (event) => {
    const button = event.target.closest('[data-action]');
    if (!button) return;
    const user = users.find((item) => item.id === Number(button.dataset.id));
    if (!user) return;
    if (button.dataset.action === 'edit') openUserDialog(user);
    if (button.dataset.action === 'lock') requestLock(user);
    if (button.dataset.action === 'more') { const menu = document.querySelector(`[data-menu="${user.id}"]`); const opening = menu.hidden; closeMenus(opening ? user.id : null); menu.hidden = !opening; button.setAttribute('aria-expanded', String(opening)); }
    if (button.dataset.action === 'details') { closeMenus(); openUserDialog(user); }
    if (button.dataset.action === 'reset-password') { closeMenus(); window.alert(`Đã gửi yêu cầu đặt lại mật khẩu cho ${user.email}.`); }
  });
  $('confirmAction').addEventListener('click', () => { const user = users.find((item) => item.id === pendingUserId); if (user) user.status = user.status === 'Bị khóa' ? 'Hoạt động' : 'Bị khóa'; pendingUserId = null; elements.confirmDialog.close(); render(); });
  document.addEventListener('click', (event) => { if (!event.target.closest('.user-actions')) closeMenus(); });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeMenus(); });

  $('exportUsersButton').addEventListener('click', () => {
    const quote = (value) => `"${String(value).replace(/"/g,'""')}"`;
    const rows = [['Họ và tên','Email','Số điện thoại','Vai trò','Đơn vị','Trạng thái','Đăng nhập cuối'], ...filteredUsers().map((user) => [user.name,user.email,user.phone,user.role,user.unit,user.status,user.lastLogin])];
    const blob = new Blob(['\ufeff' + rows.map((row) => row.map(quote).join(',')).join('\r\n')], {type:'text/csv;charset=utf-8'});
    const url = URL.createObjectURL(blob), link = document.createElement('a');
    link.href = url; link.download = 'danh-sach-nguoi-dung.csv'; link.click(); URL.revokeObjectURL(url);
  });
  render();
})();
