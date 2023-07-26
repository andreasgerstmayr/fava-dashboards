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

describe("Dashboard: SVG Snapshot Tests", () => {
    for (let dashboard of dashboards) {
        it(dashboard.name, async () => {
            await page.goto(`${BASE_URL}${dashboard.link}`);
            await waitFor(1500); // wait for animations to finish

            let html = await page.$eval("#dashboard", (element) => element.innerHTML);
            html = html.replaceAll(/_echarts_instance_="ec_[0-9]+"/g, "");
            expect(html).toMatchSnapshot();
        });
    }
});
