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
    static runScript(ledger, panel) {
        // pass 'fava' for backwards compatibility
        const scriptFn = new Function(["panel", "ledger", "fava", "helpers"], panel.script);
        return scriptFn(panel, ledger, ledger, Helpers);
    }

    static html(ledger, panel, elem) {
        elem.innerHTML = Panel.runScript(ledger, panel);
    }

    static echarts(ledger, panel, elem) {
        const options = Panel.runScript(ledger, panel);

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

    static d3_sankey(ledger, panel, elem) {
        const options = Panel.runScript(ledger, panel);
        render_d3sankey(elem, options);
    }

    static jinja2(ledger, panel, elem) {
        elem.innerHTML = panel.template;
    }
}

function renderDashboard(ledger, dashboard) {
    for (let i = 0; i < dashboard.panels.length; i++) {
        const panel = dashboard.panels[i];
        if (!panel.type) {
            continue;
        }

        const elem = document.getElementById(`panel${i}`);
        if (panel.type in Panel) {
            Panel[panel.type](ledger, panel, elem);
        }
    }
}

function bootstrap() {
    const bootstrapData = JSON.parse(document.getElementById("favaDashboardsBootstrap").text);
    const ledger = bootstrapData.ledger;
    const dashboard = bootstrapData.dashboards[bootstrapData.dashboardId];

    renderDashboard(ledger, dashboard);
}

window.addEventListener("load", bootstrap);
