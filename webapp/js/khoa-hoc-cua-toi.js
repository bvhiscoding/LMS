(() => {
  const grid = document.getElementById('courseGrid'); if (!grid) return;
  const cards = [...grid.querySelectorAll('.course-card')]; const form = document.querySelector('.course-filter'); const selects = [...form.querySelectorAll('select')]; const query = document.getElementById('courseQuery'); const footer = document.querySelector('.course-pagination');
  const slug = text => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  cards.forEach(card => card.dataset.id = slug(card.querySelector('h2').textContent));
  const filter = () => {
    const term = query.value.trim().toLocaleLowerCase('vi'); const status = selects[0].value; const mode = selects[1].value; const sort = selects[2].selectedIndex;
    const matches = cards.filter(card => card.textContent.toLocaleLowerCase('vi').includes(term) && (status === 'all' || card.dataset.status === status) && (mode.includes('Tất cả') || card.textContent.includes(mode)));
    if (sort === 1) matches.sort((a, b) => a.querySelector('h2').textContent.localeCompare(b.querySelector('h2').textContent, 'vi'));
    if (sort === 2) matches.sort((a, b) => Number.parseFloat(b.querySelector('.course-progress i')?.style.width) - Number.parseFloat(a.querySelector('.course-progress i')?.style.width));
    cards.forEach(card => card.hidden = !matches.includes(card)); matches.forEach(card => grid.appendChild(card));
    footer.querySelector('span').textContent = matches.length ? `Hiển thị 1 - ${matches.length} trong ${matches.length} khóa học` : 'Không tìm thấy khóa học phù hợp';
    footer.querySelectorAll('nav button').forEach((button, index) => { button.hidden = index > 1; button.disabled = true; });
  };
  form.addEventListener('submit', filter); query.addEventListener('input', filter); selects.forEach(select => select.addEventListener('change', filter)); form.querySelector('.course-search button').addEventListener('click', filter);
  grid.addEventListener('click', async event => {
    const card = event.target.closest('.course-card'); const button = event.target.closest('button'); if (!card || !button) return;
    if (button.textContent.includes('Xem chi tiết')) location.href = `chi-tiet-khoa-hoc.html?id=${encodeURIComponent(card.dataset.id)}`;
    if (button.textContent.trim() === 'Đăng ký') { const accepted = await window.appDialog({ title: 'Đăng ký khóa học', message: `Xác nhận đăng ký “${card.querySelector('h2').textContent}”?`, confirmText: 'Đăng ký' }); if (accepted) { card.dataset.status = 'learning'; card.querySelector('.course-status').textContent = 'Đang học'; card.querySelector('.course-status').className = 'course-status learning'; button.textContent = 'Tiếp tục học'; button.dataset.href = 'hoc-bai-giang.html'; window.showAppToast('Đăng ký khóa học thành công.'); filter(); } }
  });
  filter();
})();
