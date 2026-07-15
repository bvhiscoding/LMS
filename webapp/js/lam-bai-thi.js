(() => {
  const nav = document.getElementById('examQuestionNav');
  if (!nav) return;
  const total = nav.querySelectorAll('button').length;
  const options = document.getElementById('examOptions');
  const state = { current: 4, seconds: 1785, paused: false, submitted: false, answers: { 1: 'B', 2: 'A', 3: 'D', 4: 'B', 6: 'C', 7: 'A' }, review: new Set([8]), reports: {} };
  const timerNode = document.getElementById('examTimer');
  const format = value => `${String(Math.floor(value / 60)).padStart(2, '0')}:${String(value % 60).padStart(2, '0')}`;
  const render = () => {
    nav.querySelectorAll('button').forEach(button => {
      const number = Number(button.dataset.q);
      button.classList.toggle('current', number === state.current);
      button.classList.toggle('done', Boolean(state.answers[number]));
      button.classList.toggle('review', state.review.has(number));
    });
    document.getElementById('questionNumber').textContent = state.current;
    document.getElementById('footerQuestion').textContent = state.current;
    document.getElementById('answeredCount').textContent = `${Object.keys(state.answers).length}/${total}`;
    options.querySelectorAll('button').forEach(button => button.classList.toggle('selected', state.answers[state.current] === button.dataset.answer));
    document.getElementById('previousQuestion').disabled = state.current === 1;
    document.getElementById('nextQuestion').disabled = state.current === total;
    timerNode.textContent = format(state.seconds);
  };
  nav.addEventListener('click', event => { const button = event.target.closest('[data-q]'); if (button) { state.current = Number(button.dataset.q); render(); } });
  options.addEventListener('click', event => { const button = event.target.closest('[data-answer]'); if (button) { state.answers[state.current] = button.dataset.answer; render(); } });
  const toggleReview = () => { state.review.has(state.current) ? state.review.delete(state.current) : state.review.add(state.current); render(); };
  [document.getElementById('markQuestion'), document.getElementById('paperMark')].forEach(button => button.addEventListener('click', toggleReview));
  document.getElementById('previousQuestion').addEventListener('click', () => { state.current = Math.max(1, state.current - 1); render(); });
  document.getElementById('nextQuestion').addEventListener('click', () => { state.current = Math.min(total, state.current + 1); render(); });
  document.getElementById('timerPause').addEventListener('click', event => { state.paused = !state.paused; event.currentTarget.innerHTML = `<i class="fa-solid fa-${state.paused ? 'play' : 'pause'}"></i>`; event.currentTarget.setAttribute('aria-label', state.paused ? 'Tiếp tục' : 'Tạm dừng'); });
  document.querySelector('.report-question').addEventListener('click', async () => {
    const accepted = await window.appDialog({ title: `Báo lỗi câu ${state.current}`, html: '<label class="field">Lý do<textarea id="reportReason" required placeholder="Mô tả nội dung cần kiểm tra"></textarea></label>', confirmText: 'Gửi báo cáo' });
    const reason = document.getElementById('reportReason')?.value.trim();
    if (accepted && reason) { state.reports[state.current] = reason; window.showAppToast('Đã lưu báo cáo câu hỏi.'); }
  });
  document.querySelector('.exam-nav-tools button:last-child').addEventListener('click', () => { const first = [...state.review][0]; if (first) { state.current = first; render(); } else window.showAppToast('Không có câu nào đang được đánh dấu.'); });
  document.getElementById('submitExam').addEventListener('click', async () => {
    if (state.submitted) return;
    const unanswered = total - Object.keys(state.answers).length;
    const accepted = await window.appDialog({ title: 'Nộp bài thi', message: `Bạn còn ${unanswered} câu chưa trả lời. Sau khi nộp sẽ không thể chỉnh sửa.`, confirmText: 'Nộp bài' });
    if (accepted) { state.submitted = true; location.href = 'ket-qua-thi.html'; }
  });
  setInterval(() => { if (!state.paused && !state.submitted && state.seconds > 0) { state.seconds -= 1; render(); } }, 1000);
  render();
})();
