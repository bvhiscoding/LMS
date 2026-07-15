(() => {
  const root = document.getElementById('ad-catalog');
  if (!root) return;

  let items = [
    { id:'org', code:'ORG', name:'Đơn vị / Tổ chức', parent:null, source:'HR-TKV', icon:'fa-building', status:'Hoạt động' },
    { id:'job', code:'JOB', name:'Chức danh', parent:null, source:'HR-TKV', icon:'fa-id-badge', status:'Hoạt động' },
    { id:'topic', code:'TOPIC', name:'Chủ đề / Phân nhóm', parent:null, source:'LMS', icon:'fa-layer-group', status:'Hoạt động' },
    { id:'cost', code:'COST', name:'Danh mục chi phí', parent:null, source:'Nhập tay', icon:'fa-coins', status:'Hoạt động' },
    { id:'tkv', code:'TKV', name:'Tập đoàn Công nghiệp Than - Khoáng sản Việt Nam', parent:'org', source:'HR-TKV', icon:'fa-building-columns', status:'Hoạt động' },
    { id:'school', code:'VBS', name:'Khối trường đào tạo', parent:'org', source:'HR-TKV', icon:'fa-school', status:'Hoạt động' },
    { id:'company', code:'CTTV', name:'Khối công ty thành viên', parent:'org', source:'HR-TKV', icon:'fa-city', status:'Hoạt động' },
    { id:'office', code:'VP', name:'Khối văn phòng Tập đoàn', parent:'org', source:'HR-TKV', icon:'fa-briefcase', status:'Hoạt động' },
    { id:'vbs', code:'VBS-HL', name:'Trường QTKD Vinacomin', parent:'school', source:'HR-TKV', icon:'fa-graduation-cap', status:'Hoạt động' },
    { id:'college', code:'CĐTKV', name:'Cao đẳng TKV', parent:'school', source:'HR-TKV', icon:'fa-graduation-cap', status:'Hoạt động' },
    { id:'halam', code:'HL', name:'Công ty Than Hạ Long', parent:'company', source:'HR-TKV', icon:'fa-industry', status:'Hoạt động' },
    { id:'nuibeo', code:'NB', name:'Công ty Than Núi Béo', parent:'company', source:'Nhập tay', icon:'fa-industry', status:'Hoạt động' },
    { id:'dt', code:'PĐT', name:'Phòng Đào tạo', parent:'vbs', source:'HR-TKV', icon:'fa-users', status:'Hoạt động' },
    { id:'cntt', code:'PCNTT', name:'Phòng Công nghệ thông tin', parent:'vbs', source:'HR-TKV', icon:'fa-laptop-code', status:'Hoạt động' },
    { id:'kt', code:'KKT', name:'Khoa Kinh tế', parent:'vbs', source:'Nhập tay', icon:'fa-chart-line', status:'Hoạt động' },
    { id:'manager', code:'QL', name:'Quản lý', parent:'job', source:'HR-TKV', icon:'fa-user-tie', status:'Hoạt động' },
    { id:'specialist', code:'CV', name:'Chuyên viên', parent:'job', source:'HR-TKV', icon:'fa-user-gear', status:'Hoạt động' },
    { id:'safety', code:'ATLĐ', name:'An toàn lao động', parent:'topic', source:'LMS', icon:'fa-helmet-safety', status:'Hoạt động' },
    { id:'operation', code:'VH', name:'Vận hành sản xuất', parent:'topic', source:'LMS', icon:'fa-gears', status:'Hoạt động' },
    { id:'travel', code:'CTP', name:'Công tác phí', parent:'cost', source:'Nhập tay', icon:'fa-plane', status:'Hoạt động' },
    { id:'mining', code:'KT-MO', name:'Khối khai thác mỏ', parent:'org', source:'HR-TKV', icon:'fa-mountain', status:'Hoạt động' },
    { id:'energy', code:'NL-DL', name:'Khối năng lượng và điện lực', parent:'org', source:'HR-TKV', icon:'fa-bolt', status:'Hoạt động' },
    { id:'logistics', code:'LOG', name:'Khối logistics và dịch vụ', parent:'org', source:'HR-TKV', icon:'fa-truck-fast', status:'Hoạt động' },
    { id:'research', code:'NC', name:'Khối viện nghiên cứu', parent:'org', source:'HR-TKV', icon:'fa-flask', status:'Hoạt động' },
    { id:'campha', code:'CP', name:'Công ty Than Cẩm Phả', parent:'company', source:'HR-TKV', icon:'fa-industry', status:'Hoạt động' },
    { id:'maokhe', code:'MK', name:'Công ty Than Mạo Khê', parent:'company', source:'HR-TKV', icon:'fa-industry', status:'Hoạt động' },
    { id:'vangdanh', code:'VD', name:'Công ty Than Vàng Danh', parent:'company', source:'HR-TKV', icon:'fa-industry', status:'Hoạt động' },
    { id:'duonghuy', code:'DH', name:'Công ty Than Dương Huy', parent:'company', source:'HR-TKV', icon:'fa-industry', status:'Hoạt động' },
    { id:'khecham', code:'KC', name:'Công ty Than Khe Chàm', parent:'company', source:'HR-TKV', icon:'fa-industry', status:'Hoạt động' },
    { id:'hongai', code:'HG', name:'Công ty Than Hòn Gai', parent:'company', source:'HR-TKV', icon:'fa-industry', status:'Hoạt động' },
    { id:'voc', code:'VOC', name:'Trường Cao đẳng Than - Khoáng sản Việt Nam', parent:'school', source:'HR-TKV', icon:'fa-graduation-cap', status:'Hoạt động' },
    { id:'mining_school', code:'TC-MO', name:'Trường Trung cấp nghề mỏ', parent:'school', source:'Nhập tay', icon:'fa-school', status:'Hoạt động' },
    { id:'hr', code:'PTCHC', name:'Phòng Tổ chức - Hành chính', parent:'vbs', source:'HR-TKV', icon:'fa-people-group', status:'Hoạt động' },
    { id:'finance', code:'PTCKT', name:'Phòng Tài chính - Kế toán', parent:'vbs', source:'HR-TKV', icon:'fa-calculator', status:'Hoạt động' },
    { id:'science', code:'PKHCN', name:'Phòng Khoa học và Công nghệ', parent:'vbs', source:'Nhập tay', icon:'fa-microscope', status:'Hoạt động' },
    { id:'tech', code:'KKT-MO', name:'Khoa Kỹ thuật mỏ', parent:'vbs', source:'HR-TKV', icon:'fa-gears', status:'Hoạt động' },
    { id:'foreign', code:'KNN', name:'Khoa Ngoại ngữ', parent:'vbs', source:'Nhập tay', icon:'fa-language', status:'Hoạt động' },
    { id:'director', code:'GĐ', name:'Giám đốc / Hiệu trưởng', parent:'manager', source:'HR-TKV', icon:'fa-user-tie', status:'Hoạt động' },
    { id:'deputy', code:'PGĐ', name:'Phó giám đốc / Phó hiệu trưởng', parent:'manager', source:'HR-TKV', icon:'fa-user-tie', status:'Hoạt động' },
    { id:'department_head', code:'TP', name:'Trưởng phòng / Trưởng khoa', parent:'manager', source:'HR-TKV', icon:'fa-user-tie', status:'Hoạt động' },
    { id:'team_lead', code:'TT', name:'Tổ trưởng / Quản đốc', parent:'manager', source:'HR-TKV', icon:'fa-people-roof', status:'Hoạt động' },
    { id:'engineer', code:'KS', name:'Kỹ sư', parent:'job', source:'HR-TKV', icon:'fa-user-gear', status:'Hoạt động' },
    { id:'lecturer', code:'GV', name:'Giảng viên', parent:'job', source:'HR-TKV', icon:'fa-person-chalkboard', status:'Hoạt động' },
    { id:'worker', code:'CNKT', name:'Công nhân kỹ thuật', parent:'job', source:'HR-TKV', icon:'fa-helmet-safety', status:'Hoạt động' },
    { id:'fire', code:'PCCC', name:'Phòng cháy chữa cháy', parent:'safety', source:'LMS', icon:'fa-fire-extinguisher', status:'Hoạt động' },
    { id:'first_aid', code:'SCC', name:'Sơ cấp cứu tại nơi làm việc', parent:'safety', source:'LMS', icon:'fa-kit-medical', status:'Hoạt động' },
    { id:'mine_safety', code:'AT-MO', name:'An toàn trong khai thác mỏ', parent:'safety', source:'LMS', icon:'fa-shield-halved', status:'Hoạt động' },
    { id:'electrical', code:'AT-DIEN', name:'An toàn điện', parent:'safety', source:'LMS', icon:'fa-plug-circle-bolt', status:'Hoạt động' },
    { id:'digital', code:'CDS', name:'Chuyển đổi số', parent:'topic', source:'LMS', icon:'fa-laptop-code', status:'Hoạt động' },
    { id:'leadership', code:'LD-QT', name:'Lãnh đạo và quản trị', parent:'topic', source:'LMS', icon:'fa-compass', status:'Hoạt động' },
    { id:'environment', code:'MT', name:'Môi trường và phát triển bền vững', parent:'topic', source:'LMS', icon:'fa-leaf', status:'Hoạt động' },
    { id:'quality', code:'QLCL', name:'Quản lý chất lượng', parent:'topic', source:'LMS', icon:'fa-award', status:'Hoạt động' },
    { id:'accommodation', code:'LTP', name:'Lưu trú và phòng nghỉ', parent:'cost', source:'Nhập tay', icon:'fa-hotel', status:'Hoạt động' },
    { id:'meal', code:'TA', name:'Tiền ăn và giải khát', parent:'cost', source:'Nhập tay', icon:'fa-utensils', status:'Hoạt động' },
    { id:'trainer_cost', code:'CP-GV', name:'Chi phí giảng viên', parent:'cost', source:'Nhập tay', icon:'fa-person-chalkboard', status:'Hoạt động' },
    { id:'material_cost', code:'CP-HL', name:'Chi phí học liệu', parent:'cost', source:'LMS', icon:'fa-book', status:'Hoạt động' },
    { id:'venue_cost', code:'CP-DĐ', name:'Chi phí địa điểm tổ chức', parent:'cost', source:'Nhập tay', icon:'fa-location-dot', status:'Hoạt động' },
    { id:'equipment_cost', code:'CP-TB', name:'Chi phí thiết bị đào tạo', parent:'cost', source:'Nhập tay', icon:'fa-computer', status:'Hoạt động' }
  ];
  let selectedId = 'org';
  const expandedIds = new Set(['org', 'school', 'company', 'vbs']);
  let activeMenu = null;
  let deletingId = null;

  const el = id => document.getElementById(id);
  const childrenOf = parent => items.filter(item => item.parent === parent);
  const itemById = id => items.find(item => item.id === id);
  const levelOf = item => { let level = 1, current = item; while (current?.parent) { level += 1; current = itemById(current.parent); } return level; };
  const escapeHtml = value => String(value).replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
  const showToast = (message, type) => window.showAppToast ? window.showAppToast(message, type) : console.info(message);

  function renderTree() {
    const branch = parent => `<ul class="tree-list${parent ? ' tree-children' : ''}">${childrenOf(parent).map(node => {
      const childCount = childrenOf(node.id).length;
      const expanded = expandedIds.has(node.id);
      return `<li class="tree-branch"><div class="explorer-node${selectedId === node.id ? ' active' : ''}" data-select-node="${node.id}">${childCount ? `<button class="tree-toggle" type="button" data-toggle-node="${node.id}" aria-expanded="${expanded}" aria-label="${expanded ? 'Thu' : 'Mở'} nhánh ${escapeHtml(node.name)}"><i class="fa-solid fa-caret-${expanded ? 'down' : 'right'}"></i></button>` : '<span class="tree-toggle-spacer"></span>'}<span class="explorer-folder"><i class="fa-solid ${expanded && childCount ? 'fa-folder-open' : node.icon}"></i></span><button class="tree-label" type="button" data-select-node="${node.id}"><strong>${escapeHtml(node.name)}</strong><small>${escapeHtml(node.code)}${childCount ? ` · ${childCount}` : ''}</small></button></div>${childCount ? `<div data-branch-id="${node.id}"${expanded ? '' : ' hidden'}>${branch(node.id)}</div>` : ''}</li>`;
    }).join('')}</ul>`;
    el('explorerTree').innerHTML = branch(null);
    const path = [], seen = new Set(); let current = itemById(selectedId);
    while (current && !seen.has(current.id)) { seen.add(current.id); path.unshift(current); current = itemById(current.parent); }
    el('treePath').innerHTML = `<i class="fa-solid fa-folder-tree"></i><span>Tất cả danh mục</span>${path.map(item => `<i class="fa-solid fa-chevron-right"></i><strong>${escapeHtml(item.name)}</strong>`).join('')}`;
  }

  function visibleRows() {
    const current = selectedId;
    const directChildren = childrenOf(current);
    const base = directChildren.length ? directChildren : (current ? [itemById(current)].filter(Boolean) : childrenOf(null));
    const q = el('catalogSearch').value.trim().toLocaleLowerCase('vi');
    return base.filter(item => `${item.code} ${item.name}`.toLocaleLowerCase('vi').includes(q));
  }

  function actionMenu(item) {
    return `<div class="action-cell"><button class="action-trigger" type="button" data-action="menu" data-id="${item.id}" aria-haspopup="menu" aria-expanded="false" aria-label="Thao tác với ${escapeHtml(item.name)}"><i class="fa-solid fa-ellipsis"></i></button><div class="action-menu" role="menu" data-menu-id="${item.id}" hidden><button type="button" role="menuitem" data-action="detail" data-id="${item.id}"><i class="fa-regular fa-eye"></i>Chi tiết</button><button type="button" role="menuitem" data-action="edit" data-id="${item.id}"><i class="fa-regular fa-pen-to-square"></i>Chỉnh sửa</button><button type="button" role="menuitem" data-action="add-child" data-id="${item.id}"><i class="fa-solid fa-code-branch"></i>Thêm mục con</button><button class="danger" type="button" role="menuitem" data-action="delete" data-id="${item.id}"><i class="fa-regular fa-trash-can"></i>Xóa</button></div></div>`;
  }

  function renderTable() {
    const current = itemById(selectedId);
    el('listTitle').textContent = current?.name || 'Tất cả danh mục';
    el('listDescription').textContent = childrenOf(current?.id).length ? `Danh sách mục con trực thuộc ${current.name}.` : 'Thông tin danh mục đang chọn.';
    const rows = visibleRows();
    el('catalogTableBody').innerHTML = rows.map(item => `<tr><td><span class="catalog-code">${escapeHtml(item.code)}</span></td><td><div class="catalog-name"><span class="catalog-name-icon"><i class="fa-solid ${item.icon}"></i></span>${escapeHtml(item.name)}</div></td><td>Cấp ${levelOf(item)}</td><td><span class="source-badge${item.source === 'Nhập tay' ? ' manual' : ''}">${escapeHtml(item.source)}</span></td><td><span class="status-badge">${escapeHtml(item.status)}</span></td><td>${actionMenu(item)}</td></tr>`).join('');
    el('catalogEmpty').hidden = rows.length > 0;
    el('catalogTableBody').closest('table').hidden = rows.length === 0;
    el('catalogSummary').textContent = `Hiển thị ${rows.length} danh mục`;
  }

  function render() { closeMenus(); renderTree(); renderTable(); }
  function closeMenus() { document.querySelectorAll('.action-menu').forEach(menu => menu.hidden = true); document.querySelectorAll('.action-trigger').forEach(button => button.setAttribute('aria-expanded','false')); activeMenu = null; }

  function fillParentOptions(selected) {
    el('catalogForm').elements.parent.innerHTML = `<option value="">— Không có (cấp gốc) —</option>${items.map(item => `<option value="${item.id}"${item.id === selected ? ' selected' : ''}>${'— '.repeat(levelOf(item)-1)}${escapeHtml(item.name)}</option>`).join('')}`;
  }

  function openForm(item = null, parentId = null) {
    const form = el('catalogForm'); form.reset(); form.elements.id.value = item?.id || ''; form.elements.code.value = item?.code || ''; form.elements.name.value = item?.name || ''; form.elements.source.value = item?.source || 'Nhập tay';
    fillParentOptions(item?.parent ?? parentId ?? selectedId ?? '');
    [...form.elements.parent.options].forEach(option => { option.disabled = item && (option.value === item.id || isDescendant(option.value, item.id)); });
    el('catalogDialogTitle').textContent = item ? 'Chỉnh sửa danh mục' : 'Thêm danh mục'; el('catalogDialog').showModal();
  }

  function isDescendant(candidateId, ancestorId) { let current = itemById(candidateId); while (current?.parent) { if (current.parent === ancestorId) return true; current = itemById(current.parent); } return false; }
  function openDetail(item) { el('detailTitle').textContent = item.name; el('detailContent').innerHTML = [['Mã danh mục',item.code],['Danh mục cha',itemById(item.parent)?.name || 'Cấp gốc'],['Cấp danh mục',`Cấp ${levelOf(item)}`],['Nguồn dữ liệu',item.source],['Trạng thái',item.status],['Số mục con',childrenOf(item.id).length]].map(([label,value]) => `<div class="detail-item"><span>${label}</span><strong>${escapeHtml(value)}</strong></div>`).join(''); el('detailEdit').dataset.id = item.id; el('detailDialog').showModal(); }
  function requestDelete(item) { deletingId = item.id; const count = childrenOf(item.id).length; el('deleteMessage').textContent = count ? `“${item.name}” đang có ${count} mục con. Hãy xóa hoặc di chuyển các mục con trước.` : `Danh mục “${item.name}” sẽ bị xóa khỏi hệ thống. Thao tác này không thể hoàn tác.`; el('confirmDelete').disabled = count > 0; el('confirmDelete').style.opacity = count ? '.45' : '1'; el('deleteDialog').showModal(); }

  el('explorerTree').addEventListener('click', event => {
    const toggle = event.target.closest('[data-toggle-node]');
    if (toggle) { const id = toggle.dataset.toggleNode; expandedIds.has(id) ? expandedIds.delete(id) : expandedIds.add(id); renderTree(); return; }
    const node = event.target.closest('[data-select-node]');
    if (!node) return;
    selectedId = node.dataset.selectNode;
    let current = itemById(selectedId); while (current?.parent) { expandedIds.add(current.parent); current = itemById(current.parent); }
    el('catalogSearch').value = ''; render();
  });
  el('expandAllTree').addEventListener('click', event => {
    const expandable = items.filter(item => childrenOf(item.id).length).map(item => item.id);
    const shouldExpand = expandable.some(id => !expandedIds.has(id));
    expandedIds.clear(); if (shouldExpand) expandable.forEach(id => expandedIds.add(id));
    event.currentTarget.classList.toggle('active', shouldExpand); event.currentTarget.title = shouldExpand ? 'Thu tất cả nhánh' : 'Mở tất cả nhánh'; renderTree();
  });
  el('catalogSearch').addEventListener('input', renderTable);
  el('addCatalog').addEventListener('click', () => openForm());
  el('importCatalog').addEventListener('click', async () => { const accepted = await window.appDialog({title:'Import danh mục',html:'<label class="form-field">Tệp CSV<input id="catalogFile" type="file" accept=".csv"></label><p class="muted" style="margin-top:12px;font-size:12px">Tệp gồm các cột: Mã, Tên, Nguồn.</p>',confirmText:'Import'}); if (accepted) showToast('Đã kiểm tra tệp import. Không phát hiện lỗi dữ liệu.'); });
  root.addEventListener('click', event => {
    const target = event.target.closest('[data-action]');
    if (!target) return;
    const item = itemById(target.dataset.id); if (!item) return;
    if (target.dataset.action === 'menu') { const menu = root.querySelector(`[data-menu-id="${item.id}"]`); const opening = menu.hidden; closeMenus(); menu.hidden = !opening; target.setAttribute('aria-expanded', String(opening)); activeMenu = opening ? menu : null; return; }
    closeMenus();
    if (target.dataset.action === 'detail') openDetail(item);
    if (target.dataset.action === 'edit') openForm(item);
    if (target.dataset.action === 'add-child') openForm(null,item.id);
    if (target.dataset.action === 'delete') requestDelete(item);
  });
  document.addEventListener('click', event => { if (activeMenu && !event.target.closest('.action-cell')) closeMenus(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenus(); });
  document.querySelectorAll('[data-close-dialog]').forEach(button => button.addEventListener('click', () => el('catalogDialog').close()));
  document.querySelectorAll('[data-close-detail]').forEach(button => button.addEventListener('click', () => el('detailDialog').close()));
  el('detailEdit').addEventListener('click', event => { const item = itemById(event.currentTarget.dataset.id); el('detailDialog').close(); openForm(item); });
  el('catalogForm').addEventListener('submit', event => { event.preventDefault(); const form = event.currentTarget; const data = Object.fromEntries(new FormData(form)); const duplicate = items.find(item => item.code.toLocaleUpperCase('vi') === data.code.trim().toLocaleUpperCase('vi') && item.id !== data.id); if (duplicate) return showToast('Mã danh mục đã tồn tại.', 'error'); if (data.id) { const item = itemById(data.id); Object.assign(item,{code:data.code.trim().toUpperCase(),name:data.name.trim(),parent:data.parent || null,source:data.source}); } else { const id = `catalog-${Date.now()}`; items.push({id,code:data.code.trim().toUpperCase(),name:data.name.trim(),parent:data.parent || null,source:data.source,icon:'fa-folder',status:'Hoạt động'}); } form.closest('dialog').close(); render(); showToast(data.id ? 'Đã cập nhật danh mục.' : 'Đã thêm danh mục mới.'); });
  document.querySelector('[data-cancel-delete]').addEventListener('click', () => el('deleteDialog').close());
  el('confirmDelete').addEventListener('click', () => { if (!deletingId || childrenOf(deletingId).length) return; const item = itemById(deletingId); items = items.filter(entry => entry.id !== deletingId); expandedIds.delete(deletingId); if (selectedId === deletingId) selectedId = item.parent || items.find(entry => entry.parent === null)?.id || null; el('deleteDialog').close(); render(); showToast(`Đã xóa danh mục ${item.name}.`); deletingId = null; });
  render();
})();
