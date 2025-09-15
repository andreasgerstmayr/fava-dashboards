
function getCurrencyFormatter(currency) {
  const currencyFormat = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  });
  return (val) => (val !== undefined ? currencyFormat.format(val) : "");
}

function iterateMonths(dateFirst, dateLast) {
  const months = [];
  let [year, month] = dateFirst.split("-").map((x) => parseInt(x));
  const [lastYear, lastMonth] = dateLast.split("-").map((x) => parseInt(x));

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



sdk.AddDashboard("Income and Expenses", (dashboard) => {
  dashboard.AddPanel("Expenses", async (panel) => {
    panel.width(100).description("some text");

    const currencyFormatter = getCurrencyFormatter(ledger.ccy);
    const months = iterateMonths(ledger.dateFirst, ledger.dateLast).map((m) => `${m.month}/${m.year}`);

    const queries = [
      {
        name: "Income",
        stack: "income",
        bql: "SELECT year, month, CONVERT(SUM(position), '{{ledger.ccy}}', LAST(date)) AS value\nWHERE account ~ '^Income:'\nGROUP BY year, month\n",
        link: "../../account/Income/?time={time}",
      },
      {
        name: "Housing",
        stack: "expenses",
        bql: "SELECT year, month, CONVERT(SUM(position), '{{ledger.ccy}}', LAST(date)) AS value\nWHERE account ~ '^Expenses:Housing:' AND NOT 'travel' IN tags\nGROUP BY year, month\n",
        link: "../../account/Expenses:Housing/?filter=-#travel&time={time}",
      },
      {
        name: "Food",
        stack: "expenses",
        bql: "SELECT year, month, CONVERT(SUM(position), '{{ledger.ccy}}', LAST(date)) AS value\nWHERE account ~ '^Expenses:Food:' AND NOT 'travel' IN tags\nGROUP BY year, month\n",
        link: "../../account/Expenses:Food/?filter=-#travel&time={time}",
      },
      {
        name: "Shopping",
        stack: "expenses",
        bql: "SELECT year, month, CONVERT(SUM(position), '{{ledger.ccy}}', LAST(date)) AS value\nWHERE account ~ '^Expenses:Shopping:' AND NOT 'travel' IN tags\nGROUP BY year, month\n",
        link: "../../account/Expenses:Shopping/?filter=-#travel&time={time}",
      },
      {
        name: "Travel",
        stack: "expenses",
        bql: "SELECT year, month, CONVERT(SUM(position), '{{ledger.ccy}}', LAST(date)) AS value\nWHERE account ~ '^Expenses:' AND 'travel' IN tags\nGROUP BY year, month\n",
        link: "../../account/Expenses/?filter=#travel&time={time}",
      },
      {
        name: "Other",
        stack: "expenses",
        bql: "SELECT year, month, CONVERT(SUM(position), '{{ledger.ccy}}', LAST(date)) AS value\nWHERE account ~ '^Expenses:' AND NOT account ~ '^Expenses:(Housing|Food|Shopping):' AND NOT 'travel' IN tags\nGROUP BY year, month\n",
        link: '../../account/Expenses/?filter=all(-account:"^Expenses:(Housing|Food|Shopping)") -#travel&time={time}',
      },
    ];

    // the beancount query only returns months where there was at least one matching transaction, therefore we group by month
    const amounts = {};
    for (const query of queries) {
      amounts[query.name] = {};
      const result = await bq(query.bql);
      for (const row of result) {
        const value = row.value[ledger.ccy] ?? 0;
        amounts[query.name][`${row.month}/${row.year}`] = query.stack == "income" ? -value : value;
      }
    }

    return {
      tooltip: {
        valueFormatter: currencyFormatter,
      },
      legend: {
        top: "bottom",
      },
      xAxis: {
        data: months,
      },
      yAxis: {
        axisLabel: {
          formatter: currencyFormatter,
        },
      },
      series: queries.map((query) => ({
        type: "bar",
        name: query.name,
        stack: query.stack,
        data: months.map((month) => amounts[query.name][month] ?? 0),
      })),
      onClick: (event) => {
        const query = queries.find((q) => q.name === event.seriesName);
        if (query) {
          const [month, year] = event.name.split("/");
          const link = query.link.replace("{time}", `${year}-${month.padStart(2, "0")}`);
          window.open(helpers.urlFor(link));
        }
      },
    };
  });
});


return [
  {
    name: "Overview",
    panels: [
      {
        title: "Assets 💰",
        width: "50%",
        height: "80px",
        type: "html",
        render: async ({ ledger, query }) => {
          const currencyFormatter = getCurrencyFormatter(ledger.ccy);
          const result = await query(
            `SELECT CONVERT(SUM(position), '${ledger.ccy}') AS value WHERE account ~ '^Assets:'`,
          );
          const value = result[0]?.value[ledger.ccy] ?? 0;
          const valueFmt = currencyFormatter(value);
          return `<div style="font-size: 40px; font-weight: bold; color: #3daf46; text-align: center;">${valueFmt}</div>`;
        },
      },
      {
        title: "Liabilities 💳",
        width: "50%",
        height: "80px",
        type: "html",
        render: async ({ ledger, query }) => {
          const currencyFormatter = getCurrencyFormatter(ledger.ccy);
          const result = await query(
            `SELECT CONVERT(SUM(position), '${ledger.ccy}') AS value WHERE account ~ '^Assets:'`,
          );
          const value = result[0]?.value[ledger.ccy] ?? 0;
          const valueFmt = currencyFormatter(value);
          return `<div style="font-size: 40px; font-weight: bold; color: #3daf46; text-align: center;">${valueFmt}</div>`;
        },
      },
      {
        title: "Income/Expenses 💸",
        height: "520px",
        link: "../../income_statement/",
        type: "echarts",
        render: async ({ ledger, query: bq }) => {
          const currencyFormatter = getCurrencyFormatter(ledger.ccy);
          const months = iterateMonths(ledger.dateFirst, ledger.dateLast).map((m) => `${m.month}/${m.year}`);

          const queries = [
            {
              name: "Income",
              stack: "income",
              bql: "SELECT year, month, CONVERT(SUM(position), '{{ledger.ccy}}', LAST(date)) AS value\nWHERE account ~ '^Income:'\nGROUP BY year, month\n",
              link: "../../account/Income/?time={time}",
            },
            {
              name: "Housing",
              stack: "expenses",
              bql: "SELECT year, month, CONVERT(SUM(position), '{{ledger.ccy}}', LAST(date)) AS value\nWHERE account ~ '^Expenses:Housing:' AND NOT 'travel' IN tags\nGROUP BY year, month\n",
              link: "../../account/Expenses:Housing/?filter=-#travel&time={time}",
            },
            {
              name: "Food",
              stack: "expenses",
              bql: "SELECT year, month, CONVERT(SUM(position), '{{ledger.ccy}}', LAST(date)) AS value\nWHERE account ~ '^Expenses:Food:' AND NOT 'travel' IN tags\nGROUP BY year, month\n",
              link: "../../account/Expenses:Food/?filter=-#travel&time={time}",
            },
            {
              name: "Shopping",
              stack: "expenses",
              bql: "SELECT year, month, CONVERT(SUM(position), '{{ledger.ccy}}', LAST(date)) AS value\nWHERE account ~ '^Expenses:Shopping:' AND NOT 'travel' IN tags\nGROUP BY year, month\n",
              link: "../../account/Expenses:Shopping/?filter=-#travel&time={time}",
            },
            {
              name: "Travel",
              stack: "expenses",
              bql: "SELECT year, month, CONVERT(SUM(position), '{{ledger.ccy}}', LAST(date)) AS value\nWHERE account ~ '^Expenses:' AND 'travel' IN tags\nGROUP BY year, month\n",
              link: "../../account/Expenses/?filter=#travel&time={time}",
            },
            {
              name: "Other",
              stack: "expenses",
              bql: "SELECT year, month, CONVERT(SUM(position), '{{ledger.ccy}}', LAST(date)) AS value\nWHERE account ~ '^Expenses:' AND NOT account ~ '^Expenses:(Housing|Food|Shopping):' AND NOT 'travel' IN tags\nGROUP BY year, month\n",
              link: '../../account/Expenses/?filter=all(-account:"^Expenses:(Housing|Food|Shopping)") -#travel&time={time}',
            },
          ];

          // the beancount query only returns months where there was at least one matching transaction, therefore we group by month
          const amounts = {};
          for (const query of queries) {
            amounts[query.name] = {};
            const result = await bq(query.bql);
            for (const row of result) {
              const value = row.value[ledger.ccy] ?? 0;
              amounts[query.name][`${row.month}/${row.year}`] = query.stack == "income" ? -value : value;
            }
          }

          return {
            tooltip: {
              valueFormatter: currencyFormatter,
            },
            legend: {
              top: "bottom",
            },
            xAxis: {
              data: months,
            },
            yAxis: {
              axisLabel: {
                formatter: currencyFormatter,
              },
            },
            series: queries.map((query) => ({
              type: "bar",
              name: query.name,
              stack: query.stack,
              data: months.map((month) => amounts[query.name][month] ?? 0),
            })),
            onClick: (event) => {
              const query = queries.find((q) => q.name === event.seriesName);
              if (query) {
                const [month, year] = event.name.split("/");
                const link = query.link.replace("{time}", `${year}-${month.padStart(2, "0")}`);
                window.open(helpers.urlFor(link));
              }
            },
          };
        },
      },
    ],
  },
  {
    name: "Income and Expenses",
    panels: [
      {
        title: "monthly",
        type: "echarts",
        render: async ({ panel }) => {
          console.log("loading...");
          await new Promise((r) => setTimeout(r, 20000));
          console.log("loaded.");
          panel.title = "loaded!";
          return {};
        },
      },
    ],
  },
];
