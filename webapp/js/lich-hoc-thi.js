(() => {
  const root = document.getElementById('hv-schedule');
  if (!root) return;

  const events = [
    { id: 1, day: 1, title: 'Khai giảng khóa Quản trị kinh doanh', type: 'Khai giảng', time: '08:30–10:00', location: 'Hội trường A', instructor: 'TS. Nguyễn Minh Hải', status: 'Đã đăng ký', color: '#2474d8' },
    { id: 2, day: 2, title: 'Webinar: Văn hóa an toàn trong doanh nghiệp', type: 'Webinar', time: '14:00–15:30', location: 'Microsoft Teams', instructor: 'ThS. Lê Thanh Hà', status: 'Đã đăng ký', color: '#7257c7' },
    { id: 3, day: 3, title: 'Kỹ năng giao tiếp và thuyết trình', type: 'Buổi học', time: '09:00–11:30', location: 'Phòng 204', instructor: 'Nguyễn Thu Trang', status: 'Đã đăng ký', color: '#2474d8' },
    { id: 4, day: 5, title: 'Hạn nộp bài: Phân tích tình huống quản trị', type: 'Hạn nộp bài', time: 'Trước 23:59', location: 'LMS E-Learning', instructor: 'TS. Nguyễn Minh Hải', status: 'Sắp hết hạn', color: '#d94452' },
    { id: 5, day: 6, title: 'Thực hành nhận diện rủi ro lao động', type: 'Thực hành', time: '08:00–11:00', location: 'Xưởng thực hành 02', instructor: 'KS. Trần Quốc Anh', status: 'Đã đăng ký', color: '#15965a' },
    { id: 6, day: 7, title: 'Học trực tuyến: Chuyển đổi số căn bản', type: 'Buổi học', time: '19:30–21:00', location: 'Zoom Meeting', instructor: 'Lê Hoàng Nam', status: 'Sắp diễn ra', color: '#2474d8' },
    { id: 7, day: 8, title: 'Kiểm tra giữa kỳ — Quản trị kinh doanh', type: 'Bài kiểm tra', time: '10:00–10:45', location: 'Trực tuyến', instructor: 'TS. Nguyễn Minh Hải', status: 'Sắp diễn ra', color: '#d99a2b' },
    { id: 8, day: 9, title: 'Thi cuối khóa — An toàn lao động', type: 'Bài thi', time: '09:00–10:00', location: 'Trực tuyến · Mã đề 04', instructor: 'KS. Trần Quốc Anh', status: 'Sắp diễn ra', color: '#d99a2b' },
    { id: 9, day: 10, title: 'Coaching: Lập kế hoạch phát triển cá nhân', type: 'Coaching', time: '15:00–16:00', location: 'Phòng họp B2', instructor: 'Phạm Ngọc Linh', status: 'Đã xác nhận', color: '#7257c7' },
    { id: 10, day: 11, title: 'Buổi học trực tiếp — Quản trị kinh doanh', type: 'Buổi học', time: '14:00–16:30', location: 'Phòng 301', instructor: 'TS. Nguyễn Minh Hải', status: 'Đã đăng ký', color: '#2474d8' },
    { id: 11, day: 12, title: 'Khảo sát sau đào tạo An toàn lao động', type: 'Khảo sát', time: 'Mở cả ngày', location: 'Trực tuyến', instructor: 'Phòng Đào tạo', status: 'Chờ mở', color: '#15965a' },
    { id: 12, day: 14, title: 'Hạn hoàn thành bài học Chuyển đổi số', type: 'Hạn nộp bài', time: 'Trước 23:59', location: 'LMS E-Learning', instructor: 'Lê Hoàng Nam', status: 'Còn 7 ngày', color: '#d94452' },
    { id: 13, day: 15, title: 'Chuyên đề: Quản trị đội ngũ hiệu quả', type: 'Chuyên đề', time: '08:30–11:30', location: 'Hội trường B', instructor: 'PGS.TS. Phan Đức Long', status: 'Đã đăng ký', color: '#2474d8' },
    { id: 14, day: 16, title: 'Đánh giá năng lực số cơ bản', type: 'Bài kiểm tra', time: '13:30–14:15', location: 'Phòng máy 02', instructor: 'Lê Hoàng Nam', status: 'Chưa mở', color: '#d99a2b' },
    { id: 15, day: 18, title: 'Thực hành sơ cấp cứu tại nơi làm việc', type: 'Thực hành', time: '08:00–11:30', location: 'Trung tâm Y tế TKV', instructor: 'BS. Vũ Mai Anh', status: 'Đã đăng ký', color: '#15965a' },
    { id: 16, day: 20, title: 'Mentoring: Kỹ năng lãnh đạo nhóm', type: 'Mentoring', time: '15:30–17:00', location: 'Phòng 305', instructor: 'PGS.TS. Phan Đức Long', status: 'Đã xác nhận', color: '#7257c7' },
    { id: 17, day: 21, title: 'Ôn tập trước thi — Chuyển đổi số', type: 'Ôn tập', time: '19:00–20:30', location: 'Microsoft Teams', instructor: 'Lê Hoàng Nam', status: 'Đã đăng ký', color: '#2474d8' },
    { id: 18, day: 23, title: 'Thi kết thúc chuyên đề Chuyển đổi số', type: 'Bài thi', time: '08:30–09:30', location: 'Phòng máy 01', instructor: 'Lê Hoàng Nam', status: 'Chưa mở', color: '#d99a2b' },
    { id: 19, day: 25, title: 'Workshop: Phân tích dữ liệu với Excel', type: 'Workshop', time: '08:00–11:00', location: 'Phòng máy 03', instructor: 'Trần Khánh Vy', status: 'Đã đăng ký', color: '#7257c7' },
    { id: 20, day: 27, title: 'Hạn nộp kế hoạch ứng dụng sau đào tạo', type: 'Hạn nộp bài', time: 'Trước 17:00', location: 'LMS E-Learning', instructor: 'Phòng Đào tạo', status: 'Còn 20 ngày', color: '#d94452' },
    { id: 21, day: 29, title: 'Tổng kết khóa Quản trị kinh doanh', type: 'Tổng kết', time: '14:00–16:00', location: 'Hội trường A', instructor: 'TS. Nguyễn Minh Hải', status: 'Đã đăng ký', color: '#2474d8' },
    { id: 22, day: 31, title: 'Khảo sát mức độ hài lòng tháng 7', type: 'Khảo sát', time: 'Mở cả ngày', location: 'Trực tuyến', instructor: 'Phòng Đào tạo', status: 'Chờ mở', color: '#15965a' }
  ];

  const calendar = document.getElementById('cal');
  const calendarCard = document.getElementById('scheduleCalendarCard');
  const listCard = document.getElementById('scheduleListCard');
  const list = document.getElementById('scheduleEventList');
  const empty = document.getElementById('scheduleEmpty');
  const search = document.getElementById('scheduleEventSearch');
  const clearSearch = document.getElementById('clearScheduleSearch');
  const summary = document.getElementById('scheduleSearchSummary');
  const listCount = document.getElementById('scheduleListCount');
  const tabs = [...root.querySelectorAll('.schedule-view-tabs .chip')];
  let view = 'month';

  const escapeHtml = (value) => String(value ?? '').replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
  const normalize = (value) => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();
  const weekday = (day) => ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'][new Date(2026, 6, day).getDay()];
  const eventClass = (event) => event.type === 'Bài thi' || event.type === 'Bài kiểm tra' ? 'exam' : event.type === 'Hạn nộp bài' ? 'deadline' : event.type === 'Khảo sát' ? 'survey' : '';
  const eventSearchText = (event) => normalize(`${event.title} ${event.type} ${event.time} ${event.location} ${event.instructor} ${event.status}`);
  const eventBg = (color) => `${color}16`;

  function filteredEvents() {
    const query = normalize(search.value.trim());
    return events.filter((event) => (!query || eventSearchText(event).includes(query)) && (view !== 'week' || (event.day >= 6 && event.day <= 12)));
  }

  function renderCalendar(matches) {
    calendar.innerHTML = '';
    const days = view === 'week' ? Array.from({ length: 7 }, (_, index) => index + 6) : Array.from({ length: 31 }, (_, index) => index + 1);
    if (view === 'month') {
      for (let offset = 0; offset < 2; offset += 1) calendar.insertAdjacentHTML('beforeend', '<div class="schedule-day is-empty" aria-hidden="true"></div>');
    }
    days.forEach((day) => {
      const dayEvents = matches.filter((event) => event.day === day);
      const pills = dayEvents.slice(0, 3).map((event) => `<button type="button" class="schedule-event-pill" data-schedule-event="${event.id}" style="--event-color:${event.color};--event-bg:${eventBg(event.color)}" title="${escapeHtml(event.title)}"><span>${escapeHtml(event.time.split('–')[0])}</span> ${escapeHtml(event.title)}</button>`).join('');
      const more = dayEvents.length > 3 ? `<div class="schedule-more">+${dayEvents.length - 3} sự kiện khác</div>` : '';
      calendar.insertAdjacentHTML('beforeend', `<div class="schedule-day ${day === 9 ? 'is-today' : ''}"><span class="schedule-day-number">${day}</span><div class="schedule-day-events">${pills}${more}</div></div>`);
    });
  }

  function renderList(matches) {
    list.innerHTML = matches.map((event) => `<article class="schedule-event-row" data-schedule-event="${event.id}" tabindex="0" role="button" style="--event-color:${event.color}"><div class="schedule-event-date"><small>${weekday(event.day)}</small><b>${String(event.day).padStart(2, '0')}</b></div><span class="schedule-event-mark"></span><div class="schedule-event-main"><b>${escapeHtml(event.title)}</b><p><i class="fa-regular fa-clock"></i> ${escapeHtml(event.time)} · <i class="fa-solid fa-location-dot"></i> ${escapeHtml(event.location)} · ${escapeHtml(event.instructor)}</p><span class="schedule-event-kind">${escapeHtml(event.type)}</span></div><span class="schedule-event-status ${eventClass(event)}">${escapeHtml(event.status)}</span></article>`).join('');
    listCount.textContent = `${matches.length} sự kiện được sắp xếp theo thời gian`;
  }

  function render() {
    const matches = filteredEvents();
    const query = search.value.trim();
    clearSearch.hidden = !query;
    summary.textContent = query ? `Tìm thấy ${matches.length} sự kiện cho “${query}”` : view === 'week' ? `${matches.length} sự kiện từ ngày 06–12/07` : `${matches.length} sự kiện trong tháng`;
    renderCalendar(matches);
    renderList(matches);
    const hasResults = matches.length > 0;
    empty.hidden = hasResults;
    calendarCard.hidden = !hasResults || view === 'list';
    listCard.hidden = !hasResults || view !== 'list';
  }

  async function openEvent(eventId) {
    const item = events.find((event) => event.id === Number(eventId));
    if (!item) return;
    const isExam = item.type === 'Bài thi' || item.type === 'Bài kiểm tra';
    const isSurvey = item.type === 'Khảo sát';
    const accepted = await window.appDialog({
      title: item.title,
      message: `${item.type} · Ngày ${String(item.day).padStart(2, '0')}/07/2026\n${item.time} · ${item.location}\nPhụ trách: ${item.instructor}\nTrạng thái: ${item.status}`,
      confirmText: isExam ? 'Vào bài thi' : isSurvey ? 'Làm khảo sát' : 'Đã hiểu',
      cancelText: isExam || isSurvey ? 'Đóng' : ''
    });
    if (accepted && isExam) location.href = 'lam-bai-thi.html';
    if (accepted && isSurvey) location.href = 'khao-sat.html';
  }

  tabs.forEach((chip, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = chip.className;
    button.textContent = chip.textContent;
    chip.replaceWith(button);
    tabs[index] = button;
    button.addEventListener('click', () => {
      view = ['month', 'week', 'list'][index];
      tabs.forEach((tab) => tab.classList.toggle('on', tab === button));
      document.getElementById('scheduleListTitle').textContent = view === 'week' ? 'Sự kiện tuần này' : 'Sự kiện tháng 7';
      render();
    });
  });

  root.addEventListener('click', (event) => {
    const target = event.target.closest('[data-schedule-event]');
    if (target) openEvent(target.dataset.scheduleEvent);
  });
  root.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    const target = event.target.closest('.schedule-event-row[data-schedule-event]');
    if (!target) return;
    event.preventDefault();
    openEvent(target.dataset.scheduleEvent);
  });
  search.addEventListener('input', render);
  clearSearch.addEventListener('click', () => { search.value = ''; search.focus(); render(); });
  render();
})();
