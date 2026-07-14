(() => {
  const appScriptUrl = document.currentScript?.src || new URL('js/app.js', window.location.href).href;
  if (!document.querySelector('link[href*="font-awesome"],link[href*="fontawesome"]')) {
    const fontAwesome = document.createElement('link');
    fontAwesome.rel = 'stylesheet';
    fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css';
    document.head.appendChild(fontAwesome);
  }

  const iconMap = {
    'i-home':'fa-house', 'i-book':'fa-book-open', 'i-play':'fa-circle-play', 'i-quiz':'fa-clipboard-question',
    'i-cert':'fa-certificate', 'i-users':'fa-users', 'i-shield':'fa-shield-halved', 'i-chart':'fa-chart-column',
    'i-bell':'fa-bell', 'i-search':'fa-magnifying-glass', 'i-menu':'fa-bars', 'i-cal':'fa-calendar-days',
    'i-clock':'fa-clock', 'i-check':'fa-check', 'i-doc':'fa-file-lines', 'i-flag':'fa-flag', 'i-plus':'fa-plus',
    'i-settings':'fa-gear', 'i-video':'fa-video', 'i-list':'fa-list', 'i-money':'fa-money-bill',
    'i-logout':'fa-right-from-bracket', 'i-star':'fa-star', 'i-target':'fa-bullseye', 'i-lock':'fa-lock', 'i-eye':'fa-eye'
  };
  const upgradeSvgIcons = (root = document) => {
    const icons = root.matches?.('svg') ? [root] : root.querySelectorAll?.('svg') || [];
    icons.forEach((svg) => {
      const use = svg.querySelector('use');
      const iconId = use?.getAttribute('href')?.slice(1);
      if (!iconMap[iconId]) return;
      const icon = document.createElement('i');
      icon.className = `${svg.getAttribute('class') || ''} fa-solid ${iconMap[iconId]} fa-icon`;
      [...svg.attributes].forEach((attribute) => { if (attribute.name !== 'class') icon.setAttribute(attribute.name, attribute.value); });
      icon.setAttribute('aria-hidden', 'true');
      svg.replaceWith(icon);
    });
  };
  const upgradeLegacyGlyphs = (root = document) => {
    const within = (selector) => [
      ...(root.matches?.(selector) ? [root] : []),
      ...(root.querySelectorAll?.(selector) || [])
    ];
    const exactIcons = {
      '✓':'fa-check', '✕':'fa-xmark', '★':'fa-star', '▶':'fa-play', 'Ⅱ':'fa-pause', '⌄':'fa-chevron-down', '⌃':'fa-chevron-up',
      '☷':'fa-align-left', '≡':'fa-align-justify', '❝':'fa-quote-left', '🔗':'fa-link', '▧':'fa-image', '▦':'fa-table', '🖍':'fa-highlighter',
      '🙂':'fa-face-smile', '😐':'fa-face-meh', '😊':'fa-face-smile-beam', '😡':'fa-face-angry', '🙁':'fa-face-frown', '🤩':'fa-face-grin-stars'
    };
    within('.badge, em, .editor-tools button, .fake-editor span, .rich-editor > div > span, .mood, .face, .timer-pause, .answer-expand, .result-collapse, a.jump').forEach((element) => {
      if (element.children.length) return;
      const value = element.textContent.trim();
      if (exactIcons[value]) element.innerHTML = `<i class="fa-solid ${exactIcons[value]}" aria-hidden="true"></i>`;
      else if (value === '🖍⌄') element.innerHTML = '<i class="fa-solid fa-highlighter" aria-hidden="true"></i> <i class="fa-solid fa-chevron-down" aria-hidden="true"></i>';
      else if (value === '▦⌄') element.innerHTML = '<i class="fa-solid fa-table-cells" aria-hidden="true"></i> <i class="fa-solid fa-chevron-down" aria-hidden="true"></i>';
      else if (value.endsWith('⌄')) element.innerHTML = `${value.slice(0, -1)} <i class="fa-solid fa-chevron-down" aria-hidden="true"></i>`;
      else if (value.endsWith('⌃')) element.innerHTML = `${value.slice(0, -1)} <i class="fa-solid fa-chevron-up" aria-hidden="true"></i>`;
      else if (value.endsWith('→')) element.innerHTML = `${value.slice(0, -1)} <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>`;
    });
    within('.metric-trend, .class-mini-list p').forEach((element) => {
      if (element.querySelector('.fa-icon-inline')) return;
      const value = element.textContent.trim();
      const glyph = value[0];
      const icon = glyph === '▲' ? 'fa-arrow-trend-up' : glyph === '▼' ? 'fa-arrow-trend-down' : glyph === '✓' ? 'fa-check' : null;
      if (!icon) return;
      element.textContent = value.slice(1).trim();
      element.insertAdjacentHTML('afterbegin', `<i class="fa-solid ${icon} fa-icon-inline" aria-hidden="true"></i>`);
    });
    within('h1').forEach((heading) => {
      if (!heading.textContent.includes('👋')) return;
      heading.innerHTML = heading.innerHTML.replace('👋', '<i class="fa-solid fa-hand fa-wave-icon" aria-hidden="true"></i>');
    });
  };
  upgradeSvgIcons();
  upgradeLegacyGlyphs();
  new MutationObserver((mutations) => mutations.forEach((mutation) => mutation.addedNodes.forEach((node) => {
    if (node.nodeType === Node.ELEMENT_NODE) { upgradeSvgIcons(node); upgradeLegacyGlyphs(node); }
  }))).observe(document.body, { childList:true, subtree:true });

  const favicon = document.createElement('link');
  favicon.rel = 'icon';
  favicon.type = 'image/png';
  favicon.href = new URL('../public/logo-school-round.png', appScriptUrl).href;
  document.head.appendChild(favicon);

  const body = document.body;
  const go = (url) => { if (url) window.location.href = url; };
  const parentPage = {
    'hv-result':'hv-exam',
    'gv-course-create':'gv-courses', 'gv-course-detail':'gv-courses',
    'gv-class-form':'gv-classes', 'gv-class-detail':'gv-classes',
    'gv-plan-form':'gv-plan', 'gv-plan-detail':'gv-plan',
    'gv-position-form':'gv-competency', 'gv-position-detail':'gv-competency',
    'gv-proctor-detail':'gv-proctor', 'gv-question-detail':'gv-exam', 'gv-question-form':'gv-exam',
    'gv-topic-detail':'gv-program', 'gv-topic-groups':'gv-program'
  }[body.dataset.page] || body.dataset.page;

  const sidebarMenus = {
    hv: [
      { title:'Học tập', items:[
        ['hv-dash','../index.html','fa-house','Trang chủ'],
        ['hv-courses','../html/hv/khoa-hoc-cua-toi.html','fa-book-open','Khóa học của tôi','4'],
        ['hv-learn','../html/hv/hoc-bai-giang.html','fa-circle-play','Học bài giảng'],
        ['hv-essay','../html/hv/bai-tu-luan.html','fa-file-lines','Bài tự luận'],
        ['hv-schedule','../html/hv/lich-hoc-thi.html','fa-calendar-days','Lịch học &amp; thi'],
        ['hv-exam','../html/hv/lam-bai-thi.html','fa-clipboard-question','Làm bài thi'],
        ['hv-progress','../html/hv/tien-do-va-ket-qua.html','fa-chart-line','Tiến độ &amp; kết quả']
      ]},
      { title:'Tương tác', items:[
        ['hv-discussion','../html/hv/thao-luan.html','fa-comments','Thảo luận &amp; hỏi đáp'],
        ['hv-survey','../html/hv/khao-sat.html','fa-square-poll-vertical','Khảo sát']
      ]},
      { title:'Thành tích', items:[
        ['hv-cert','../html/hv/chung-chi-hoc-vien.html','fa-certificate','Chứng chỉ'],
        ['hv-rank','../html/hv/xep-hang.html','fa-star','Xếp hạng &amp; điểm']
      ]},
      { title:'Tài khoản', items:[
        ['hv-profile','../html/hv/thong-tin-ca-nhan.html','fa-gear','Thông tin cá nhân']
      ]}
    ],
    gv: [
      { title:'Nghiệp vụ đào tạo', items:[
        ['gv-dash','../html/gv/dashboard-giang-vien.html','fa-house','Tổng quan'],
        ['gv-courses','../html/gv/quan-ly-khoa-hoc.html','fa-book-open','Quản lý khóa học'],
        ['gv-classes','../html/gv/quan-ly-lop-hoc.html','fa-chalkboard','Quản lý lớp học'],
        ['gv-students','../html/gv/quan-ly-hoc-vien.html','fa-user-graduate','Quản lý học viên'],
        ['gv-content','../html/gv/quan-ly-hoc-lieu.html','fa-video','Nội dung &amp; học liệu'],
        ['gv-exam','../html/gv/ngan-hang-de-thi.html','fa-clipboard-question','Ngân hàng đề thi'],
        ['gv-proctor','../html/gv/giam-sat-thi.html','fa-shield-halved','Giám sát thi'],
        ['gv-examsession','../html/gv/ca-thi.html','fa-flag','Tổ chức ca thi'],
        ['gv-grade','../html/gv/diem-danh-cham-diem.html','fa-check','Điểm danh &amp; chấm điểm'],
        ['gv-cert','../html/gv/quan-ly-chung-chi.html','fa-certificate','Quản lý chứng chỉ']
      ]},
      { title:'Kế hoạch', items:[
        ['gv-plan','../html/gv/ke-hoach-dao-tao.html','fa-calendar-days','Kế hoạch &amp; nhu cầu'],
        ['gv-needsurvey','../html/gv/khao-sat-nhu-cau.html','fa-file-lines','Khảo sát nhu cầu'],
        ['gv-completion','../html/gv/xet-hoan-thanh.html','fa-circle-check','Xét hoàn thành'],
        ['gv-cost','../html/gv/chi-phi-dao-tao.html','fa-money-bill','Chi phí đào tạo']
      ]},
      { title:'Chương trình', items:[
        ['gv-instructor','../html/gv/quan-ly-giang-vien.html','fa-users','Quản lý giảng viên'],
        ['gv-competency','../html/gv/khung-nang-luc.html','fa-bullseye','Khung năng lực'],
        ['gv-program','../html/gv/chu-de-chuong-trinh.html','fa-layer-group','Chủ đề &amp; chương trình']
      ]}
    ],
    ad: [
      { title:'Quản trị hệ thống', items:[
        ['ad-users','../html/ad/quan-ly-nguoi-dung.html','fa-users','Người dùng','5k'],
        ['ad-rbac','../html/ad/phan-quyen.html','fa-shield-halved','Phân quyền (RBAC)'],
        ['ad-catalog','../html/ad/danh-muc-he-thong.html','fa-list','Danh mục hệ thống']
      ]},
      { title:'Cấu hình', items:[
        ['ad-config','../html/ad/thiet-lap-he-thong.html','fa-gear','Thiết lập hệ thống'],
        ['ad-log','../html/ad/nhat-ky-he-thong.html','fa-file-lines','Nhật ký (log)']
      ]},
      { title:'Báo cáo &amp; phân tích', items:[
        ['ad-report','../html/ad/bao-cao.html','fa-chart-column','Báo cáo']
      ]}
    ],
    ld: [
      { title:'Báo cáo &amp; phân tích', items:[
        ['ld-dash','../html/ld/dashboard-lanh-dao.html','fa-chart-column','Dashboard tổng hợp'],
        ['ld-kpi','../html/ld/bao-cao-kpi.html','fa-bullseye','KPI đào tạo'],
        ['ld-unit','../html/ld/bao-cao-don-vi.html','fa-building','Báo cáo theo đơn vị']
      ]}
    ]
  };
  const sidebar = document.querySelector('.sidebar');
  if (sidebar && sidebarMenus[body.dataset.role]) {
    const groups = sidebarMenus[body.dataset.role].map((group) => `<div class="side-cap">${group.title}</div>${group.items.map(([target,path,icon,label,badge]) => `<a class="nav-item${target === parentPage ? ' active' : ''}" data-target="${target}" data-href="${new URL(path, appScriptUrl).href}"><i class="ic fa-solid ${icon} fa-icon" aria-hidden="true"></i><span>${label}</span>${badge ? `<span class="badge2">${badge}</span>` : ''}</a>`).join('')}`).join('');
    sidebar.innerHTML = `<div class="sidebar-scroll"><nav class="side-role active" data-role="${body.dataset.role}" aria-label="Điều hướng ${body.dataset.role}">${groups}</nav></div><div class="side-foot">Prototype giao diện · v0.2<br>© VBS — TKV 2026</div>`;
  }
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
