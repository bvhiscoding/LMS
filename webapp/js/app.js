(() => {
  const prefix = 'vbs-lms:';
  const clone = value => value == null ? value : JSON.parse(JSON.stringify(value));
  const read = (key, fallback = []) => {
    try {
      const value = localStorage.getItem(prefix + key);
      return value == null ? clone(fallback) : JSON.parse(value);
    } catch (error) {
      console.warn(`Không thể đọc dữ liệu ${key}`, error);
      return clone(fallback);
    }
  };
  const write = (key, value) => {
    localStorage.setItem(prefix + key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent('lms:data-change', { detail:{ key, value:clone(value) } }));
    return value;
  };
  window.LMSStore = Object.freeze({
    read,
    write,
    seed(key, records) {
      if (localStorage.getItem(prefix + key) == null) write(key, records);
      return read(key, records);
    },
    all(key, fallback = []) { return read(key, fallback); },
    find(key, id) { return read(key, []).find(item => String(item.id) === String(id)); },
    save(key, record) {
      const records = read(key, []);
      const now = new Date().toISOString();
      const index = records.findIndex(item => String(item.id) === String(record.id));
      const saved = { ...record, id:record.id || `${key}-${Date.now()}`, updatedAt:now };
      if (index >= 0) records[index] = { ...records[index], ...saved };
      else records.unshift({ ...saved, createdAt:saved.createdAt || now });
      write(key, records);
      return saved;
    },
    remove(key, id) {
      const records = read(key, []);
      const removed = records.find(item => String(item.id) === String(id));
      if (removed) write(key, records.filter(item => String(item.id) !== String(id)));
      return removed;
    },
    nextId(key) {
      return Math.max(0, ...read(key, []).map(item => Number(item.id) || 0)) + 1;
    }
  });
})();

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
    'gv-content-create':'gv-content', 'gv-content-constraint':'gv-content',
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
        ['gv-cert','../html/gv/quan-ly-chung-chi.html','fa-certificate','Quản lý chứng chỉ']
      ]},
      { title:'Kế hoạch', items:[
        ['gv-plan','../html/gv/ke-hoach-dao-tao.html','fa-calendar-days','Kế hoạch &amp; nhu cầu'],
        ['gv-needsurvey','../html/gv/khao-sat-nhu-cau.html','fa-file-lines','Khảo sát'],
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

document.querySelector('#bellBtn, button[aria-label="Thông báo"]')?.addEventListener('click', () => {
  if (body.dataset.role === 'hv') go(new URL('../html/hv/thong-bao.html', appScriptUrl).href);
  else window.appDialog?.({ title: 'Thông báo', message: 'Bạn không có thông báo mới.', confirmText: 'Đã hiểu', cancelText: '' });
});

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
// Shared dialogs, toasts, downloads, search and authentication affordances.
const escapeHtml = value => String(value ?? '').replace(/[&<>'"]/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
}[char]));

function ensureDialog() {
  let dialog = document.getElementById('appDialog');
  if (dialog) return dialog;
  dialog = document.createElement('dialog');
  dialog.id = 'appDialog';
  dialog.className = 'app-dialog';
  document.body.appendChild(dialog);
  return dialog;
}

window.appDialog = ({ title = 'Thông báo', message = '', html = '', confirmText = 'Xác nhận', cancelText = 'Hủy' } = {}) => new Promise(resolve => {
  const dialog = ensureDialog();
  dialog.innerHTML = `
    <form method="dialog">
      <header><h2>${escapeHtml(title)}</h2><button value="cancel" class="app-dialog-close" aria-label="Đóng"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button></header>
      <div class="app-dialog-body">${html || `<p>${escapeHtml(message)}</p>`}</div>
      <footer>${cancelText ? `<button value="cancel" class="btn secondary">${escapeHtml(cancelText)}</button>` : ''}<button value="confirm" class="btn primary">${escapeHtml(confirmText)}</button></footer>
    </form>`;
  dialog.addEventListener('close', () => resolve(dialog.returnValue === 'confirm'), { once: true });
  dialog.showModal();
});

window.showAppToast = (message, tone = 'success') => {
  document.querySelector('.app-toast')?.remove();
  const toast = document.createElement('div');
  toast.className = `app-toast ${tone}`;
  toast.setAttribute('role', 'status');
  toast.textContent = message;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 220); }, 2800);
};

window.downloadCsv = (filename, rows) => {
  const csv = rows.map(row => row.map(cell => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
  const url = URL.createObjectURL(new Blob(['\ufeff', csv], { type: 'text/csv;charset=utf-8' }));
  const link = Object.assign(document.createElement('a'), { href: url, download: filename });
  link.click();
  URL.revokeObjectURL(url);
};

const routeCatalog = {
  hv: [
    ['Khóa học của tôi', '../html/hv/khoa-hoc-cua-toi.html'], ['Lịch học và lịch thi', '../html/hv/lich-hoc-thi.html'],
    ['Tiến độ và kết quả', '../html/hv/tien-do-va-ket-qua.html'], ['Chứng chỉ', '../html/hv/chung-chi.html'],
    ['Xếp hạng', '../html/hv/xep-hang.html'], ['Thông báo', '../html/hv/thong-bao.html'], ['Thông tin cá nhân', '../html/hv/thong-tin-ca-nhan.html']
  ],
  gv: [
    ['Dashboard giảng viên', '../html/gv/dashboard-giang-vien.html'], ['Quản lý khóa học', '../html/gv/quan-ly-khoa-hoc.html'],
    ['Quản lý lớp học', '../html/gv/quan-ly-lop-hoc.html'], ['Ngân hàng đề thi', '../html/gv/ngan-hang-de-thi.html'],
    ['Giám sát thi', '../html/gv/giam-sat-thi.html'], ['Học liệu', '../html/gv/hoc-lieu.html']
  ],
  ad: [['Quản lý người dùng', '../html/ad/quan-ly-nguoi-dung.html'], ['Danh mục hệ thống', '../html/ad/danh-muc-he-thong.html'], ['Báo cáo', '../html/ad/bao-cao.html'], ['Thiết lập hệ thống', '../html/ad/thiet-lap-he-thong.html']],
  ld: [['Dashboard lãnh đạo', '../html/ld/dashboard-lanh-dao.html'], ['Báo cáo KPI', '../html/ld/bao-cao-kpi.html'], ['Báo cáo đơn vị', '../html/ld/bao-cao-don-vi.html']]
};

document.querySelectorAll('.searchbar input, .topbar input[type="search"], .search input').forEach(input => input.addEventListener('keydown', async event => {
  if (event.key !== 'Enter') return;
  const query = input.value.trim().toLocaleLowerCase('vi');
  if (!query) return;
  const routes = (routeCatalog[body.dataset.role] || routeCatalog.hv).filter(([label]) => label.toLocaleLowerCase('vi').includes(query));
  const html = routes.length
    ? `<div class="app-search-results">${routes.map(([label, path]) => `<a href="${new URL(path, appScriptUrl).href}">${escapeHtml(label)}<i class="fa-solid fa-arrow-right" aria-hidden="true"></i></a>`).join('')}</div>`
    : '<p>Không tìm thấy trang phù hợp. Hãy thử từ khóa khác.</p>';
  await window.appDialog({ title: `Kết quả cho “${input.value.trim()}”`, html, confirmText: 'Đóng', cancelText: '' });
}));

document.querySelectorAll('.password-eye, svg:has(use[href="#i-eye"])').forEach(icon => {
  const input = icon.closest('.field, .input-wrap, div')?.querySelector('input[type="password"]');
  if (!input) return;
  const button = document.createElement('button');
  button.type = 'button';
  button.className = `${icon.className} password-toggle`;
  button.setAttribute('aria-label', 'Hiện mật khẩu');
  button.innerHTML = icon.innerHTML || '<i class="fa-solid fa-eye" aria-hidden="true"></i>';
  button.addEventListener('click', () => {
    input.type = input.type === 'password' ? 'text' : 'password';
    button.setAttribute('aria-label', input.type === 'password' ? 'Hiện mật khẩu' : 'Ẩn mật khẩu');
  });
  icon.replaceWith(button);
});

document.querySelectorAll('.forgot, [data-forgot-password], #loginScreen a, #loginModal a, #loginOverlay a').forEach(link => {
  if (!link.matches('.forgot, [data-forgot-password]') && !link.textContent.includes('Quên mật khẩu')) return;
  link.addEventListener('click', event => {
  event.preventDefault();
  window.appDialog({ title: 'Khôi phục mật khẩu', message: 'Hướng dẫn đặt lại mật khẩu đã được gửi tới email công vụ của bạn.', confirmText: 'Đã hiểu', cancelText: '' });
  });
});

document.addEventListener('click', async event => {
  const logout = event.target.closest('[data-app-logout], .iconbtn[title*="Đăng nhập"], .iconbtn[title*="Đăng xuất"], button[aria-label*="Đăng nhập"], button[aria-label*="Đăng xuất"]');
  if (logout) {
    event.preventDefault();
    event.stopImmediatePropagation();
    const accepted = await window.appDialog({ title: 'Đăng xuất', message: 'Bạn có chắc muốn kết thúc phiên làm việc?', confirmText: 'Đăng xuất' });
    if (accepted) {
      sessionStorage.removeItem('lms-session');
      if (document.getElementById('loginOverlay') || document.getElementById('loginModal')) showLogin();
      else { sessionStorage.setItem('lms-force-login', '1'); location.href = new URL('../index.html', appScriptUrl).href; }
    }
    return;
  }
  const submit = event.target.closest('#loginModal .btn.primary, #loginOverlay .btn.primary');
  if (!submit) return;
  const scope = submit.closest('#loginModal, #loginOverlay');
  const fields = [...scope.querySelectorAll('input')];
  if (fields.some(field => !field.value.trim())) {
    event.preventDefault();
    event.stopImmediatePropagation();
    window.showAppToast('Vui lòng nhập đầy đủ tài khoản và mật khẩu.', 'error');
  } else sessionStorage.setItem('lms-session', 'active');
}, true);

document.addEventListener('click', event => {
  const link = event.target.closest('#bankBody a:not([href])'); if (!link) return;
  event.preventDefault(); event.stopImmediatePropagation(); const row = link.closest('tr');
  window.appDialog({ title: row.cells[2]?.innerText.trim() || 'Chi tiết đề thi', html: `<p>${[...row.cells].slice(1, -1).map(cell => cell.innerText.trim()).join(' · ')}</p>`, confirmText: 'Đóng', cancelText: '' });
}, true);

// Resolve contextual links that were previously visual-only in legacy detail cards.
document.addEventListener('click', event => {
  const link = event.target.closest('a:not([href])');
  if (!link) return;
  const label = link.textContent.trim();
  const page = document.body.dataset.page;
  let target = '';
  if (page === 'gv-question-detail' && label === 'An toàn lao động') target = 'ngan-hang-de-thi.html?tab=questions&category=An%20to%C3%A0n%20lao%20%C4%91%E1%BB%99ng';
  if (page === 'gv-question-detail' && label === '3 đề thi') target = 'ngan-hang-de-thi.html?tab=exams&question=CH-000248';
  if (page === 'gv-topic-detail' && label === 'Pháp luật') target = 'chu-de-chuong-trinh.html?tab=topics&group=Ph%C3%A1p%20lu%E1%BA%ADt';
  if (page === 'ld-dash' && label === 'Xem tất cả đơn vị') target = 'bao-cao-don-vi.html';
  if (target) {
    event.preventDefault();
    event.stopImmediatePropagation();
    location.href = target;
  } else if (page === 'gv-question-detail' && label === '18') {
    event.preventDefault();
    event.stopImmediatePropagation();
    window.appDialog({ title: 'Thống kê sử dụng câu hỏi', html: '<p>Câu hỏi đã được sử dụng <b>18 lượt</b>, với tỷ lệ trả lời đúng <b>83%</b>.</p>', confirmText: 'Đóng', cancelText: '' });
  }
}, true);

// Upgrade legacy table demo actions to visible in-session mutations.
document.addEventListener('click', async event => {
  const action = event.target.closest('[data-course-action="copy"], [data-course-action="delete"], #classBody [data-action="copy"], #classBody [data-action="delete"], #bankBody [data-action="copy"], #bankBody [data-action="delete"]');
  if (!action) return;
  if (action.closest('[data-real-actions="true"]') || action.closest('#bankView')?.dataset.realBankActions === 'true') return;
  event.preventDefault(); event.stopImmediatePropagation();
  const row = action.closest('tr'); if (!row) return;
  const removing = action.dataset.action === 'delete' || action.dataset.courseAction === 'delete';
  if (removing) {
    const accepted = await window.appDialog({ title: 'Xóa bản ghi', message: `Xóa “${row.cells[1]?.innerText.trim() || row.cells[0]?.innerText.trim()}” khỏi danh sách trong phiên này?`, confirmText: 'Xóa' });
    if (accepted) { row.remove(); window.showAppToast('Đã xóa bản ghi khỏi danh sách.'); }
    return;
  }
  const clone = row.cloneNode(true); const codeCell = clone.cells[0];
  if (codeCell) codeCell.textContent = `${codeCell.innerText.trim()}-COPY`;
  row.parentElement.insertBefore(clone, row.nextSibling);
  window.showAppToast('Đã tạo một bản sao trong danh sách.');
}, true);

document.addEventListener('click', event => {
  const button = event.target.closest('#proctorBody [data-action="result"], #proctorBody [data-action="more"], #proctorTableBody [data-action="result"], #proctorTableBody [data-action="more"]');
  if (!button) return;
  if (button.closest('[data-real-actions="true"]')) return;
  event.preventDefault(); event.stopImmediatePropagation();
  if (button.dataset.action === 'result') window.appDialog({ title: 'Kết quả ca thi', html: '<p><b>42</b> thí sinh · <b>38</b> đạt · <b>4</b> chưa đạt</p><p>Điểm trung bình: <b>7,9/10</b></p>', confirmText: 'Đóng', cancelText: '' });
  else window.appDialog({ title: 'Thao tác ca thi', html: `<p>Mã ca: <b>${button.dataset.id}</b></p><button class="btn ghost" type="button" onclick="navigator.clipboard?.writeText('${button.dataset.id}');window.showAppToast('Đã sao chép mã ca thi')">Sao chép mã</button>`, confirmText: 'Đóng', cancelText: '' });
}, true);

document.addEventListener('click', async event => {
  const manual = event.target.closest('[data-action="manual"]');
  const bulk = event.target.closest('[data-action="bulk"]');
  if (!manual && !bulk) return;
  const bank = event.target.closest('#examBankView, .exam-bank-view, main');
  if (!bank?.querySelector('#bankBody')) return;
  if (bank.querySelector('#bankView')?.dataset.realBankActions === 'true' || document.getElementById('bankView')?.dataset.realBankActions === 'true') return;
  event.preventDefault(); event.stopImmediatePropagation();
  if (manual) {
    const accepted = await window.appDialog({ title: 'Tạo đề thi thủ công', html: '<label class="field">Tên đề<input id="manualExamName" value="Đề kiểm tra an toàn mới"></label><label class="field">Số câu<input id="manualExamCount" type="number" min="1" value="20"></label><label class="field">Thời gian (phút)<input id="manualExamTime" type="number" min="5" value="30"></label>', confirmText: 'Tạo đề' });
    if (accepted) { const sample = document.querySelector('#bankBody tr'); if (sample) { const clone = sample.cloneNode(true); clone.cells[1].textContent = `DT-${Date.now().toString().slice(-5)}`; clone.cells[2].textContent = document.getElementById('manualExamName')?.value || 'Đề thi mới'; clone.cells[4].textContent = document.getElementById('manualExamCount')?.value || '20'; document.getElementById('bankBody').prepend(clone); } window.showAppToast('Đã tạo đề thi thủ công.'); }
  } else {
    const selected = [...document.querySelectorAll('#bankBody input[type="checkbox"]:checked')].map(input => input.closest('tr'));
    if (!selected.length) return window.showAppToast('Hãy chọn ít nhất một bản ghi.', 'error');
    const accepted = await window.appDialog({ title: 'Thao tác hàng loạt', message: `Xóa ${selected.length} bản ghi đã chọn khỏi danh sách trong phiên?`, confirmText: 'Xóa đã chọn' });
    if (accepted) selected.forEach(row => row.remove());
  }
}, true);

document.addEventListener('submit', event => {
  if (!event.target.matches('#importForm, #autoExamForm')) return;
  if (event.target.dataset.realImport === 'true') return;
  if (!event.target.reportValidity()) return;
  event.preventDefault(); event.stopImmediatePropagation();
  const tbody = document.getElementById('bankBody'); const sample = tbody?.querySelector('tr');
  if (sample) { const clone = sample.cloneNode(true); clone.cells[1].textContent = event.target.id === 'importForm' ? `IMP-${Date.now().toString().slice(-4)}` : `AUTO-${Date.now().toString().slice(-4)}`; tbody.prepend(clone); }
  event.target.closest('dialog')?.close(); window.showAppToast(event.target.id === 'importForm' ? 'Đã nhập dữ liệu vào danh sách.' : 'Đã tạo đề thi tự động.');
}, true);

document.getElementById('copyQuestion')?.addEventListener('click', event => {
  event.preventDefault(); event.stopImmediatePropagation();
  sessionStorage.setItem('copied-question', JSON.stringify({ source: 'CH-000248', createdAt: Date.now() }));
  location.href = 'chi-tiet-cau-hoi.html?id=CH-000248-COPY';
}, true);

document.getElementById('exportCost')?.addEventListener('click', event => {
  event.preventDefault(); event.stopImmediatePropagation();
  const table = document.querySelector('#costPanel table');
  window.downloadCsv('chi-phi-dao-tao.csv', [...table.rows].map(row => [...row.cells].map(cell => cell.innerText.trim())));
}, true);

document.getElementById('costForm')?.addEventListener('submit', event => {
  if (!event.target.reportValidity()) return;
  event.preventDefault(); event.stopImmediatePropagation(); const values = [...event.target.querySelectorAll('input,select')].map(input => input.value).filter(Boolean); document.getElementById('costDialog')?.close();
  const tbody = document.querySelector('#costPanel tbody'); if (tbody) { const row = tbody.insertRow(); row.innerHTML = `<td>${values[0] || 'CP-NEW'}</td><td>${values[1] || 'Khoản chi phí mới'}</td><td>${values[2] || 'Đào tạo'}</td><td>${values[3] || 'Phòng Đào tạo'}</td><td>${values[4] || '0'} đ</td><td>0 đ</td><td>0 đ</td><td>0 đ</td><td><span class="cost-status unpaid">Chưa thanh toán</span></td><td></td>`; }
  window.showAppToast('Đã thêm khoản chi phí.');
}, true);

document.getElementById('costPanel')?.addEventListener('click', async event => {
  const button = event.target.closest('[data-view], [data-edit]'); if (!button) return;
  event.preventDefault(); event.stopImmediatePropagation(); const row = button.closest('tr');
  if (button.dataset.view) return window.appDialog({ title: `Chi tiết ${button.dataset.view}`, html: `<p>${[...row.cells].slice(0, -1).map(cell => cell.innerText.trim()).join(' · ')}</p>`, confirmText: 'Đóng', cancelText: '' });
  const accepted = await window.appDialog({ title: `Chỉnh sửa ${button.dataset.edit}`, html: `<label class="field">Tên lớp<input id="costEditName" value="${row.cells[1].innerText.trim()}"></label><label class="field">Dự toán<input id="costEditBudget" value="${row.cells[4].innerText.replace(/\D/g, '')}"></label>`, confirmText: 'Lưu' });
  if (accepted) { row.cells[1].textContent = document.getElementById('costEditName').value; row.cells[4].textContent = `${Number(document.getElementById('costEditBudget').value).toLocaleString('vi-VN')} đ`; window.showAppToast('Đã cập nhật khoản chi phí.'); }
}, true);

document.getElementById('editTopicDetail')?.addEventListener('click', async event => {
  event.preventDefault(); event.stopImmediatePropagation(); const heading = document.querySelector('main h1');
  const accepted = await window.appDialog({ title: 'Chỉnh sửa chủ đề', html: `<label class="field">Tên chủ đề<input id="topicEditName" value="${heading?.textContent || ''}"></label>`, confirmText: 'Lưu' });
  if (accepted && heading) { heading.textContent = document.getElementById('topicEditName').value.trim(); window.showAppToast('Đã cập nhật chủ đề.'); }
}, true);
document.getElementById('topicDetailPanel')?.addEventListener('click', event => {
  const view = event.target.closest('[data-content-action="view"]'); if (!view) return;
  event.preventDefault(); event.stopImmediatePropagation(); const row = view.closest('tr');
  window.appDialog({ title: row.cells[1].innerText.trim(), html: `<p><b>Loại:</b> ${row.cells[2].innerText.trim()}</p><p><b>Trạng thái:</b> ${row.cells[4].innerText.trim()}</p>`, confirmText: 'Đóng', cancelText: '' });
}, true);

document.getElementById('planDialog')?.querySelector('#dialogConfirm')?.addEventListener('click', event => {
  event.preventDefault(); event.stopImmediatePropagation();
  const kind = document.getElementById('dialogTitle')?.textContent || '';
  document.getElementById('planDialog').close();
  if (kind.includes('Phê duyệt')) {
    const status = document.querySelector('.plan-detail-page .status, main .status'); if (status) { status.textContent = 'Đã phê duyệt'; status.className = 'status green'; }
  } else if (kind.includes('Triển khai')) {
    document.querySelector('[data-tab="classes"]')?.click();
    const tbody = document.querySelector('#planTabPanel tbody'); if (tbody) { const row = tbody.insertRow(); row.innerHTML = '<td>CDS2026-NEW</td><td>Lớp triển khai mới</td><td>20/07/2026</td><td>Nguyễn Văn An</td><td>40</td><td><span class="status green">Đã tạo</span></td>'; }
  } else {
    document.querySelector('[data-tab="allocation"]')?.click();
    const status = document.querySelector('#planTabPanel tbody .status'); if (status) { status.textContent = 'Đã cập nhật'; status.className = 'status green'; }
  }
  window.showAppToast('Đã cập nhật dữ liệu kế hoạch.');
}, true);

document.getElementById('classTabView')?.addEventListener('click', event => {
  if (event.currentTarget.dataset.realStudentActions === 'true') return;
  const button = event.target.closest('[data-class-action="approve"], [data-class-action="reject"]'); if (!button) return;
  event.preventDefault(); event.stopImmediatePropagation();
  const approve = button.dataset.classAction === 'approve'; const checked = [...document.querySelectorAll('[data-student-select]:checked')];
  checked.forEach(input => { const badge = input.closest('tr').querySelector('.approval'); badge.textContent = approve ? 'Đã duyệt' : 'Từ chối'; badge.className = `approval ${approve ? '' : 'rejected'}`; });
  window.showAppToast(`Đã ${approve ? 'duyệt' : 'từ chối'} ${checked.length} học viên.`);
}, true);

document.getElementById('detailPanel')?.addEventListener('click', async event => {
  const add = event.target.closest('[data-add-skill]');
  const remove = event.target.closest('[data-remove-skill], .table-actions .danger');
  const edit = event.target.closest('.table-actions button:not(.danger)');
  if (!add && !remove && !edit) return;
  event.preventDefault(); event.stopImmediatePropagation();
  if (remove) { const accepted = await window.appDialog({ title: 'Gỡ năng lực', message: 'Xác nhận gỡ năng lực này khỏi chức danh?', confirmText: 'Gỡ' }); if (accepted) remove.closest('tr').remove(); return; }
  if (edit) {
    const row = edit.closest('tr'); const accepted = await window.appDialog({ title: 'Chỉnh sửa năng lực', html: `<label class="field">Tên năng lực<input id="editSkillName" value="${row.cells[0].innerText.trim()}"></label><label class="field">Cấp độ<select id="editSkillLevel"><option>Level 3</option><option>Level 4</option></select></label>`, confirmText: 'Lưu' });
    if (accepted) { row.cells[0].textContent = document.getElementById('editSkillName').value; row.cells[1].textContent = document.getElementById('editSkillLevel').value; }
    return;
  }
  const accepted = await window.appDialog({ title: 'Gắn năng lực', html: '<label class="field">Năng lực<select id="newSkill"><option>Năng lực số</option><option>Tư duy đổi mới</option></select></label><label class="field">Cấp độ<select id="newSkillLevel"><option>Level 3</option><option>Level 4</option></select></label>', confirmText: 'Gắn năng lực' });
  if (accepted) { const tbody = document.querySelector('#detailPanel tbody'); const row = tbody?.insertRow(); if (row) row.innerHTML = `<td>${document.getElementById('newSkill')?.value || 'Năng lực mới'}</td><td>${document.getElementById('newSkillLevel')?.value || 'Level 3'}</td><td>Khuyến nghị</td><td><span class="tag green">Đang hoạt động</span></td><td></td>`; }
}, true);

document.getElementById('editPosition')?.addEventListener('click', async event => {
  event.preventDefault(); event.stopImmediatePropagation(); const heading = document.querySelector('main h1');
  const accepted = await window.appDialog({ title: 'Chỉnh sửa chức danh', html: `<label class="field">Tên chức danh<input id="positionName" value="${heading?.textContent || ''}"></label>`, confirmText: 'Lưu' });
  if (accepted && heading) { heading.textContent = document.getElementById('positionName').value.trim(); window.showAppToast('Đã cập nhật chức danh.'); }
}, true);

document.getElementById('saveLearning')?.addEventListener('click', event => {
  event.preventDefault(); event.stopImmediatePropagation();
  const selected = [...document.querySelectorAll('#learningList input:checked')].map(input => input.closest('label').querySelector('b').textContent);
  sessionStorage.setItem('position-learning', JSON.stringify(selected)); document.getElementById('learningDialog')?.close();
  document.querySelector('[data-tab="learning"]')?.click(); window.showAppToast(`Đã gắn ${selected.length} nội dung học tập.`);
}, true);

document.getElementById('courseTabView')?.addEventListener('click', async event => {
  const menu = event.target.closest('[data-course-detail-action="content-menu"], [data-course-detail-action="topic-menu"], [data-course-detail-action="test-menu"]');
  const save = event.target.closest('[data-course-detail-action="save-condition"], [data-course-detail-action="save-completion"]');
  const cancel = event.target.closest('[data-course-detail-action="cancel-condition"]');
  if (!menu && !save && !cancel) return;
  event.preventDefault(); event.stopImmediatePropagation();
  if (save) { save.textContent = 'Đã lưu'; save.disabled = true; window.showAppToast('Đã lưu cấu hình điều kiện.'); return; }
  if (cancel) { document.querySelector('[data-course-tab="overview"]')?.click(); return; }
  const target = menu.closest('tr, .course-topic'); const current = target.querySelector('h3')?.childNodes[0]?.textContent.trim() || target.cells?.[1]?.innerText.trim() || 'Nội dung';
  const accepted = await window.appDialog({ title: 'Chỉnh sửa nội dung', html: `<label class="field">Tên<input id="courseItemName" value="${current.replace(/"/g, '&quot;')}"></label>`, confirmText: 'Lưu', cancelText: 'Đóng' });
  if (!accepted) return; const value = document.getElementById('courseItemName').value.trim();
  if (target.querySelector('h3')) target.querySelector('h3').childNodes[0].textContent = value;
  else if (target.cells?.[1]) target.cells[1].textContent = value;
  window.showAppToast('Đã cập nhật nội dung.');
}, true);

document.getElementById('copyCourse')?.addEventListener('click', event => {
  event.preventDefault(); event.stopImmediatePropagation(); sessionStorage.setItem('copied-course', Date.now());
  window.showAppToast('Đã tạo bản sao khóa học trong phiên.');
}, true);
document.getElementById('moreCourse')?.addEventListener('click', async event => {
  event.preventDefault(); event.stopImmediatePropagation(); const accepted = await window.appDialog({ title: 'Trạng thái khóa học', message: 'Chuyển khóa học sang trạng thái lưu trữ?', confirmText: 'Lưu trữ' });
  if (accepted) { const badge = document.querySelector('.course-detail-header .status, main .status'); if (badge) badge.textContent = 'Đã lưu trữ'; }
}, true);

document.getElementById('testBuilderForm')?.addEventListener('submit', event => {
  event.preventDefault(); event.stopImmediatePropagation(); document.getElementById('testBuilderDialog')?.close(); document.querySelector('[data-course-tab="tests"]')?.click();
  const tbody = document.querySelector('#courseTabView tbody'); if (tbody) { const row = tbody.insertRow(); row.innerHTML = '<td>Bài kiểm tra mới</td><td>20</td><td>20 điểm</td><td>30 phút</td><td><span class="test-status">Bản nháp</span></td><td></td>'; }
  window.showAppToast('Đã tạo bài kiểm tra mới.');
}, true);

document.getElementById('classActionForm')?.addEventListener('submit', event => {
  if (event.target.dataset.confirmAction === 'true') return;
  if (!event.target.reportValidity()) return;
  event.preventDefault(); event.stopImmediatePropagation(); const title = document.getElementById('classDialogTitle')?.textContent || ''; document.getElementById('classActionDialog')?.close();
  if (title.includes('học viên')) { document.querySelector('[data-class-tab="students"]')?.click(); const tbody = document.querySelector('#classTabView tbody'); if (tbody) { const row = tbody.insertRow(); row.innerHTML = '<td><input type="checkbox"></td><td>HV-NEW</td><td>Trần Văn Nam</td><td>Đơn vị mới</td><td><span class="approval">Đã duyệt</span></td><td>Chưa học</td><td>Vừa thêm</td><td></td>'; } }
  else window.showAppToast('Đã thêm dữ liệu vào lớp học.');
}, true);

document.getElementById('testNext')?.addEventListener('click', event => {
  if (!event.currentTarget.textContent.includes('Tạo bài kiểm tra')) return;
  event.preventDefault(); event.stopImmediatePropagation(); document.getElementById('classTestDialog')?.close(); document.querySelector('[data-class-tab="tests"]')?.click();
  const tbody = document.querySelector('#classTabView tbody'); if (tbody) { const row = tbody.insertRow(); row.innerHTML = '<td>Kiểm tra kiến thức cơ bản</td><td>20 câu</td><td>30 phút</td><td><span class="approval pending">Bản nháp</span></td><td></td>'; }
  window.showAppToast('Đã tạo bài kiểm tra cho lớp.');
}, true);

if (sessionStorage.getItem('lms-force-login') === '1') {
  sessionStorage.removeItem('lms-force-login');
  showLogin();
}

})();
