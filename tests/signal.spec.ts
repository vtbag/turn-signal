import { test, expect, Page } from '@playwright/test';
let text = "";
async function start(page: Page, url:string) {
	text = "";
	page.on("console", msg => msg.text().startsWith("test") && (text += msg.text().slice(4)));
	await page.goto(url);
	await expect(page).toHaveTitle("Page 1");
	expect(text).toBe("");
	text = "";
}

test('full', async ({ page }) => {
	await start(page, 'http://localhost:3000/signal1/');
	await page.locator('#l1').click();
	await expect(page).toHaveTitle("Page 1");
	expect(text).toBe(" [pageswap] 2 same old [pagereveal] 2 same new");
	text = "";
	await page.locator('#l3').click();
	await expect(page).toHaveTitle("Page 3");
	expect(text).toBe(" [pageswap] 2 forward old [pagereveal] 2 forward new");
	text = "";
	await page.locator('#l2').click();
	await expect(page).toHaveTitle("Page 2");
	await page.waitForTimeout(100);
	expect(text).toBe(" [pageswap] 2 backward old [pagereveal] 2 backward new");
	text = "";
	await page.goBack();
	await expect(page).toHaveTitle("Page 3");
	await page.waitForTimeout(100);
	expect(text).toBe(" [pageswap] 2 forward old [pagereveal] 2 forward new");
	text = "";
	await page.locator('#l4').click();
	await expect(page).toHaveTitle("Page 4");
	expect(text).toBe(" [pageswap] 2 forward old [pagereveal] 2 forward new");
	text = "";
	await page.locator('#l2').click();
	await expect(page).toHaveTitle("Page 2");
	await page.waitForTimeout(100);
	expect(text).toBe(" [pageswap] 2 backward old [pagereveal] 2 backward new");
	text = "";
	await page.goBack();
	await expect(page).toHaveTitle("Page 4");
	await page.waitForTimeout(100);
	expect(text).toBe(" [pageswap] 2 forward old [pagereveal] 2 forward new");
	text = "";
	await page.goBack();
	await expect(page).toHaveTitle("Page 3");
	await page.waitForTimeout(100);
	expect(text).toBe(" [pageswap] 2 backward old [pagereveal] 2 backward new");
	text = "";
});

test('bf', async ({ page, browserName }) => {
	await start(page, 'http://localhost:3000/bf1/');
	await page.locator('#l1').click();
	await expect(page).toHaveTitle("Page 2");
	expect(text).toBe(" [pageswap] 2 forward old [pagereveal] 2 forward new");
	text = "";
	await page.locator('#l1').click();
	await expect(page).toHaveTitle("Page 3");
	await page.waitForTimeout(100);
	expect(text).toBe(" [pageswap] 2 forward old [pagereveal] 2 forward new");
	text = "";
	await page.goBack();
	await expect(page).toHaveTitle("Page 2");
	await page.waitForTimeout(100);
	expect(text).toBe(" [pageswap] 2 backward old [pagereveal] 2 backward new");
	text = "";
	await page.locator('#l2').click();
	await expect(page).toHaveTitle("Page 2");
	await page.waitForTimeout(100);
	expect(text).toBe(" [pageswap] 2 same old [pagereveal] 2 same new");
	text = "";
	await page.goBack();
	await expect(page).toHaveTitle("Page 1");
	await page.waitForTimeout(100);
	expect(text).toBe(" [pageswap] 2 backward old [pagereveal] 2 backward new");
	text = "";
	await page.goForward();
	await expect(page).toHaveTitle("Page 2");
	await page.waitForTimeout(100);
	expect(text).toBe(" [pageswap] 2 forward old [pagereveal] 2 forward new");
	text = "";
	await page.goForward();
	await expect(page).toHaveTitle("Page 3");
	await page.waitForTimeout(100);
	expect(text).toBe(" [pageswap] 2 forward old [pagereveal] 2 forward new");
	text = "";
});
test('2 full', async ({browserName, page }) => {
	test.skip(browserName !== 'webkit', "only for webkit");
	await start(page,'http://localhost:3000/signal11/');
	await page.locator('#l1').click();
	await expect(page).toHaveTitle("Page 1");
	expect(text).toBe(" [pageswap] 2 same old [pagereveal] 2 same new");
	text = "";
	await page.locator('#l3').click();
	await expect(page).toHaveTitle("Page 3");
	await page.waitForTimeout(100);
	expect(text).toBe(" [pageswap] 2 forward old [pagereveal] 2 forward new");
	text = "";
	await page.locator('#l2').click();
	await expect(page).toHaveTitle("Page 2");
	expect(text).toBe(" [pageswap] 2 backward old [pagereveal] 2 backward new");
	text = "";
	await page.goBack();
	await expect(page).toHaveTitle("Page 3");
	await page.waitForTimeout(100);
	expect(text).toBe(" [pageswap] 2 forward old [pagereveal] 2 forward new");
	text = "";
	await page.locator('#l4').click();
	await expect(page).toHaveTitle("Page 4");
	expect(text).toBe(" [pageswap] 2 forward old [pagereveal] 2 forward new");
	text = "";
	await page.locator('#l2').click();
	await expect(page).toHaveTitle("Page 2");
	await page.waitForTimeout(100);
	expect(text).toBe(" [pageswap] 2 backward old [pagereveal] 2 backward new");
	text = "";
	await page.goBack();
	await expect(page).toHaveTitle("Page 4");
	await page.waitForTimeout(100);
	expect(text).toBe(" [pageswap] 2 forward old [pagereveal] 2 forward new");
	text = "";
	await page.goBack();
	await expect(page).toHaveTitle("Page 3");
	await page.waitForTimeout(100);
	expect(text).toBe(" [pageswap] 2 backward old [pagereveal] 2 backward new");
	text = "";
});


test('2 bf', async ({ page , browserName}) => {
	test.skip(browserName !== 'webkit', "only for webkit");
	await start(page, 'http://localhost:3000/bf11/');
	await page.locator('#l1').click();
	await expect(page).toHaveTitle("Page 2");
	expect(text).toBe(" [pageswap] 2 forward old [pagereveal] 2 forward new");
	text = "";
	await page.locator('#l1').click();
	await expect(page).toHaveTitle("Page 3");
	expect(text).toBe(" [pageswap] 2 forward old [pagereveal] 2 forward new");
	text = "";
	await page.goBack();
	await expect(page).toHaveTitle("Page 2");
	await page.waitForTimeout(100);
	expect(text).toBe(" [pageswap] 1 old [pagereveal] 2 backward new");
	text = "";
	await page.locator('#l2').click();
	await expect(page).toHaveTitle("Page 2");
	await page.waitForTimeout(100);
	expect(text).toBe(" [pageswap] 2 same old [pagereveal] 2 same new");
	text = "";
	await page.goBack();
	await expect(page).toHaveTitle("Page 1");
	await page.waitForTimeout(100);
	expect(text).toBe(" [pageswap] 1 old [pagereveal] 2 backward new");
	text = "";
	await page.goForward();
	await expect(page).toHaveTitle("Page 2");
	await page.waitForTimeout(100);
	expect(text).toBe(" [pageswap] 1 old [pagereveal] 2 forward new");
	text = "";
	await page.goForward();
	await expect(page).toHaveTitle("Page 3");
	await page.waitForTimeout(100);
	expect(text).toBe(" [pageswap] 1 old [pagereveal] 2 forward new");
	text = "";
});