(() => {
  const root = document.getElementById('hv-discussion') || document.querySelector('.discussion-page');
  if (!root) return;
  const modal = document.getElementById('discussionModal');
  const form = modal.querySelector('form');
  form.addEventListener('submit', event => {
    const title = form.querySelector('#topic').value.trim(); const detail = form.querySelector('#detail').value.trim();
    if (!title || !detail) { event.preventDefault(); event.stopImmediatePropagation(); return window.showAppToast('Vui lòng nhập tiêu đề và nội dung.', 'error'); }
    const item = document.createElement('article'); item.className = 'discussion-item';
    item.innerHTML = `<span class="user-avatar blue">NA</span><div class="discussion-content"><h3>${title.replace(/[<>]/g, '')}</h3><div class="discussion-meta">Nguyễn Văn An · Vừa xong</div><p>${detail.replace(/[<>]/g, '')}</p></div><div class="discussion-actions"><button type="button"><i class="fa-regular fa-thumbs-up"></i>0</button><button type="button"><i class="fa-regular fa-message"></i>0</button><button type="button" class="item-menu"><i class="fa-solid fa-ellipsis-vertical"></i></button></div>`;
    root.querySelector('.discussion-item')?.parentElement.prepend(item); form.reset(); window.showAppToast('Đã đăng thảo luận mới.');
  });
  root.addEventListener('click', async event => {
    const item = event.target.closest('.discussion-item'); if (!item) return;
    const actions = [...item.querySelectorAll('.discussion-actions > button')]; const button = event.target.closest('button');
    if (button === actions[0]) { const active = button.classList.toggle('active'); const number = Number(button.textContent.trim()) || 0; button.innerHTML = `<i class="fa-${active ? 'solid' : 'regular'} fa-thumbs-up"></i>${number + (active ? 1 : -1)}`; }
    if (button === actions[1]) { const accepted = await window.appDialog({ title: item.querySelector('h3').textContent, html: '<label class="field">Phản hồi<textarea id="threadReply" placeholder="Nhập phản hồi"></textarea></label>', confirmText: 'Gửi phản hồi' }); if (accepted && document.getElementById('threadReply')?.value.trim()) { const number = Number(button.textContent.trim()) || 0; button.innerHTML = `<i class="fa-regular fa-message"></i>${number + 1}`; window.showAppToast('Đã thêm phản hồi.'); } }
    if (button?.classList.contains('item-menu')) { const remove = await window.appDialog({ title: 'Quản lý thảo luận', message: 'Bạn muốn xóa thảo luận này khỏi phiên làm việc?', confirmText: 'Xóa', cancelText: 'Giữ lại' }); if (remove) item.remove(); }
  });
  root.querySelectorAll('a[href="#"]').forEach(link => { link.removeAttribute('href'); link.setAttribute('role', 'button'); link.tabIndex = 0; link.addEventListener('click', () => link.closest('section')?.querySelectorAll('.discussion-item').forEach(item => item.hidden = false)); });
  root.querySelectorAll('.panel-footer button').forEach(button => button.addEventListener('click', () => { button.closest('section, article')?.querySelectorAll('.discussion-item').forEach(item => item.hidden = false); window.showAppToast('Đang hiển thị toàn bộ nội dung.'); }));
})();
