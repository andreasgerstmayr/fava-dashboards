import { toMatchImageSnapshot } from "jest-image-snapshot";
import "jest-puppeteer";

const BASE_URL = "http://127.0.0.1:5000/beancount/extension/FavaDashboards/";
const dashboards = [
  { name: "Overview", url: "" },
  { name: "Assets", url: "?dashboard=1" },
  { name: "Income and Expenses", url: "?dashboard=2" },
  { name: "Travelling", url: "?dashboard=3" },
  { name: "Sankey", url: "?dashboard=4" },
  { name: "Projection", url: "?dashboard=5" },
];

function customSnapshotIdentifier(p: { currentTestName: string }) {
  return p.currentTestName.replace(": PNG Snapshot Tests", "").replaceAll(" ", "_").toLowerCase();
}

expect.extend({ toMatchImageSnapshot });

describe("Dashboard: PNG Snapshot Tests", () => {
  beforeAll(async () => {
    await page.setUserAgent("puppeteer-png");
  });

  it.each(dashboards)("$name", async ({ url }) => {
    await page.goto(`${BASE_URL}${url}`);
    await page.evaluate(() => {
      // full page screenshot doesn't work due to sticky sidebar
      document.body.style.height = "inherit";
    });
    await page.waitForNetworkIdle();

    const screenshot = await page.screenshot({ fullPage: true });
    expect(Buffer.from(screenshot)).toMatchImageSnapshot({ customSnapshotIdentifier });
  });
});

describe("Dashboard: HTML Snapshot Tests", () => {
  beforeAll(async () => {
    await page.setUserAgent("puppeteer-html");
  });

  it.each(dashboards)("$name", async ({ url }) => {
    await page.goto(`${BASE_URL}${url}`);
    await page.waitForNetworkIdle();

    let html = await page.$eval("#dashboard", (element) => element.innerHTML);
    // remove nondeterministic rendering
    html = html.replaceAll(/_echarts_instance_="ec_[0-9]+"/g, "");
    expect(html).toMatchSnapshot();
  });
});
