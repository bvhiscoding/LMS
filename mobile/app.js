const screens = {
  list: document.querySelector('#course-list'),
  detail: document.querySelector('#course-detail')
};

const navItems = [
  ['home', 'Trang chủ'],
  ['book', 'Khóa học'],
  ['calendar', 'Lịch'],
  ['chat', 'Thảo luận'],
  ['user', 'Cá nhân']
];

document.querySelectorAll('.bottom-nav').forEach(nav => {
  nav.innerHTML = navItems.map(([icon, label]) => `
    <button class="nav-item ${label === 'Khóa học' ? 'active' : ''}" type="button" aria-label="${label}">
      <span class="nav-icon ${icon}" aria-hidden="true"></span><span>${label}</span>
    </button>`).join('');
});

function showScreen(name) {
  const isDetail = name === 'detail';
  screens.list.classList.toggle('is-active', !isDetail);
  screens.detail.classList.toggle('is-active', isDetail);
  screens.list.setAttribute('aria-hidden', String(isDetail));
  screens.detail.setAttribute('aria-hidden', String(!isDetail));
  if (isDetail) screens.detail.querySelector('.detail-scroll').scrollTop = 0;
  history.replaceState(null, '', isDetail ? '#chi-tiet-khoa-hoc' : '#khoa-hoc');
}

document.querySelector('[data-open-course]').addEventListener('click', () => showScreen('detail'));
document.querySelector('.back-btn').addEventListener('click', () => showScreen('list'));

document.querySelectorAll('.filter-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.filter-tab').forEach(item => item.classList.remove('active'));
    tab.classList.add('active');
    const status = tab.dataset.status;
    let visible = 0;
    document.querySelectorAll('.course-card').forEach(card => {
      const show = status === 'all' || card.dataset.status === status;
      card.hidden = !show;
      if (show) visible += 1;
    });
    document.querySelector('.empty-state').hidden = visible !== 0;
  });
});

document.querySelectorAll('.chapter-head').forEach(button => {
  button.addEventListener('click', () => {
    const chapter = button.closest('.chapter');
    const open = chapter.classList.toggle('is-open');
    button.setAttribute('aria-expanded', String(open));
    button.querySelector('.chevron').textContent = open ? '⌃' : '⌄';
  });
});

document.querySelector('.expand-all').addEventListener('click', event => {
  const chapters = [...document.querySelectorAll('.chapter')];
  const shouldOpen = chapters.some(chapter => !chapter.classList.contains('is-open'));
  chapters.forEach(chapter => {
    chapter.classList.toggle('is-open', shouldOpen);
    const button = chapter.querySelector('.chapter-head');
    button.setAttribute('aria-expanded', String(shouldOpen));
    button.querySelector('.chevron').textContent = shouldOpen ? '⌃' : '⌄';
  });
  event.currentTarget.textContent = shouldOpen ? 'Thu gọn tất cả⌃' : 'Mở rộng tất cả⌄';
});

document.querySelector('.bookmark-btn').addEventListener('click', event => {
  event.currentTarget.classList.toggle('saved');
  event.currentTarget.setAttribute('aria-label', event.currentTarget.classList.contains('saved') ? 'Bỏ lưu khóa học' : 'Lưu khóa học');
});

if (location.hash === '#chi-tiet-khoa-hoc') showScreen('detail');
