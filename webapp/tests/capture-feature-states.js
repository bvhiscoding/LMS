async (page) => {
  const origin = await page.evaluate(() => location.origin);
  page.setDefaultTimeout(3000);
  const results = [];
  const capture = async (name, action) => {
    try {
      await action();
      await page.screenshot({ path: `output/playwright/${name}.png`, fullPage: false });
      results.push({ name, status: 'ok' });
    } catch (error) {
      results.push({ name, status: 'failed', error: error.message });
    }
  };
  const go = path => page.goto(`${origin}${path}`);
  await page.setViewportSize({ width: 1440, height: 900 });

  await capture('common-search-results', async () => {
    await go('/');
    const search = page.locator('header input, .topbar input').first();
    await search.fill('chứng chỉ');
    await search.press('Enter');
  });
  await capture('common-forgot-password', async () => {
    await go('/');
    await page.locator('#loginScreen').evaluate(element => element.classList.add('show'));
    await page.getByText('Quên mật khẩu?').first().evaluate(element => element.click());
  });
  await capture('hv-khoa-hoc-dang-ky-modal', async () => {
    await go('/html/hv/khoa-hoc-cua-toi.html');
    await page.getByRole('button', { name: 'Đăng ký', exact: true }).first().click();
  });
  await capture('hv-khoa-hoc-dang-ky-thanh-cong', async () => {
    await page.getByRole('button', { name: 'Đăng ký', exact: true }).last().click();
    await page.waitForTimeout(150);
  });
  await capture('hv-bai-giang-danh-gia-modal', async () => {
    await go('/html/hv/hoc-bai-giang.html');
    await page.locator('.lesson-rating').click();
  });
  await capture('hv-tu-luan-huong-dan-va-luu-bai', async () => {
    await go('/html/hv/bai-tu-luan.html');
    await page.locator('#essayAnswer').fill('Phân tích rủi ro, biện pháp kiểm soát và trách nhiệm của từng vị trí trong ca làm việc.');
    await page.locator('.essay-guide').click();
  });
  await capture('hv-lich-hoc-chi-tiet-su-kien', async () => {
    await go('/html/hv/lich-hoc-thi.html');
    await page.locator('.card .list-row').first().evaluate(element => element.click());
  });
  await capture('hv-lam-bai-thi-bao-cao-cau-hoi', async () => {
    await go('/html/hv/lam-bai-thi.html');
    await page.locator('#examOptions button').first().click();
    await page.locator('#markQuestion').click();
    await page.locator('.report-question').click();
  });
  await capture('hv-ket-qua-mo-rong-dap-an', async () => {
    await go('/html/hv/ket-qua-thi.html');
    await page.locator('.answer-expand').first().click();
  });
  await capture('hv-thao-luan-tao-moi-modal', async () => {
    await go('/html/hv/thao-luan.html');
    await page.locator('#newDiscussion').click();
    await page.locator('#topic').fill('Trao đổi quy trình an toàn');
    await page.locator('#detail').fill('Mọi người chia sẻ tình huống thực tế và cách xử lý nhé.');
  });
  await capture('hv-thao-luan-da-dang', async () => {
    await page.getByRole('button', { name: 'Đăng thảo luận' }).click();
  });
  await capture('hv-thong-bao-da-doc-tat-ca', async () => {
    await go('/html/hv/thong-bao.html');
    await page.locator('#notif .page-head button').click();
  });
  await capture('hv-tien-do-chi-tiet-ket-qua', async () => {
    await go('/html/hv/tien-do-va-ket-qua.html');
    await page.locator('a[href="#"]').first().evaluate(element => element.click());
  });
  await capture('hv-chung-chi-xem-truoc', async () => {
    await go('/html/hv/chung-chi-hoc-vien.html');
    await page.locator('.certificate-card button, .certificate-card .btn').first().click();
  });
  await capture('hv-khao-sat-da-gui', async () => {
    await go('/html/hv/khao-sat.html');
    for (const name of ['goal', 'materials', 'lms', 'satisfaction']) await page.locator(`[name="${name}"]`).first().check();
    await page.locator('#postTrainingSurvey textarea').fill('Nội dung thiết thực, dễ áp dụng tại đơn vị.');
    await page.locator('#postTrainingSurvey button[type="submit"]').click();
  });
  await capture('hv-thong-tin-ca-nhan-luu-thay-doi', async () => {
    await go('/html/hv/thong-tin-ca-nhan.html');
    const editable = page.locator('#hv-profile input:not([disabled])').first();
    await editable.fill(`${await editable.inputValue()} cập nhật`);
    await page.locator('#hv-profile .page-head button').click();
  });
  await capture('hv-xep-hang-doi-thuong', async () => {
    await go('/html/hv/xep-hang.html');
    await page.locator('button').filter({ hasText: /1[.,][02]00đ/ }).first().click();
  });

  await capture('gv-hoc-lieu-tao-noi-dung', async () => {
    await go('/html/gv/quan-ly-hoc-lieu.html');
    await page.locator('#gv-content .page-head button').nth(1).click();
  });
  await capture('gv-xet-hoan-thanh-phe-duyet', async () => {
    await go('/html/gv/xet-hoan-thanh.html');
    await page.locator('#gv-completion tbody input').first().check();
    await page.locator('#gv-completion .page-head button').nth(1).click();
  });
  await capture('ad-danh-muc-them-moi', async () => {
    await go('/html/ad/danh-muc-he-thong.html');
    await page.locator('#ad-catalog .page-head button').last().click();
  });
  await capture('ad-thiet-lap-xem-truoc', async () => {
    await go('/html/ad/thiet-lap-he-thong.html');
    const color = page.locator('#ad-config input[value^="#"]').first();
    await color.fill('#1557a0');
    await page.locator('#ad-config select').first().selectOption({ index: 1 });
  });
  await capture('ld-dashboard-dieu-chinh-du-lieu', async () => {
    await go('/html/ld/dashboard-lanh-dao.html');
    const select = page.locator('select').first();
    if (await select.count()) await select.selectOption({ index: 1 });
  });
  await capture('gv-cau-hoi-thong-ke-su-dung', async () => {
    await go('/html/gv/chi-tiet-cau-hoi.html');
    await page.getByText('18', { exact: true }).evaluate(element => element.click());
  });

  await capture('mobile-hv-lam-bai-thi', async () => {
    await page.setViewportSize({ width: 390, height: 844 });
    await go('/html/hv/lam-bai-thi.html');
  });
  await capture('mobile-gv-quan-ly-hoc-lieu', async () => {
    await go('/html/gv/quan-ly-hoc-lieu.html');
  });
  await page.setViewportSize({ width: 1440, height: 900 });
  return results;
}
