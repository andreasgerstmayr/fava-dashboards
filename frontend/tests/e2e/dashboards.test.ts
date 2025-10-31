import { expect, test } from "@playwright/test";

const BASE_URL = "http://127.0.0.1:5000/beancount/extension/FavaDashboards/";
const dashboards = [
  { name: "Overview", url: "" },
  { name: "Assets", url: "#/dashboards/assets" },
  { name: "Income and Expenses", url: "#/dashboards/income-and-expenses" },
  { name: "Travelling", url: "#/dashboards/travelling" },
  { name: "Sankey", url: "#/dashboards/sankey" },
  { name: "Projection", url: "#/dashboards/projection" },
];

test.describe("PNG Snapshot Tests", () => {
  test.describe("Light Theme", () => {
    dashboards.forEach(({ name, url }) => {
      test(name, async ({ page }) => {
        await page.goto(`${BASE_URL}${url}`);
        await page.evaluate(() => {
          // full page screenshot doesn't work due to sticky sidebar
          document.body.style.height = "inherit";
        });
        await expect(page).toHaveScreenshot({ fullPage: true });
      });
    });
  });

  test.describe("Dark Theme", () => {
    test.use({ colorScheme: "dark" });
    dashboards.forEach(({ name, url }) => {
      test(name, async ({ page }) => {
        await page.goto(`${BASE_URL}${url}`);
        await page.evaluate(() => {
          // full page screenshot doesn't work due to sticky sidebar
          document.body.style.height = "inherit";
        });
        await expect(page).toHaveScreenshot({ fullPage: true });
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
