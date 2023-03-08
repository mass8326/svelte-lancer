import { expect, test } from "@playwright/test";

test("index page has expected h1", async ({ page }) => {
	await page.goto("/");

	await expect(page.locator("h1")).toBeVisible();
	await expect(page.locator("form")).toHaveCount(1);
});
