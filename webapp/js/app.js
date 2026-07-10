(() => {
  const body = document.body;
  const go = (url) => { if (url) window.location.href = url; };

  document.querySelectorAll('.side-role').forEach((nav) => nav.classList.toggle('active', nav.dataset.role === body.dataset.role));
  document.querySelectorAll('#roleSwitch [data-role]').forEach((button) => button.classList.toggle('active', button.dataset.role === body.dataset.role));

  document.querySelectorAll('[data-href]').forEach((item) => {
    item.addEventListener('click', (event) => {
      event.preventDefault();
      go(item.dataset.href);
    });
  });

  document.getElementById('bellBtn')?.addEventListener('click', () => go(document.querySelector('[data-target="notif"]')?.dataset.href));

  window.showLogin = () => document.getElementById('loginScreen')?.classList.add('show');
  window.hideLogin = () => document.getElementById('loginScreen')?.classList.remove('show');

  const pal = document.getElementById('qpal');
  if (pal && !pal.children.length) {
    [ ...Array(30) ].forEach((_, index) => {
      const number = index + 1, node = document.createElement('div');
      node.className = `qn${number === 19 ? ' cur' : [5, 12, 22].includes(number) ? ' mark' : number < 19 ? ' done' : ''}`;
      node.textContent = number;
      pal.appendChild(node);
    });
  }

  const rb = document.getElementById('rbacBody');
  if (rb && !rb.children.length) {
    const colors = { A:['#E7F6ED','#1F9D57'], T:['#E9EFF8','#1c498c'], O:['#FBF1DD','#B4791A'], S:['#FCE9DF','#C2410C'], '—':['#F0F2F6','#98A2B3'] };
    const rows = [['Xem & học khóa học','S','O','T','A','T'],['Đăng ký / hủy đăng ký lớp','S','—','T','A','—'],['Quản lý lớp học','—','O','T','A','—'],['Quản lý nội dung & học liệu','—','O','T','A','—'],['Tạo đề thi & tổ chức ca thi','—','O','T','A','—'],['Giám sát thi & chấm điểm','—','O','T','A','—'],['Điểm danh & nhập điểm','—','O','T','A','—'],['Cấp / thu hồi chứng chỉ','—','—','T','A','—'],['Kế hoạch & duyệt nhu cầu','—','—','T','A','T'],['Quản lý người dùng','—','—','—','A','—'],['Phân quyền (RBAC) & cấu hình','—','—','—','A','—'],['Báo cáo & dashboard','S','O','T','A','T']];
    rows.forEach(([label, ...values]) => {
      const tr = document.createElement('tr'); tr.innerHTML = `<td><b style="font-weight:500">${label}</b></td>`;
      values.forEach((value) => { const [bg, color] = colors[value]; tr.innerHTML += `<td style="text-align:center"><span style="display:inline-grid;place-items:center;width:30px;height:26px;border-radius:7px;font-weight:700;font-size:12px;background:${bg};color:${color}">${value}</span></td>`; });
      rb.appendChild(tr);
    });
  }

  const calendar = document.getElementById('cal');
  if (calendar && !calendar.children.length) {
    const events = {5:'#1c498c',9:'#D99A2B',11:'#1c498c',12:'#1F9D57',18:'#1c498c',23:'#1c498c'};
    for (let day = 1; day <= 31; day += 1) { const cell = document.createElement('div'); cell.style.cssText = `aspect-ratio:1;border:1px solid var(--border);border-radius:8px;padding:6px 8px;font-size:12px;position:relative;color:var(--text)${day === 9 ? ';background:var(--accent-050);border-color:#F0DCB4' : ''}`; cell.innerHTML = day + (events[day] ? `<span style="position:absolute;bottom:6px;left:8px;width:6px;height:6px;border-radius:50%;background:${events[day]}"></span>` : ''); calendar.appendChild(cell); }
  }
})();
