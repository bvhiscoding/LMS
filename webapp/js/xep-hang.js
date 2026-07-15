(() => {
  const root = document.querySelector('#hv-rank, main .screen');
  if (!root) return;
  const rewardButtons = [...root.querySelectorAll('button')].filter(button => /1[.,][02]00đ/.test(button.textContent.replace(/\s/g, '')));
  let balance = 1240;
  const balanceNode = [...root.querySelectorAll('.val, b, strong')].find(node => node.textContent.replace(/\D/g, '') === '1240');
  rewardButtons.forEach((button, index) => button.addEventListener('click', async () => {
    const cost = index ? 1200 : 1000;
    const reward = button.closest('.list-row')?.textContent.replace(button.textContent, '').trim() || 'phần thưởng';
    if (balance < cost) return window.appDialog({ title: 'Chưa đủ điểm', message: `Bạn cần thêm ${cost - balance} điểm để đổi ${reward}.`, confirmText: 'Đã hiểu', cancelText: '' });
    const accepted = await window.appDialog({ title: 'Xác nhận đổi quà', message: `Dùng ${cost.toLocaleString('vi-VN')} điểm để đổi ${reward}?`, confirmText: 'Đổi quà' });
    if (!accepted) return;
    balance -= cost;
    if (balanceNode) balanceNode.textContent = balance.toLocaleString('vi-VN');
    button.disabled = true;
    button.textContent = 'Đã đổi';
    window.showAppToast(`Đổi ${reward} thành công. Còn ${balance.toLocaleString('vi-VN')} điểm.`);
  }));
})();
