(() => {
  const root = document.querySelector('.course-detail-page, .detail-page, main');
  const title = root?.querySelector('h1'); if (!title) return;
  const courses = {
    'an-toan-thong-tin-co-ban': 'An toàn thông tin cơ bản',
    'ky-nang-quan-ly-thoi-gian': 'Kỹ năng quản lý thời gian',
    'an-toan-lao-dong-nhom-3': 'An toàn lao động nhóm 3',
    'excel-nang-cao': 'Excel nâng cao',
    'phan-tich-du-lieu-co-ban': 'Phân tích dữ liệu cơ bản',
    'ky-nang-lanh-dao': 'Kỹ năng lãnh đạo',
    'chuyen-doi-so-trong-doanh-nghiep': 'Chuyển đổi số trong doanh nghiệp',
    'bao-ve-moi-truong': 'Bảo vệ môi trường'
  };
  const id = new URLSearchParams(location.search).get('id');
  if (id && courses[id]) { title.textContent = courses[id]; document.querySelector('.register-dialog strong').textContent = `“${courses[id]}”`; }
  else if (id) window.showAppToast('Không tìm thấy mã khóa học; đang hiển thị nội dung mẫu.', 'error');
  document.querySelectorAll('[data-tab]').forEach(tab => tab.addEventListener('click', () => history.replaceState(null, '', `${location.pathname}${location.search}#${tab.dataset.tab}`)));
  const active = location.hash.slice(1); document.querySelector(`[data-tab="${active}"]`)?.click();
})();
