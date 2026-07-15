(() => {
  const root = document.getElementById('gv-grade'); if (!root) return;
  const actions = root.querySelectorAll('.page-head button'); const tbody = root.querySelector('tbody');
  actions[0].addEventListener('click', () => window.appDialog({ title: 'Mã QR điểm danh', html: '<div style="width:190px;height:190px;margin:auto;background:repeating-conic-gradient(#17213b 0 25%,#fff 0 50%) 50%/28px 28px;border:16px solid #fff;box-shadow:0 0 0 1px #dfe5ef"></div><p style="text-align:center;margin-top:16px">Mã lớp: <b>AT-2026-12</b> · Hết hạn sau 15 phút</p>', confirmText: 'Đóng', cancelText: '' }));
  tbody.querySelectorAll('input').forEach(input => input.addEventListener('input', () => {
    const value = Number(input.value); const result = input.closest('tr').cells[5].querySelector('.badge');
    input.setCustomValidity(Number.isFinite(value) && value >= 0 && value <= 10 ? '' : 'Điểm phải từ 0 đến 10');
    if (!input.validationMessage) { result.textContent = value >= 5 ? 'Đạt' : 'Chưa đạt'; result.className = `badge ${value >= 5 ? 'b-green' : 'b-red'}`; }
  }));
  actions[1].addEventListener('click', async () => {
    const invalid = [...tbody.querySelectorAll('input')].find(input => !input.reportValidity()); if (invalid) return;
    const accepted = await window.appDialog({ title: 'Lưu và trình duyệt', message: 'Xác nhận khóa bảng điểm hiện tại và gửi cấp quản lý phê duyệt?', confirmText: 'Trình duyệt' });
    if (accepted) { tbody.querySelectorAll('input').forEach(input => input.disabled = true); actions[1].disabled = true; actions[1].textContent = 'Đã trình duyệt'; window.showAppToast('Bảng điểm đã được gửi phê duyệt.'); }
  });
})();
