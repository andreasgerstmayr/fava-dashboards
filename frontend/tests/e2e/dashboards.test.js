const { toMatchImageSnapshot } = require("jest-image-snapshot");
expect.extend({ toMatchImageSnapshot });

const waitFor = (ms) => new Promise((r) => setTimeout(r, ms));
const customSnapshotIdentifier = (p) =>
    p.currentTestName.replace(": PNG Snapshot Tests", "").replaceAll(" ", "_").toLowerCase();
const BASE_URL = "http://127.0.0.1:5000/beancount";
const dashboards = [
    { name: "Overview", url: "/extension/FavaDashboards/" },
    { name: "Assets", url: "/extension/FavaDashboards/?dashboard=1" },
    { name: "Income and Expenses", url: "/extension/FavaDashboards/?dashboard=2" },
    { name: "Travelling", url: "/extension/FavaDashboards/?dashboard=3" },
    { name: "Sankey", url: "/extension/FavaDashboards/?dashboard=4" },
    { name: "Projection", url: "/extension/FavaDashboards/?dashboard=5" },
];

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
