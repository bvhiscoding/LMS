(() => {
  const root = document.querySelector('.lesson-page, #hv-learn, main');
  const player = root?.querySelector('.lesson-video');
  if (!player) return;
  const lessons = [...root.querySelectorAll('.lesson-unit')];
  const progress = root.querySelector('.video-progress span');
  const time = root.querySelector('.video-time');
  const play = root.querySelector('[aria-label*="Phát video"]');
  const speed = root.querySelector('.video-speed');
  const previous = [...root.querySelectorAll('.lesson-actions button')][0];
  const next = [...root.querySelectorAll('.lesson-actions button')][1];
  let current = 0, elapsed = 495, duration = 1125, playing = false, rate = 1, timer;
  const format = seconds => `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;
  const render = () => {
    lessons.forEach((lesson, index) => lesson.classList.toggle('current', index === current));
    previous.disabled = current === 0; next.disabled = current === lessons.length - 1;
    progress.style.width = `${elapsed / duration * 100}%`; time.textContent = `${format(elapsed)} / ${format(duration)}`;
    play.innerHTML = `<i class="fa-solid fa-${playing ? 'pause' : 'play'}"></i>`;
    play.setAttribute('aria-label', playing ? 'Tạm dừng video mô phỏng' : 'Phát video mô phỏng');
  };
  const setPlaying = value => { playing = value; clearInterval(timer); if (playing) timer = setInterval(() => { elapsed = Math.min(duration, elapsed + rate); if (elapsed >= duration) setPlaying(false); render(); }, 1000); render(); };
  play.addEventListener('click', () => setPlaying(!playing));
  root.querySelector('.video-progress').addEventListener('click', event => { elapsed = Math.round(duration * event.offsetX / event.currentTarget.clientWidth); render(); });
  speed.addEventListener('click', () => { rate = rate === 1 ? 1.5 : rate === 1.5 ? 2 : 1; speed.textContent = `${rate}x`; });
  lessons.forEach((lesson, index) => lesson.addEventListener('click', () => { current = index; elapsed = 0; render(); }));
  previous.addEventListener('click', () => { if (current) lessons[current - 1].click(); });
  next.addEventListener('click', () => { if (current < lessons.length - 1) lessons[current + 1].click(); });
  root.querySelector('[aria-label*="âm lượng"]')?.addEventListener('click', event => { event.currentTarget.classList.toggle('muted'); event.currentTarget.innerHTML = `<i class="fa-solid fa-volume-${event.currentTarget.classList.contains('muted') ? 'xmark' : 'high'}"></i>`; });
  root.querySelector('[aria-label*="Cài đặt"]')?.addEventListener('click', () => window.appDialog({ title: 'Cài đặt trình phát', message: 'Trình phát mô phỏng đang dùng chất lượng Tự động (720p).', confirmText: 'Đóng', cancelText: '' }));
  root.querySelector('[aria-label*="Toàn màn hình"]')?.addEventListener('click', () => player.requestFullscreen?.());
  root.querySelector('.lesson-rating')?.addEventListener('click', async () => {
    const accepted = await window.appDialog({ title: 'Đánh giá bài học', html: '<label class="field">Mức đánh giá<select id="lessonRating"><option>5 - Rất hữu ích</option><option>4 - Hữu ích</option><option>3 - Bình thường</option><option>2 - Cần cải thiện</option><option>1 - Chưa tốt</option></select></label><label class="field">Nhận xét<textarea id="lessonComment" placeholder="Chia sẻ cảm nhận của bạn"></textarea></label>', confirmText: 'Gửi đánh giá' });
    if (accepted) { root.querySelector('.lesson-rating').innerHTML = '<i class="fa-solid fa-star"></i>Đã đánh giá 5/5'; window.showAppToast('Cảm ơn bạn đã đánh giá bài học.'); }
  });
  root.querySelectorAll('.course-file').forEach(link => link.addEventListener('click', event => {
    event.preventDefault(); const name = link.querySelector('.file-name').childNodes[0].textContent.trim();
    const url = URL.createObjectURL(new Blob([`Tài liệu mẫu: ${name}\nVBS - TKV 2026`], { type: 'text/plain;charset=utf-8' }));
    Object.assign(document.createElement('a'), { href: url, download: `${name}.txt` }).click(); URL.revokeObjectURL(url);
  }));
  root.querySelector('.view-files')?.addEventListener('click', event => { event.preventDefault(); root.querySelector('.course-files').classList.toggle('expanded'); event.currentTarget.textContent = root.querySelector('.course-files').classList.contains('expanded') ? 'Thu gọn tài liệu' : 'Xem tất cả tài liệu'; });
  root.querySelectorAll('.related-arrow').forEach((button, index) => button.addEventListener('click', () => { current = Math.max(0, Math.min(lessons.length - 1, current + (index ? 1 : -1))); lessons[current].click(); }));
  render();
})();
