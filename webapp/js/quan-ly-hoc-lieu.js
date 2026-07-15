(() => {
  'use strict';
  const toast = document.getElementById('contentToast');
  let toastTimer;
  const notify = (message) => {
    if (!toast) return;
    toast.textContent = message; toast.hidden = false;
    clearTimeout(toastTimer); toastTimer = setTimeout(() => { toast.hidden = true; }, 2400);
  };

  const listPage = document.getElementById('gv-content');
  if (listPage) {
    const form = document.getElementById('contentFilters');
    const body = document.getElementById('contentTableBody');
    const summary = document.getElementById('contentSummary');
    const applyFilters = () => {
      const data = new FormData(form), term = String(data.get('q') || '').trim().toLocaleLowerCase('vi');
      let visible = 0;
      body.querySelectorAll('tr[data-parent]').forEach((row) => {
        const match = (!term || row.textContent.toLocaleLowerCase('vi').includes(term)) &&
          (!data.get('type') || row.dataset.type === data.get('type')) &&
          (!data.get('status') || row.dataset.status === data.get('status')) &&
          (!data.get('source') || row.dataset.source === data.get('source'));
        row.hidden = !match; if (match) visible += 1;
      });
      body.querySelectorAll('.chapter-row').forEach((chapter) => {
        chapter.hidden = !body.querySelector(`tr[data-parent="${chapter.dataset.chapter}"]:not([hidden])`);
      });
      summary.textContent = visible ? `Hiển thị 1 đến ${visible} của ${visible} nội dung` : 'Không tìm thấy nội dung phù hợp';
    };
    form.addEventListener('input', applyFilters); form.addEventListener('change', applyFilters);
    body.addEventListener('click', (event) => {
      const chapter = event.target.closest('.chapter-toggle');
      if (chapter) {
        const row = chapter.closest('tr'), collapsed = row.classList.toggle('collapsed');
        chapter.querySelector('.fa-chevron-down,.fa-chevron-right').className = `fa-solid fa-chevron-${collapsed ? 'right' : 'down'}`;
        body.querySelectorAll(`tr[data-parent="${row.dataset.chapter}"]`).forEach((item) => { item.hidden = collapsed; });
      }
      const remove = event.target.closest('.delete-content');
      if (remove && confirm('Bạn muốn xóa nội dung này?')) { remove.closest('tr').remove(); applyFilters(); notify('Đã xóa nội dung khỏi danh sách.'); }
    });
  }

  const createPage = document.getElementById('contentCreatePage');
  if (createPage) {
    const menu = document.getElementById('typeMenu'), picker = document.getElementById('typePickerButton');
    const typeInput = document.getElementById('contentType'), selected = document.getElementById('selectedType');
    picker.addEventListener('click', () => { menu.hidden = !menu.hidden; picker.querySelector('i').className = `fa-solid fa-chevron-${menu.hidden ? 'down' : 'up'}`; });
    menu.addEventListener('click', (event) => {
      const option = event.target.closest('[data-type]'); if (!option) return;
      typeInput.value = option.dataset.type; selected.textContent = option.dataset.type; menu.hidden = true; picker.querySelector('i').className = 'fa-solid fa-chevron-down';
    });
    const textarea = createPage.querySelector('textarea[name="description"]');
    textarea.addEventListener('input', () => { document.getElementById('descriptionCount').textContent = textarea.value.length; });
    const file = createPage.querySelector('input[type="file"]');
    document.getElementById('contentUpload').addEventListener('click', (event) => { if (!event.target.closest('input')) file.click(); });
    file.addEventListener('change', () => {
      if (!file.files[0]) return;
      createPage.querySelector('[name="size"]').value = (file.files[0].size / 1048576).toFixed(2);
      document.querySelector('.upload-zone b').textContent = file.files[0].name;
    });
    document.getElementById('contentCreateForm').addEventListener('submit', (event) => {
      event.preventDefault();
      if (!typeInput.value) { notify('Vui lòng chọn loại nội dung.'); menu.hidden = false; return; }
      notify('Đã lưu nội dung mới.'); setTimeout(() => { window.location.href = 'quan-ly-hoc-lieu.html'; }, 650);
    });
  }

  const constraintPage = document.getElementById('constraintPage');
  if (constraintPage) {
    const tabs = document.getElementById('constraintTabs'), panel = document.getElementById('constraintPanel');
    const displayContent = panel.innerHTML;
    const panels = {
      completion: '<h3>2. Điều kiện hoàn thành</h3><p>Quy định tiêu chí để nội dung được ghi nhận hoàn thành.</p><div class="condition-block"><label class="condition-check"><input type="checkbox" checked><span><b>Xem tối thiểu 90% thời lượng</b><p>Học viên cần xem đủ thời lượng video trước khi được ghi nhận.</p></span></label></div><div class="condition-block"><label class="condition-check"><input type="checkbox"><span><b>Hoàn thành hoạt động tương tác</b><p>Áp dụng với nội dung SCORM và bài học tương tác.</p></span></label></div>',
      time: '<h3>3. Thời gian</h3><p>Thiết lập khoảng thời gian học viên có thể truy cập nội dung.</p><div class="condition-block"><div class="condition-fields" style="margin-left:0"><label class="form-field"><span>Mở từ ngày</span><input type="datetime-local"></label><label class="form-field"><span>Đóng vào ngày</span><input type="datetime-local"></label><label class="form-field"><span>Múi giờ</span><select><option>GMT+7 — Việt Nam</option></select></label></div></div>',
      options: '<h3>4. Tùy chọn</h3><p>Thiết lập cách học viên tương tác với nội dung.</p><div class="condition-block"><label class="condition-check"><input type="checkbox"><span><b>Đánh dấu là nội dung bắt buộc</b><p>Nội dung phải hoàn thành trong lộ trình học.</p></span></label></div><div class="condition-block"><label class="condition-check"><input type="checkbox" checked><span><b>Cho phép tải xuống</b><p>Học viên có thể tải tệp về thiết bị.</p></span></label></div><div class="condition-block"><label class="condition-check"><input type="checkbox" checked><span><b>Hiển thị trong lộ trình</b><p>Nội dung xuất hiện trong danh sách bài học.</p></span></label></div>',
      overview: '<h3>5. Tổng quan ràng buộc</h3><p>Kiểm tra lại cấu hình trước khi lưu.</p><div class="info-strip"><i class="fa-solid fa-circle-check"></i>Đã thiết lập 1 điều kiện hiển thị, 1 điều kiện hoàn thành và quyền tải nội dung.</div>'
    };
    tabs.addEventListener('click', (event) => {
      const button = event.target.closest('[data-panel]'); if (!button) return;
      tabs.querySelectorAll('button').forEach((item) => item.classList.toggle('active', item === button));
      panel.innerHTML = button.dataset.panel === 'display' ? displayContent : panels[button.dataset.panel];
    });
    panel.addEventListener('change', () => {
      const checked = panel.querySelectorAll('input[data-summary]:checked').length;
      const summary = document.getElementById('displaySummary'); if (summary) summary.textContent = checked ? `Đã thiết lập ${checked} điều kiện` : 'Chưa thiết lập';
    });
    document.getElementById('previewConstraint').addEventListener('click', () => notify('Đang xem trước nội dung theo ràng buộc hiện tại.'));
    document.getElementById('saveConstraint').addEventListener('click', () => { notify('Đã lưu thiết lập ràng buộc.'); setTimeout(() => { window.location.href = 'quan-ly-hoc-lieu.html'; }, 650); });
  }
})();
