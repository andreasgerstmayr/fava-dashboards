import { expect, test } from "@playwright/test";

const BASE_URL = "http://127.0.0.1:5000";
const EXAMPLE_URL = `${BASE_URL}/beancount/extension/FavaDashboards/`;

test("Overview dashboard", async ({ page }) => {
  await page.goto(`${EXAMPLE_URL}?dashboard=overview`);
  await expect(page.locator("body")).toContainText("Income vs. Expenses");
});
