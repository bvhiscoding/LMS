(() => {
  const root = document.getElementById('ad-catalog'); if (!root) return;
  const tbody = root.querySelector('tbody'); const actions = root.querySelectorAll('.page-head button');
  const codes = () => [...tbody.rows].map(row => row.cells[0].innerText.trim().toUpperCase());
  actions[0].addEventListener('click', async () => {
    const accepted = await window.appDialog({ title: 'Import danh mục', html: '<label class="field">Tệp CSV<input id="catalogFile" type="file" accept=".csv"></label><p class="muted">Tệp cần có các cột: Mã, Tên, Cấp.</p>', confirmText: 'Import' });
    const file = document.getElementById('catalogFile')?.files[0];
    if (!accepted) return; if (!file || !file.name.toLowerCase().endsWith('.csv')) return window.showAppToast('Chỉ chấp nhận tệp CSV.', 'error');
    const text = await file.text(); const records = text.split(/\r?\n/).slice(1).filter(Boolean);
    records.forEach(line => { const [code, name, level = '2'] = line.split(','); if (!code || codes().includes(code.trim().toUpperCase())) return; const row = tbody.insertRow(); row.innerHTML = `<td><b>${code.trim()}</b></td><td>${name?.trim() || code.trim()}</td><td>${level.trim()}</td><td><span class="badge b-amber">Import</span></td><td><button class="btn ghost sm" type="button" aria-label="Cài đặt mục"><i class="fa-solid fa-gear"></i></button></td>`; });
    window.showAppToast(`Đã import ${records.length} dòng danh mục.`);
  });
  const edit = async row => {
    const accepted = await window.appDialog({ title: row ? 'Chỉnh sửa danh mục' : 'Thêm mục danh mục', html: `<label class="field">Mã<input id="catalogCode" value="${row?.cells[0].innerText.trim() || ''}"></label><label class="field">Tên<input id="catalogName" value="${row?.cells[1].innerText.trim().replace(/^└\s*/, '') || ''}"></label><label class="field">Cấp<select id="catalogLevel"><option>1</option><option selected>2</option><option>3</option></select></label>`, confirmText: 'Lưu' });
    if (!accepted) return; const code = document.getElementById('catalogCode').value.trim().toUpperCase(); const name = document.getElementById('catalogName').value.trim();
    if (!code || !name) return window.showAppToast('Mã và tên là bắt buộc.', 'error'); if ((!row || row.cells[0].innerText.trim() !== code) && codes().includes(code)) return window.showAppToast('Mã danh mục đã tồn tại.', 'error');
    if (!row) row = tbody.insertRow(); row.innerHTML = `<td><b>${code}</b></td><td>${name}</td><td>${document.getElementById('catalogLevel').value}</td><td><span class="badge b-amber">Nhập tay</span></td><td><button class="btn ghost sm" type="button" aria-label="Cài đặt mục"><i class="fa-solid fa-gear"></i></button></td>`; window.showAppToast('Đã lưu mục danh mục.');
  };
  actions[1].addEventListener('click', () => edit()); tbody.addEventListener('click', event => { const button = event.target.closest('button'); if (button) edit(button.closest('tr')); });
  root.querySelectorAll('.card, .list-row').forEach((group, index) => { group.tabIndex = 0; group.addEventListener('click', () => { root.querySelectorAll('.card, .list-row').forEach(item => item.classList.toggle('active', item === group)); root.querySelector('.page-head .sub').textContent = `Đang quản lý nhóm danh mục ${index + 1}.`; }); });
})();
