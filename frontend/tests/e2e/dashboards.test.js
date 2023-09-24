const { toMatchImageSnapshot } = require("jest-image-snapshot");
expect.extend({ toMatchImageSnapshot });

const waitFor = (ms) => new Promise((r) => setTimeout(r, ms));
const customSnapshotIdentifier = (p) =>
    p.currentTestName.replace(": PNG Snapshot Tests", "").replaceAll(" ", "_").toLowerCase();
const BASE_URL = "http://127.0.0.1:5000/beancount";
const dashboards = [
    { name: "Overview", link: "/extension/FavaDashboards/" },
    { name: "Assets", link: "/extension/FavaDashboards/?dashboard=1" },
    { name: "Income and Expenses", link: "/extension/FavaDashboards/?dashboard=2" },
    { name: "Travelling", link: "/extension/FavaDashboards/?dashboard=3" },
    { name: "Sankey", link: "/extension/FavaDashboards/?dashboard=4" },
    { name: "Projection", link: "/extension/FavaDashboards/?dashboard=5" },
];

describe("Dashboard: PNG Snapshot Tests", () => {
    for (let dashboard of dashboards) {
        it(dashboard.name, async () => {
            await page.goto(`${BASE_URL}${dashboard.link}`);
            await waitFor(1500); // wait for animations to finish

            const screenshot = await page.screenshot({ fullPage: true });
            expect(screenshot).toMatchImageSnapshot({ customSnapshotIdentifier });
        });
    }
});

describe("Dashboard: HTML Snapshot Tests", () => {
    for (let dashboard of dashboards) {
        it(dashboard.name, async () => {
            await page.setUserAgent("puppeteer");
            await page.goto(`${BASE_URL}${dashboard.link}`);
            await waitFor(1500); // wait for animations to finish

            let html = await page.$eval("article", (element) => element.innerHTML);
            html = html.replaceAll(/_echarts_instance_="ec_[0-9]+"/g, "");
            html = html.replaceAll(/"filename": .+,/g, "");

            // HACK: remove nondeterministic rendering
            html = html.replaceAll(/"tags": \[[\s\S]+?\],/g, ""); // tag sort order doesn' work
            html = html.replaceAll(/y=".+?"/g, "");
            html = html.replaceAll(/transform="translate(.+?)"/g, "");
            html = html.replaceAll(/<path d=".+?"/g, "<path ");

            expect(html).toMatchSnapshot();
        });
    }
});
