(() => {
  const form = document.getElementById('postTrainingSurvey');
  if (!form) return;
  ['goal', 'materials', 'lms', 'satisfaction'].forEach(name => form.querySelector(`[name="${name}"]`)?.setAttribute('required', ''));
  form.querySelector('.survey-actions .ghost').addEventListener('click', () => history.length > 1 ? history.back() : location.href = 'khoa-hoc-cua-toi.html');
  form.addEventListener('submit', event => {
    if (!form.checkValidity()) { event.preventDefault(); event.stopImmediatePropagation(); form.reportValidity(); return; }
    form.querySelectorAll('input, textarea, button').forEach(control => control.disabled = true);
    form.classList.add('submitted');
    window.showAppToast('Cảm ơn bạn. Khảo sát đã được ghi nhận.');
  }, true);
})();
