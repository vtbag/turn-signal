import { test, expect, Page } from '@playwright/test';
let text = "";
async function start(page: Page) {
	text = "";
	page.on("console", msg => msg.text().startsWith("test") && (text += msg.text().slice(4)));
	await page.goto('http://localhost:3000/page1/');
	await expect(page).toHaveTitle("Page 1");
	expect(text).toBe("");
	text = "";
}

test('basic navigation', async ({ page }) => {
	await start(page);
	await page.locator('#l1').click();
	await expect(page).toHaveTitle("Page 2");
	expect(text).toBe(" [pageswap] 1 forward [pagereveal] 1 forward");
});

test('backward traversal detection', async ({ page }) => {
	await start(page);
	await page.locator('#l1').click();
	await page.waitForTimeout(100);
	await expect(page).toHaveTitle("Page 2");
	text = "";
	await page.goBack();
	await expect(page).toHaveTitle("Page 1");
	await page.waitForTimeout(100);
	expect(text).toBe(" [pageswap] 1 forward [pagereveal] 1 forward");
});

test('both', async ({ page }) => {
	await start(page);
	await page.locator('#l2').click();
	await expect(page).toHaveTitle("Page 2");
	expect(text).toBe(" [pageswap] 1 forward [pagereveal] 1 forward");
	text = "";
	await page.goBack();
	await expect(page).toHaveTitle('Page 1');
	await page.waitForTimeout(100);
	expect(text).toBe(" [pageswap] 1 backward [pagereveal] 1 backward");
});

test('multi', async ({ page }) => {
	await start(page);
	await page.locator('#l3').click();
	await expect(page).toHaveTitle("Page 2");
	expect(text).toBe(" [pageswap] 2 f1 f2 [pagereveal] 2 f1 f2");
	text = "";
	await page.goBack();
	await expect(page).toHaveTitle('Page 1');
	await page.waitForTimeout(100);
	expect(text).toBe(" [pageswap] 2 b1 b2 [pagereveal] 2 b1 b2");
});

test('normal', async ({ page }) => {
	await start(page);
	await page.locator('#l4').click();
	await expect(page).toHaveTitle("Page 2");
	expect(text).toBe(" [pageswap] 0 [pagereveal] 0");
	text = "";
	await page.goBack();
	await expect(page).toHaveTitle('Page 1');
	await page.waitForTimeout(100);
	expect(text).toBe(" [pageswap] 0 [pagereveal] 0");
});

test('empty', async ({ page }) => {
	await start(page);
	await page.locator('#l5').click();
	await expect(page).toHaveTitle("Page 2");
	expect(text).toBe(" [pageswap] 0 [pagereveal] 0");
	text = "";
	await page.goBack();
	await expect(page).toHaveTitle('Page 1');
	await page.waitForTimeout(100);
	expect(text).toBe(" [pageswap] 0 [pagereveal] 0");
});

test('empty2', async ({ page }) => {
	await start(page);
	await page.locator('#l6').click();
	await expect(page).toHaveTitle("Page 2");
	await page.waitForTimeout(100);
	expect(text).toBe(" [pageswap] 0 [pagereveal] 0");
	text = "";
	await page.goBack();
	await expect(page).toHaveTitle('Page 1');
	await page.waitForTimeout(100);
	expect(text).toBe(" [pageswap] 0 [pagereveal] 0");
});

test('two', async ({ page }) => {
	await start(page);
	await page.locator('#l3').click();
	await expect(page).toHaveTitle("Page 2");
	await page.waitForTimeout(100);
	expect(text).toBe(" [pageswap] 2 f1 f2 [pagereveal] 2 f1 f2");
	text = "";
	await page.locator('#l1').click();
	await expect(page).toHaveTitle("Page 1");
	expect(text).toBe(" [pageswap] 2 explicit backward [pagereveal] 2 explicit backward");
	text = "";
	await page.goBack();
	await expect(page).toHaveTitle("Page 2");
	await page.waitForTimeout(100);
	expect(text).toBe(" [pageswap] 2 back go [pagereveal] 2 back go");
	text = "";
	await page.goBack();
	await expect(page).toHaveTitle("Page 1");
	await page.waitForTimeout(100);
	expect(text).toBe(" [pageswap] 2 b1 b2 [pagereveal] 2 b1 b2");
});
test('full', async ({ page }) => {
	await start(page);
	await page.locator('#l3').click();
	await expect(page).toHaveTitle("Page 2");
	expect(text).toBe(" [pageswap] 2 f1 f2 [pagereveal] 2 f1 f2");
	text = "";
	await page.locator('#l2').click();
	await expect(page).toHaveTitle("Page 3");
	expect(text).toBe(" [pageswap] 1 hi [pagereveal] 1 hi");
	text = "";
	await page.locator('#l3').click();
	await expect(page).toHaveTitle("Page 4");
	expect(text).toBe(" [pageswap] 1 foo [pagereveal] 1 foo");
	text = "";
	await page.goBack();
	await expect(page).toHaveTitle("Page 3");
	await page.waitForTimeout(100);
	expect(text).toBe(" [pageswap] 1 bar [pagereveal] 1 bar");
	text = "";
	await page.locator('#l4').click();
	await expect(page).toHaveTitle("Page 1");
	expect(text).toBe(" [pageswap] 2 b1 b2 [pagereveal] 2 b1 b2");
	text = "";
	await page.locator('#l7').click();
	await expect(page).toHaveTitle("Page 4");
	await page.waitForTimeout(100);
	expect(text).toBe(" [pageswap] 2 f1 f2 [pagereveal] 2 f1 f2");
	text = "";
	await page.locator('#l3').click();
	await expect(page).toHaveTitle("Page 2");
	await page.waitForTimeout(100);
	expect(text).toBe(" [pageswap] 1 ho [pagereveal] 1 ho");
	text = "";
	await page.locator('#l3').click();
	await expect(page).toHaveTitle("Page 1");
	expect(text).toBe(" [pageswap] 1 bla [pagereveal] 1 bla");
	text = "";
	await page.locator('#l8').click();
	await expect(page).toHaveTitle("Page 1");
	expect(text).toBe("");
	text = "";
	await page.locator('#l9').click();
	await expect(page).toHaveTitle("Page 1");
	await page.waitForTimeout(100);
	expect(text).toBe(" [pageswap] 1 go [pagereveal] 1 go");
	text = "";
	await page.locator('#l0').click();
	await expect(page).toHaveTitle("Page 1");
	expect(text).toBe("");
});


async function start2(page: Page) {
	text = "";
	page.on("console", msg => msg.text().startsWith("test") && (text += msg.text().slice(4)));
	await page.goto('http://localhost:3000/page11/');
	await expect(page).toHaveTitle("Page 1");
	expect(text).toBe("");
	text = "";
}

test('2 basic navigation', async ({ browserName, page }) => {
	test.skip(browserName !== 'webkit', "only for webkit");
	await start2(page);
	await page.locator('#l1').click();
	await expect(page).toHaveTitle("Page 2");
	expect(text).toBe(" [pageswap] 1 forward [pagereveal] 1 forward");
});

test('2 backward traversal detection', async ({browserName, page }) => {
	test.skip(browserName !== 'webkit', "only for webkit");
	await start2(page);
	await page.locator('#l1').click();
	await page.waitForTimeout(100);
	await expect(page).toHaveTitle("Page 2");
	text = "";
	await page.goBack();
	await expect(page).toHaveTitle("Page 1");
	await page.waitForTimeout(100);
	expect(text).toBe(" [pageswap] 0 [pagereveal] 1 forward");
});

test('2 both', async ({browserName, page }) => {
	test.skip(browserName !== 'webkit', "only for webkit");
	await start2(page);
	await page.locator('#l2').click();
	await expect(page).toHaveTitle("Page 2");
	expect(text).toBe(" [pageswap] 1 forward [pagereveal] 1 forward");
	text = "";
	await page.goBack();
	await expect(page).toHaveTitle('Page 1');
	await page.waitForTimeout(100);
	expect(text).toBe(" [pageswap] 0 [pagereveal] 1 backward");
});

test('2 multi', async ({browserName, page }) => {
	test.skip(browserName !== 'webkit', "only for webkit");
	await start2(page);
	await page.locator('#l3').click();
	await expect(page).toHaveTitle("Page 2");
	expect(text).toBe(" [pageswap] 2 f1 f2 [pagereveal] 2 f1 f2");
	text = "";
	await page.goBack();
	await expect(page).toHaveTitle('Page 1');
	await page.waitForTimeout(100);
	expect(text).toBe(" [pageswap] 0 [pagereveal] 2 b1 b2");
});

test('2 normal', async ({browserName, page }) => {
	test.skip(browserName !== 'webkit', "only for webkit");
	await start2(page);
	await page.locator('#l4').click();
	await expect(page).toHaveTitle("Page 2");
	expect(text).toBe(" [pageswap] 0 [pagereveal] 0");
	text = "";
	await page.goBack();
	await expect(page).toHaveTitle('Page 1');
	await page.waitForTimeout(100);
	expect(text).toBe(" [pageswap] 0 [pagereveal] 0");
});

test('2 empty', async ({browserName, page }) => {
	test.skip(browserName !== 'webkit', "only for webkit");
	await start2(page);
	await page.locator('#l5').click();
	await expect(page).toHaveTitle("Page 2");
	expect(text).toBe(" [pageswap] 0 [pagereveal] 0");
	text = "";
	await page.goBack();
	await expect(page).toHaveTitle('Page 1');
	await page.waitForTimeout(100);
	expect(text).toBe(" [pageswap] 0 [pagereveal] 0");
});

test('2 empty2', async ({browserName, page }) => {
	test.skip(browserName !== 'webkit', "only for webkit");
	await start2(page);
	await page.locator('#l6').click();
	await expect(page).toHaveTitle("Page 2");
	await page.waitForTimeout(100);
	expect(text).toBe(" [pageswap] 0 [pagereveal] 0");
	text = "";
	await page.goBack();
	await expect(page).toHaveTitle('Page 1');
	await page.waitForTimeout(100);
	expect(text).toBe(" [pageswap] 0 [pagereveal] 0");
});

test('2 two', async ({browserName, page }) => {
	test.skip(browserName !== 'webkit', "only for webkit");
	await start2(page);
	await page.locator('#l3').click();
	await expect(page).toHaveTitle("Page 2");
	await page.waitForTimeout(100);
	expect(text).toBe(" [pageswap] 2 f1 f2 [pagereveal] 2 f1 f2");
	text = "";
	await page.locator('#l1').click();
	await expect(page).toHaveTitle("Page 1");
	expect(text).toBe(" [pageswap] 2 explicit backward [pagereveal] 2 explicit backward");
	text = "";
	await page.goBack();
	await expect(page).toHaveTitle("Page 2");
	await page.waitForTimeout(100);
	expect(text).toBe(" [pageswap] 0 [pagereveal] 2 back go");
	text = "";
	await page.goBack();
	await expect(page).toHaveTitle("Page 1");
	await page.waitForTimeout(100);
	expect(text).toBe(" [pageswap] 0 [pagereveal] 2 b1 b2");
});
test('2 full', async ({browserName, page }) => {
	test.skip(browserName !== 'webkit', "only for webkit");
	await start2(page);
	await page.locator('#l3').click();
	await expect(page).toHaveTitle("Page 2");
	expect(text).toBe(" [pageswap] 2 f1 f2 [pagereveal] 2 f1 f2");
	text = "";
	await page.locator('#l2').click();
	await expect(page).toHaveTitle("Page 3");
	expect(text).toBe(" [pageswap] 1 hi [pagereveal] 1 hi");
	text = "";
	await page.locator('#l3').click();
	await expect(page).toHaveTitle("Page 4");
	expect(text).toBe(" [pageswap] 1 foo [pagereveal] 1 foo");
	text = "";
	await page.goBack();
	await expect(page).toHaveTitle("Page 3");
	await page.waitForTimeout(100);
	expect(text).toBe(" [pageswap] 0 [pagereveal] 1 bar");
	text = "";
	await page.locator('#l4').click();
	await expect(page).toHaveTitle("Page 1");
	expect(text).toBe(" [pageswap] 0 [pagereveal] 2 b1 b2");
	text = "";
	await page.locator('#l7').click();
	await expect(page).toHaveTitle("Page 4");
	await page.waitForTimeout(100);
	expect(text).toBe(" [pageswap] 0 [pagereveal] 2 f1 f2");
	text = "";
	await page.locator('#l3').click();
	await expect(page).toHaveTitle("Page 2");
	await page.waitForTimeout(100);
	expect(text).toBe(" [pageswap] 0 [pagereveal] 1 ho");
	text = "";
	await page.locator('#l3').click();
	await expect(page).toHaveTitle("Page 1");
	expect(text).toBe(" [pageswap] 1 bla [pagereveal] 1 bla");
	text = "";
	await page.locator('#l8').click();
	await expect(page).toHaveTitle("Page 1");
	expect(text).toBe("");
	text = "";
	await page.locator('#l9').click();
	await expect(page).toHaveTitle("Page 1");
	expect(text).toBe(" [pageswap] 1 go [pagereveal] 1 go");
	text = "";
	await page.locator('#l0').click();
	await expect(page).toHaveTitle("Page 1");
	expect(text).toBe("");
});