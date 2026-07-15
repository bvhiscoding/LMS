(() => {
  const root = document.querySelector('.exam-result-redesign');
  if (!root) return;
  root.querySelectorAll('.answer-expand').forEach(button => button.addEventListener('click', () => {
    const item = button.closest('.answer-review, .essay-review');
    item.classList.toggle('expanded');
    button.textContent = item.classList.contains('expanded') ? '⌃' : '⌄';
    button.setAttribute('aria-label', item.classList.contains('expanded') ? 'Thu gọn chi tiết' : 'Mở chi tiết');
  }));
  root.querySelectorAll('.essay-review .btn').forEach(button => button.addEventListener('click', () => {
    const item = button.closest('.essay-review');
    window.appDialog({ title: item.querySelector('h4').textContent, html: '<p><b>Bài làm:</b> Người học đã phân tích nguyên nhân, đưa ra biện pháp phòng ngừa và liên hệ đúng với quy trình an toàn tại đơn vị.</p><p><b>Nhận xét:</b> Lập luận rõ ràng; cần bổ sung thêm dẫn chứng định lượng.</p>', confirmText: 'Đóng', cancelText: '' });
  }));
  const collapse = root.querySelector('.result-collapse');
  collapse.addEventListener('click', () => {
    const collapsed = root.classList.toggle('is-collapsed');
    root.querySelectorAll('.answer-review, .essay-review').forEach((item, index) => item.hidden = collapsed && index > 1);
    collapse.textContent = collapsed ? 'Xem tất cả ⌄' : 'Ẩn bớt ⌃';
  });
})();
