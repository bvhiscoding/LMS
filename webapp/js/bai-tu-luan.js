(() => {
  const editor = document.getElementById('essayAnswer');
  const nav = document.getElementById('essayQuestionList');
  if (!editor || !nav) return;
  const prompts = {
    1: 'Phân tích một tình huống xung đột trong đội nhóm và rút ra ba bài học về giao tiếp.',
    2: document.getElementById('essayPrompt').textContent
  };
  const state = { current: 2, answers: { 1: 'Trong dự án triển khai hệ thống, đội của tôi đã xử lý bất đồng bằng cách thống nhất dữ kiện và phân công lại trách nhiệm.', 2: '' }, marked: new Set(), submitted: false };
  const render = () => {
    editor.value = state.answers[state.current];
    document.getElementById('essayQuestionNo').textContent = state.current;
    document.getElementById('essayPoint').textContent = state.current === 1 ? '30 điểm' : '70 điểm';
    document.getElementById('essayPrompt').textContent = prompts[state.current];
    nav.querySelectorAll('[data-question]').forEach(button => {
      const number = Number(button.dataset.question);
      button.classList.toggle('active', number === state.current);
      button.classList.toggle('answered', Boolean(state.answers[number].trim()));
      button.classList.toggle('marked', state.marked.has(number));
      button.querySelector('em')?.remove();
      if (state.answers[number].trim()) button.insertAdjacentHTML('beforeend', '<em>✓</em>');
    });
    const answered = Object.values(state.answers).filter(value => value.trim()).length;
    document.getElementById('essayAnswered').textContent = `${answered}/2`;
    document.getElementById('essayWords').textContent = editor.value.trim() ? editor.value.trim().split(/\s+/).length : 0;
  };
  editor.addEventListener('input', () => { state.answers[state.current] = editor.value; render(); });
  nav.addEventListener('click', event => { const button = event.target.closest('[data-question]'); if (button) { state.current = Number(button.dataset.question); render(); } });
  const toggleMark = () => { state.marked.has(state.current) ? state.marked.delete(state.current) : state.marked.add(state.current); render(); };
  [document.getElementById('essayMark'), document.getElementById('essayReviewMark')].forEach(button => button.addEventListener('click', toggleMark));
  document.getElementById('essayPrevious').addEventListener('click', () => { state.current = Math.max(1, state.current - 1); render(); });
  document.querySelector('.essay-guide').addEventListener('click', () => window.appDialog({ title: 'Hướng dẫn làm bài', html: '<ul><li>Trả lời đủ cả hai câu hỏi.</li><li>Nội dung được lưu trong phiên hiện tại khi đổi câu.</li><li>Kiểm tra các câu đã đánh dấu trước khi nộp.</li></ul>', confirmText: 'Đã hiểu', cancelText: '' }));
  const submit = async () => {
    if (state.submitted) return;
    const missing = Object.values(state.answers).filter(value => !value.trim()).length;
    const accepted = await window.appDialog({ title: 'Nộp bài tự luận', message: missing ? `Bạn còn ${missing} câu chưa trả lời. Bạn vẫn muốn nộp bài?` : 'Xác nhận nộp bài và khóa nội dung chỉnh sửa?', confirmText: 'Nộp bài' });
    if (!accepted) return;
    state.submitted = true; editor.disabled = true;
    document.querySelectorAll('.essay-submit, #essaySubmitBottom').forEach(button => { button.disabled = true; button.textContent = 'Đã nộp bài'; });
    window.showAppToast('Bài tự luận đã được nộp thành công.');
  };
  [document.getElementById('essaySubmit'), document.getElementById('essaySubmitBottom')].forEach(button => button.addEventListener('click', submit));
  const tools = [...document.querySelectorAll('.editor-tools button')];
  const wrappers = [['', ''], ['', ''], ['**', '**'], ['_', '_'], ['__', '__']];
  tools.forEach((button, index) => {
    if (index > 4) { button.hidden = true; return; }
    button.type = 'button';
    button.addEventListener('click', () => {
      if (index < 2) return window.showAppToast(index ? 'Cỡ chữ mặc định: 14px.' : 'Phông chữ mặc định: Inter.');
      const [before, after] = wrappers[index]; const start = editor.selectionStart; const end = editor.selectionEnd;
      editor.setRangeText(`${before}${editor.value.slice(start, end)}${after}`, start, end, 'end'); editor.dispatchEvent(new Event('input'));
    });
  });
  document.querySelector('.upload-work input')?.addEventListener('change', event => { const file = event.target.files[0]; if (file) window.showAppToast(`Đã đính kèm ${file.name}.`); });
  render();
})();
