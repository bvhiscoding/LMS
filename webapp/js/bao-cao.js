(() => {
  const data = { learner: ['1.256', '856', '378', '22'], unit: ['156', '98', '48', '10', '75'], overview: ['2.486', '1.784', '568', '134', '1.256'] };
  const labels = ['Tổng số học viên', 'Đã hoàn thành khóa học', 'Đang học', 'Chưa bắt đầu', 'Chứng chỉ đã cấp'];
  const icons = ['fa-users', 'fa-graduation-cap', 'fa-book-open', 'fa-clock', 'fa-certificate'];
  const colors = ['#1769e0', '#16a463', '#9344e6', '#f27919', '#e69a16'];
  const rows = ['Kỹ năng giao tiếp hiệu quả', 'An toàn lao động trong sản xuất', 'Tin học văn phòng cơ bản', 'Quản lý thời gian hiệu quả', 'Kỹ năng làm việc nhóm'];
  let view = 'learner', charts = [];
  const el = id => document.getElementById(id);
  function draw() {
    charts.forEach(chart => chart.destroy()); charts = [];
    charts.push(new Chart(el('scoreChart'), { type: 'bar', data: { labels: ['Xuất sắc', 'Giỏi', 'Khá', 'Trung bình', 'Yếu'], datasets: [{ data: [156, 342, 456, 234, 68], backgroundColor: ['#35be7d', '#4c8bf5', '#f7bd3c', '#ff8a29', '#ef4444'], borderRadius: 7 }] }, options: { plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true }, x: { grid: { display: false } } } } }));
    charts.push(new Chart(el('progressChart'), { type: 'doughnut', data: { labels: ['Hoàn thành', 'Đang học', 'Chưa bắt đầu'], datasets: [{ data: [68, 30, 2], backgroundColor: ['#35be7d', '#6da5f7', '#ff902d'], borderWidth: 0, cutout: '70%' }] }, options: { plugins: { legend: { display: false } }, maintainAspectRatio: false } }));
    charts.push(new Chart(el('activityChart'), { type: 'line', data: { labels: ['20/05', '21/05', '22/05', '23/05', '24/05', '25/05', '26/05', '27/05'], datasets: [{ label: 'Hoàn thành', data: [25,34,39,46,60,52,46,36], borderColor: '#35be7d', tension: .35 }, { label: 'Đang học', data: [16,23,27,27,32,31,23,23], borderColor: '#3d83ef', tension: .35 }] }, options: { plugins: { legend: { position: 'bottom' } }, scales: { y: { beginAtZero: true }, x: { grid: { display: false } } } } }));
  }
  function render() {
    el('kpis').classList.toggle('is-four', data[view].length === 4);
    el('kpis').innerHTML = data[view].map((value, i) => `<article class="kpi"><i class="fa-solid ${icons[i]}" style="color:${colors[i]}"></i><div><span>${labels[i]}</span><b>${value}</b><small>So với kỳ trước</small></div></article>`).join('');
    el('doughnutLabel').innerHTML = `<b>${view === 'unit' ? '62,82%' : '68,15%'}</b><small>Tỷ lệ hoàn thành</small>`;
    el('tableTitle').textContent = view === 'unit' ? 'Chi tiết học tập theo khóa học' : view === 'overview' ? 'Tình hình học tập theo đơn vị' : 'Lộ trình học tập của học viên';
    el('topCourses').innerHTML = rows.map((name, i) => `<li><b>${i + 1}</b><span>${name}</span><a>${[856,742,635,512,478][i]} học viên</a></li>`).join('');
    el('tableBody').innerHTML = rows.map((name, i) => `<tr><td>${i + 1}</td><td>${view === 'unit' ? name : ['Nguyễn Văn A', 'Trần Thị Bích', 'Lê Văn Cường', 'Phạm Thị Dung', 'Hoàng Văn E'][i]}<small>Phòng Kinh doanh</small></td><td>${60-i*5}</td><td>${45-i*3}</td><td>${12-i}</td><td><div class="progress"><i style="width:${75-i*3}%"></i></div></td></tr>`).join(''); draw();
  }
  document.querySelectorAll('[data-view]').forEach(button => button.onclick = () => { view = button.dataset.view; document.querySelectorAll('[data-view]').forEach(tab => tab.classList.toggle('active', tab === button)); render(); });
  el('searchInput').oninput = event => document.querySelectorAll('#tableBody tr').forEach(row => row.hidden = !row.textContent.toLowerCase().includes(event.target.value.toLowerCase()));
  el('exportBtn').onclick = () => { el('toast').textContent = 'Đã tạo báo cáo, sẵn sàng tải xuống.'; el('toast').classList.add('show'); setTimeout(() => el('toast').classList.remove('show'), 2500); };
  el('showAll').onclick = () => el('tableTitle').scrollIntoView({ behavior: 'smooth' }); render();
})();
