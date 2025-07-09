import { test, expect, Page } from '@playwright/test';
let text = "";
async function start(page: Page, url = "http://localhost:3000/page1/", title = "Page 1") {
	text = "";
	page.on("console", msg => msg.text().startsWith("test") && (text += msg.text().slice(4)));
	await page.goto(url);
	await expect(page).toHaveTitle(title);
	expect(text).toBe("");
	text = "";
}

test('basic navigation', async ({ page }) => {
	await start(page);
	await page.locator('#l1').click();
	await expect(page).toHaveTitle("Page 2");
	await page.waitForTimeout(100);
	expect(text).toBe(" [pageswap] 2 forward old [pagereveal] 2 forward new");
});

test('backward traversal detection', async ({ page, browserName }) => {
	test.skip(browserName === 'webkit', "not for webkit");
	await start(page);
	await page.locator('#l1').click();
	await page.waitForTimeout(100);
	await expect(page).toHaveTitle("Page 2");
	text = "";
	await page.goBack();
	await expect(page).toHaveTitle("Page 1");
	await page.waitForTimeout(150);
	expect(text).toBe(" [pageswap] 2 forward old [pagereveal] 2 forward new");
});

test('s backward traversal detection', async ({ page, browserName }) => {
	test.skip(browserName !== 'webkit', "only for webkit");
	await start(page);
	await page.locator('#l1').click();
	await page.waitForTimeout(100);
	await expect(page).toHaveTitle("Page 2");
	text = "";
	await page.goBack();
	await expect(page).toHaveTitle("Page 1");
	await page.waitForTimeout(100);
	expect(text).toBe(" [pageswap] 1 old [pagereveal] 2 forward new");
});

test('both', async ({ page, browserName }) => {
	test.skip(browserName === 'webkit', "not for webkit");
	await start(page);
	await page.locator('#l2').click();
	await expect(page).toHaveTitle("Page 2");
	await page.waitForTimeout(100);
	expect(text).toBe(" [pageswap] 2 forward old [pagereveal] 2 forward new");
	text = "";
	await page.goBack();
	await expect(page).toHaveTitle('Page 1');
	await page.waitForTimeout(100);
	expect(text).toBe(" [pageswap] 2 backward old [pagereveal] 2 backward new");
});

test('s both', async ({ page, browserName }) => {
	test.skip(browserName !== 'webkit', "only for webkit");
	await start(page);
	await page.locator('#l2').click();
	await expect(page).toHaveTitle("Page 2");
	expect(text).toBe(" [pageswap] 2 forward old [pagereveal] 2 forward new");
	text = "";
	await page.goBack();
	await expect(page).toHaveTitle('Page 1');
	await page.waitForTimeout(100);
	expect(text).toBe(" [pageswap] 1 old [pagereveal] 2 backward new");
});

test('multi', async ({ page, browserName }) => {
	test.skip(browserName === 'webkit', "not for webkit");
	await start(page);
	await page.locator('#l3').click();
	await expect(page).toHaveTitle("Page 2");
	await page.waitForTimeout(100);
	expect(text).toBe(" [pageswap] 3 f1 f2 old [pagereveal] 3 f1 f2 new");
	text = "";
	await page.goBack();
	await expect(page).toHaveTitle('Page 1');
	await page.waitForTimeout(100);
	expect(text).toBe(" [pageswap] 3 b1 b2 old [pagereveal] 3 b1 b2 new");
});

test('s multi', async ({ page, browserName }) => {
	test.skip(browserName !== 'webkit', "only for webkit");
	await start(page);
	await page.locator('#l3').click();
	await expect(page).toHaveTitle("Page 2");
	expect(text).toBe(" [pageswap] 3 f1 f2 old [pagereveal] 3 f1 f2 new");
	text = "";
	await page.goBack();
	await expect(page).toHaveTitle('Page 1');
	await page.waitForTimeout(100);
	expect(text).toBe(" [pageswap] 1 old [pagereveal] 3 b1 b2 new");
});

test('normal', async ({ page }) => {
	await start(page);
	await page.locator('#l4').click();
	await expect(page).toHaveTitle("Page 2");
	await page.waitForTimeout(100);
	expect(text).toBe(" [pageswap] 1 old [pagereveal] 1 new");
	text = "";
	await page.goBack();
	await expect(page).toHaveTitle('Page 1');
	await page.waitForTimeout(100);
	expect(text).toBe(" [pageswap] 1 old [pagereveal] 1 new");
});

test('empty', async ({ page }) => {
	await start(page);
	await page.locator('#l5').click();
	await expect(page).toHaveTitle("Page 2");
	expect(text).toBe(" [pageswap] 1 old [pagereveal] 1 new");
	text = "";
	await page.goBack();
	await expect(page).toHaveTitle('Page 1');
	await page.waitForTimeout(100);
	await new Promise(r => setTimeout(r, 100));
	expect(text).toBe(" [pageswap] 1 old [pagereveal] 1 new");
});

test('empty2', async ({ page }) => {
	await start(page);
	await page.locator('#l6').click();
	await expect(page).toHaveTitle("Page 2");
	await page.waitForTimeout(100);
	expect(text).toBe(" [pageswap] 1 old [pagereveal] 1 new");
	text = "";
	await page.goBack();
	await expect(page).toHaveTitle('Page 1');
	await page.waitForTimeout(100);
	expect(text).toBe(" [pageswap] 1 old [pagereveal] 1 new");
});

test('two', async ({ page, browserName }) => {
	test.skip(browserName === 'webkit', "not for webkit");
	await start(page);
	await page.locator('#l3').click();
	await expect(page).toHaveTitle("Page 2");
	await page.waitForTimeout(100);
	expect(text).toBe(" [pageswap] 3 f1 f2 old [pagereveal] 3 f1 f2 new");
	text = "";
	await page.locator('#l1').click();
	await expect(page).toHaveTitle("Page 1");

	await new Promise(r => setTimeout(r, 100));
	expect(text).toBe(" [pageswap] 3 explicit backward old [pagereveal] 3 explicit backward new");
	text = "";
	await page.goBack();
	await expect(page).toHaveTitle("Page 2");
	await page.waitForTimeout(100);
	expect(text).toBe(" [pageswap] 3 back go old [pagereveal] 3 back go new");
	text = "";
	await page.goBack();
	await expect(page).toHaveTitle("Page 1");
	await page.waitForTimeout(100);
	expect(text).toBe(" [pageswap] 3 b1 b2 old [pagereveal] 3 b1 b2 new");
});

test('s two', async ({ page, browserName }) => {
	test.skip(browserName !== 'webkit', "only for webkit");
	await start(page);
	await page.locator('#l3').click();
	await expect(page).toHaveTitle("Page 2");
	await page.waitForTimeout(100);
	expect(text).toBe(" [pageswap] 3 f1 f2 old [pagereveal] 3 f1 f2 new");
	text = "";
	await page.locator('#l1').click();
	await expect(page).toHaveTitle("Page 1");
	expect(text).toBe(" [pageswap] 3 explicit backward old [pagereveal] 3 explicit backward new");
	text = "";
	await page.goBack();
	await expect(page).toHaveTitle("Page 2");
	await page.waitForTimeout(100);
	expect(text).toBe(" [pageswap] 1 old [pagereveal] 3 back go new");
	text = "";
	await page.goBack();
	await expect(page).toHaveTitle("Page 1");
	await page.waitForTimeout(100);
	expect(text).toBe(" [pageswap] 1 old [pagereveal] 3 b1 b2 new");
});

test('full', async ({ page, browserName }) => {
	test.skip(browserName === 'webkit', "not for webkit");
	await start(page);
	await page.locator('#l3').click();
	await expect(page).toHaveTitle("Page 2");
	await new Promise(r => setTimeout(r, 100));
	expect(text).toBe(" [pageswap] 3 f1 f2 old [pagereveal] 3 f1 f2 new");
	text = "";
	await page.locator('#l2').click();
	await expect(page).toHaveTitle("Page 3");
	expect(text).toBe(" [pageswap] 2 hi old [pagereveal] 2 hi new");
	text = "";
	await page.locator('#l3').click();
	await expect(page).toHaveTitle("Page 4");
	await new Promise(r => setTimeout(r, 100));
	expect(text).toBe(" [pageswap] 2 foo old [pagereveal] 2 foo new");
	text = "";
	await page.goBack();
	await expect(page).toHaveTitle("Page 3");
	await page.waitForTimeout(100);
	expect(text).toBe(" [pageswap] 2 bar old [pagereveal] 2 bar new");
	text = "";
	await page.locator('#l4').click();
	await expect(page).toHaveTitle("Page 1");
	await page.waitForTimeout(100);
	expect(text).toBe(" [pageswap] 3 b1 b2 old [pagereveal] 3 b1 b2 new");
	text = "";
	await page.locator('#l7').click();
	await expect(page).toHaveTitle("Page 4");
	await page.waitForTimeout(100);
	expect(text).toBe(" [pageswap] 3 f1 f2 old [pagereveal] 3 f1 f2 new");
	text = "";
	await page.locator('#l3').click();
	await expect(page).toHaveTitle("Page 2");
	await page.waitForTimeout(100);
	expect(text).toBe(" [pageswap] 2 ho old [pagereveal] 2 ho new");
	text = "";
	await page.locator('#l3').click();
	await expect(page).toHaveTitle("Page 1");
	await new Promise(r => setTimeout(r, 100));
	expect(text).toBe(" [pageswap] 2 bla old [pagereveal] 2 bla new");
	text = "";
	await page.locator('#l8').click();
	await expect(page).toHaveTitle("Page 1");
	expect(text).toBe("");
	text = "";
	await page.locator('#l9').click();
	await expect(page).toHaveTitle("Page 1");
	await page.waitForTimeout(100);
	expect(text).toBe(" [pageswap] 2 go old [pagereveal] 2 go new");
	text = "";
	await page.locator('#l0').click();
	await expect(page).toHaveTitle("Page 1");
	expect(text).toBe("");
});

test('s full', async ({ page, browserName }) => {
	test.skip(browserName !== 'webkit', "only for webkit");
	await start(page);
	await page.locator('#l3').click();
	await expect(page).toHaveTitle("Page 2");
	expect(text).toBe(" [pageswap] 3 f1 f2 old [pagereveal] 3 f1 f2 new");
	text = "";
	await page.locator('#l2').click();
	await expect(page).toHaveTitle("Page 3");
	expect(text).toBe(" [pageswap] 2 hi old [pagereveal] 2 hi new");
	text = "";
	await page.locator('#l3').click();
	await expect(page).toHaveTitle("Page 4");
	expect(text).toBe(" [pageswap] 2 foo old [pagereveal] 2 foo new");
	text = "";
	await page.goBack();
	await expect(page).toHaveTitle("Page 3");
	await page.waitForTimeout(100);
	expect(text).toBe(" [pageswap] 1 old [pagereveal] 2 bar new");
	text = "";
	await page.locator('#l4').click();
	await expect(page).toHaveTitle("Page 1");
	expect(text).toBe(" [pageswap] 1 old [pagereveal] 3 b1 b2 new");
	text = "";
	await page.locator('#l7').click();
	await expect(page).toHaveTitle("Page 4");
	await page.waitForTimeout(100);
	expect(text).toBe(" [pageswap] 1 old [pagereveal] 3 f1 f2 new");
	text = "";
	await page.locator('#l3').click();
	await expect(page).toHaveTitle("Page 2");
	await page.waitForTimeout(100);
	expect(text).toBe(" [pageswap] 1 old [pagereveal] 2 ho new");
	text = "";
	await page.locator('#l3').click();
	await expect(page).toHaveTitle("Page 1");
	expect(text).toBe(" [pageswap] 2 bla old [pagereveal] 2 bla new");
	text = "";
	await page.locator('#l8').click();
	await expect(page).toHaveTitle("Page 1");
	expect(text).toBe("");
	text = "";
	await page.locator('#l9').click();
	await expect(page).toHaveTitle("Page 1");
	await page.waitForTimeout(100);
	expect(text).toBe(" [pageswap] 2 go old [pagereveal] 2 go new");
	text = "";
	await page.locator('#l0').click();
	await expect(page).toHaveTitle("Page 1");
	expect(text).toBe("");
});

test('override', async ({ page, browserName }) => {
	test.skip(browserName === 'webkit', "not for webkit");
	await start(page, "http://localhost:3000/page5/", "Page 5");

	await page.locator('#l1').click();
	await expect(page).toHaveTitle("Page 6");
	expect(text).toBe(" [pageswap] 2 flink old [pagereveal] 2 flink new");
	text = "";
	await page.locator('#l1').click();
	await expect(page).toHaveTitle("Page 6");
	expect(text).toBe(" [pageswap] 2 slink old [pagereveal] 2 slink new");
	text = "";
	await page.goBack();
	await expect(page).toHaveTitle("Page 5");
	await page.waitForTimeout(100);
	expect(text).toBe(" [pageswap] 2 blink old [pagereveal] 2 blink new");
	text = "";
	await page.locator('#l2').click();
	await expect(page).toHaveTitle("Page 6");
	await page.waitForTimeout(100);
	expect(text).toBe(" [pageswap] 2 forward old [pagereveal] 2 forward new");
	text = "";
	await page.locator('#l2').click();
	await expect(page).toHaveTitle("Page 6");
	await page.waitForTimeout(100);
	expect(text).toBe(" [pageswap] 2 same old [pagereveal] 2 same new");
	text = "";
	await page.goBack();
	await expect(page).toHaveTitle("Page 5");
	await page.waitForTimeout(100);
	expect(text).toBe(" [pageswap] 2 backward old [pagereveal] 2 backward new");
});

test('s override', async ({ page, browserName }) => {
	test.skip(browserName !== 'webkit', "webkit only");
	await start(page, "http://localhost:3000/page5/", "Page 5");

	await page.locator('#l1').click();
	await expect(page).toHaveTitle("Page 6");
	expect(text).toBe(" [pageswap] 2 flink old [pagereveal] 2 flink new");
	text = "";
	await page.locator('#l1').click();
	await expect(page).toHaveTitle("Page 6");
	expect(text).toBe(" [pageswap] 2 slink old [pagereveal] 2 slink new");
	text = "";
	await page.goBack();
	await expect(page).toHaveTitle("Page 5");
	await page.waitForTimeout(100);
	expect(text).toBe(" [pageswap] 1 old [pagereveal] 2 blink new");
	text = "";
	await page.locator('#l2').click();
	await expect(page).toHaveTitle("Page 6");
	await page.waitForTimeout(100);
	expect(text).toBe(" [pageswap] 2 forward old [pagereveal] 2 forward new");
	text = "";
	await page.locator('#l2').click();
	await expect(page).toHaveTitle("Page 6");
	await page.waitForTimeout(100);
	expect(text).toBe(" [pageswap] 2 same old [pagereveal] 2 same new");
	text = "";
	await page.goBack();
	await expect(page).toHaveTitle("Page 5");
	await page.waitForTimeout(100);
	expect(text).toBe(" [pageswap] 1 old [pagereveal] 2 backward new");
});

