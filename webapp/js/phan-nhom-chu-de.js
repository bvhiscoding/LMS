(() => {
  const seedTopics = [
    ['Giáo dục chính trị','Các chủ đề về giáo dục chính trị, tư tưởng',12,'Hoạt động'],
    ['Kỹ năng mềm','Các chủ đề về kỹ năng mềm cho cán bộ, học viên',18,'Hoạt động'],
    ['Pháp luật','Tuyên truyền, phổ biến pháp luật',15,'Hoạt động'],
    ['Quốc phòng - An ninh','Các chủ đề về quốc phòng, an ninh',9,'Hoạt động'],
    ['Đoàn thể','Sinh hoạt đoàn thể, phong trào',7,'Hoạt động'],
    ['Lịch sử - Truyền thống','Lịch sử, truyền thống của ngành, đơn vị',11,'Hoạt động'],
    ['Khoa học - Công nghệ','Khoa học, công nghệ, đổi mới sáng tạo',10,'Ngừng hoạt động'],
    ['Y tế - Sức khỏe','Các chủ đề về y tế, sức khỏe',6,'Hoạt động']
  ];
  const seedSpecialties = [
    ['Quản trị và lãnh đạo','Các chuyên đề dành cho cán bộ quản lý, lãnh đạo',8,'Hoạt động'],
    ['Chuyển đổi số','Các chuyên đề về công nghệ và chuyển đổi số',11,'Hoạt động'],
    ['An toàn lao động','Các chuyên đề an toàn, vệ sinh lao động',9,'Hoạt động'],
    ['Văn hóa doanh nghiệp','Các chuyên đề về văn hóa và môi trường làm việc',5,'Hoạt động'],
    ['Nghiệp vụ chuyên môn','Các chuyên đề bồi dưỡng nghiệp vụ theo vị trí',14,'Ngừng hoạt động']
  ];
  const toRecords = (rows) => rows.map((row,index) => ({id:index + 1,name:row[0],description:row[1],count:row[2],status:row[3],order:index + 1}));
  let topicGroups = window.LMSStore.seed('training-topic-groups',toRecords(seedTopics));
  let specialtyGroups = window.LMSStore.seed('training-specialty-groups',toRecords(seedSpecialties));
  const requestedTab = new URLSearchParams(location.search).get('tab');
  let tab = requestedTab === 'specialties' ? 'specialties' : 'topics';
  const $ = (id) => document.getElementById(id),body = $('topicGroupBody');
  if (!body) return;

  const meta = () => tab === 'topics'
    ? {singular:'chủ đề',title:'Chủ đề',store:'training-topic-groups'}
    : {singular:'chuyên đề',title:'Chuyên đề',store:'training-specialty-groups'};
  const list = () => tab === 'topics' ? topicGroups : specialtyGroups;
  const setList = (value) => { if (tab === 'topics') topicGroups = value; else specialtyGroups = value; };
  const esc = (value) => String(value).replace(/[&<>'"]/g,(char) => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
  const normalize = (value) => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').replace(/Đ/g,'D').toLowerCase();
  const toast = (message) => { const node = $('topicToast'); node.textContent = message; node.hidden = false; clearTimeout(toast.timer); toast.timer = setTimeout(() => { node.hidden = true; },2200); };

  function render() {
    const currentMeta = meta(),query = normalize($('groupSearch').value);
    const data = list().filter((item) => !query || normalize(`${item.name} ${item.description}`).includes(query));
    body.innerHTML = data.length ? data.map((item,index) => `<tr><td>${index + 1}</td><td><b>${esc(item.name)}</b></td><td>${esc(item.description)}</td><td>${item.count}</td><td><span class="topic-status ${item.status === 'Hoạt động' ? 'active' : 'inactive'}">${item.status}</span></td><td><div class="topic-actions"><button data-group-action="edit" data-id="${item.id}" aria-label="Sửa"><i class="fa-solid fa-pen"></i></button><button class="delete" data-group-action="delete" data-id="${item.id}" aria-label="Xóa"><i class="fa-regular fa-trash-can"></i></button></div></td></tr>`).join('') : '<tr><td colspan="6" class="topic-empty">Không tìm thấy phân nhóm</td></tr>';
    $('topicGroupSummary').textContent = `Hiển thị ${data.length ? 1 : 0} đến ${data.length} của ${data.length} kết quả`;
    $('groupPageTitle').textContent = `Quản lý phân nhóm ${currentMeta.singular}`;
    $('groupCrumbLabel').textContent = `Phân nhóm ${currentMeta.singular}`;
    $('groupCountHeading').textContent = `Số ${currentMeta.singular}`;
    $('addTopicGroup').querySelector('span').textContent = `Thêm phân nhóm ${currentMeta.singular}`;
    document.querySelectorAll('[data-group-tab]').forEach((button) => button.classList.toggle('active',button.dataset.groupTab === tab));
  }

  function openForm(item) {
    const form = $('topicGroupForm'),current = list();
    form.reset();
    $('topicGroupFormTitle').textContent = `${item ? 'Chỉnh sửa' : 'Thêm'} phân nhóm ${meta().singular}`;
    ['id','name','description','order','status'].forEach((key) => { form.elements[key].value = item?.[key] ?? (key === 'order' ? current.length + 1 : key === 'status' ? 'Hoạt động' : ''); });
    $('groupDescriptionCount').value = form.elements.description.value.length;
    $('topicGroupDrawer').classList.add('open');
  }
  const closeForm = () => $('topicGroupDrawer').classList.remove('open');

  $('groupTypeTabs').addEventListener('click',(event) => { const button = event.target.closest('[data-group-tab]'); if (!button) return; tab = button.dataset.groupTab; history.replaceState(null,'',`?tab=${tab}`); $('groupSearch').value = ''; closeForm(); render(); });
  $('groupSearch').addEventListener('input',render);
  $('resetGroupSearch').addEventListener('click',() => { $('groupSearch').value = ''; render(); });
  $('addTopicGroup').addEventListener('click',() => openForm());
  $('closeTopicGroup').addEventListener('click',closeForm);
  $('cancelTopicGroup').addEventListener('click',closeForm);
  body.addEventListener('click',(event) => {
    const button = event.target.closest('[data-group-action]'); if (!button) return;
    const item = list().find((row) => row.id === Number(button.dataset.id)); if (!item) return;
    if (button.dataset.groupAction === 'edit') openForm(item);
    if (button.dataset.groupAction === 'delete' && window.confirm(`Xóa phân nhóm ${item.name}?`)) { const next = list().filter((row) => row.id !== item.id); setList(next); window.LMSStore.write(meta().store,next); toast('Đã xóa phân nhóm'); render(); }
  });
  $('topicGroupForm').elements.description.addEventListener('input',(event) => { $('groupDescriptionCount').value = event.target.value.length; });
  $('topicGroupForm').addEventListener('submit',(event) => {
    event.preventDefault(); if (!event.currentTarget.reportValidity()) return;
    const data = Object.fromEntries(new FormData(event.currentTarget)),current = list(),existing = current.find((item) => String(item.id) === data.id);
    const record = {name:data.name.trim(),description:data.description.trim(),order:Number(data.order),status:data.status,count:existing?.count || 0};
    if (existing) Object.assign(existing,record); else current.push({id:Math.max(0,...current.map((item) => item.id)) + 1,...record});
    window.LMSStore.write(meta().store,current); closeForm(); toast(existing ? 'Đã cập nhật phân nhóm' : 'Đã thêm phân nhóm'); render();
  });
  console.assert(topicGroups.length && specialtyGroups.length,'Group tabs self-check failed');
  render();
})();
