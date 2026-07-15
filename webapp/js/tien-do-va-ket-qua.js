(() => {
  const root = document.getElementById('hv-progress') || document.querySelector('.progress-page') || document.querySelector('main');
  if (!root) return;
  root.querySelectorAll('a[href="#"]').forEach(link => {
    if (link.closest('.cert-actions')) return;
    link.removeAttribute('href'); link.setAttribute('role', 'button'); link.tabIndex = 0;
    link.addEventListener('click', event => {
      const row = event.currentTarget.closest('tr'); const name = row?.querySelector('td:nth-child(2), .cert-name')?.textContent.trim() || 'Kết quả học tập';
      if (event.currentTarget.textContent.includes('Tải')) {
        const url = URL.createObjectURL(new Blob([`CHỨNG CHỈ\n${name}\nNguyễn Văn An\nVBS - TKV 2026`], { type: 'text/plain;charset=utf-8' }));
        Object.assign(document.createElement('a'), { href: url, download: 'chung-chi-vbs.txt' }).click(); URL.revokeObjectURL(url);
      } else window.appDialog({ title: name, message: row?.innerText.replace(/\s+/g, ' ') || 'Thông tin chi tiết kết quả.', confirmText: 'Đóng', cancelText: '' });
    });
  });
  root.querySelectorAll('.search-box input').forEach(input => input.addEventListener('input', () => {
    const table = input.closest('.panel-card')?.querySelector('table'); const term = input.value.toLocaleLowerCase('vi');
    table?.querySelectorAll('tbody tr').forEach(row => row.hidden = !row.textContent.toLocaleLowerCase('vi').includes(term));
  }));
  root.querySelectorAll('.filter-box').forEach(button => button.addEventListener('click', () => window.appDialog({ title: 'Bộ lọc', message: 'Dữ liệu hiện đang được lọc theo học kỳ và trạng thái đang chọn trên trang.', confirmText: 'Đã hiểu', cancelText: '' })));
  root.querySelectorAll('.pages').forEach(pages => pages.addEventListener('click', event => { const button = event.target.closest('button'); if (!button) return; pages.querySelectorAll('button').forEach(item => item.classList.toggle('active', item === button)); window.showAppToast(`Đã chuyển trang ${button.textContent.trim()}.`); }));
  const assignmentDetail = root.querySelector('.assignment-detail');
  const assignmentTable = root.querySelector('.assignment-list .result-table');
  if (assignmentDetail && assignmentTable) {
    const detailTitle = assignmentDetail.querySelector('.panel-title');
    const closeButton = assignmentDetail.querySelector('.detail-close');
    const modal = document.createElement('div');
    let lastTrigger = null;

    modal.className = 'assignment-detail-modal';
    modal.hidden = true;
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-hidden', 'true');
    if (detailTitle) {
      detailTitle.id ||= 'assignment-detail-title';
      modal.setAttribute('aria-labelledby', detailTitle.id);
    }
    modal.appendChild(assignmentDetail);
    document.body.appendChild(modal);

    const closeMenus = except => {
      assignmentTable.querySelectorAll('.assignment-action-menu').forEach(menu => {
        if (menu === except) return;
        menu.hidden = true;
        menu.previousElementSibling?.setAttribute('aria-expanded', 'false');
      });
    };

    const selectRow = row => {
      assignmentTable.querySelectorAll('tbody tr').forEach(item => {
        const selected = item === row;
        item.classList.toggle('selected', selected);
        const marker = item.querySelector('td:first-child i');
        marker?.classList.toggle('fa-solid', selected);
        marker?.classList.toggle('fa-regular', !selected);
        if (marker) marker.style.color = selected ? '#0876ed' : '';
      });
    };

    const updateDetail = row => {
      const sourceTitle = row.querySelector('.result-title');
      const title = sourceTitle?.firstChild?.textContent.trim() || 'Kết quả bài làm';
      const subtitle = sourceTitle?.querySelector('small')?.textContent.trim() || '';
      const score = row.querySelector('.score-good, .score-low')?.textContent.trim() || '--/100';
      const status = row.querySelector('.status');
      const [scoreValue, scoreTotal = '100'] = score.split('/');
      const targetScore = assignmentDetail.querySelector('.detail-score');
      const targetStatus = assignmentDetail.querySelector('.assignment-name .status');

      assignmentDetail.querySelector('.assignment-name h3').textContent = title;
      assignmentDetail.querySelector('.assignment-name p').textContent = subtitle;
      if (targetScore) {
        targetScore.textContent = scoreValue;
        targetScore.classList.toggle('low', status?.classList.contains('fail'));
        const small = document.createElement('small');
        small.textContent = `/${scoreTotal}`;
        targetScore.appendChild(small);
      }
      if (targetStatus && status) {
        targetStatus.textContent = status.textContent.trim();
        targetStatus.className = status.className;
      }
    };

    const openDetail = (row, trigger) => {
      lastTrigger = trigger;
      selectRow(row);
      updateDetail(row);
      closeMenus();
      modal.hidden = false;
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('assignment-detail-open');
      closeButton?.focus();
    };

    const closeDetail = () => {
      modal.hidden = true;
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('assignment-detail-open');
      lastTrigger?.focus();
    };

    assignmentTable.querySelectorAll('tbody tr').forEach((row, index) => {
      const cell = row.lastElementChild;
      const legacyIcon = cell?.querySelector('.fa-ellipsis');
      if (!cell || !legacyIcon) return;

      const actions = document.createElement('div');
      const toggle = document.createElement('button');
      const menu = document.createElement('div');
      const viewButton = document.createElement('button');
      const downloadButton = document.createElement('button');

      actions.className = 'assignment-actions';
      toggle.className = 'assignment-action-toggle';
      toggle.type = 'button';
      toggle.setAttribute('aria-label', `Mở thao tác bài làm ${index + 1}`);
      toggle.setAttribute('aria-expanded', 'false');
      toggle.innerHTML = '<i class="fa-solid fa-ellipsis" aria-hidden="true"></i>';
      menu.className = 'assignment-action-menu';
      menu.hidden = true;
      menu.setAttribute('role', 'menu');
      viewButton.type = 'button';
      viewButton.setAttribute('role', 'menuitem');
      viewButton.innerHTML = '<i class="fa-regular fa-eye" aria-hidden="true"></i><span>Xem chi tiết</span>';
      downloadButton.type = 'button';
      downloadButton.setAttribute('role', 'menuitem');
      downloadButton.innerHTML = '<i class="fa-solid fa-download" aria-hidden="true"></i><span>Tải kết quả</span>';

      toggle.addEventListener('click', event => {
        event.stopPropagation();
        const willOpen = menu.hidden;
        closeMenus(menu);
        menu.hidden = !willOpen;
        toggle.setAttribute('aria-expanded', String(willOpen));
        if (willOpen) {
          const rect = toggle.getBoundingClientRect();
          const menuTop = rect.bottom + menu.offsetHeight + 14 > window.innerHeight
            ? rect.top - menu.offsetHeight - 6
            : rect.bottom + 6;
          menu.style.top = `${Math.max(8, menuTop)}px`;
          menu.style.left = `${Math.max(8, rect.right - 180)}px`;
          viewButton.focus();
        }
      });
      viewButton.addEventListener('click', () => openDetail(row, toggle));
      downloadButton.addEventListener('click', () => {
        const name = row.querySelector('.result-title')?.firstChild?.textContent.trim() || 'ket-qua-bai-lam';
        const content = row.innerText.replace(/\s+/g, ' ').trim();
        const url = URL.createObjectURL(new Blob([content], { type: 'text/plain;charset=utf-8' }));
        const link = document.createElement('a');
        link.href = url;
        link.download = `${name.toLocaleLowerCase('vi').replace(/[^a-z0-9]+/gi, '-') || 'ket-qua-bai-lam'}.txt`;
        link.click();
        URL.revokeObjectURL(url);
        closeMenus();
      });

      menu.append(viewButton, downloadButton);
      actions.append(toggle, menu);
      cell.replaceChildren(actions);
    });

    closeButton?.setAttribute('aria-label', 'Đóng chi tiết kết quả bài làm');
    closeButton?.addEventListener('click', closeDetail);
    modal.addEventListener('click', event => { if (event.target === modal) closeDetail(); });
    document.addEventListener('click', event => {
      if (!event.target.closest('.assignment-actions')) closeMenus();
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        if (!modal.hidden) closeDetail();
        else closeMenus();
        return;
      }
      if (event.key === 'Tab' && !modal.hidden) {
        const focusable = [...assignmentDetail.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')]
          .filter(element => !element.disabled && !element.hidden);
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });
    window.addEventListener('resize', () => closeMenus());
    window.addEventListener('scroll', () => closeMenus(), true);
  }

  const certificatePreview = root.querySelector('.cert-preview');
  const certificateTable = root.querySelector('.cert-table');
  if (certificatePreview && certificateTable) {
    const certificateHeaderRow = certificateTable.querySelector('thead tr');
    if (certificateHeaderRow && !certificateHeaderRow.querySelector('.cert-category-head')) {
      const categoryHeader = document.createElement('th');
      categoryHeader.className = 'cert-category-head';
      categoryHeader.textContent = 'Phân loại';
      certificateHeaderRow.children[0]?.after(categoryHeader);
    }
    certificateTable.querySelectorAll('tbody tr').forEach(row => {
      const nameCell = row.children[0];
      const nameElement = nameCell?.querySelector('.cert-name');
      if (!nameCell || !nameElement || row.querySelector('.cert-category')) return;
      const categorySource = nameElement.querySelector('small');
      const categoryCell = document.createElement('td');
      const categoryLabel = document.createElement('span');
      categoryCell.className = 'cert-category';
      categoryLabel.className = 'cert-category-label';
      categoryLabel.textContent = categorySource?.textContent.trim() || 'Khác';
      categoryCell.appendChild(categoryLabel);
      nameCell.querySelector('.cert-thumb')?.remove();
      categorySource?.remove();
      nameCell.after(categoryCell);
    });

    const modal = document.createElement('div');
    const card = document.createElement('section');
    const header = document.createElement('header');
    const modalTitle = document.createElement('h2');
    const closeButton = document.createElement('button');
    const content = document.createElement('div');
    const visual = document.createElement('div');
    const information = document.createElement('div');
    const certificateName = document.createElement('h3');
    const certificateCategory = document.createElement('p');
    const modalSheet = certificatePreview.querySelector('.certificate-sheet').cloneNode(true);
    const modalInfo = certificatePreview.querySelector('.cert-info').cloneNode(true);
    const actions = document.createElement('div');
    const downloadButton = document.createElement('button');
    const doneButton = document.createElement('button');
    let activeRow = certificateTable.querySelector('tbody tr.selected') || certificateTable.querySelector('tbody tr');
    let lastCertificateTrigger = null;

    modal.className = 'certificate-detail-modal';
    modal.hidden = true;
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-hidden', 'true');
    modal.setAttribute('aria-labelledby', 'certificate-detail-title');
    card.className = 'certificate-detail-card';
    header.className = 'certificate-detail-header';
    modalTitle.id = 'certificate-detail-title';
    modalTitle.textContent = 'Chi tiết chứng chỉ';
    closeButton.className = 'certificate-modal-close';
    closeButton.type = 'button';
    closeButton.setAttribute('aria-label', 'Đóng chi tiết chứng chỉ');
    closeButton.innerHTML = '<i class="fa-solid fa-xmark" aria-hidden="true"></i>';
    content.className = 'certificate-detail-content';
    visual.className = 'certificate-detail-visual';
    information.className = 'certificate-detail-information';
    certificateName.className = 'certificate-modal-name';
    certificateCategory.className = 'certificate-modal-category';
    actions.className = 'certificate-modal-actions';
    downloadButton.className = 'btn primary';
    downloadButton.type = 'button';
    downloadButton.innerHTML = '<i class="fa-solid fa-download" aria-hidden="true"></i>Tải chứng chỉ';
    doneButton.className = 'btn ghost';
    doneButton.type = 'button';
    doneButton.textContent = 'Đóng';

    header.append(modalTitle, closeButton);
    visual.appendChild(modalSheet);
    information.append(certificateName, certificateCategory, modalInfo, actions);
    actions.append(downloadButton, doneButton);
    content.append(visual, information);
    card.append(header, content);
    modal.appendChild(card);
    document.body.appendChild(modal);

    const valueFromCell = cell => {
      const main = cell?.firstChild?.textContent.trim() || cell?.textContent.trim() || '';
      const secondary = cell?.querySelector('small')?.textContent.trim();
      return secondary ? `${main} (${secondary})` : main;
    };

    const certificateData = row => {
      const nameElement = row.querySelector('.cert-name');
      const cells = row.querySelectorAll('td');
      return {
        name: nameElement?.firstChild?.textContent.trim() || 'Chứng chỉ',
        category: row.querySelector('.cert-category-label')?.textContent.trim() || '',
        code: valueFromCell(cells[2]),
        issued: valueFromCell(cells[3]),
        validity: valueFromCell(cells[4]),
        status: cells[5]?.querySelector('.status')
      };
    };

    const updateCertificateModal = row => {
      const data = certificateData(row);
      const infoValues = modalInfo.querySelectorAll('p b');
      const sheetTitle = modalSheet.querySelector('strong small');
      certificateName.textContent = data.name;
      certificateCategory.textContent = data.category;
      if (sheetTitle) sheetTitle.textContent = data.name.toLocaleUpperCase('vi').replace(/^CHỨNG CHỈ\s*/i, '');
      if (infoValues[0]) infoValues[0].textContent = data.name;
      if (infoValues[1]) infoValues[1].textContent = data.code;
      if (infoValues[2]) infoValues[2].textContent = data.issued;
      if (infoValues[3]) infoValues[3].textContent = data.validity;
      if (infoValues[4] && data.status) {
        infoValues[4].textContent = data.status.textContent.trim();
        infoValues[4].className = data.status.className;
      }
    };

    const downloadCertificate = row => {
      const data = certificateData(row);
      const fileContent = [
        'CHỨNG CHỈ',
        data.name,
        'Cấp cho: Nguyễn Minh Anh',
        `Mã chứng chỉ: ${data.code}`,
        `Ngày cấp: ${data.issued}`,
        `Hiệu lực: ${data.validity}`,
        `Trạng thái: ${data.status?.textContent.trim() || ''}`
      ].join('\n');
      const url = URL.createObjectURL(new Blob([fileContent], { type: 'text/plain;charset=utf-8' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = `${data.code || 'chung-chi-vbs'}.txt`;
      link.click();
      URL.revokeObjectURL(url);
    };

    const openCertificateModal = (row, trigger) => {
      activeRow = row;
      lastCertificateTrigger = trigger;
      certificateTable.querySelectorAll('tbody tr').forEach(item => item.classList.toggle('selected', item === row));
      updateCertificateModal(row);
      modal.hidden = false;
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('certificate-detail-open');
      closeButton.focus();
    };

    const closeCertificateModal = () => {
      modal.hidden = true;
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('certificate-detail-open');
      lastCertificateTrigger?.focus();
    };

    const closeCertificateMenus = except => {
      certificateTable.querySelectorAll('.cert-action-menu').forEach(menu => {
        if (menu === except) return;
        menu.hidden = true;
        menu.previousElementSibling?.setAttribute('aria-expanded', 'false');
      });
    };

    certificateTable.querySelectorAll('tbody tr').forEach((row, index) => {
      const cell = row.lastElementChild;
      if (!cell) return;

      const actionGroup = document.createElement('div');
      const toggle = document.createElement('button');
      const menu = document.createElement('div');
      const viewButton = document.createElement('button');
      const rowDownloadButton = document.createElement('button');

      actionGroup.className = 'assignment-actions cert-row-actions';
      toggle.className = 'assignment-action-toggle cert-action-toggle';
      toggle.type = 'button';
      toggle.setAttribute('aria-label', `Mở thao tác chứng chỉ ${index + 1}`);
      toggle.setAttribute('aria-expanded', 'false');
      toggle.innerHTML = '<i class="fa-solid fa-ellipsis" aria-hidden="true"></i>';
      menu.className = 'assignment-action-menu cert-action-menu';
      menu.hidden = true;
      menu.setAttribute('role', 'menu');
      viewButton.type = 'button';
      viewButton.setAttribute('role', 'menuitem');
      viewButton.innerHTML = '<i class="fa-regular fa-eye" aria-hidden="true"></i><span>Xem chi tiết</span>';
      rowDownloadButton.type = 'button';
      rowDownloadButton.setAttribute('role', 'menuitem');
      rowDownloadButton.innerHTML = '<i class="fa-solid fa-download" aria-hidden="true"></i><span>Tải xuống</span>';

      toggle.addEventListener('click', event => {
        event.stopPropagation();
        const willOpen = menu.hidden;
        closeCertificateMenus(menu);
        menu.hidden = !willOpen;
        toggle.setAttribute('aria-expanded', String(willOpen));
        if (willOpen) {
          const rect = toggle.getBoundingClientRect();
          const menuTop = rect.bottom + menu.offsetHeight + 14 > window.innerHeight
            ? rect.top - menu.offsetHeight - 6
            : rect.bottom + 6;
          menu.style.top = `${Math.max(8, menuTop)}px`;
          menu.style.left = `${Math.max(8, rect.right - 180)}px`;
          viewButton.focus();
        }
      });
      viewButton.addEventListener('click', () => {
        closeCertificateMenus();
        openCertificateModal(row, toggle);
      });
      rowDownloadButton.addEventListener('click', () => {
        downloadCertificate(row);
        closeCertificateMenus();
      });

      menu.append(viewButton, rowDownloadButton);
      actionGroup.append(toggle, menu);
      cell.replaceChildren(actionGroup);
    });

    certificatePreview.querySelector('.cert-preview-actions .ghost')?.addEventListener('click', event => {
      openCertificateModal(activeRow, event.currentTarget);
    });
    certificatePreview.querySelector('.cert-preview-actions .primary')?.addEventListener('click', () => downloadCertificate(activeRow));
    downloadButton.addEventListener('click', () => downloadCertificate(activeRow));
    closeButton.addEventListener('click', closeCertificateModal);
    doneButton.addEventListener('click', closeCertificateModal);
    modal.addEventListener('click', event => { if (event.target === modal) closeCertificateModal(); });
    document.addEventListener('click', event => {
      if (!event.target.closest('.cert-row-actions')) closeCertificateMenus();
    });
    window.addEventListener('resize', () => closeCertificateMenus());
    window.addEventListener('scroll', () => closeCertificateMenus(), true);
    document.addEventListener('keydown', event => {
      if (modal.hidden) return;
      if (event.key === 'Escape') {
        closeCertificateModal();
        return;
      }
      if (event.key === 'Tab') {
        const focusable = [...card.querySelectorAll('button, [href], [tabindex]:not([tabindex="-1"])')]
          .filter(element => !element.disabled && !element.hidden);
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });
  }
})();
