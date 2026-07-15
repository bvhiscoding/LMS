async (page) => {
  const origin = await page.evaluate(() => location.origin);
  page.setDefaultTimeout(4000);
  const results = [];
  const go = path => page.goto(`${origin}${path}`);
  const capture = async (name, action) => {
    try {
      await action();
      await page.screenshot({ path: `output/playwright/${name}.png`, fullPage: false });
      results.push({ name, status: 'ok' });
    } catch (error) {
      results.push({ name, status: 'failed', error: error.message });
    }
  };
  await page.setViewportSize({ width: 1440, height: 900 });

  await capture('gv-dashboard-bo-loc', async () => {
    await go('/html/gv/dashboard-giang-vien.html');
    await page.locator('.dashboard-period select').selectOption({ index: 1 });
  });
  await capture('gv-chi-phi-nhap-khoan-chi', async () => {
    await go('/html/gv/chi-phi-dao-tao.html');
    await page.locator('#openCost').click();
  });
  await capture('gv-ke-hoach-phan-bo-chi-tieu', async () => {
    await go('/html/gv/chi-tiet-ke-hoach.html');
    await page.locator('[data-open="allocation"]').click();
  });
  await capture('gv-khoa-hoc-trinh-tao-bai-kiem-tra', async () => {
    await go('/html/gv/chi-tiet-khoa-hoc.html');
    await page.locator('[data-course-tab="tests"]').click();
    await page.getByRole('button', { name: /Tạo.*bài kiểm tra/ }).first().click();
  });
  await capture('gv-lop-hoc-trinh-tao-bai-kiem-tra', async () => {
    await go('/html/gv/chi-tiet-lop-hoc.html');
    await page.locator('[data-class-tab="tests"]').click();
    await page.getByRole('button', { name: /Thêm bài kiểm tra/ }).first().click();
  });
  await capture('gv-chuc-danh-chinh-sua', async () => {
    await go('/html/gv/chi-tiet-chuc-danh.html');
    await page.locator('#editPosition').click();
  });
  await capture('gv-ngan-hang-tao-de-thu-cong', async () => {
    await go('/html/gv/ngan-hang-de-thi.html?tab=exams');
    const button = page.locator('[data-action="manual"]');
    await button.evaluate(element => element.click());
  });
  await capture('gv-giam-sat-ket-qua-ca-thi', async () => {
    await go('/html/gv/giam-sat-thi.html');
    await page.locator('#proctorTableBody [data-action="result"]').first().evaluate(element => element.click());
  });
  await capture('ld-kpi-tuy-chinh-cot', async () => {
    await go('/html/ld/bao-cao-kpi.html');
    await page.getByRole('button', { name: /Tùy chỉnh cột/ }).click();
  });
  await capture('ld-don-vi-sap-xep', async () => {
    await go('/html/ld/bao-cao-don-vi.html');
    await page.getByRole('button', { name: /Sắp xếp/ }).click();
  });
  await capture('desktop-1920-dashboard-hoc-vien', async () => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await go('/');
  });
  return results;
}
