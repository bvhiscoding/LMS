(() => {
  const root = document.getElementById('gv-completion');
  if (!root) return;

  const rows = [...root.querySelectorAll('tbody tr')];
  const master = root.querySelector('thead input');
  const actions = root.querySelectorAll('.page-head button');
  const dialog = document.getElementById('completionApprovalDialog');
  const form = document.getElementById('completionApprovalForm');
  const note = document.getElementById('completionApprovalNote');
  let approvalRows = [];

  master.addEventListener('change', () => rows.forEach((row) => {
    const checkbox = row.querySelector('input');
    if (!checkbox.disabled) checkbox.checked = master.checked;
  }));

  actions[0].addEventListener('click', () => {
    rows.forEach((row) => {
      const progress = Number.parseFloat(row.cells[2].textContent);
      const attendance = Number.parseFloat(row.cells[3].textContent);
      const score = Number.parseFloat(row.cells[4].textContent);
      const pass = progress === 100 && attendance >= 80 && score >= 5;
      row.cells[5].innerHTML = `<span class="badge ${pass ? 'b-green' : 'b-red'}">${pass ? 'Đạt' : 'Chưa đạt'}</span>`;
      row.cells[6].innerHTML = `<span class="badge ${pass ? 'b-green' : 'b-gray'}">${pass ? 'Sẽ cấp' : 'Không'}</span>`;
    });
    window.showAppToast('Đã xét tự động theo tiến độ, điểm danh và điểm thi.');
  });

  actions[1].addEventListener('click', () => {
    approvalRows = rows.filter((row) => {
      const checkbox = row.querySelector('input');
      return checkbox.checked && !checkbox.disabled;
    });
    if (!approvalRows.length) {
      window.showAppToast('Hãy chọn ít nhất một học viên.', 'error');
      return;
    }
    form.reset();
    document.getElementById('completionSelectedCount').textContent = `${approvalRows.length} học viên`;
    document.getElementById('completionNoteCount').value = 0;
    dialog.showModal();
  });

  note.addEventListener('input', () => {
    document.getElementById('completionNoteCount').value = note.value.length;
  });

  document.querySelectorAll('[data-close-approval]').forEach((button) => {
    button.addEventListener('click', () => dialog.close());
  });
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const approved = data.get('result') === 'approved';
    approvalRows.forEach((row) => {
      row.cells[5].innerHTML = `<span class="badge ${approved ? 'b-blue' : 'b-red'}">${approved ? 'Đã duyệt' : 'Chưa đạt'}</span>`;
      if (approved && row.cells[6].textContent.includes('Sẽ cấp')) row.cells[6].innerHTML = '<span class="badge b-green">Đã cấp</span>';
      if (!approved) row.cells[6].innerHTML = '<span class="badge b-gray">Không</span>';
      row.querySelector('input').disabled = true;
    });
    dialog.close();
    master.checked = false;
    window.showAppToast(approved ? `Đã phê duyệt kết quả cho ${approvalRows.length} học viên.` : `Đã cập nhật ${approvalRows.length} học viên chưa đạt.`);
  });
})();
