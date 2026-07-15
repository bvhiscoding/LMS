(() => {
  const root = document.getElementById('hv-schedule');
  if (!root) return;
  const calendarCard = document.getElementById('cal')?.closest('.card');
  const upcoming = calendarCard?.nextElementSibling;
  const tabs = [...root.querySelectorAll('.toolbar .chip')];
  tabs.forEach((chip, index) => {
    const button = document.createElement('button');
    button.type = 'button'; button.className = chip.className; button.textContent = chip.textContent; chip.replaceWith(button); tabs[index] = button;
    button.addEventListener('click', () => {
      tabs.forEach(item => item.classList.toggle('on', item === button));
      calendarCard.hidden = index === 2;
      upcoming.hidden = index === 0;
      if (index === 1) { calendarCard.hidden = false; calendarCard.querySelectorAll('#cal > div').forEach((day, dayIndex) => day.hidden = dayIndex > 6); }
      else calendarCard.querySelectorAll('#cal > div').forEach(day => day.hidden = false);
    });
  });
  root.querySelectorAll('.card .list-row').forEach((row, index) => {
    row.tabIndex = 0; row.setAttribute('role', 'button');
    const open = async () => {
      const title = row.querySelector('b')?.textContent || 'Sự kiện';
      const detail = row.querySelector('.faint')?.textContent || '';
      const accepted = await window.appDialog({ title, message: detail, confirmText: index === 0 ? 'Vào bài thi' : index === 2 ? 'Làm khảo sát' : 'Đã hiểu', cancelText: index === 1 ? '' : 'Đóng' });
      if (accepted && index !== 1) location.href = index === 0 ? 'lam-bai-thi.html' : 'khao-sat.html';
    };
    row.addEventListener('click', open); row.addEventListener('keydown', event => { if (event.key === 'Enter') open(); });
  });
  upcoming.hidden = true;
})();
