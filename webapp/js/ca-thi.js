(() => {
  const root = document.getElementById('gv-examsession') || document.querySelector('main .screen');
  if (!root) return;
  const actions = root.querySelectorAll('.page-head button');
  const tbody = root.querySelector('tbody');
  actions[0].addEventListener('click', () => window.downloadCsv('danh-sach-ca-thi.csv', [...root.querySelectorAll('table tr')].map(row => [...row.cells].map(cell => cell.innerText.trim()))));
  actions[1].addEventListener('click', async () => {
    const accepted = await window.appDialog({ title: 'Thêm ca thi', html: '<label class="field">Tên ca<input id="sessionName" value="Ca mới — Sáng 12/07"></label><label class="field">Mã đề<select id="sessionCode"><option>Mã đề 07</option><option>Mã đề 08</option></select></label><label class="field">Thời gian<input id="sessionTime" type="time" value="09:00"></label>', confirmText: 'Tạo ca thi' });
    if (!accepted) return;
    const row = tbody.insertRow(); row.innerHTML = `<td><b>${document.getElementById('sessionName')?.value || 'Ca thi mới'}</b></td><td>${document.getElementById('sessionCode')?.value || 'Mã đề 07'}</td><td>${document.getElementById('sessionTime')?.value || '09:00'}–09:45</td><td>0</td><td><span class="badge b-gray">Sắp diễn ra</span></td><td><button class="btn ghost sm" type="button">Thêm thí sinh</button></td>`;
    window.showAppToast('Đã tạo ca thi mới.');
  });
  tbody.addEventListener('click', async event => {
    const button = event.target.closest('button'); if (!button || button.dataset.href) return;
    const row = button.closest('tr');
    if (button.textContent.includes('Thêm thí sinh')) { const accepted = await window.appDialog({ title: 'Thêm thí sinh', html: '<label class="field">Mã nhân viên<input id="candidateCode" placeholder="Ví dụ: 20260150"></label>', confirmText: 'Thêm' }); if (accepted && document.getElementById('candidateCode')?.value.trim()) { row.cells[3].textContent = Number(row.cells[3].textContent) + 1; window.showAppToast('Đã thêm thí sinh vào ca thi.'); } }
    if (button.textContent.includes('Xem kết quả')) window.appDialog({ title: row.cells[0].innerText, html: '<p><b>40</b> thí sinh · <b>36</b> đạt · <b>4</b> chưa đạt</p><p>Điểm trung bình: <b>7,8/10</b></p>', confirmText: 'Đóng', cancelText: '' });
  });
})();
