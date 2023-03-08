function iterate_months(dateFirst, dateLast) {
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

function iterate_years(dateFirst, dateLast) {
    const years = [];
    let year = parseInt(dateFirst.split("-")[0]);
    let lastYear = parseInt(dateLast.split("-")[0]);

    for (; year <= lastYear; year++) {
        years.push(year);
    }
    return years;
}

function render_chart(fava, elem, panel) {
    const utils = {
        months: iterate_months(fava.dateFirst, fava.dateLast),
        years: iterate_years(fava.dateFirst, fava.dateLast),
    };

    const chart = echarts.init(elem);
    const optionsFn = new Function(["panel", "utils"], panel.chart);
    const options = optionsFn(panel, utils);
    if (options.onClick) {
        chart.on("click", options.onClick);
        delete options.onClick;
    }
    chart.setOption(options);
}

function render_dashboard() {
    const dashboardData = JSON.parse(document.getElementById("dashboardData").text);
    const fava = { dateFirst: dashboardData.dateFirst, dateLast: dashboardData.dateLast };
    const dashboard = dashboardData.dashboards[dashboardData.dashboardId];

    for (let i = 0; i < dashboard.panels.length; i++) {
        if (dashboard.panels[i].chart) {
            const elem = document.getElementById(`panel${i}`);
            render_chart(fava, elem, dashboard.panels[i]);
        }
    }
}

window.addEventListener("load", render_dashboard);
