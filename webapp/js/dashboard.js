(() => {
  if (typeof Chart === 'undefined') return;
  const root = document.querySelector('[data-dashboard]');
  if (!root) return;

  Chart.defaults.font.family = "'Be Vietnam Pro', system-ui, sans-serif";
  Chart.defaults.font.size = 10;
  Chart.defaults.color = '#68758a';
  const blue = '#1676e7', green = '#23a86b', amber = '#f0a31f', purple = '#8655d9', red = '#e95d4d', grid = '#edf0f5';
  const common = { responsive: true, maintainAspectRatio: false, interaction: { mode: 'index', intersect: false }, plugins: { legend: { display: false }, tooltip: { backgroundColor: '#172b4d', padding: 10, cornerRadius: 7 } } };
  const canvas = id => document.getElementById(id);
  const charts = [];
  const make = (id, config) => { if (canvas(id)) charts.push(new Chart(canvas(id), config)); };
  const xy = { x: { grid: { display: false }, border: { display: false }, ticks: { color: '#8a94a6' } }, y: { beginAtZero: true, grid: { color: grid }, border: { display: false }, ticks: { color: '#8a94a6' } } };

  if (root.dataset.dashboard === 'student') {
    make('studentActivityChart', { type: 'line', data: { labels: ['T2','T3','T4','T5','T6','T7','CN'], datasets: [{ label: 'Phút học', data: [42,65,38,82,74,96,54], borderColor: blue, backgroundColor: 'rgba(22,118,231,.12)', fill: true, tension: .38, pointRadius: 3, pointBackgroundColor: '#fff', pointBorderWidth: 2 }, { label: 'Mục tiêu', data: [60,60,60,60,60,60,60], borderColor: amber, borderDash: [5,5], pointRadius: 0, tension: 0 }] }, options: { ...common, scales: xy, plugins: { ...common.plugins, legend: { display: true, position: 'bottom', labels: { usePointStyle: true, boxWidth: 7 } } } } });
    make('studentCompletionChart', { type: 'doughnut', data: { labels: ['Hoàn thành','Đang học','Chưa bắt đầu'], datasets: [{ data: [12,4,2], backgroundColor: [green,blue,'#e6ebf2'], borderWidth: 0, cutout: '72%' }] }, options: { ...common, plugins: { ...common.plugins, tooltip: { enabled: true } } } });
    make('studentCourseChart', { type: 'bar', data: { labels: ['An toàn lao động','Quản trị kinh doanh','Kỹ năng lãnh đạo','Tin học văn phòng','Ngoại ngữ B1'], datasets: [{ data: [82,75,58,91,46], backgroundColor: [blue,'#458de5',purple,green,amber], borderRadius: 6, barThickness: 15 }] }, options: { ...common, indexAxis: 'y', scales: { x: { min: 0, max: 100, grid: { color: grid }, border: { display:false }, ticks: { callback: value => value + '%' } }, y: { grid: { display:false }, border: { display:false } } } } });
    make('studentScoreChart', { type: 'bar', data: { labels: ['T1','T2','T3','T4','T5','T6'], datasets: [{ label: 'Điểm bài kiểm tra', data: [72,78,74,86,82,88], backgroundColor: 'rgba(22,118,231,.78)', borderRadius: 5 }, { label: 'Điểm trung bình', data: [76,76,77,79,80,82], type: 'line', borderColor: amber, tension: .35, pointRadius: 2 }] }, options: { ...common, scales: { ...xy, y: { ...xy.y, suggestedMax: 100 } }, plugins: { ...common.plugins, legend: { display:true, position:'bottom', labels:{usePointStyle:true,boxWidth:7} } } } });
    make('studentSkillChart', { type: 'radar', data: { labels: ['Chuyên môn','An toàn','Số hóa','Giao tiếp','Quản lý','Ngoại ngữ'], datasets: [{ label:'Hiện tại', data:[82,90,68,76,64,58], borderColor:blue, backgroundColor:'rgba(22,118,231,.14)', pointBackgroundColor:blue }, { label:'Mục tiêu', data:[90,90,80,85,75,70], borderColor:green, borderDash:[4,4], backgroundColor:'transparent', pointRadius:1 }] }, options: { ...common, scales: { r: { beginAtZero:true, max:100, ticks:{display:false}, grid:{color:grid}, angleLines:{color:grid}, pointLabels:{font:{size:9}} } }, plugins:{...common.plugins,legend:{display:true,position:'bottom',labels:{usePointStyle:true,boxWidth:7}}} } });
  }

  const tableRows = () => [...root.querySelectorAll('table tr')].map(row => [...row.cells].map(cell => cell.innerText.trim()));
  const exportDashboard = () => {
    const rows = tableRows();
    if (!rows.length) rows.push(['Chỉ số', 'Giá trị'], ...[...root.querySelectorAll('.dash-kpi, .stat')].map(card => [card.querySelector('span,.lab')?.innerText || 'KPI', card.querySelector('strong,.val')?.innerText || '']));
    window.downloadCsv?.(`${root.dataset.dashboard}-${new Date().toISOString().slice(0, 10)}.csv`, rows);
  };

  root.querySelectorAll('select').forEach(select => select.addEventListener('change', () => {
    const factor = 1 - Math.min(select.selectedIndex, 3) * .08;
    charts.forEach(chart => {
      chart.data.datasets.forEach(dataset => {
        if (!dataset._baseline) dataset._baseline = dataset.data.map(value => typeof value === 'number' ? value : value);
        dataset.data = dataset._baseline.map(value => typeof value === 'number' ? Math.round(value * factor * 10) / 10 : value);
      });
      chart.update();
    });
    root.querySelectorAll('.dash-kpi strong, .stat .val').forEach(value => {
      if (!value.dataset.baseline) value.dataset.baseline = value.textContent;
      const number = Number(value.dataset.baseline.replace(/[^\d.]/g, ''));
      if (Number.isFinite(number)) value.textContent = value.dataset.baseline.includes('%') ? `${Math.round(number * factor)}%` : Math.round(number * factor).toLocaleString('vi-VN');
    });
    window.showAppToast?.(`Đã cập nhật dữ liệu theo “${select.options[select.selectedIndex].text}”.`);
  }));

  root.querySelectorAll('button').forEach(button => {
    const label = button.textContent.trim().toLocaleLowerCase('vi');
    if (label.includes('xuất báo cáo')) button.addEventListener('click', exportDashboard);
    if (label.includes('xuất pdf') || label.includes('in / lưu pdf')) button.addEventListener('click', () => window.print());
    if (label.includes('bộ lọc')) button.addEventListener('click', async () => {
      const confirmed = await window.appDialog?.({ title: 'Bộ lọc báo cáo', html: '<div class="field"><label>Phạm vi dữ liệu</label><select id="dashboardScope"><option>Toàn trường</option><option>Khối khai thác</option><option>Khối văn phòng</option></select></div><p class="muted">Bộ lọc sẽ cập nhật tất cả biểu đồ trên trang.</p>', confirmText: 'Áp dụng' });
      if (confirmed) root.querySelector('select')?.dispatchEvent(new Event('change'));
    });
    if (label.includes('tùy chỉnh cột')) button.addEventListener('click', async () => {
      const table = root.querySelector('table');
      if (!table) return;
      const headings = [...table.querySelectorAll('th')];
      const html = `<div class="app-column-picker">${headings.map((heading, index) => `<label><input type="checkbox" data-column="${index}" checked> ${heading.textContent}</label>`).join('')}</div>`;
      const accepted = await window.appDialog?.({ title: 'Tùy chỉnh cột', html, confirmText: 'Áp dụng' });
      if (!accepted) return;
      document.querySelectorAll('#appDialog [data-column]').forEach(input => {
        table.querySelectorAll('tr').forEach(row => row.cells[input.dataset.column]?.toggleAttribute('hidden', !input.checked));
      });
    });
    if (label.includes('sắp xếp')) button.addEventListener('click', () => {
      const tbody = root.querySelector('table tbody');
      if (!tbody) return;
      const rows = [...tbody.rows].reverse();
      rows.forEach(row => tbody.appendChild(row));
      button.classList.toggle('is-reversed');
      window.showAppToast?.(`Đã sắp xếp ${button.classList.contains('is-reversed') ? 'tăng dần' : 'giảm dần'}.`);
    });
  });

  if (root.dataset.dashboard === 'instructor') {
    make('teacherActivityChart', { type:'line', data:{ labels:['T2','T3','T4','T5','T6','T7','CN'], datasets:[{label:'Học viên hoạt động',data:[186,214,198,248,231,172,126],borderColor:blue,backgroundColor:'rgba(22,118,231,.1)',fill:true,tension:.38},{label:'Bài hoàn thành',data:[92,118,104,146,138,81,62],borderColor:green,tension:.38}] }, options:{...common,scales:xy,plugins:{...common.plugins,legend:{display:true,position:'bottom',labels:{usePointStyle:true,boxWidth:7}}}} });
    make('teacherContentChart', { type:'doughnut', data:{labels:['Đã xuất bản','Bản nháp','Chờ duyệt','Cần cập nhật'],datasets:[{data:[68,12,7,5],backgroundColor:[green,'#a9b6c8',amber,red],borderWidth:0,cutout:'70%'}]},options:common });
    make('teacherClassChart', { type:'bar', data:{labels:['ATLD K24','QTKD K12','Lãnh đạo K08','Tin học K31','PCCC K16'],datasets:[{label:'Hoàn thành',data:[86,74,68,92,79],backgroundColor:blue,borderRadius:6,barThickness:17},{label:'Mục tiêu',data:[90,85,80,95,85],backgroundColor:'#dfe8f5',borderRadius:6,barThickness:17}]},options:{...common,indexAxis:'y',scales:{x:{max:100,grid:{color:grid},ticks:{callback:v=>v+'%'}},y:{grid:{display:false}}},plugins:{...common.plugins,legend:{display:true,position:'bottom',labels:{usePointStyle:true,boxWidth:7}}}} });
    make('teacherGradeChart', { type:'bar', data:{labels:['Xuất sắc','Giỏi','Khá','Trung bình','Chưa đạt'],datasets:[{data:[38,74,126,82,24],backgroundColor:[green,blue,'#6b91d8',amber,red],borderRadius:6}]},options:{...common,scales:xy} });
    make('teacherAttendanceChart', { type:'line', data:{labels:['Tuần 1','Tuần 2','Tuần 3','Tuần 4','Tuần 5','Tuần 6'],datasets:[{label:'Tham gia',data:[91,93,89,94,92,96],borderColor:purple,backgroundColor:'rgba(134,85,217,.1)',fill:true,tension:.35,pointRadius:3},{label:'Mục tiêu',data:[90,90,90,90,90,90],borderColor:amber,borderDash:[4,4],pointRadius:0}]},options:{...common,scales:{x:xy.x,y:{min:70,max:100,grid:{color:grid},ticks:{callback:v=>v+'%'}}},plugins:{...common.plugins,legend:{display:true,position:'bottom',labels:{usePointStyle:true,boxWidth:7}}}} });
  }

  if (root.dataset.dashboard === 'leadership') {
    const leadershipLegend = { display:true, position:'bottom', labels:{ usePointStyle:true, boxWidth:7, padding:16 } };
    make('leadershipGrowthChart', {
      type:'line',
      data:{labels:['T1','T2','T3','T4','T5','T6','T7'],datasets:[
        {label:'Học viên hoạt động',data:[3920,4280,4610,4890,5320,5860,6480],borderColor:blue,backgroundColor:'rgba(22,118,231,.1)',fill:true,tension:.38,pointRadius:3,yAxisID:'y'},
        {label:'Lớp học',data:[82,91,99,108,119,132,146],borderColor:green,tension:.38,pointRadius:3,yAxisID:'y1'},
        {label:'Giảng viên',data:[142,148,153,161,169,178,186],borderColor:purple,borderDash:[5,4],tension:.38,pointRadius:2,yAxisID:'y1'}
      ]},
      options:{...common,scales:{x:xy.x,y:{beginAtZero:true,grid:{color:grid},border:{display:false},ticks:{callback:v=>(v/1000)+'k'}},y1:{beginAtZero:true,position:'right',grid:{display:false},border:{display:false}}},plugins:{...common.plugins,legend:leadershipLegend}}
    });
    make('leadershipModeChart', {type:'doughnut',data:{labels:['Trực tuyến','Kết hợp','Trực tiếp'],datasets:[{data:[55,30,15],backgroundColor:[blue,amber,green],borderWidth:0,cutout:'72%'}]},options:{...common,plugins:{...common.plugins,tooltip:{enabled:true}}}});
    make('leadershipPlanChart', {
      type:'bar',
      data:{labels:['T2','T3','T4','T5','T6','T7'],datasets:[{label:'Kế hoạch',data:[21,23,25,26,28,29],backgroundColor:'#dfe5ee',borderRadius:5},{label:'Thực hiện',data:[18,21,22,24,27,25],backgroundColor:blue,borderRadius:5}]},
      options:{...common,scales:xy,plugins:{...common.plugins,legend:leadershipLegend}}
    });
    make('leadershipCostChart', {
      type:'bar',
      data:{labels:['Q1','Q2','Q3','Q4 dự báo'],datasets:[{label:'Ngân sách',data:[1250,1300,1450,1500],backgroundColor:'#e2e8f1',borderRadius:5},{label:'Thực tế',data:[1080,1170,1380,1460],backgroundColor:amber,borderRadius:5},{label:'Tỷ lệ sử dụng',data:[86,90,95,97],type:'line',borderColor:red,tension:.3,pointRadius:3,yAxisID:'y1'}]},
      options:{...common,scales:{x:xy.x,y:{beginAtZero:true,grid:{color:grid},border:{display:false}},y1:{min:70,max:100,position:'right',grid:{display:false},ticks:{callback:v=>v+'%'}}},plugins:{...common.plugins,legend:leadershipLegend}}
    });
    make('leadershipUnitChart', {
      type:'bar',
      data:{labels:['Than Hạ Long','Than Núi Béo','Than Cao Sơn','Cơ khí Hòn Gai','Than Đèo Nai','Vận tải mỏ'],datasets:[{label:'Hoàn thành',data:[88,81,76,73,69,64],backgroundColor:[green,blue,'#5d90d7','#70a3c8',amber,red],borderRadius:6,barThickness:17},{label:'Mục tiêu toàn trường',data:[80,80,80,80,80,80],backgroundColor:'#e4e9f0',borderRadius:6,barThickness:17}]},
      options:{...common,indexAxis:'y',scales:{x:{min:0,max:100,grid:{color:grid},border:{display:false},ticks:{callback:v=>v+'%'}},y:{grid:{display:false},border:{display:false}}},plugins:{...common.plugins,legend:leadershipLegend}}
    });
    make('leadershipDemandChart', {
      type:'radar',
      data:{labels:['An toàn','Quản trị','Chuyển đổi số','Kỹ thuật mỏ','Ngoại ngữ','Kỹ năng mềm'],datasets:[{label:'Nhu cầu 2026',data:[92,74,88,81,58,69],borderColor:blue,backgroundColor:'rgba(22,118,231,.14)',pointBackgroundColor:blue},{label:'Năng lực hiện tại',data:[78,62,61,75,43,57],borderColor:green,backgroundColor:'rgba(35,168,107,.06)',pointBackgroundColor:green}]},
      options:{...common,scales:{r:{beginAtZero:true,max:100,ticks:{display:false},grid:{color:grid},angleLines:{color:grid},pointLabels:{font:{size:9}}}},plugins:{...common.plugins,legend:leadershipLegend}}
    });
    make('leadershipQualityChart', {
      type:'bar',
      data:{labels:['Xuất sắc','Giỏi','Khá','Trung bình','Chưa đạt'],datasets:[{label:'Học viên',data:[684,1426,1968,916,270],backgroundColor:[green,blue,'#6d94da',amber,red],borderRadius:6,barThickness:28}]},
      options:{...common,scales:xy,plugins:{...common.plugins,legend:{display:false}}}
    });
  }

  if (root.dataset.dashboard === 'leadership-kpi') {
    const reportLegend = { display:true, position:'bottom', labels:{ usePointStyle:true, boxWidth:7, padding:16 } };
    make('kpiAchievementChart', {
      type:'bar',
      data:{labels:['Hoàn thành khóa học','Chuẩn chức danh','Giờ đào tạo BQ','Chi phí/HV đạt chuẩn','Hài lòng học viên','Số hóa học liệu'],datasets:[{label:'Mức hoàn thành',data:[105,95,107,98,102,92],backgroundColor:[green,amber,green,amber,blue,red],borderRadius:6,barThickness:17},{label:'Ngưỡng mục tiêu',data:[100,100,100,100,100,100],backgroundColor:'#e6ebf2',borderRadius:6,barThickness:17}]},
      options:{...common,indexAxis:'y',scales:{x:{min:0,max:115,grid:{color:grid},border:{display:false},ticks:{callback:v=>v+'%'}},y:{grid:{display:false},border:{display:false}}},plugins:{...common.plugins,legend:reportLegend}}
    });
    make('kpiStatusChart', {type:'doughnut',data:{labels:['Đạt/vượt','Cần theo dõi','Không đạt'],datasets:[{data:[12,2,1],backgroundColor:[green,amber,red],borderWidth:0,cutout:'72%'}]},options:{...common,plugins:{...common.plugins,tooltip:{enabled:true}}}});
    make('kpiTrendChart', {
      type:'line',
      data:{labels:['T1','T2','T3','T4','T5','T6','T7'],datasets:[{label:'Điểm KPI tổng hợp',data:[72,75,77,80,81.5,84,86.4],borderColor:blue,backgroundColor:'rgba(22,118,231,.1)',fill:true,tension:.38,pointRadius:3},{label:'Tỷ lệ hoàn thành',data:[69,72,74,77,79,82,84],borderColor:green,tension:.38,pointRadius:3},{label:'Mục tiêu',data:[80,80,80,80,80,80,80],borderColor:amber,borderDash:[5,5],pointRadius:0}]},
      options:{...common,scales:{x:xy.x,y:{min:60,max:100,grid:{color:grid},border:{display:false},ticks:{callback:v=>v+'%'}}},plugins:{...common.plugins,legend:reportLegend}}
    });
    make('kpiBalanceChart', {
      type:'radar',
      data:{labels:['Chất lượng','Năng lực','Quy mô','Tài chính','Trải nghiệm','Số hóa'],datasets:[{label:'Thực hiện',data:[88,71,92,82,92,78],borderColor:blue,backgroundColor:'rgba(22,118,231,.15)',pointBackgroundColor:blue},{label:'Mục tiêu',data:[80,75,85,85,90,85],borderColor:green,backgroundColor:'rgba(35,168,107,.04)',borderDash:[4,4],pointBackgroundColor:green}]},
      options:{...common,scales:{r:{beginAtZero:true,max:100,ticks:{display:false},grid:{color:grid},angleLines:{color:grid},pointLabels:{font:{size:9}}}},plugins:{...common.plugins,legend:reportLegend}}
    });
    make('kpiForecastChart', {
      type:'line',
      data:{labels:['T1','T2','T3','T4','T5','T6','T7','T8','T9','T10','T11','T12'],datasets:[{label:'Thực tế',data:[72,75,77,80,81.5,84,86.4,null,null,null,null,null],borderColor:blue,backgroundColor:'rgba(22,118,231,.08)',fill:true,tension:.35,pointRadius:3},{label:'Kịch bản cơ sở',data:[null,null,null,null,null,null,86.4,87.5,88.8,89.6,90.4,91],borderColor:purple,borderDash:[5,4],tension:.35,pointRadius:2},{label:'Mục tiêu năm',data:[83,83,83,83,83,83,83,83,83,83,83,83],borderColor:amber,borderDash:[3,4],pointRadius:0}]},
      options:{...common,scales:{x:xy.x,y:{min:65,max:100,grid:{color:grid},border:{display:false}}},plugins:{...common.plugins,legend:reportLegend}}
    });
  }

  if (root.dataset.dashboard === 'leadership-unit') {
    const unitLegend = { display:true, position:'bottom', labels:{ usePointStyle:true, boxWidth:7, padding:16 } };
    make('unitPerformanceChart', {
      type:'bar',
      data:{labels:['Than Hạ Long','Than Núi Béo','Than Cao Sơn','Cơ khí Hòn Gai','Than Đèo Nai','Vận tải mỏ'],datasets:[{label:'Điểm hiệu suất',data:[92.4,86.8,82.1,75.6,70.2,66.4],backgroundColor:[green,blue,'#5c8fd7',amber,'#ef8d53',red],borderRadius:6,barThickness:20},{label:'Mục tiêu',data:[80,80,80,80,80,80],backgroundColor:'#e5eaf1',borderRadius:6,barThickness:20}]},
      options:{...common,indexAxis:'y',scales:{x:{min:0,max:100,grid:{color:grid},border:{display:false},ticks:{callback:v=>v+' điểm'}},y:{grid:{display:false},border:{display:false}}},plugins:{...common.plugins,legend:unitLegend}}
    });
    make('unitStatusChart', {type:'doughnut',data:{labels:['Đạt/vượt','Theo dõi','Cảnh báo'],datasets:[{data:[13,3,2],backgroundColor:[green,amber,red],borderWidth:0,cutout:'72%'}]},options:{...common,plugins:{...common.plugins,tooltip:{enabled:true}}}});
    make('unitTrendChart', {
      type:'line',
      data:{labels:['T2','T3','T4','T5','T6','T7'],datasets:[{label:'Khối khai thác',data:[72,75,78,80,83,86],borderColor:blue,backgroundColor:'rgba(22,118,231,.08)',fill:true,tension:.38},{label:'Khối sản xuất',data:[66,68,70,72,74,76],borderColor:green,tension:.38},{label:'Khối văn phòng',data:[78,80,82,84,87,89],borderColor:purple,tension:.38},{label:'Mục tiêu',data:[80,80,80,80,80,80],borderColor:amber,borderDash:[5,4],pointRadius:0}]},
      options:{...common,scales:{x:xy.x,y:{min:55,max:100,grid:{color:grid},border:{display:false},ticks:{callback:v=>v+'%'}}},plugins:{...common.plugins,legend:unitLegend}}
    });
    make('unitEfficiencyChart', {
      type:'bubble',
      data:{datasets:[{label:'Đơn vị',data:[{x:643,y:84.2,r:15,unit:'Than Hạ Long'},{x:646,y:80.6,r:13,unit:'Than Núi Béo'},{x:659,y:78.4,r:12,unit:'Than Cao Sơn'},{x:765,y:77.9,r:10,unit:'Cơ khí Hòn Gai'},{x:623,y:73.8,r:11,unit:'Than Đèo Nai'},{x:681,y:71.5,r:9,unit:'Vận tải mỏ'}],backgroundColor:['rgba(35,168,107,.72)','rgba(22,118,231,.7)','rgba(93,144,215,.7)','rgba(240,163,31,.72)','rgba(239,141,83,.72)','rgba(233,93,77,.72)'],borderWidth:0}]},
      options:{...common,scales:{x:{title:{display:true,text:'Chi phí / học viên (nghìn đồng)'},grid:{color:grid},border:{display:false}},y:{min:65,max:90,title:{display:true,text:'Điểm trung bình'},grid:{color:grid},border:{display:false}}},plugins:{legend:{display:false},tooltip:{callbacks:{label:(context)=>`${context.raw.unit}: ${context.raw.x} nghìn · ${context.raw.y} điểm`}}}}
    });
    make('unitQualityChart', {
      type:'bar',
      data:{labels:['Than Hạ Long','Than Núi Béo','Than Cao Sơn','Cơ khí Hòn Gai','Than Đèo Nai','Vận tải mỏ'],datasets:[{label:'Khá–Giỏi',data:[72,68,64,61,56,51],backgroundColor:blue,borderRadius:4},{label:'Trung bình',data:[23,26,29,31,34,37],backgroundColor:amber,borderRadius:4},{label:'Chưa đạt',data:[5,6,7,8,10,12],backgroundColor:red,borderRadius:4}]},
      options:{...common,scales:{x:{stacked:true,grid:{display:false},border:{display:false}},y:{stacked:true,max:100,grid:{color:grid},border:{display:false},ticks:{callback:v=>v+'%'}}},plugins:{...common.plugins,legend:unitLegend}}
    });
  }
  if (root.dataset.dashboard.startsWith('leadership')) {
    const actions = root.querySelector('.dashboard-head-actions');
    if (actions && !actions.querySelector('[data-print-report]')) {
      const print = document.createElement('button');
      print.type = 'button'; print.className = 'btn ghost'; print.dataset.printReport = '';
      print.innerHTML = '<i class="fa-solid fa-print"></i> In / Lưu PDF';
      print.addEventListener('click', () => window.print());
      actions.appendChild(print);
    }
  }
})();
