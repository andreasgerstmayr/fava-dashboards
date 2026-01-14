import { expect, Page, test } from "@playwright/test";

const BASE_URL = "http://127.0.0.1:5000";
const EXAMPLE_URL = `${BASE_URL}/beancount/extension/FavaDashboards/`;
const dashboards = [
  { name: "Overview", url: "" },
  { name: "Assets", url: "#/dashboards/assets" },
  { name: "Income and Expenses", url: "#/dashboards/income-and-expenses" },
  { name: "Travelling", url: "#/dashboards/travelling" },
  { name: "Sankey", url: "#/dashboards/sankey" },
  { name: "Projection", url: "#/dashboards/projection" },
];

async function expectScreenshot(page: Page) {
  await page.evaluate(() => {
    // full page screenshot doesn't work due to sticky sidebar
    document.body.style.height = "inherit";
  });
  await page.waitForLoadState("networkidle");
  await expect(page.locator(".MuiCircularProgress-root")).toHaveCount(0);
  await expect(page.locator(".MuiSkeleton-root")).toHaveCount(0);
  await expect(page).toHaveScreenshot({ fullPage: true });
}

test.describe("PNG Snapshot Tests", () => {
  test.describe("Light Theme", () => {
    dashboards.forEach(({ name, url }) => {
      test(name, async ({ page }) => {
        await page.goto(`${EXAMPLE_URL}${url}`);
        await expectScreenshot(page);
      });
    });
  });

  test.describe("Dark Theme", () => {
    test.use({ colorScheme: "dark" });
    dashboards.forEach(({ name, url }) => {
      test(name, async ({ page }) => {
        await page.goto(`${EXAMPLE_URL}${url}`);
        await expectScreenshot(page);
      });
    });
  });
});

test.describe("HTML Snapshot Tests", () => {
  dashboards.forEach(({ name, url }) => {
    test(name, async ({ page }) => {
      await page.goto(`${EXAMPLE_URL}${url}`);
      await expect(page.locator("body")).toMatchAriaSnapshot();
    });
  });
});

test("Variable Chain", async ({ page }) => {
  await page.goto(`${BASE_URL}/test-features/extension/FavaDashboards/#/dashboards/variable-chain`);
  await expectScreenshot(page);
});

test("Custom Theme", async ({ page }) => {
  await page.goto(`${BASE_URL}/test-themes/extension/FavaDashboards/#/dashboards/custom-theme`);
  await expectScreenshot(page);
});
