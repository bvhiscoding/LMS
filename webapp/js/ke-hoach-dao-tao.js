(() => {
  const base = [
    ['KH-2026-11','Kế hoạch đào tạo chuyển đổi số 2026','2026','Trung tâm CNTT',3,320,'1,25 tỷ','Đang triển khai'],
    ['KH-2026-10','Kế hoạch kỹ năng số cho cán bộ quản lý','2026','Trung tâm QLCL',5,450,'520 triệu','Chờ phê duyệt'],
    ['KH-2026-09','Đào tạo an toàn thông tin cơ bản','2026','Phòng Đào tạo',4,280,'380 triệu','Đang triển khai'],
    ['KH-2026-08','Bồi dưỡng nghiệp vụ giảng viên','2026','Phòng Đào tạo',6,210,'460 triệu','Đã hoàn thành'],
    ['KH-2026-07','Đào tạo quản lý dự án chuyên nghiệp','2026','Trung tâm CNTT',2,120,'300 triệu','Bản nháp'],
    ['KH-2025-16','Nâng cao kỹ năng phân tích dữ liệu','2025','Trung tâm CNTT',4,190,'410 triệu','Đã hoàn thành']
  ];
  const data = Array.from({length:24},(_,index) => {
    const row = [...base[index % base.length]];
    if (index >= base.length) row[0] = `KH-${2026 - Math.floor(index / 12)}-${String(30 - index).padStart(2,'0')}`;
    return row;
  });
  const form = document.querySelector('#planFilters'),body = document.querySelector('#planBody'),pages = document.querySelector('#planPages'),summary = document.querySelector('#planSummary'),compareDialog = document.querySelector('#planCompareDialog'),compareSelect = document.querySelector('#comparePlanSelect'),proposalDialog=document.querySelector('#planProposalDialog'),proposalForm=document.querySelector('#planProposalForm');
  let page = 1;
  const cls = (status) => status === 'Đang triển khai' ? 'blue' : status === 'Chờ phê duyệt' ? 'amber' : status === 'Đã hoàn thành' ? 'green' : '';
  const escapeHtml = (value) => String(value).replace(/[&<>'"]/g,(char) => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
  const toast = (message) => { const node = document.querySelector('#planToast'); node.textContent = message; node.hidden = false; clearTimeout(toast.timer); toast.timer = setTimeout(() => { node.hidden = true; },1800); };
  function renderPlanCharts() {
    if (typeof Chart === 'undefined') return;
    Chart.defaults.font.family = "'Be Vietnam Pro', system-ui, sans-serif"; Chart.defaults.color='#69778d';
    const common={responsive:true,maintainAspectRatio:false,animation:{duration:500},plugins:{tooltip:{backgroundColor:'#172b4d',padding:9,cornerRadius:6}}};
    const centerText={id:'planCenterText',afterDraw(chart){if(chart.config.type!=='doughnut')return;const {ctx,chartArea:{left,right,top,bottom}}=chart,x=(left+right)/2,y=(top+bottom)/2;ctx.save();ctx.textAlign='center';ctx.fillStyle='#173057';ctx.font="700 18px 'Be Vietnam Pro'";ctx.fillText('62,5%',x,y-3);ctx.fillStyle='#71809a';ctx.font="8px 'Be Vietnam Pro'";ctx.fillText('Hoàn thành chung',x,y+14);ctx.restore();}};
    const valueLabels={id:'planValueLabels',afterDatasetsDraw(chart){if(chart.canvas.id!=='planBudgetChart')return;const {ctx}=chart;ctx.save();ctx.fillStyle='#263853';ctx.font="600 9px 'Be Vietnam Pro'";chart.getDatasetMeta(0).data.forEach((bar,index)=>ctx.fillText(['12,45','7,78','4,67'][index],bar.x+8,bar.y+3));ctx.restore();}};
    new Chart(document.querySelector('#planExecutionChart'),{type:'doughnut',data:{labels:['Đã hoàn thành · 7 kế hoạch','Đang triển khai · 12 kế hoạch','Chưa hoàn thành · 5 kế hoạch','Chưa triển khai · 0 kế hoạch'],datasets:[{data:[29.17,50,20.83,0],backgroundColor:['#4b8df6','#3ebe82','#f6a442','#ff646b'],borderWidth:0,cutout:'68%'}]},options:{...common,layout:{padding:6},plugins:{...common.plugins,legend:{position:'right',labels:{usePointStyle:true,pointStyle:'circle',boxWidth:7,boxHeight:7,padding:14,font:{size:8}}}}},plugins:[centerText]});
    new Chart(document.querySelector('#planProgressChart'),{type:'line',data:{labels:['01','02','03','04','05','06','07','08','09','10','11','12/2026'],datasets:[{label:'Thực tế',data:[10,18,25,33,40,48,55,62,70,70,78,86],borderColor:'#2879ed',backgroundColor:'#2879ed',borderWidth:2.5,tension:.25,pointRadius:2,pointBackgroundColor:'#fff',pointBorderWidth:1.5},{label:'Kế hoạch',data:[15,22,30,38,45,52,60,67,75,82,90,100],borderColor:'#79aef5',backgroundColor:'#79aef5',borderDash:[5,4],borderWidth:2,tension:.25,pointRadius:0}]},options:{...common,plugins:{...common.plugins,legend:{position:'bottom',labels:{usePointStyle:true,boxWidth:7,font:{size:8}}}},scales:{x:{grid:{display:false},border:{display:false},ticks:{font:{size:7}}},y:{min:0,max:100,grid:{color:'#e8edf4'},border:{display:false},ticks:{stepSize:25,callback:(value)=>`${value}%`,font:{size:7}}}}}});
    new Chart(document.querySelector('#planBudgetChart'),{type:'bar',data:{labels:['Kinh phí kế hoạch','Đã sử dụng','Còn lại'],datasets:[{data:[12.45,7.78,4.67],backgroundColor:['#2879ed','#4d8eea','#8bb5ef'],borderRadius:7,barThickness:10}]},options:{...common,indexAxis:'y',layout:{padding:{right:35}},plugins:{...common.plugins,legend:{display:false}},scales:{x:{min:0,max:15,grid:{display:false},border:{display:false},ticks:{display:false}},y:{grid:{display:false},border:{display:false},ticks:{color:'#52627b',font:{size:8}}}}},plugins:[valueLabels]});
  }
  const closeMenus = () => {
    document.querySelectorAll('.plan-action-menu').forEach((menu) => { menu.hidden = true; });
    document.querySelectorAll('.plan-action-toggle').forEach((button) => button.setAttribute('aria-expanded','false'));
  };
  function filtered() {
    const filters = new FormData(form),query = (filters.get('q') || '').toLowerCase();
    return data.filter((row) => (!query || `${row[0]} ${row[1]}`.toLowerCase().includes(query)) && (!filters.get('year') || row[2] === filters.get('year')) && (!filters.get('unit') || row[3] === filters.get('unit')) && (!filters.get('status') || row[7] === filters.get('status')));
  }
  function openMenu(button) {
    const menu = document.getElementById(button.getAttribute('aria-controls')),shouldOpen = menu.hidden;
    closeMenus();
    if (!shouldOpen) return;
    menu.hidden = false; button.setAttribute('aria-expanded','true');
    const rect = button.getBoundingClientRect(),openUp = rect.bottom + menu.offsetHeight + 8 > window.innerHeight;
    menu.style.top = `${openUp ? rect.top - menu.offsetHeight - 6 : rect.bottom + 6}px`;
    menu.style.left = `${Math.max(12,rect.right - menu.offsetWidth)}px`;
  }
  function render() {
    closeMenus();
    const rows = filtered(),size = 8,total = Math.max(1,Math.ceil(rows.length / size));
    page = Math.min(page,total);
    body.innerHTML = rows.slice((page - 1) * size,page * size).map((row) => `<tr><td><b>${escapeHtml(row[0])}</b></td><td>${escapeHtml(row[1])}</td><td>${row[2]}</td><td>${escapeHtml(row[3])}</td><td>${row[4]}</td><td>${row[5]}</td><td>${escapeHtml(row[6])}</td><td><span class="status ${cls(row[7])}">${escapeHtml(row[7])}</span></td><td><div class="plan-row-actions"><button type="button" class="plan-action-toggle" data-plan-action="menu" data-code="${escapeHtml(row[0])}" aria-label="Thao tác với ${escapeHtml(row[1])}" aria-expanded="false" aria-controls="plan-menu-${escapeHtml(row[0])}"><i class="fa-solid fa-ellipsis"></i></button><div class="plan-action-menu" id="plan-menu-${escapeHtml(row[0])}" hidden><a href="chi-tiet-ke-hoach.html"><i class="fa-regular fa-eye"></i>Chi tiết</a><a href="them-ke-hoach.html"><i class="fa-regular fa-pen-to-square"></i>Chỉnh sửa</a><button type="button" data-plan-action="proposal" data-code="${escapeHtml(row[0])}"><i class="fa-regular fa-message"></i>Đề xuất chỉnh sửa</button><button type="button" data-plan-action="compare" data-code="${escapeHtml(row[0])}"><i class="fa-solid fa-scale-balanced"></i>So sánh kế hoạch – thực tế</button><button type="button" data-plan-action="copy" data-code="${escapeHtml(row[0])}"><i class="fa-regular fa-copy"></i>Sao chép</button><button type="button" class="danger" data-plan-action="delete" data-code="${escapeHtml(row[0])}"><i class="fa-regular fa-trash-can"></i>Xóa</button></div></div></td></tr>`).join('') || '<tr><td colspan="9">Không tìm thấy kế hoạch phù hợp</td></tr>';
    summary.textContent = `Hiển thị ${rows.length ? ((page - 1) * size + 1) : 0} - ${Math.min(page * size,rows.length)} trong ${rows.length} kế hoạch`;
    pages.innerHTML = Array.from({length:total},(_,index) => `<button class="page-btn ${index + 1 === page ? 'active' : ''}" data-page="${index + 1}">${index + 1}</button>`).join('');
  }
  form.addEventListener('input',() => { page = 1; render(); });
  form.addEventListener('reset',() => setTimeout(() => { page = 1; render(); }));
  pages.addEventListener('click',(event) => { const button = event.target.closest('[data-page]'); if (button) { page = Number(button.dataset.page); render(); } });
  body.addEventListener('click',async(event) => {
    const button = event.target.closest('[data-plan-action]'); if (!button) return;
    const action = button.dataset.planAction,code = button.dataset.code;
    if (action === 'menu') { openMenu(button); return; }
    closeMenus();
    if(action==='proposal'){
      const row=data.find((item)=>item[0]===code);if(!row)return;proposalForm.reset();proposalForm.elements.code.value=row[0];document.querySelector('#planProposalName').textContent=row[1];document.querySelector('#planProposalMeta').textContent=`${row[0]} · ${row[3]} · ${row[2]}`;document.querySelector('#planProposalContentCount').value=0;document.querySelector('#planProposalReasonCount').value=0;proposalDialog.showModal();return;
    }
    if (action === 'compare') {
      compareSelect.innerHTML=data.map((row) => `<option value="${escapeHtml(row[0])}" ${row[0]===code?'selected':''}>${escapeHtml(row[0])} – ${escapeHtml(row[1])}</option>`).join('');
      const row=data.find((item)=>item[0]===code); document.querySelector('#comparePlanSub').textContent=row ? `${row[0]} · ${row[1]} · ${row[3]}` : 'Chi tiết mức độ thực hiện kế hoạch đào tạo';
      compareDialog.showModal(); return;
    }
    if (action === 'copy') toast(`Đã sao chép ${code}`);
    if (action === 'delete') {
      const row = data.find((item) => item[0] === code); if (!row) return;
      const accepted = window.appDialog ? await window.appDialog({title:'Xóa kế hoạch đào tạo',html:`<p class="app-dialog-danger">Bạn có chắc muốn xóa <b>${escapeHtml(row[0])} · ${escapeHtml(row[1])}</b>?</p>`,confirmText:'Xóa',cancelText:'Hủy'}) : window.confirm(`Xóa kế hoạch ${row[1]}?`);
      if (accepted) { data.splice(data.indexOf(row),1); render(); toast(`Đã xóa ${code}`); }
    }
  });
  document.addEventListener('click',(event) => { if (!event.target.closest('.plan-row-actions')) closeMenus(); });
  document.addEventListener('keydown',(event) => { if (event.key === 'Escape') closeMenus(); });
  document.addEventListener('scroll',closeMenus,true);
  window.addEventListener('resize',closeMenus);
  compareSelect.addEventListener('change',() => { const row=data.find((item)=>item[0]===compareSelect.value); if(row) document.querySelector('#comparePlanSub').textContent=`${row[0]} · ${row[1]} · ${row[3]}`; });
  compareDialog.addEventListener('click',(event) => { if(event.target===compareDialog) compareDialog.close(); });
  document.querySelectorAll('[data-close-plan-proposal]').forEach((button)=>button.addEventListener('click',()=>proposalDialog.close()));
  proposalDialog.addEventListener('click',(event)=>{if(event.target===proposalDialog)proposalDialog.close()});
  proposalForm.querySelectorAll('textarea').forEach((textarea)=>textarea.addEventListener('input',()=>{document.querySelector(textarea.name==='content'?'#planProposalContentCount':'#planProposalReasonCount').value=textarea.value.length}));
  proposalForm.addEventListener('submit',(event)=>{event.preventDefault();if(!event.currentTarget.reportValidity())return;const formData=Object.fromEntries(new FormData(event.currentTarget)),row=data.find((item)=>item[0]===formData.code),proposal={id:Date.now(),planCode:formData.code,planName:row?.[1]||'',category:formData.category,priority:formData.priority,content:formData.content.trim(),reason:formData.reason.trim(),dueDate:formData.dueDate,proposedBy:'Nguyễn Văn An',status:'Chờ xem xét',createdAt:new Date().toISOString()};window.LMSStore.save('plan-change-proposals',proposal);proposalDialog.close();toast(`Đã gửi đề xuất chỉnh sửa ${formData.code}`)});
  renderPlanCharts();
  render();
})();
