(() => {
  const groups = [
    ['Quản lý người dùng','fa-users'],['Vai trò & quyền hạn','fa-shield-halved'],['Nhật ký hệ thống','fa-square-poll-horizontal'],['Cấu hình hệ thống','fa-gear'],['Danh mục','fa-folder'],['Quản lý dữ liệu','fa-database'],['Tích hợp hệ thống','fa-share-nodes'],['AI hỗ trợ quản lý đào tạo','fa-robot']
  ];
  const all = () => groups.map(([name]) => ({name,rights:[true,true,true,true],scope:'Toàn hệ thống'}));
  const limited = (allowed,scope='Đơn vị của mình') => groups.map(([name],index) => ({name,rights:[true,allowed.includes(index),allowed.includes(index),false],scope}));
  let roles = [
    {id:1,name:'Quản trị hệ thống',icon:'fa-shield-halved',permissions:all()},
    {id:2,name:'Giảng viên',icon:'fa-graduation-cap',permissions:limited([4,6],'Dữ liệu được phân công')},
    {id:3,name:'Học viên',icon:'fa-user',permissions:limited([],'Dữ liệu cá nhân')},
    {id:4,name:'Quản lý đơn vị',icon:'fa-building',permissions:limited([0,2,4,5],'Đơn vị và cấp dưới')},
    {id:5,name:'Nhân viên hỗ trợ',icon:'fa-headset',permissions:limited([0,2,3],'Toàn hệ thống')},
    {id:6,name:'Khách',icon:'fa-user',permissions:groups.map(([name],index) => ({name,rights:[index === 4,false,false,false],scope:'Dữ liệu công khai'}))}
  ];
  let selectedId = 1, activeTab = 'function', editing = false;
  const $ = (id) => document.getElementById(id), esc = (value) => String(value).replace(/[&<>'"]/g,(char) => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
  const selectedRole = () => roles.find((role) => role.id === selectedId);

  function renderRoles() {
    const query = $('roleSearch').value.trim().toLocaleLowerCase('vi'), filtered = roles.filter((role) => role.name.toLocaleLowerCase('vi').includes(query));
    $('roleList').innerHTML = filtered.length ? filtered.map((role) => `<button class="role-item ${role.id === selectedId ? 'active' : ''}" data-role-id="${role.id}"><i class="fa-solid ${role.icon}"></i><span>${esc(role.name)}<small>1 vai trò</small></span></button>`).join('') : '<p class="role-empty">Không tìm thấy vai trò phù hợp</p>';
    $('roleTotal').textContent = `Tổng số: ${roles.length} vai trò`;
  }
  function renderPermissions() {
    const role = selectedRole();
    $('selectedRoleName').textContent = role.name;
    if (activeTab === 'function') {
      $('permissionHead').innerHTML = '<tr><th class="group-cell" rowspan="2">Nhóm chức năng</th><th colspan="4">Quyền hạn</th></tr><tr><th>Xem</th><th>Thêm</th><th>Sửa</th><th>Xóa</th></tr>';
      $('permissionTableBody').innerHTML = role.permissions.map((permission,index) => `<tr><td class="group-cell"><div class="permission-group"><i class="fa-solid ${groups[index][1]}"></i>${esc(permission.name)}</div></td>${permission.rights.map((checked,right) => `<td><input type="checkbox" data-group="${index}" data-right="${right}" ${checked ? 'checked' : ''} ${editing ? '' : 'disabled'} aria-label="${['Xem','Thêm','Sửa','Xóa'][right]} ${esc(permission.name)}"></td>`).join('')}</tr>`).join('');
    } else {
      $('permissionHead').innerHTML = '<tr><th class="group-cell">Nhóm chức năng</th><th>Phạm vi dữ liệu</th></tr>';
      $('permissionTableBody').innerHTML = role.permissions.map((permission,index) => `<tr><td class="group-cell"><div class="permission-group"><i class="fa-solid ${groups[index][1]}"></i>${esc(permission.name)}</div></td><td><select data-scope="${index}" ${editing ? '' : 'disabled'}><option ${permission.scope === 'Toàn hệ thống' ? 'selected' : ''}>Toàn hệ thống</option><option ${permission.scope === 'Đơn vị và cấp dưới' ? 'selected' : ''}>Đơn vị và cấp dưới</option><option ${permission.scope === 'Đơn vị của mình' ? 'selected' : ''}>Đơn vị của mình</option><option ${permission.scope === 'Dữ liệu được phân công' ? 'selected' : ''}>Dữ liệu được phân công</option><option ${permission.scope === 'Dữ liệu cá nhân' ? 'selected' : ''}>Dữ liệu cá nhân</option><option ${permission.scope === 'Dữ liệu công khai' ? 'selected' : ''}>Dữ liệu công khai</option></select></td></tr>`).join('');
    }
    const button = $('editPermissionButton');
    button.classList.toggle('editing',editing);
    button.querySelector('span').textContent = editing ? 'Lưu thay đổi' : 'Chỉnh sửa quyền';
    button.querySelector('i').className = editing ? 'fa-solid fa-check' : 'fa-regular fa-pen-to-square';
  }

  $('roleSearch').addEventListener('input',renderRoles);
  $('roleList').addEventListener('click',(event) => { const button = event.target.closest('[data-role-id]'); if (!button) return; selectedId = Number(button.dataset.roleId); editing = false; renderRoles(); renderPermissions(); });
  document.querySelectorAll('[data-permission-tab]').forEach((button) => button.addEventListener('click',() => { activeTab = button.dataset.permissionTab; editing = false; document.querySelectorAll('[data-permission-tab]').forEach((tab) => tab.classList.toggle('active',tab === button)); renderPermissions(); }));
  $('permissionTableBody').addEventListener('change',(event) => { const role = selectedRole(); if (event.target.matches('[data-group]')) role.permissions[Number(event.target.dataset.group)].rights[Number(event.target.dataset.right)] = event.target.checked; if (event.target.matches('[data-scope]')) role.permissions[Number(event.target.dataset.scope)].scope = event.target.value; });
  $('editPermissionButton').addEventListener('click',() => { editing = !editing; if (!editing) $('permissionUpdated').textContent = new Date().toLocaleString('vi-VN',{hour12:false}).replace(',',''); renderPermissions(); });

  $('addRoleButton').addEventListener('click',() => { $('roleForm').reset(); $('roleDialog').showModal(); });
  document.querySelectorAll('[data-close-role]').forEach((button) => button.addEventListener('click',() => $('roleDialog').close()));
  $('roleForm').addEventListener('submit',(event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget)),input = event.currentTarget.elements.namedItem('name'),duplicate = roles.some((role) => role.name.toLocaleLowerCase('vi') === data.name.trim().toLocaleLowerCase('vi'));
    input.setCustomValidity(duplicate ? 'Tên vai trò đã tồn tại.' : '');
    if (!event.currentTarget.reportValidity()) return;
    const id = Math.max(...roles.map((role) => role.id)) + 1;
    roles.push({id,name:data.name.trim(),icon:data.icon,permissions:groups.map(([name]) => ({name,rights:[false,false,false,false],scope:'Dữ liệu cá nhân'}))});
    selectedId = id; $('roleDialog').close(); renderRoles(); renderPermissions();
  });
  $('roleForm').elements.namedItem('name').addEventListener('input',(event) => event.target.setCustomValidity(''));
  renderRoles(); renderPermissions();
})();
