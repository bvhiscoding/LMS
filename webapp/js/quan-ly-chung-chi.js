(() => {
  const seed = [
    ['CERT-00024','Chứng chỉ hoàn thành khóa Kỹ năng giao tiếp','Dành cho học viên hoàn thành khóa học kỹ năng giao tiếp','Khóa học','Đang sử dụng','10/04/2024 10:30','15/05/2024 14:20',12,'navy'],
    ['CERT-00023','Chứng nhận chuyên gia Quản trị hệ thống','Chứng nhận dành cho chuyên gia quản trị hệ thống','Chứng nhận','Đang sử dụng','05/04/2024 09:15','12/05/2024 11:10',24,'blue'],
    ['CERT-00022','Chứng chỉ Tiếng Anh B1','Chứng chỉ tiếng Anh trình độ B1 theo khung CEFR','Ngoại ngữ','Đang sử dụng','28/03/2024 16:45','01/05/2024 08:30',36,'navy'],
    ['CERT-00021','Chứng chỉ Excel nâng cao','Dành cho học viên hoàn thành khóa Excel nâng cao','Tin học','Đang sử dụng','20/03/2024 14:20','20/04/2024 10:05',24,'green'],
    ['CERT-00020','Chứng nhận An toàn lao động','Chứng nhận đã hoàn thành khóa học An toàn lao động','Chứng nhận','Hết hiệu lực','15/03/2024 11:00','10/04/2024 09:20',12,'red'],
    ['CERT-00019','Chứng chỉ Lập trình Python cơ bản','Chứng chỉ dành cho lập trình Python cơ bản','Tin học','Tạm ngưng','01/03/2024 09:30','05/04/2024 16:40',24,'navy']
  ];
  let certificates = seed.map((row,index) => ({id:index + 1,code:row[0],name:row[1],description:row[2],type:row[3],status:row[4],created:row[5],updated:row[6],validity:row[7],theme:row[8]}));
  const names = ['Chứng chỉ kỹ năng lãnh đạo','Chứng nhận đào tạo nội bộ','Chứng chỉ Tin học văn phòng','Chứng nhận chuyển đổi số'];
  for (let index = 6; index < 24; index += 1) certificates.push({id:index + 1,code:`CERT-${String(24 - index).padStart(5,'0')}`,name:`${names[index % names.length]} ${index + 1}`,description:'Mẫu chứng chỉ sử dụng trong hệ thống đào tạo',type:['Khóa học','Chứng nhận','Ngoại ngữ','Tin học'][index % 4],status:index % 8 === 0 ? 'Tạm ngưng' : 'Đang sử dụng',created:'20/02/2024 09:30',updated:'01/04/2024 10:20',validity:[12,24,36][index % 3],theme:['navy','blue','green','red'][index % 4]});

  certificates = window.LMSStore.seed('certificate-templates',certificates);
  const $ = (id) => document.getElementById(id), body = $('certificateTableBody');
  if (!body) return;
  let page = 1, pageSize = 6, selectedId = certificates[0].id;
  const esc = (value) => String(value).replace(/[&<>'"]/g,(char) => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
  const normalize = (value) => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').replace(/Đ/g,'D').toLowerCase();
  const statusClass = (status) => status === 'Đang sử dụng' ? 'active' : status === 'Tạm ngưng' ? 'paused' : 'expired';
  const filtered = () => { const query = normalize($('certificateSearch').value),type = $('certificateType').value,status = $('certificateStatus').value,validity = $('certificateValidity').value; return certificates.filter((item) => (!query || normalize(`${item.code} ${item.name} ${item.description}`).includes(query)) && (!type || item.type === type) && (!status || item.status === status) && (!validity || item.validity === Number(validity))); };
  const toast = (message) => { const node = $('certificateToast'); node.textContent = message; node.hidden = false; clearTimeout(toast.timer); toast.timer = setTimeout(() => { node.hidden = true; },2200); };
  const closeMenus = () => document.querySelectorAll('[data-certificate-menu]').forEach((menu) => { menu.hidden = true; });
  const persist = () => window.LMSStore.write('certificate-templates',certificates);
  const columnLabels = ['Chọn','Mã mẫu','Tên mẫu chứng chỉ','Loại chứng chỉ','Trạng thái','Ngày tạo','Cập nhật lần cuối','Thao tác'];
  let tableSettings = window.LMSStore.read('certificate-table-settings',{visible:[0,1,2,3,4,5,6,7],density:'comfortable'});
  let pendingCertificateFile = null,removeCurrentCertificateFile = false;
  const formatFileSize = (bytes) => bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1,Math.round(bytes / 1024))} KB`;
  function showCertificateFile(meta) {
    const hasFile = Boolean(meta?.name);
    $('certificateFileDrop').querySelector('.certificate-file-drop').hidden = hasFile;
    $('certificateFileSelected').hidden = !hasFile;
    $('certificateFileName').textContent = hasFile ? meta.name : '';
    $('certificateFileSize').textContent = hasFile ? `${formatFileSize(meta.size || 0)} · ${meta.type || 'Tệp chứng chỉ'}` : '';
  }
  function acceptCertificateFile(file) {
    const allowed = /\.(pdf|doc|docx|png|jpe?g)$/i.test(file?.name || '');
    if (!allowed) { toast('Chỉ hỗ trợ tệp PDF, DOC, DOCX, PNG hoặc JPG'); return false; }
    if (file.size > 10 * 1024 * 1024) { toast('Tệp chứng chỉ không được vượt quá 10MB'); return false; }
    pendingCertificateFile = file; removeCurrentCertificateFile = false;
    showCertificateFile({name:file.name,size:file.size,type:file.type || file.name.split('.').pop().toUpperCase()});
    return true;
  }
  function applyTableSettings() {
    const table = body.closest('table');
    [...table.rows].forEach((row) => [...row.cells].forEach((cell,index) => { cell.hidden = !tableSettings.visible.includes(index); }));
    document.querySelector('.certificate-table-card').classList.toggle('compact',tableSettings.density === 'compact');
    document.querySelectorAll('[data-density]').forEach((button) => button.classList.toggle('active',button.dataset.density === tableSettings.density));
  }

  function preview() {
    const item = certificates.find((row) => row.id === selectedId) || certificates[0];
    if (!item) { $('certificatePreviewMeta').innerHTML = '<dd>Chưa có mẫu chứng chỉ</dd>'; return; }
    selectedId = item.id; $('certificateArt').dataset.theme = item.theme; $('certificateCoursePreview').textContent = item.name.replace(/^Chứng (chỉ|nhận)\s*/i,'');
    $('certificatePreviewMeta').innerHTML = `<dt>Mã mẫu</dt><dd>${esc(item.code)}</dd><dt>Tên mẫu</dt><dd>${esc(item.name)}</dd><dt>Loại chứng chỉ</dt><dd>${esc(item.type)}</dd><dt>Trạng thái</dt><dd><span class="certificate-status ${statusClass(item.status)}">${esc(item.status)}</span></dd><dt>Kích thước</dt><dd>29.7 x 21 cm (A4 ngang)</dd><dt>Nền mẫu</dt><dd>${esc(item.theme)}</dd><dt>Tệp mẫu</dt><dd>${item.fileName ? esc(item.fileName) : 'Chưa tải lên'}</dd><dt>Hiệu lực</dt><dd>${item.validity} tháng kể từ ngày cấp</dd><dt>Mô tả</dt><dd>${esc(item.description)}</dd><dt>Ngày tạo</dt><dd>${esc(item.created)}</dd><dt>Cập nhật lần cuối</dt><dd>${esc(item.updated)}</dd>`;
  }
  function render() {
    const data = filtered(),pages = Math.max(1,Math.ceil(data.length / pageSize)); page = Math.min(page,pages); const rows = data.slice((page - 1) * pageSize,page * pageSize);
    if (!certificates.some((item) => item.id === selectedId)) selectedId = certificates[0]?.id;
    body.innerHTML = rows.length ? rows.map((item) => `<tr data-select-id="${item.id}" class="${item.id === selectedId ? 'selected' : ''}"><td><input type="checkbox" data-check-certificate="${item.id}" aria-label="Chọn ${esc(item.name)}"></td><td><b>${esc(item.code)}</b></td><td class="certificate-template-name"><b>${esc(item.name)}</b><span>Mô tả: ${esc(item.description)}</span></td><td>${esc(item.type)}</td><td><span class="certificate-status ${statusClass(item.status)}">${esc(item.status)}</span></td><td>${esc(item.created).replace(' ','<br>')}</td><td>${esc(item.updated).replace(' ','<br>')}</td><td><div class="certificate-row-actions"><button data-action="view" data-id="${item.id}" aria-label="Xem"><i class="fa-regular fa-eye"></i></button><button data-action="edit" data-id="${item.id}" aria-label="Sửa"><i class="fa-solid fa-pen"></i></button><span><button data-action="more" data-id="${item.id}" aria-label="Thêm"><i class="fa-solid fa-ellipsis-vertical"></i></button><div class="certificate-row-menu" data-certificate-menu="${item.id}" hidden><button data-action="duplicate" data-id="${item.id}">Sao chép mẫu</button><button data-action="toggle" data-id="${item.id}">${item.status === 'Tạm ngưng' ? 'Kích hoạt' : 'Tạm ngưng'}</button></div></span></div></td></tr>`).join('') : '<tr><td colspan="8" class="certificate-empty">Không tìm thấy mẫu chứng chỉ phù hợp</td></tr>';
    const first = data.length ? (page - 1) * pageSize + 1 : 0,last = Math.min(page * pageSize,data.length); $('certificateSummary').textContent = `Hiển thị ${first} - ${last} trong tổng số ${data.length}`; $('certificateCount').textContent = `(${data.length})`;
    $('certificatePagination').innerHTML = `<button class="certificate-page-button" data-page="${page - 1}" ${page === 1 ? 'disabled' : ''}><i class="fa-solid fa-chevron-left"></i></button>${Array.from({length:pages},(_,index) => `<button class="certificate-page-button ${index + 1 === page ? 'active' : ''}" data-page="${index + 1}">${index + 1}</button>`).join('')}<button class="certificate-page-button" data-page="${page + 1}" ${page === pages ? 'disabled' : ''}><i class="fa-solid fa-chevron-right"></i></button>`;
    $('selectAllCertificates').checked = false; applyTableSettings(); preview();
  }
  function openForm(item) {
    const form = $('certificateForm'); form.reset(); $('certificateDialogTitle').textContent = item ? 'Sửa mẫu chứng chỉ' : 'Tạo mẫu chứng chỉ';
    pendingCertificateFile = null; removeCurrentCertificateFile = false;
    ['id','code','name','type','status','validity','theme','description'].forEach((key) => { form.elements[key].value = item?.[key] ?? (key === 'code' ? `CERT-${String(certificates.length + 1).padStart(5,'0')}` : key === 'status' ? 'Đang sử dụng' : key === 'validity' ? '12' : key === 'theme' ? 'navy' : ''); });
    showCertificateFile(item?.fileName ? {name:item.fileName,size:item.fileSize,type:item.fileType} : null); $('certificateDialog').showModal();
  }
  async function removeSelected() { const item = certificates.find((row) => row.id === selectedId); if (!item) return; const accepted = await window.appDialog({title:'Xóa mẫu chứng chỉ',html:`<p class="app-dialog-danger"><b>${esc(item.code)} · ${esc(item.name)}</b></p><p>Mẫu sẽ bị xóa khỏi danh sách cấu hình. Các chứng chỉ đã cấp trước đây vẫn được giữ nguyên để tra cứu.</p>`,confirmText:'Xóa mẫu',cancelText:'Hủy'}); if (!accepted) return; certificates = certificates.filter((row) => row.id !== item.id); persist(); selectedId = certificates[0]?.id; toast('Đã xóa mẫu chứng chỉ'); render(); }

  ['certificateSearch','certificateType','certificateStatus','certificateValidity'].forEach((id) => $(id).addEventListener(id === 'certificateSearch' ? 'input' : 'change',() => { page = 1; render(); }));
  $('applyCertificateFilters').addEventListener('click',() => { page = 1; render(); toast('Đã áp dụng bộ lọc'); });
  $('resetCertificateFilters').addEventListener('click',() => { ['certificateSearch','certificateType','certificateStatus','certificateValidity'].forEach((id) => { $(id).value = ''; }); page = 1; render(); });
  $('certificatePagination').addEventListener('click',(event) => { const button = event.target.closest('[data-page]'); if (!button || button.disabled) return; page = Number(button.dataset.page); render(); });
  $('certificatePageSize').addEventListener('change',(event) => { pageSize = Number(event.target.value); page = 1; render(); });
  $('selectAllCertificates').addEventListener('change',(event) => body.querySelectorAll('[data-check-certificate]').forEach((box) => { box.checked = event.target.checked; }));
  body.addEventListener('click',(event) => { const actionButton = event.target.closest('[data-action]'),row = event.target.closest('[data-select-id]'); if (row && !event.target.closest('input,button,.certificate-row-menu')) { selectedId = Number(row.dataset.selectId); render(); return; } if (!actionButton) return; const item = certificates.find((record) => record.id === Number(actionButton.dataset.id)); if (!item) return; const action = actionButton.dataset.action; if (action === 'more') { const menu = document.querySelector(`[data-certificate-menu="${item.id}"]`),opening = menu.hidden; closeMenus(); menu.hidden = !opening; return; } closeMenus(); if (action === 'view') { selectedId = item.id; render(); } if (action === 'edit') openForm(item); if (action === 'duplicate') { const copy = {...item,id:Math.max(...certificates.map((row) => row.id)) + 1,code:`${item.code}-COPY`,name:`${item.name} - Bản sao`}; certificates.unshift(copy); persist(); selectedId = copy.id; page = 1; toast('Đã sao chép mẫu'); render(); } if (action === 'toggle') { item.status = item.status === 'Tạm ngưng' ? 'Đang sử dụng' : 'Tạm ngưng'; persist(); toast(`Đã chuyển sang ${item.status.toLowerCase()}`); render(); } });
  document.addEventListener('click',(event) => { if (!event.target.closest('.certificate-row-actions')) closeMenus(); });
  document.querySelector('.certificate-table-head').addEventListener('click',(event) => { const button = event.target.closest('[data-density]'); if (!button) return; tableSettings.density=button.dataset.density; window.LMSStore.write('certificate-table-settings',tableSettings); applyTableSettings(); });
  $('certificateSettings').addEventListener('click',async() => { const accepted=await window.appDialog({title:'Thiết lập bảng chứng chỉ',html:`<p class="app-dialog-note">Chọn các cột cần hiển thị. Mã mẫu, tên mẫu và thao tác luôn được giữ để bảng vẫn sử dụng được.</p><div class="app-check-grid">${columnLabels.map((label,index)=>`<label><input type="checkbox" data-certificate-column="${index}" ${tableSettings.visible.includes(index)?'checked':''} ${[1,2,7].includes(index)?'disabled':''}><span><b>${label}</b><small>Cột ${index+1}</small></span></label>`).join('')}</div><label class="field">Mật độ dòng<select id="certificateDensity"><option value="comfortable" ${tableSettings.density==='comfortable'?'selected':''}>Thoáng</option><option value="compact" ${tableSettings.density==='compact'?'selected':''}>Gọn</option></select></label>`,confirmText:'Lưu thiết lập',cancelText:'Hủy'});if(!accepted)return;const visible=[...document.querySelectorAll('[data-certificate-column]')].filter(input=>input.checked||input.disabled).map(input=>Number(input.dataset.certificateColumn));tableSettings={visible:[...new Set(visible)],density:document.getElementById('certificateDensity').value};window.LMSStore.write('certificate-table-settings',tableSettings);applyTableSettings();toast('Đã lưu thiết lập bảng chứng chỉ'); });
  $('addCertificate').addEventListener('click',() => openForm()); $('editSelectedCertificate').addEventListener('click',() => openForm(certificates.find((row) => row.id === selectedId))); $('deleteSelectedCertificate').addEventListener('click',removeSelected);
  document.querySelectorAll('[data-close-certificate]').forEach((button) => button.addEventListener('click',() => $('certificateDialog').close())); $('certificateDialog').addEventListener('click',(event) => { if (event.target === $('certificateDialog')) $('certificateDialog').close(); });
  $('certificateTemplateFile').addEventListener('change',(event) => { const file=event.target.files[0];if(file&&!acceptCertificateFile(file))event.target.value=''; });
  ['dragenter','dragover'].forEach((type)=>$('certificateFileDrop').addEventListener(type,(event)=>{event.preventDefault();event.currentTarget.classList.add('dragging')}));
  ['dragleave','drop'].forEach((type)=>$('certificateFileDrop').addEventListener(type,(event)=>{event.preventDefault();event.currentTarget.classList.remove('dragging')}));
  $('certificateFileDrop').addEventListener('drop',(event)=>{const file=event.dataTransfer.files[0];if(file)acceptCertificateFile(file)});
  $('removeCertificateFile').addEventListener('click',(event)=>{event.preventDefault();event.stopPropagation();pendingCertificateFile=null;removeCurrentCertificateFile=true;$('certificateTemplateFile').value='';showCertificateFile(null)});
  $('certificateForm').addEventListener('submit',(event) => {
    event.preventDefault(); if (!event.currentTarget.reportValidity()) return;
    const data = Object.fromEntries(new FormData(event.currentTarget)),duplicate = certificates.some((item) => item.code.toLowerCase() === data.code.trim().toLowerCase() && String(item.id) !== data.id);
    event.currentTarget.elements.code.setCustomValidity(duplicate ? 'Mã mẫu đã tồn tại.' : ''); if (!event.currentTarget.reportValidity()) return;
    const existing = certificates.find((item) => String(item.id) === data.id),fileMeta = pendingCertificateFile ? {fileName:pendingCertificateFile.name,fileSize:pendingCertificateFile.size,fileType:pendingCertificateFile.type || pendingCertificateFile.name.split('.').pop().toUpperCase()} : removeCurrentCertificateFile ? {fileName:'',fileSize:0,fileType:''} : {fileName:existing?.fileName || '',fileSize:existing?.fileSize || 0,fileType:existing?.fileType || ''},record = {code:data.code.trim(),name:data.name.trim(),description:data.description.trim(),type:data.type,status:data.status,validity:Number(data.validity),theme:data.theme,...fileMeta,updated:new Date().toLocaleString('vi-VN'),created:existing?.created || new Date().toLocaleString('vi-VN')};
    if (existing) Object.assign(existing,record); else { const item = {id:(Math.max(0,...certificates.map((row) => row.id)) + 1),...record}; certificates.unshift(item); selectedId = item.id; }
    persist(); $('certificateDialog').close(); page = 1; toast(existing ? 'Đã cập nhật mẫu chứng chỉ' : 'Đã tạo mẫu chứng chỉ'); render();
  });
  $('certificateForm').elements.code.addEventListener('input',(event) => event.target.setCustomValidity(''));
  console.assert(certificates.length === 24,'Certificate mock data self-check failed'); render();
})();
