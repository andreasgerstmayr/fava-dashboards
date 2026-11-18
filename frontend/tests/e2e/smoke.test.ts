import { expect, test } from "@playwright/test";

const BASE_URL = "http://127.0.0.1:5000";
const EXAMPLE_URL = `${BASE_URL}/beancount/extension/FavaDashboards/`;

test("Overview dashboard", async ({ page }) => {
  await page.goto(`${EXAMPLE_URL}?dashboard=overview`);
  await page.waitForLoadState("networkidle");
  await expect(page.locator(".MuiCircularProgress-root")).toHaveCount(0);
  await expect(page.locator(".MuiSkeleton-root")).toHaveCount(0);

  await expect(page.locator("body")).toContainText("Income vs. Expenses");
  await expect(page.getByRole("alert")).toHaveCount(0);
});
