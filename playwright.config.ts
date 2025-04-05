import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
	testDir: './tests',
	workers: 1,
	webServer: {
		command: 'npm run start',
		port: 3000,
		reuseExistingServer: !process.env.CI,
	},
	projects: process.env.CI ? [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'], channel: 'chrome', },
		},
		{
			name: 'webkit',
			use: { ...devices['Desktop Safari'], browserName: 'webkit' },
		},
	] : [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'], channel: 'chrome', },
		}],
});
