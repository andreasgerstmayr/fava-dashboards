class Helpers {
    static iterateMonths(dateFirst, dateLast) {
        const months = [];
        let [year, month] = dateFirst.split("-").map((x) => parseInt(x));
        let [lastYear, lastMonth] = dateLast.split("-").map((x) => parseInt(x));

        while (year < lastYear || (year === lastYear && month <= lastMonth)) {
            months.push({ year, month });
            if (month == 12) {
                year++;
                month = 1;
            } else {
                month++;
            }
        }
        return months;
    }

    static iterateYears(dateFirst, dateLast) {
        const years = [];
        let year = parseInt(dateFirst.split("-")[0]);
        let lastYear = parseInt(dateLast.split("-")[0]);

        for (; year <= lastYear; year++) {
            years.push(year);
        }
        return years;
    }

    static buildAccountTree(rows, valueFn) {
        const accountTree = { children: [] };
        for (let row of rows) {
            const accountParts = row.account.split(":");
            let node = accountTree;
            for (let i = 0; i < accountParts.length; i++) {
                const account = accountParts.slice(0, i + 1).join(":");

                let child = node.children.find((c) => c.name == account);
                if (!child) {
                    child = { name: account, children: [], value: 0 };
                    node.children.push(child);
                }

                child.value += valueFn(row);
                node = child;
            }
        }
        return accountTree;
    }
}

class Panel {
    static html(elem, content) {
        elem.innerHTML = content;
    }

    static echarts(elem, options) {
        const chart = echarts.init(elem);
        if (options.onClick) {
            chart.on("click", options.onClick);
            delete options.onClick;
        }
        if (options.onDblClick) {
            chart.on("dblclick", options.onDblClick);
            delete options.onDblClick;
        }
        chart.setOption(options);
    }

    static d3_sankey(elem, options) {
        render_d3sankey(elem, options);
    }
}

function renderDashboard(fava, dashboard) {
    for (let i = 0; i < dashboard.panels.length; i++) {
        const panel = dashboard.panels[i];
        if (!panel.type || !panel.script) {
            continue;
        }

        const elem = document.getElementById(`panel${i}`);
        const scriptFn = new Function(["panel", "fava", "helpers"], panel.script);
        const options = scriptFn(panel, fava, Helpers);

        if (panel.type in Panel) {
            Panel[panel.type](elem, options);
        }
    }
}

function bootstrap() {
    const bootstrapData = JSON.parse(document.getElementById("favaDashboardsBootstrap").text);
    const fava = bootstrapData.fava;
    const dashboard = bootstrapData.dashboards[bootstrapData.dashboardId];

    renderDashboard(fava, dashboard);
}

window.addEventListener("load", bootstrap);
