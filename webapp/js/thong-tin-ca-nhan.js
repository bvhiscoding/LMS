(() => {
  const root = document.getElementById('hv-profile');
  if (!root) return;
  const save = root.querySelector('.page-head button');
  const changePhoto = [...root.querySelectorAll('button')].find(button => button.textContent.includes('Đổi ảnh'));
  const avatar = root.querySelector('.avatar-init');
  const inputs = [...root.querySelectorAll('input:not([disabled])')];
  const picker = Object.assign(document.createElement('input'), { type: 'file', accept: 'image/*', hidden: true });
  let previewUrl;
  root.appendChild(picker);
  changePhoto.addEventListener('click', () => picker.click());
  picker.addEventListener('change', () => {
    const file = picker.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return window.showAppToast('Vui lòng chọn một tệp ảnh.', 'error');
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    previewUrl = URL.createObjectURL(file);
    avatar.textContent = '';
    Object.assign(avatar.style, { backgroundImage: `url(${previewUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' });
  });
  save.addEventListener('click', () => {
    const email = inputs.find(input => input.value.includes('@') || input.closest('div')?.previousElementSibling?.textContent.includes('Email'));
    const passwords = inputs.filter(input => input.type === 'password');
    if (email && !/^\S+@\S+\.\S+$/.test(email.value)) return window.showAppToast('Email không hợp lệ.', 'error');
    if (passwords[1]?.value !== passwords[2]?.value) return window.showAppToast('Mật khẩu xác nhận không khớp.', 'error');
    if (passwords[1]?.value && passwords[1].value.length < 6) return window.showAppToast('Mật khẩu mới cần ít nhất 6 ký tự.', 'error');
    window.showAppToast('Đã lưu thông tin cá nhân và mật khẩu mới.');
  });
  window.addEventListener('beforeunload', () => { if (previewUrl) URL.revokeObjectURL(previewUrl); });
})();
