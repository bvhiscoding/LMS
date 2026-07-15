(() => {
  const root = document.getElementById('gv-content'); if (!root) return;
  const grid = root.querySelector('.grid.cards-4'); const search = root.querySelector('.toolbar input'); const actions = root.querySelectorAll('.page-head button');
  const decorate = card => {
    card.dataset.type = card.querySelector('.faint')?.textContent.split('·')[0].trim() || 'Nội dung'; card.tabIndex = 0;
    if (!card.querySelector('.resource-delete')) card.insertAdjacentHTML('beforeend', '<button class="btn ghost sm resource-delete" type="button" style="margin-top:10px">Xóa</button>');
  };
  [...grid.children].forEach(decorate);
  const filter = type => { const term = search.value.toLocaleLowerCase('vi'); [...grid.children].forEach(card => card.hidden = !(card.textContent.toLocaleLowerCase('vi').includes(term) && (type === 'Tất cả' || card.dataset.type.includes(type) || card.textContent.includes(type)))); };
  search.addEventListener('input', () => filter(root.querySelector('.chip.on')?.textContent || 'Tất cả'));
  root.querySelectorAll('.chip').forEach(chip => { chip.tabIndex = 0; chip.setAttribute('role', 'button'); chip.addEventListener('click', () => { root.querySelectorAll('.chip').forEach(item => item.classList.toggle('on', item === chip)); filter(chip.textContent.trim()); }); });
  const addResource = async upload => {
    const accepted = await window.appDialog({ title: upload ? 'Upload học liệu' : 'Tạo nội dung', html: `<label class="field">Tên học liệu<input id="resourceTitle" placeholder="Nhập tên học liệu"></label><label class="field">Loại<select id="resourceType"><option>Video</option><option>PDF</option><option>SCORM</option><option>Office</option></select></label>${upload ? '<label class="field">Tệp<input id="resourceFile" type="file"></label>' : '<label class="field">Mô tả<textarea id="resourceDescription"></textarea></label>'}`, confirmText: upload ? 'Upload' : 'Tạo nội dung' });
    const title = document.getElementById('resourceTitle')?.value.trim(); if (!accepted || !title) return accepted && window.showAppToast('Vui lòng nhập tên học liệu.', 'error');
    const type = document.getElementById('resourceType').value; const card = document.createElement('div'); card.className = 'card pad'; card.innerHTML = `<div style="height:64px;border-radius:10px;background:#1c498c;display:grid;place-items:center;color:#fff;margin-bottom:10px"><i class="fa-solid fa-file"></i></div><b style="font-size:13px">${title.replace(/[<>]/g, '')}</b><div class="faint" style="font-size:11px;margin-top:4px">${type} · Vừa tạo</div>`; decorate(card); grid.prepend(card); window.showAppToast('Đã thêm học liệu vào thư viện.');
  };
  actions[0].addEventListener('click', () => addResource(true)); actions[1].addEventListener('click', () => addResource(false));
  grid.addEventListener('click', async event => { const card = event.target.closest('.card'); if (!card) return; if (event.target.closest('.resource-delete')) { const accepted = await window.appDialog({ title: 'Xóa học liệu', message: `Xóa “${card.querySelector('b').textContent}” khỏi thư viện?`, confirmText: 'Xóa' }); if (accepted) card.remove(); } else window.appDialog({ title: card.querySelector('b').textContent, message: card.querySelector('.faint').textContent, confirmText: 'Đóng', cancelText: '' }); });
})();
