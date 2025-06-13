import { expect, test } from "@playwright/test";

const BASE_URL = "http://127.0.0.1:5000/beancount/extension/FavaDashboards/";
const dashboards = [
  { name: "Overview", url: "" },
  { name: "Assets", url: "?dashboard=1" },
  { name: "Income and Expenses", url: "?dashboard=2" },
  { name: "Travelling", url: "?dashboard=3" },
  { name: "Sankey", url: "?dashboard=4" },
  { name: "Projection", url: "?dashboard=5" },
];

test.describe("PNG Snapshot Tests", () => {
  test.describe("Light Theme", () => {
    dashboards.forEach(({ name, url }) => {
      test(name, async ({ page }) => {
        await page.goto(`${BASE_URL}${url}`);
        await expect(page).toHaveScreenshot();
      });
    });
  });

  test.describe("Dark Theme", () => {
    test.use({ colorScheme: "dark" });
    dashboards.forEach(({ name, url }) => {
      test(name, async ({ page }) => {
        await page.goto(`${BASE_URL}${url}`);
        await expect(page).toHaveScreenshot();
      });
    });
  });
});

test.describe("HTML Snapshot Tests", () => {
  dashboards.forEach(({ name, url }) => {
    test(name, async ({ page }) => {
      await page.goto(`${BASE_URL}${url}`);
      await expect(page.locator("body")).toMatchAriaSnapshot();
    });
  });
});
