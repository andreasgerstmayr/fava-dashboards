/* eslint-disable @typescript-eslint/no-explicit-any */
/// <reference types="./fava-dashboards.d.ts" />
import { BarSeriesOption, ECElementEvent } from "echarts";
import {
  Amount,
  D3SankeyLink,
  D3SankeyNode,
  defineConfig,
  EChartsSpec,
  Inventory,
  Ledger,
  Position,
  TableSpec,
  VariableDefinition,
} from "fava-dashboards";

// Base colors from fava
const COLOR_PROFIT = "#3daf46";
const COLOR_LOSS = "#af3d3d";
// colors from https://mui.com/material-ui/getting-started/templates/dashboard/
const TREND_POSITIVE = (opacity = 1) => `hsla(120, 44%, 53%, ${opacity})`;
const TREND_NEGATIVE = (opacity = 1) => `hsla(0, 90%, 40%, ${opacity})`;

function getCurrencyFormatter(currency: string) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format;
}

function anyFormatter(formatter: (value: number) => string) {
  return (value: any) => (typeof value === "number" ? formatter(value) : String(value));
}

function iterateMonths(dateFirst: string, dateLast: string) {
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

function iterateYears(dateFirst: string, dateLast: string) {
  const years = [];
  let year = parseInt(dateFirst.split("-")[0]);
  const lastYear = parseInt(dateLast.split("-")[0]);

  for (; year <= lastYear; year++) {
    years.push(year);
  }
  return years;
}

function countMonths(ledger: Ledger): number {
  const ms = new Date(ledger.dateLast).getTime() - new Date(ledger.dateFirst).getTime();
  const days = ms / (1000 * 60 * 60 * 24) + 1;
  const months = days / (365 / 12);
  return months;
}

type Dataset = DatasetRow[];
type DatasetRow = Record<string, number | string>;

function fillMonthlyDataset(dataset: Dataset, column: string, values: string[], undef: DatasetRow): Dataset {
  const dsByColumn: Record<string, DatasetRow> = {};
  for (const row of dataset) {
    dsByColumn[row[column]] = row;
  }
  return values.map((v) => dsByColumn[v] ?? { ...undef, [column]: v });
}

function sumValue(dataset: { value: number }[]): number {
  return dataset.reduce((prev, cur) => prev + cur.value, 0);
}

type SunburstNode = {
  name?: string;
  value?: number;
  children: SunburstNode[];
};

function buildAccountTree(rows: any[], valueFn: (row: any) => number, nameFn?: (parts: string[], i: number) => string) {
  nameFn = nameFn ?? ((parts, i) => parts.slice(0, i + 1).join(":"));

  const accountTree: SunburstNode = { children: [] };
  for (const row of rows) {
    const accountParts = row.account.split(":");
    let node = accountTree;
    for (let i = 0; i < accountParts.length; i++) {
      const account = nameFn(accountParts, i);
      let child = node.children.find((c) => c.name == account);
      if (!child) {
        child = { name: account, children: [], value: 0 };
        node.children.push(child);
      }

      child.value! += valueFn(row);
      node = child;
    }
  }
  return accountTree;
}

function StatChart(
  dataset: { date: string; value: number }[],
  lineColor: (opacity?: number) => string,
  text: string,
  textColor: string,
): EChartsSpec {
  return {
    grid: {
      top: 30,
      bottom: 0,
      left: 0,
      right: 0,
    },
    xAxis: {
      type: "time",
      show: false,
    },
    yAxis: {
      show: false,
    },
    dataset: {
      source: dataset,
    },
    series: [
      {
        type: "line",
        smooth: true,
        showSymbol: false,
        color: lineColor(),
        areaStyle: {
          origin: "start",
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: lineColor(0.2) },
              { offset: 1, color: lineColor(0) },
            ],
          },
        },
        encode: { x: "date", y: "value" },
      },
    ],
    graphic: [
      {
        type: "text",
        top: 0,
        right: 0,
        style: {
          text,
          fontWeight: "bold",
          fontSize: 24,
          fill: textColor,
        },
      },
    ],
  };
}

async function StackedYearOverYear(
  ledger: Ledger,
  dataset: { year: number; account: string; category: string; value: number }[],
  currency: string,
  stacked: boolean,
): Promise<EChartsSpec> {
  const currencyFormatter = getCurrencyFormatter(currency);
  const years = iterateYears(ledger.dateFirst, ledger.dateLast);
  const maxAccounts = 7; // number of accounts to show, sorted by sum

  const categorySums: Record<string, number> = {};
  const yearlySums: Record<string, number> = {};
  for (const row of dataset) {
    categorySums[row.category] = (categorySums[row.category] ?? 0) + row.value;
    yearlySums[`${row.year}/${row.category}`] = (yearlySums[`${row.year}/${row.category}`] ?? 0) + row.value;
  }
  const categories = Object.entries(categorySums)
    .sort(([, sumA], [, sumB]) => sumB - sumA)
    .slice(0, maxAccounts)
    .map(([name]) => name)
    .reverse();

  if (!stacked) {
    return {
      legend: {
        top: "bottom",
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
        valueFormatter: anyFormatter(currencyFormatter),
      },
      xAxis: {
        axisLabel: {
          formatter: currencyFormatter,
        },
      },
      yAxis: {
        data: categories.map((category) => category.split(":").slice(1).join(":")),
      },
      grid: {
        containLabel: true,
        left: 0,
      },
      series: years.map((year) => ({
        type: "bar",
        name: year,
        data: categories.map((category) => yearlySums[`${year}/${category}`] ?? 0),
        label: {
          show: true,
          position: "right",
          formatter: (params: any) => currencyFormatter(params.value),
        },
        emphasis: {
          focus: "series",
        },
      })),
      onClick: (event) => {
        const link = "../../account/{account}/?time={time}"
          .replace("{account}", categories[event.dataIndex])
          .replace("{time}", event.seriesName ?? "");
        window.open(ledger.urlFor(link));
      },
    };
  }

  const filteredDataset = dataset
    .filter((row) => categories.includes(row.category))
    .sort((a, b) => a.year - b.year || a.account.localeCompare(b.account));

  const series: BarSeriesOption[] = [];
  for (const row of filteredDataset) {
    series.push({
      type: "bar",
      name: row.account, // name decides the color of the bar
      stack: String(row.year),
      data: categories.map((category) => (category == row.category ? row.value : 0)),
      emphasis: {
        focus: "series",
      },
    });
  }

  // add labels at end of bar
  for (const category of categories) {
    for (const year of years) {
      series.push({
        type: "bar",
        name: "sum",
        stack: String(year),
        data: categories.map((c) => (c == category ? 0 : undefined)),
        label: {
          show: `${year}/${category}` in yearlySums,
          position: "right",
          formatter: () => currencyFormatter(yearlySums[`${year}/${category}`] ?? 0),
        },
        tooltip: {
          show: false,
        },
      });
    }
  }

  return {
    tooltip: {
      valueFormatter: anyFormatter(currencyFormatter),
    },
    xAxis: {
      axisLabel: {
        formatter: currencyFormatter,
      },
    },
    yAxis: {
      data: categories.map((category) => category.split(":").slice(1).join(":")),
    },
    grid: {
      containLabel: true,
      left: 0,
    },
    series,
    onClick: (event) => {
      if (event.seriesIndex === undefined) {
        return;
      }

      const serie = series[event.seriesIndex];
      const link = "../../account/{account}/?time={time}"
        .replace("{account}", serie.name as string)
        .replace("{time}", serie.stack as string);
      window.open(ledger.urlFor(link));
    },
  };
}

const currencyVariable: VariableDefinition = {
  name: "currency",
  label: "Currency",
  options: async ({ ledger }) => {
    return ledger.operatingCurrencies;
  },
};

export default defineConfig({
  dashboards: [
    {
      name: "Overview",
      variables: [currencyVariable],
      panels: [
        {
          title: "Assets 💰",
          width: "50%",
          height: "80px",
          link: "../../balance_sheet/",
          kind: "echarts",
          spec: async ({ ledger, variables }) => {
            const currencyFormatter = getCurrencyFormatter(variables.currency);
            const result = await ledger.query(
              `SELECT year, month, CONVERT(SUM(position), '${variables.currency}') AS value
               WHERE account ~ '^Assets:'
               GROUP BY year, month`,
            );
            let cumValue = 0;
            const dataset = result.map((row) => ({
              date: `${row.year}-${row.month}`,
              value: (cumValue += row.value[variables.currency]),
            }));
            const lastValue = dataset.length > 0 ? dataset[dataset.length - 1].value : 0;
            return StatChart(dataset, TREND_POSITIVE, currencyFormatter(lastValue), COLOR_PROFIT);
          },
        },
        {
          title: "Liabilities 💳",
          width: "50%",
          height: "80px",
          link: "../../balance_sheet/",
          kind: "echarts",
          spec: async ({ ledger, variables }) => {
            const currencyFormatter = getCurrencyFormatter(variables.currency);
            const result = await ledger.query(
              `SELECT year, month, CONVERT(SUM(position), '${variables.currency}') AS value
               WHERE account ~ '^Liabilities:'
               GROUP BY year, month`,
            );
            let cumValue = 0;
            const dataset = result.map((row) => ({
              date: `${row.year}-${row.month}`,
              value: (cumValue += -row.value[variables.currency]),
            }));
            const lastValue = dataset.length > 0 ? dataset[dataset.length - 1].value : 0;
            return StatChart(dataset, TREND_NEGATIVE, currencyFormatter(lastValue), COLOR_LOSS);
          },
        },
        {
          title: "Income/Expenses 💸",
          width: "100%",
          height: "520px",
          link: "../../income_statement/",
          kind: "echarts",
          spec: async ({ ledger, variables }) => {
            const currencyFormatter = getCurrencyFormatter(variables.currency);
            const queries = [
              {
                bql: `SELECT year, month, CONVERT(SUM(position), '${variables.currency}', LAST(date)) AS value
                      WHERE account ~ '^Income:'
                      GROUP BY year, month`,
                name: "Income",
                stack: "income",
                link: "../../account/Income/?time={time}",
              },
              {
                bql: `SELECT year, month, CONVERT(SUM(position), '${variables.currency}', LAST(date)) AS value
                      WHERE account ~ '^Expenses:Housing:' AND NOT 'travel' IN tags
                      GROUP BY year, month`,
                name: "Housing",
                stack: "expenses",
                link: "../../account/Expenses:Housing/?filter=-#travel&time={time}",
              },
              {
                bql: `SELECT year, month, CONVERT(SUM(position), '${variables.currency}', LAST(date)) AS value
                      WHERE account ~ '^Expenses:Food:' AND NOT 'travel' IN tags
                      GROUP BY year, month`,
                name: "Food",
                stack: "expenses",
                link: "../../account/Expenses:Food/?filter=-#travel&time={time}",
              },
              {
                bql: `SELECT year, month, CONVERT(SUM(position), '${variables.currency}', LAST(date)) AS value
                      WHERE account ~ '^Expenses:Shopping:' AND NOT 'travel' IN tags
                      GROUP BY year, month`,
                name: "Shopping",
                stack: "expenses",
                link: "../../account/Expenses:Shopping/?filter=-#travel&time={time}",
              },
              {
                bql: `SELECT year, month, CONVERT(SUM(position), '${variables.currency}', LAST(date)) AS value
                      WHERE account ~ '^Expenses:' AND 'travel' IN tags
                      GROUP BY year, month`,
                name: "Travel",
                stack: "expenses",
                link: "../../account/Expenses/?filter=#travel&time={time}",
              },
              {
                bql: `SELECT year, month, CONVERT(SUM(position), '${variables.currency}', LAST(date)) AS value
                      WHERE account ~ '^Expenses:' AND NOT account ~ '^Expenses:(Housing|Food|Shopping):' AND NOT 'travel' IN tags
                      GROUP BY year, month`,
                name: "Other",
                stack: "expenses",
                link: '../../account/Expenses/?filter=all(-account:"^Expenses:(Housing|Food|Shopping)") -#travel&time={time}',
              },
            ];

            const results = await Promise.all(
              queries.map(async (query) => ({
                name: query.name,
                stack: query.stack,
                // stacked barcharts show empty bars if the dataset contains "holes", therefore use fillMonthlyDataset() here
                dataset: fillMonthlyDataset(
                  (await ledger.query(query.bql)).map((row) => ({
                    date: `${row.year}-${row.month}`,
                    value: query.stack === "income" ? -row.value[variables.currency] : row.value[variables.currency],
                  })),
                  "date",
                  iterateMonths(ledger.dateFirst, ledger.dateLast).map((m) => `${m.year}-${m.month}`),
                  { value: 0 },
                ),
              })),
            );

            return {
              tooltip: {
                valueFormatter: anyFormatter(currencyFormatter),
              },
              legend: {
                top: "bottom",
              },
              xAxis: {
                type: "time",
              },
              yAxis: {
                axisLabel: {
                  formatter: currencyFormatter,
                },
              },
              dataset: results.map((r) => ({ source: r.dataset })),
              series: results.map((query, i) => ({
                type: "bar",
                name: query.name,
                stack: query.stack,
                datasetIndex: i,
                encode: { x: "date", y: "value" },
                emphasis: {
                  focus: "series",
                },
              })),
              onClick: (event) => {
                const query = queries.find((q) => q.name === event.seriesName);
                if (query) {
                  const [year, month] = (event.data as { date: string }).date.split("-");
                  const link = query.link.replace("{time}", `${year}-${month.padStart(2, "0")}`);
                  window.open(ledger.urlFor(link));
                }
              },
            };
          },
        },
        /*{
          title: "React Test Panel",
          height: "80px",
          kind: "react",
          spec: () => {
            const [counter, setCounter] = React.useState(0);
            const x = <a onClick={() => setCounter(counter + 1)}>Click me ({counter})</a>;
            return <a onClick={() => setCounter(counter + 1)}>Click me ({counter})</a>;
          },
        },*/
      ],
    },
    {
      name: "Assets",
      variables: [currencyVariable],
      panels: [
        {
          title: "Assets 🏦",
          width: "50%",
          height: "400px",
          kind: "echarts",
          spec: async ({ ledger, variables }) => {
            const currencyFormatter = getCurrencyFormatter(variables.currency);
            const result = await ledger.query(
              `SELECT currency, CONVERT(SUM(position), '${variables.currency}') as market_value
               WHERE account_sortkey(account) ~ '^[01]'
               GROUP BY currency
               ORDER BY market_value`,
            );

            const data = result
              .filter((row) => row.market_value[variables.currency])
              .map((row) => ({ name: row.currency, value: row.market_value[variables.currency] }));

            return {
              tooltip: {
                formatter: (params: any) =>
                  `${params.marker} ${
                    ledger.commodities[params.name]?.meta.name ?? params.name
                  } <span style="padding-left: 15px; font-weight: bold;">${currencyFormatter(
                    params.value,
                  )}</span> (${params.percent.toFixed(0)}%)`,
              },
              series: [
                {
                  type: "pie",
                  data,
                },
              ],
            };
          },
        },
        {
          title: "Net Worth 💰",
          width: "50%",
          height: "400px",
          link: "../../income_statement/",
          kind: "echarts",
          spec: async ({ ledger, variables }) => {
            const currencyFormatter = getCurrencyFormatter(variables.currency);
            const result = await ledger.query(
              `SELECT year, month,
               CONVERT(LAST(balance), '${variables.currency}', DATE_TRUNC('month', FIRST(date)) + INTERVAL('1 month') - INTERVAL('1 day')) AS value
               WHERE account_sortkey(account) ~ '^[01]'
               GROUP BY year, month`,
            );
            const dataset = result.map((row) => ({
              date: `${row.year}-${row.month}`,
              value: row.value[variables.currency],
            }));
            return {
              magic: 1,
              tooltip: {
                trigger: "axis",
                valueFormatter: anyFormatter(currencyFormatter),
              },
              xAxis: {
                type: "time",
              },
              yAxis: {
                axisLabel: {
                  formatter: currencyFormatter,
                },
              },
              dataset: {
                source: dataset,
              },
              series: [
                {
                  type: "line",
                  smooth: true,
                  color: TREND_POSITIVE(),
                  areaStyle: {
                    origin: "start",
                    color: {
                      type: "linear",
                      x: 0,
                      y: 0,
                      x2: 0,
                      y2: 1,
                      colorStops: [
                        { offset: 0, color: TREND_POSITIVE(0.4) },
                        { offset: 1, color: TREND_POSITIVE(0) },
                      ],
                    },
                  },
                  encode: { x: "date", y: "value" },
                },
              ],
              onClick: (event) => {
                const [year, month] = (event.data as { date: string }).date.split("-");
                const link = "../../balance_sheet/?time={time}".replace("{time}", `${year}-${month.padStart(2, "0")}`);
                window.open(ledger.urlFor(link));
              },
            };
          },
        },
        {
          title: "Portfolio 📈",
          width: "50%",
          height: "400px",
          kind: "echarts",
          spec: async ({ ledger, variables }) => {
            const currencyFormatter = getCurrencyFormatter(variables.currency);
            const result = await ledger.query(
              `SELECT year, month,
               CONVERT(LAST(balance),       '${variables.currency}', DATE_TRUNC('month', FIRST(date)) + INTERVAL('1 month') - INTERVAL('1 day')) AS market_value,
               CONVERT(COST(LAST(balance)), '${variables.currency}', DATE_TRUNC('month', FIRST(date)) + INTERVAL('1 month') - INTERVAL('1 day')) AS book_value
               WHERE account ~ '^Assets:' AND currency != '${variables.currency}'
               GROUP BY year, month`,
            );
            const dataset = result.map((row) => ({
              date: `${row.year}-${row.month}`,
              market_value: row.market_value[variables.currency],
              book_value: row.book_value[variables.currency],
            }));
            return {
              tooltip: {
                trigger: "axis",
                valueFormatter: anyFormatter(currencyFormatter),
              },
              legend: {
                top: "bottom",
              },
              xAxis: {
                type: "time",
              },
              yAxis: {
                axisLabel: {
                  formatter: currencyFormatter,
                },
              },
              dataset: {
                source: dataset,
              },
              series: [
                {
                  type: "line",
                  name: "Market Value",
                  smooth: true,
                  encode: { x: "date", y: "market_value" },
                },
                {
                  type: "line",
                  name: "Book Value",
                  smooth: true,
                  encode: { x: "date", y: "book_value" },
                },
              ],
              onClick: (event) => {
                const [year, month] = (event.data as { date: string }).date.split("-");
                const link = "../../balance_sheet/?time={time}".replace("{time}", `${year}-${month.padStart(2, "0")}`);
                window.open(ledger.urlFor(link));
              },
            };
          },
        },
        {
          title: "Portfolio Gains ✨",
          width: "50%",
          height: "400px",
          kind: "echarts",
          spec: async ({ ledger, variables }) => {
            const currencyFormatter = getCurrencyFormatter(variables.currency);
            const result = await ledger.query(
              `SELECT year, month,
               CONVERT(LAST(balance),       '${variables.currency}', DATE_TRUNC('month', FIRST(date)) + INTERVAL('1 month') - INTERVAL('1 day')) AS market_value,
               CONVERT(COST(LAST(balance)), '${variables.currency}', DATE_TRUNC('month', FIRST(date)) + INTERVAL('1 month') - INTERVAL('1 day')) AS book_value
               WHERE account ~ '^Assets:' AND currency != '${variables.currency}'
               GROUP BY year, month`,
            );
            const dataset = result.map((row) => ({
              date: `${row.year}-${row.month}`,
              value: row.market_value[variables.currency] - row.book_value[variables.currency],
            }));

            return {
              tooltip: {
                trigger: "axis",
                valueFormatter: anyFormatter(currencyFormatter),
              },
              xAxis: {
                type: "time",
              },
              yAxis: {
                axisLabel: {
                  formatter: currencyFormatter,
                },
              },
              dataset: {
                source: dataset,
              },
              series: [
                {
                  type: "line",
                  smooth: true,
                },
              ],
            };
          },
        },
        {
          title: "Asset Classes Year-over-Year 🏦",
          width: "100%",
          height: "400px",
          kind: "echarts",
          spec: async ({ ledger, variables }) => {
            const currencyFormatter = getCurrencyFormatter(variables.currency);
            const years = iterateYears(ledger.dateFirst, ledger.dateLast);

            // This chart requires the balances grouped by year and currency.
            // Unfortunately the `balance` column does not support GROUP BY
            // (see https://groups.google.com/g/beancount/c/TfZJswxuIDA/m/psc2BkrBAAAJ)
            // therefore we need to run a separate query per year.
            const queries = await Promise.all(
              years.map((year) =>
                ledger.query(`SELECT currency,
                              CONVERT(SUM(position), '${variables.currency}', ${year}-12-31) as market_value
                              FROM CLOSE ON ${year + 1}-01-01
                              WHERE account_sortkey(account) ~ '^[01]'
                              GROUP BY currency`),
              ),
            );

            const amounts: Record<string, Record<string, number>> = {};
            const balances: Record<string, number> = {};
            for (let i = 0; i < years.length; i++) {
              const year = years[i];
              const query = queries[i];

              amounts[year] = {};
              for (const row of query) {
                if (!row.market_value[variables.currency]) {
                  continue;
                }

                const value = row.market_value[variables.currency];
                const assetClass = ledger.commodities[row.currency]?.meta.asset_class ?? "unknown";
                amounts[year][assetClass] = (amounts[year][assetClass] ?? 0) + value;
                balances[assetClass] = (balances[assetClass] ?? 0) + value;
              }
            }

            const assetClasses = Object.entries(balances)
              .sort(([, a], [, b]) => b - a)
              .map(([name]) => name);

            return {
              tooltip: {
                formatter: (params: any) => {
                  const sum = Object.values(amounts[params.name]).reduce((prev, cur) => prev + cur, 0);
                  return `${params.marker} ${params.seriesName} <span style="padding-left: 15px; font-weight: bold;">${currencyFormatter(
                    params.value,
                  )}</span> (${((params.value / sum) * 100).toFixed(0)}%)`;
                },
              },
              legend: {
                top: "bottom",
              },
              xAxis: {
                data: years,
              },
              yAxis: {
                axisLabel: {
                  formatter: currencyFormatter,
                },
              },
              series: assetClasses.map((assetClass) => ({
                type: "bar",
                name: assetClass,
                stack: "assets",
                data: years.map((year) => amounts[year][assetClass] ?? 0),
              })),
            };
          },
        },
        {
          title: "Asset Classes 🏦",
          width: "50%",
          height: "400px",
          kind: "echarts",
          variables: [
            {
              name: "categories",
              display: "toggle",
              options: () => ["All assets", "Only investments"],
            },
          ],
          spec: async ({ ledger, variables }) => {
            const currencyFormatter = getCurrencyFormatter(variables.currency);
            const filter = variables.categories == "Only investments" ? `AND currency != '${variables.currency}'` : "";
            const result = await ledger.query(
              `SELECT currency, CONVERT(SUM(position), '${variables.currency}') as market_value
               WHERE account_sortkey(account) ~ '^[01]' ${filter}
               GROUP BY currency
               ORDER BY market_value`,
            );

            let totalValue = 0;
            const assetClasses: Record<string, { name: string; children: { name: string; value: number }[] }> = {};
            for (const row of result) {
              if (!row.market_value[variables.currency]) {
                continue;
              }

              const ccy = row.currency;
              const value = row.market_value[variables.currency];
              const assetName = (ledger.commodities[ccy]?.meta.name ?? ccy) as string;
              const assetClass = (ledger.commodities[ccy]?.meta.asset_class ?? "unknown") as string;
              if (!(assetClass in assetClasses)) {
                assetClasses[assetClass] = { name: assetClass, children: [] };
              }
              assetClasses[assetClass].children.push({ name: assetName, value });
              totalValue += value;
            }

            return {
              tooltip: {
                formatter: (params: any) =>
                  `${params.marker} ${params.name} <span style="padding-left: 15px; font-weight: bold;">${currencyFormatter(
                    params.value,
                  )}</span> (${((params.value / totalValue) * 100).toFixed(0)}%)`,
              },
              series: [
                {
                  type: "sunburst",
                  radius: "100%",
                  label: {
                    minAngle: 3,
                    width: 170,
                    overflow: "truncate",
                  },
                  labelLayout: {
                    hideOverlap: true,
                  },
                  data: Object.values(assetClasses),
                },
              ],
            };
          },
        },
        {
          title: "Assets Allocation 🏦",
          width: "50%",
          height: "400px",
          kind: "echarts",
          variables: [
            {
              name: "categories",
              display: "toggle",
              options: () => ["All assets", "Only investments"],
            },
          ],
          spec: async ({ ledger, variables }) => {
            const currencyFormatter = getCurrencyFormatter(variables.currency);
            const filter = variables.categories == "Only investments" ? `AND currency != '${variables.currency}'` : "";
            const result = await ledger.query(
              `SELECT currency, CONVERT(SUM(position), '${variables.currency}') as market_value
               WHERE account_sortkey(account) ~ '^[01]' ${filter}
               GROUP BY currency
               ORDER BY market_value`,
            );

            let totalValue = 0;
            const root: SunburstNode = { children: [] };
            for (const row of result) {
              if (!row.market_value[variables.currency]) {
                continue;
              }

              const allocations = Object.entries(ledger.commodities[row.currency]?.meta ?? {}).filter(([k, _v]) =>
                k.startsWith("asset_allocation_"),
              ) as [string, number][];
              if (allocations.length === 0) {
                allocations.push(["asset_allocation_Unknown", 100]);
              }

              for (const [allocation, percentage] of allocations) {
                const parts = allocation.substring("asset_allocation_".length).split("_");
                let node = root;
                for (const part of parts) {
                  let child = node.children.find((c) => c.name == part);
                  if (!child) {
                    child = { name: part, children: [] };
                    node.children.push(child);
                  }
                  node = child;
                }

                const value = (percentage / 100) * row.market_value[variables.currency];
                node.value = (node.value ?? 0) + value;
                totalValue += value;
              }
            }

            return {
              tooltip: {
                formatter: (params: any) =>
                  `${params.marker} ${params.name} <span style="padding-left: 15px; font-weight: bold;">${currencyFormatter(
                    params.value,
                  )}</span> (${((params.value / totalValue) * 100).toFixed(0)}%)`,
              },
              series: [
                {
                  type: "sunburst",
                  radius: "100%",
                  label: {
                    rotate: "tangential",
                    minAngle: 20,
                  },
                  labelLayout: {
                    hideOverlap: true,
                  },
                  data: root.children,
                },
              ],
            };
          },
        },
      ],
    },
    {
      name: "Income and Expenses",
      variables: [currencyVariable],
      panels: [
        {
          title: "Avg. Income per Month 💰",
          width: "33%",
          height: "100px",
          link: "../../account/Income/?r=changes",
          kind: "echarts",
          spec: async ({ ledger, variables }) => {
            const currencyFormatter = getCurrencyFormatter(variables.currency);
            const result = await ledger.query(
              `SELECT year, month, CONVERT(SUM(position), '${variables.currency}') AS value
               WHERE account ~ '^Income:'
               GROUP BY year, month`,
            );
            const dataset = result.map((row) => ({
              date: `${row.year}-${row.month}`,
              value: -row.value[variables.currency],
            }));
            const avg = sumValue(dataset) / countMonths(ledger);
            return StatChart(dataset, TREND_POSITIVE, currencyFormatter(avg), COLOR_PROFIT);
          },
        },
        {
          title: "Avg. Expenses per Month 💸",
          width: "33%",
          height: "100px",
          link: "../../account/Expenses/?r=changes",
          kind: "echarts",
          spec: async ({ ledger, variables }) => {
            const currencyFormatter = getCurrencyFormatter(variables.currency);
            const result = await ledger.query(
              `SELECT year, month, CONVERT(SUM(position), '${variables.currency}') AS value
               WHERE account ~ '^Expenses:'
               GROUP BY year, month`,
            );
            const dataset = result.map((row) => ({
              date: `${row.year}-${row.month}`,
              value: row.value[variables.currency],
            }));
            const avg = sumValue(dataset) / countMonths(ledger);
            return StatChart(dataset, TREND_NEGATIVE, currencyFormatter(avg), COLOR_LOSS);
          },
        },
        {
          title: "Avg. Savings per Month ✨",
          width: "33%",
          height: "100px",
          link: "../../income_statement/",
          kind: "echarts",
          spec: async ({ ledger, variables }) => {
            const currencyFormatter = getCurrencyFormatter(variables.currency);
            const percentFormatter = new Intl.NumberFormat(undefined, {
              style: "percent",
              maximumFractionDigits: 0,
            }).format;

            const income = await ledger.query(
              `SELECT year, month, CONVERT(SUM(position), '${variables.currency}') AS value
               WHERE account ~ '^Income:'
               GROUP BY year, month`,
            );
            const incomeDataset = income.map((row) => ({
              date: `${row.year}-${row.month}`,
              value: -row.value[variables.currency],
            }));
            const avgIncome = sumValue(incomeDataset) / countMonths(ledger);

            const expenses = await ledger.query(
              `SELECT year, month, CONVERT(SUM(position), '${variables.currency}') AS value
               WHERE account ~ '^Expenses:'
               GROUP BY year, month`,
            );
            const expensesDataset = expenses.map((row) => ({
              date: `${row.year}-${row.month}`,
              value: row.value[variables.currency],
            }));
            const avgExpenses = sumValue(expensesDataset) / countMonths(ledger);

            const avgSavingsRate = avgIncome - avgExpenses;
            const avgSavingsRatePercent = avgIncome === 0 ? 0 : 1 - avgExpenses / avgIncome;
            const trend_color = avgSavingsRate >= 0 ? TREND_POSITIVE : TREND_NEGATIVE;

            const incomeMap = new Map<string, number>(incomeDataset.map(({ date, value }) => [date, value]));
            const expensesMap = new Map<string, number>(expensesDataset.map(({ date, value }) => [date, value]));
            const allDates = new Set([...incomeMap.keys(), ...expensesMap.keys()]);
            const savingsSeries = Array.from(allDates, (date) => ({
              date,
              value: (incomeMap.get(date) ?? 0) - (expensesMap.get(date) ?? 0),
            }));

            const text = `${currencyFormatter(avgSavingsRate)} (${percentFormatter(avgSavingsRatePercent)})`;
            const textColor = avgSavingsRate >= 0 ? COLOR_PROFIT : COLOR_LOSS;
            return StatChart(savingsSeries, trend_color, text, textColor);
          },
        },
        {
          title: "Savings Heatmap 💰",
          width: "100%",
          height: "400px",
          link: "../../income_statement/",
          kind: "echarts",
          spec: async ({ ledger, variables }) => {
            const currencyFormatter = getCurrencyFormatter(variables.currency);
            const monthFormatter = new Intl.DateTimeFormat(undefined, { month: "short" }).format;
            const years = iterateYears(ledger.dateFirst, ledger.dateLast);

            const result = await ledger.query(
              `SELECT year, month, CONVERT(SUM(position), '${variables.currency}', LAST(date)) AS value
               WHERE account ~ '^(Income|Expenses):'
               GROUP BY year, month`,
            );

            // the beancount query only returns months where there was at least one matching transaction, therefore we group by month
            const monthly: Record<string, number> = {};
            const yearly: Record<number, number> = {};
            for (const row of result) {
              const savings = -row.value[variables.currency];
              monthly[`${row.year}-${row.month}`] = savings;
              yearly[row.year] = (yearly[row.year] ?? 0) + savings;
            }

            const data: [string, number][] = [];
            for (const year of years) {
              data.push([`${year}`, yearly[year] ?? 0]);
              for (let month = 1; month <= 12; month++) {
                data.push([`${year}-${month}`, monthly[`${year}-${month}`] ?? 0]);
              }
            }
            const max = Math.max(...data.map(([label, val]) => (label.includes("-") ? Math.abs(val) : 0)));
            const maxRounded = Math.round(max * 100) / 100;

            return {
              tooltip: {
                position: "top",
                valueFormatter: anyFormatter(currencyFormatter),
              },
              grid: {
                top: 30,
                height: Math.min(50 * years.length, 280),
                bottom: 100, // space for visualMap
              },
              xAxis: {
                type: "category",
              },
              yAxis: {
                type: "category",
              },
              visualMap: {
                min: -maxRounded,
                max: maxRounded,
                calculable: true, // show handles
                orient: "horizontal",
                left: "center",
                bottom: 0, // place visualMap at bottom of chart
                itemHeight: 400, // width
                inRange: {
                  color: ["#af3d3d", "#fff", "#3daf46"],
                },
                formatter: anyFormatter(currencyFormatter),
              },
              series: [
                {
                  type: "heatmap",
                  data: data.map(([label, value]) => {
                    if (!label.includes("-")) {
                      return ["Entire Year", label, value];
                    }

                    const [year, month] = label.split("-");
                    const monthLocale = monthFormatter(new Date(parseInt(year), parseInt(month) - 1, 1));
                    return [monthLocale, year, value];
                  }),
                  label: {
                    show: true,
                    formatter: (params: any) => currencyFormatter(params.data[2]),
                  },
                  emphasis: {
                    itemStyle: {
                      shadowBlur: 10,
                      shadowColor: "rgba(0, 0, 0, 0.5)",
                    },
                  },
                },
              ],
              onClick: (event) => {
                let time = data[event.dataIndex][0];
                if (time.includes("-")) {
                  const [year, month] = time.split("-");
                  time = `${year}-${month.padStart(2, "0")}`;
                }
                const link = "../../income_statement/?time={time}".replace("{time}", time);
                window.open(ledger.urlFor(link));
              },
            };
          },
        },
        {
          title: "Expenses Calendar Heatmap 📅",
          width: "100%",
          height: "450px",
          kind: "echarts",
          spec: async ({ ledger, variables }) => {
            const result = await ledger.query(
              `SELECT date, root(account, 2) AS account, CONVERT(SUM(position), '${variables.currency}', LAST(date)) AS value
              WHERE account ~ '^Expenses:'
              GROUP BY account, date`,
            );

            // dirty hack for dark mode fix for the calendar heatmap
            const storedThemeSetting = document.documentElement.style.colorScheme;
            const isDarkMode =
              storedThemeSetting == "dark" ||
              (window.matchMedia &&
                window.matchMedia("(prefers-color-scheme: dark)").matches &&
                storedThemeSetting != "light");
            const outerLineStyleColor = isDarkMode ? "lightgray" : "black";

            const amounts: Record<string, number> = {};
            const counts: Record<number, number> = {};

            let maxAmount = 0;
            for (const row of result) {
              if (isNaN(row.value[variables.currency])) {
                continue;
              }
              if (!amounts[row.date]) {
                amounts[row.date] = row.value[variables.currency];
              } else {
                amounts[row.date] += row.value[variables.currency];
              }
              maxAmount = Math.max(maxAmount, amounts[row.date]);

              const year = row.date.substring(0, 4);
              if (!counts[year]) {
                counts[year] = 1;
              } else {
                counts[year] += 1;
              }
            }
            const allValues = Object.values(amounts).sort((a, b) => a - b);
            const percentileValue = allValues[Math.floor(allValues.length * 0.95)];

            const maxScaleValue = percentileValue;

            let mostMentionedYearCounts = -1;
            for (const [_year, count] of Object.entries(counts)) {
              if (count > mostMentionedYearCounts) {
                mostMentionedYearCounts = count;
              }
            }

            let allYears = Object.keys(counts);
            allYears = allYears.slice(0, 3);
            const calendars = allYears.map((year, ind) => ({
              left: 80,
              right: 100,
              top: ind * 150,
              cellSize: [10, 15],
              range: year,
              splitLine: {
                lineStyle: {
                  color: outerLineStyleColor,
                },
              },
              itemStyle: {
                borderWidth: 0.5,
              },
              dayLabel: {
                firstDay: 1,
              },
              yearLabel: {
                show: true,
                margin: 40,
              },
            }));
            const seriesData = allYears.map((year, ind) => ({
              type: "heatmap" as const,
              coordinateSystem: "calendar" as const,
              calendarIndex: ind,
              data: Object.entries(amounts),
            }));

            return {
              tooltip: {
                position: "top",
                formatter: function (params: any) {
                  return (
                    params.data[0] +
                    ":<br/>" +
                    "<b style='font-weight: 700'>" +
                    params.data[1] +
                    ` ${variables.currency}` +
                    "</b>"
                  );
                },
              },
              visualMap: [
                {
                  min: 0,
                  max: maxScaleValue,
                  calculable: true,
                  orient: "vertical",
                  top: "middle",
                  right: 10,
                  itemHeight: 300,
                },
              ],
              calendar: calendars,
              series: seriesData,
              onClick: (event) => {
                const link = "../../journal/?time={time}"
                  .replace("{time}", (event.data as string[])[0])
                  .replace("{account}", "");
                window.open(ledger.urlFor(link));
              },
            };
          },
        },
        {
          title: "Income Categories (per month) 💰",
          width: "50%",
          height: "400px",
          link: "../../account/Income/?r=changes",
          kind: "echarts",
          spec: async ({ ledger, variables }) => {
            const currencyFormatter = getCurrencyFormatter(variables.currency);
            const result = await ledger.query(
              `SELECT root(account, 4) AS account, CONVERT(SUM(position), '${variables.currency}') AS value
               WHERE account ~ '^Income:'
               GROUP BY account`,
            );

            const months = countMonths(ledger);
            const accountTree = buildAccountTree(
              result,
              (row) => -(row.value[variables.currency] ?? 0) / months,
              (parts, i) => parts[i],
            );
            // use click event on desktop, dblclick on mobile
            const clickEvt = window.screen.width < 800 ? "onDblClick" : "onClick";

            return {
              tooltip: {
                valueFormatter: anyFormatter(currencyFormatter),
              },
              series: [
                {
                  type: "sunburst",
                  radius: "100%",
                  label: {
                    minAngle: 20,
                  },
                  nodeClick: false,
                  data: accountTree.children[0]?.children ?? [],
                },
              ],
              [clickEvt]: (event: ECElementEvent) => {
                const account = "Income" + event.treePathInfo.map((i: any) => i.name).join(":");
                const link = "../../account/{account}/?r=changes".replace("{account}", account);
                window.open(ledger.urlFor(link));
              },
            };
          },
        },
        {
          title: "Expenses Categories (per month) 💸",
          width: "50%",
          height: "400px",
          link: "../../account/Expenses/?r=changes",
          kind: "echarts",
          spec: async ({ ledger, variables }) => {
            const result = await ledger.query(
              `SELECT root(account, 3) AS account, CONVERT(SUM(position), '${variables.currency}') AS value
               WHERE account ~ '^Expenses:'
               GROUP BY account`,
            );

            const currencyFormatter = getCurrencyFormatter(variables.currency);
            const months = countMonths(ledger);
            const accountTree = buildAccountTree(
              result,
              (row) => (row.value[variables.currency] ?? 0) / months,
              (parts, i) => parts[i],
            );
            // use click event on desktop, dblclick on mobile
            const clickEvt = window.screen.width < 800 ? "onDblClick" : "onClick";

            return {
              tooltip: {
                valueFormatter: anyFormatter(currencyFormatter),
              },
              series: [
                {
                  type: "sunburst",
                  radius: "100%",
                  label: {
                    minAngle: 20,
                  },
                  nodeClick: false,
                  data: accountTree.children[0]?.children ?? [],
                },
              ],
              [clickEvt]: (event: ECElementEvent) => {
                const account = "Expenses" + event.treePathInfo.map((i: any) => i.name).join(":");
                const link = "../../account/{account}/?r=changes".replace("{account}", account);
                window.open(ledger.urlFor(link));
              },
            };
          },
        },
        {
          title: "Recurring, Regular and Irregular Expenses 🔁",
          width: "50%",
          height: "400px",
          link: "../../income_statement/",
          kind: "echarts",
          spec: async ({ ledger, variables }) => {
            const currencyFormatter = getCurrencyFormatter(variables.currency);
            const queries = [
              {
                bql: `SELECT year, month, CONVERT(SUM(position), '${variables.currency}', LAST(date)) AS value
WHERE account ~ '^Expenses:' AND 'recurring' IN tags
GROUP BY year, month`,
                name: "Recurring",
                link: "../../account/Expenses/?filter=#recurring&time={time}",
              },
              {
                bql: `SELECT year, month, CONVERT(SUM(position), '${variables.currency}', LAST(date)) AS value
WHERE account ~ '^Expenses:' AND NOT 'recurring' IN tags AND NOT 'irregular' IN tags
GROUP BY year, month`,
                name: "Regular",
                link: "../../account/Expenses/?filter=-#recurring -#irregular&time={time}",
              },
              {
                bql: `SELECT year, month, CONVERT(SUM(position), '${variables.currency}', LAST(date)) AS value
WHERE account ~ '^Expenses:' AND 'irregular' IN tags
GROUP BY year, month`,
                name: "Irregular",
                link: "../../account/Expenses/?filter=#irregular&time={time}",
              },
            ];

            const results = await Promise.all(
              queries.map(async (query) => ({
                name: query.name,
                dataset: fillMonthlyDataset(
                  (await ledger.query(query.bql)).map((row) => ({
                    date: `${row.year}-${row.month}`,
                    value: row.value[variables.currency],
                  })),
                  "date",
                  iterateMonths(ledger.dateFirst, ledger.dateLast).map((m) => `${m.year}-${m.month}`),
                  { value: 0 },
                ),
              })),
            );

            return {
              tooltip: {
                valueFormatter: anyFormatter(currencyFormatter),
              },
              legend: {
                top: "bottom",
              },
              xAxis: {
                type: "time",
              },
              yAxis: {
                axisLabel: {
                  formatter: currencyFormatter,
                },
              },
              dataset: results.map((r) => ({ source: r.dataset })),
              series: queries.map((query, i) => ({
                type: "bar",
                name: query.name,
                stack: "expenses",
                datasetIndex: i,
                encode: { x: "date", y: "value" },
              })),
              onClick: (event) => {
                const query = queries.find((q) => q.name === event.seriesName);
                if (query) {
                  const [year, month] = (event.data as { date: string }).date.split("-");
                  const link = query.link.replace("{time}", `${year}-${month.padStart(2, "0")}`);
                  window.open(ledger.urlFor(link));
                }
              },
            };
          },
        },
        {
          title: "Food Expenses 🥐",
          width: "50%",
          height: "400px",
          link: "../../account/Expenses:Food/",
          kind: "echarts",
          spec: async ({ ledger, variables }) => {
            const currencyFormatter = getCurrencyFormatter(variables.currency);
            const result = await ledger.query(
              `SELECT year, month, CONVERT(SUM(position), '${variables.currency}', LAST(date)) AS value
               WHERE account ~ '^Expenses:Food:'
               GROUP BY year, month`,
            );
            const dataset = result.map((row) => ({
              date: `${row.year}-${row.month}`,
              value: row.value[variables.currency],
            }));

            return {
              tooltip: {
                valueFormatter: anyFormatter(currencyFormatter),
              },
              xAxis: {
                type: "time",
              },
              yAxis: {
                axisLabel: {
                  formatter: currencyFormatter,
                },
              },
              dataset: {
                source: dataset,
              },
              series: [
                {
                  type: "line",
                  name: "Expenses",
                  smooth: true,
                  encode: { x: "date", y: "value" },
                },
              ],
              onClick: (event) => {
                const [year, month] = (event.data as { date: string }).date.split("-");
                const link = "../../account/Expenses:Food/?time={time}".replace(
                  "{time}",
                  `${year}-${month.padStart(2, "0")}`,
                );
                window.open(ledger.urlFor(link));
              },
            };
          },
        },
        {
          title: "Income Year-Over-Year 💰",
          width: "50%",
          height: "700px",
          variables: [
            {
              name: "display",
              label: "Display",
              display: "toggle",
              options: () => ["single", "stacked"],
            },
          ],
          kind: "echarts",
          spec: async ({ ledger, variables }) => {
            const result = await ledger.query<{ year: number; account: string; category: string; value: Inventory }>(
              `SELECT year, account, root(account, 3) AS category, CONVERT(SUM(position), '${variables.currency}', LAST(date)) AS value
               WHERE account ~ '^Income:'
               GROUP BY account, category, year`,
            );
            const dataset = result.map(({ year, account, category, value }) => ({
              year,
              account,
              category,
              value: -(value[variables.currency] ?? 0),
            }));
            return StackedYearOverYear(ledger, dataset, variables.currency, variables.display == "stacked");
          },
        },
        {
          title: "Expenses Year-Over-Year 💸",
          width: "50%",
          height: "700px",
          variables: [
            {
              name: "display",
              label: "Display",
              display: "toggle",
              options: () => ["single", "stacked"],
            },
          ],
          kind: "echarts",
          spec: async ({ ledger, variables }) => {
            const result = await ledger.query<{ year: number; account: string; category: string; value: Inventory }>(
              `SELECT year, account, root(account, 2) AS category, CONVERT(SUM(position), '${variables.currency}', LAST(date)) AS value
               WHERE account ~ '^Expenses:'
               GROUP BY account, category, year`,
            );
            const dataset = result.map(({ year, account, category, value }) => ({
              year,
              account,
              category,
              value: value[variables.currency] ?? 0,
            }));
            return StackedYearOverYear(ledger, dataset, variables.currency, variables.display == "stacked");
          },
        },
        {
          title: "Top 10 biggest expenses",
          width: "100%",
          height: "400px",
          kind: "table",
          spec: async ({ ledger }) => {
            type Row = {
              date: string;
              payee: string | null;
              narration: string;
              position: Position;
            };
            const rows = await ledger.query<Row>(
              'SELECT date, payee, narration, position WHERE account ~ "^Expenses:" ORDER BY position DESC LIMIT 10',
            );

            const table: TableSpec<Row> = {
              columns: [
                { field: "date", minWidth: 100 },
                { field: "payee", flex: 0.5 },
                { field: "narration", flex: 1 },
                {
                  field: "position",
                  minWidth: 200,
                  valueGetter: (_value, row) => row.position.units.number,
                  valueFormatter: (_value, row) => `${row.position.units.number} ${row.position.units.currency}`,
                },
              ],
              rows: rows.map((row, i) => ({ ...row, id: i })),
            };
            return table;
          },
        },
      ],
    },
    {
      name: "Travelling",
      variables: [currencyVariable],
      panels: [
        {
          title: "Travel Costs per Year 📅",
          width: "100%",
          height: "400px",
          link: "../../income_statement/?filter=#travel",
          kind: "echarts",
          spec: async ({ ledger, variables }) => {
            const currencyFormatter = getCurrencyFormatter(variables.currency);
            const result = await ledger.query<{ tags: string[]; value: Amount }>(
              `SELECT tags, CONVERT(position, '${variables.currency}', date) AS value
               WHERE account ~ '^Expenses:' AND 'travel' IN tags
               ORDER BY date DESC`,
            );

            function parseTag(tags: string[]) {
              for (const tag of tags) {
                const m = tag.match(/-(\d{4})/);
                if (m) {
                  return { tag, year: parseInt(m[1]) };
                }
              }
              return { tag: "unknown", year: 0 };
            }

            const dataset: Record<number, Record<string, number>> = {}; // ex. {2025: {"date": 2025, "_sum": 8, "trip-chicago-2025": 5, "trip-paris-2025": 3}}
            const tags: string[] = []; // sorted by date
            for (const row of result) {
              const { tag, year } = parseTag(row.tags);
              if (!(year in dataset)) {
                dataset[year] = { date: year };
              }
              if (!(tag in dataset[year])) {
                tags.push(tag);
              }
              dataset[year]["_sum"] = (dataset[year]["_sum"] ?? 0) + row.value.number;
              dataset[year][tag] = (dataset[year][tag] ?? 0) + row.value.number;
            }

            const series: BarSeriesOption[] = [...tags].reverse().map((tag) => ({
              type: "bar",
              name: tag,
              stack: "total",
              encode: { x: "date", y: tag },
              barMaxWidth: 100,
            }));
            // totals labels
            series.push({
              type: "bar",
              name: "total",
              stack: "total",
              data: Object.keys(dataset).map((year) => [parseInt(year), 0]),
              label: {
                show: true,
                position: "top",
                formatter: ({ value }) => currencyFormatter(dataset[(value as [number, number])[0]]["_sum"]),
              },
              tooltip: {
                show: false,
              },
            });

            return {
              tooltip: {
                valueFormatter: anyFormatter(currencyFormatter),
              },
              xAxis: {
                type: "category",
              },
              yAxis: {
                axisLabel: {
                  formatter: currencyFormatter,
                },
              },
              dataset: {
                source: Object.values(dataset),
                // required because not every row contains all tags
                dimensions: ["date", ...tags],
              },
              series,
              onClick: (event) => {
                const link = "../../account/Expenses/?filter=#{tag}".replace("{tag}", event.seriesName as string);
                window.open(ledger.urlFor(link));
              },
            };
          },
        },
        {
          title: "Destinations ✈️",
          width: "100%",
          height: "150px",
          link: "../../income_statement/?filter=#travel",
          kind: "echarts",
          spec: async ({ panel, ledger, variables }) => {
            const currencyFormatter = getCurrencyFormatter(variables.currency);
            const result = await ledger.query<{ tags: string[]; value: Amount }>(
              `SELECT tags, CONVERT(position, '${variables.currency}', date) AS value
               WHERE account ~ '^Expenses:' AND 'travel' IN tags
               ORDER BY date DESC`,
            );

            const tags: string[] = [];
            const amounts: Record<string, number> = {};
            for (const row of result) {
              const tag = row.tags.find((tag) => tag.match(/-\d{4}/)) ?? "unknown";
              if (!(tag in amounts)) {
                tags.push(tag);
                amounts[tag] = 0;
              }
              amounts[tag] += row.value.number;
            }

            const dataset = tags.map((tag) => ({ tag, value: amounts[tag] }));

            panel.height = `${20 + dataset.length * 30}px`;
            return {
              dataset: {
                source: dataset,
              },
              tooltip: {
                valueFormatter: anyFormatter(currencyFormatter),
              },
              grid: {
                containLabel: true,
                left: 0,
                top: 10,
                bottom: 10,
              },
              xAxis: {
                type: "value",
                axisLabel: {
                  formatter: currencyFormatter,
                },
              },
              yAxis: {
                type: "category",
              },
              series: [
                {
                  type: "bar",
                  encode: { x: "value", y: "tag" },
                  label: {
                    show: true,
                    position: "right",
                    formatter: (params: any) => currencyFormatter(params.value.value),
                  },
                },
              ],
              onClick: (event) => {
                const link = "../../account/Expenses/?filter=#{tag}".replace("{tag}", event.name);
                window.open(ledger.urlFor(link));
              },
            };
          },
        },
      ],
    },
    {
      name: "Sankey",
      variables: [currencyVariable],
      panels: [
        {
          title: "Sankey (per month) 💸",
          width: "100%",
          height: "800px",
          link: "../../income_statement/",
          kind: "d3_sankey",
          spec: async ({ ledger, variables }) => {
            const currencyFormatter = getCurrencyFormatter(variables.currency);
            const result = await ledger.query(
              `SELECT account, CONVERT(SUM(position), '${variables.currency}') AS value
               WHERE account ~ '^(Income|Expenses):'
               GROUP BY account`,
            );
            const months = countMonths(ledger);
            const valueThreshold = 10; // skip nodes below this value

            const nodes: D3SankeyNode[] = [{ name: "Income" }];
            const links: D3SankeyLink[] = [];
            type Node = Required<SunburstNode> & { children: Node[] };
            function addNode(root: Node) {
              for (let node of root.children) {
                let label = node.name.split(":").pop();

                // skip over pass-through accounts
                while (node.children.length === 1) {
                  node = node.children[0];
                  label += ":" + node.name.split(":").pop();
                }

                // skip nodes below the threshold
                if (Math.abs(node.value / months) < valueThreshold) {
                  continue;
                }

                nodes.push({ name: node.name, label });
                if (node.name.startsWith("Income:")) {
                  links.push({ source: node.name, target: root.name, value: -node.value / months });
                } else {
                  links.push({
                    source: root.name == "Expenses" ? "Income" : root.name,
                    target: node.name,
                    value: node.value / months,
                  });
                }
                addNode(node);
              }
            }

            const accountTree = buildAccountTree(result, (row) => row.value[variables.currency] ?? 0);
            if (accountTree.children.length !== 2) {
              throw Error("No Income/Expense accounts found.");
            }
            addNode(accountTree.children[0] as Node);
            addNode(accountTree.children[1] as Node);

            const savings =
              accountTree.children[0].name === "Income"
                ? -accountTree.children[0].value! - accountTree.children[1].value!
                : -accountTree.children[1].value! - accountTree.children[0].value!;
            if (savings > 0) {
              nodes.push({ name: "Savings" });
              links.push({ source: "Income", target: "Savings", value: savings / months });
            }

            return {
              align: "left",
              valueFormatter: currencyFormatter,
              data: {
                nodes,
                links,
              },
              onClick: (_event, node) => {
                if (node.name === "Savings") {
                  return;
                }
                const link = "../../account/{account}/".replace("{account}", node.name);
                window.open(ledger.urlFor(link));
              },
            };
          },
        },
      ],
    },
    {
      name: "Projection",
      variables: [currencyVariable],
      panels: [
        {
          title: "Net Worth 💰",
          width: "100%",
          height: "400px",
          link: "../../income_statement/",
          kind: "echarts",
          spec: async ({ ledger, variables }) => {
            const currencyFormatter = getCurrencyFormatter(variables.currency);
            const projectYears = 2; // number of years to project

            const result = await ledger.query(
              `SELECT year, month,
               CONVERT(LAST(balance), '${variables.currency}', DATE_TRUNC('month', FIRST(date)) + INTERVAL('1 month') - INTERVAL('1 day')) AS value
               WHERE account_sortkey(account) ~ '^[01]'
               GROUP BY year, month`,
            );
            const resultDataset = result.map((row) => ({
              date: `${row.year}-${row.month}`,
              value: row.value[variables.currency],
            }));

            // ignore onetime income and expenses, for example winning the lottery or wedding expenses
            const resultEx = await ledger.query(
              `SELECT year, month,
               CONVERT(LAST(balance), '${variables.currency}', DATE_TRUNC('month', FIRST(date)) + INTERVAL('1 month') - INTERVAL('1 day')) AS value
               WHERE account_sortkey(account) ~ '^[01]' AND NOT 'wedding' IN tags AND NOT 'weddinggift' IN tags
               GROUP BY year, month`,
            );
            const resultExDataset = resultEx.map((row) => ({
              date: `${row.year}-${row.month}`,
              value: row.value[variables.currency],
            }));

            const resultExLast = resultEx[resultEx.length - 1];

            const finalAmount = result.length > 0 ? result.at(-1)!.value[variables.currency] : 0;
            const dateFirst = new Date(resultEx[0].year, resultEx[0].month - 1, 1);
            const dateLast = new Date(new Date(resultExLast.year, resultExLast.month, 1).getTime() - 1);
            const days = (dateLast.getTime() - dateFirst.getTime()) / (1000 * 60 * 60 * 24) + 1;
            const totalDiff =
              (resultExLast.value[variables.currency] ?? 0) - (resultEx[0].value[variables.currency] ?? 0);
            const monthlyDiff = (totalDiff / days) * (365 / 12);

            const dateLastYear = dateLast.getFullYear();
            const dateLastMonth = dateLast.getMonth() + 1;
            const dateFirstStr = `${dateFirst.getFullYear()}-${dateFirst.getMonth() + 1}-1`;
            const dateProjectUntilStr = `${dateLastYear + projectYears}-${dateLastMonth}-1`;
            const months = iterateMonths(dateFirstStr, dateProjectUntilStr).map((m) => `${m.year}-${m.month}`);
            const lastMonthIdx = months.findIndex((m) => m === `${dateLastYear}-${dateLastMonth}`);

            const projection: Record<string, number> = {};
            let sum = finalAmount;
            for (let i = lastMonthIdx; i < months.length; i++) {
              projection[months[i]] = sum;
              sum += monthlyDiff;
            }

            return {
              tooltip: {
                trigger: "axis",
                valueFormatter: anyFormatter(currencyFormatter),
              },
              legend: {
                top: "bottom",
              },
              xAxis: {
                type: "time",
              },
              yAxis: {
                axisLabel: {
                  formatter: currencyFormatter,
                },
              },
              dataset: [{ source: resultDataset }, { source: resultExDataset }],
              series: [
                {
                  type: "line",
                  name: "Net Worth",
                  smooth: true,
                  connectNulls: true,
                  showSymbol: false,
                  datasetIndex: 0,
                  encode: { x: "date", y: "value" },
                },
                {
                  type: "line",
                  name: "Excluding onetime txns",
                  smooth: true,
                  connectNulls: true,
                  showSymbol: false,
                  datasetIndex: 1,
                  encode: { x: "date", y: "value" },
                },
                {
                  type: "line",
                  name: "Projection",
                  lineStyle: {
                    type: "dashed",
                  },
                  showSymbol: false,
                  data: months.map((month) => [month, projection[month]]),
                },
              ],
              onClick: (event) => {
                if (event.seriesName === "Projection") {
                  return;
                }
                const [year, month] = (event.data as { date: string }).date.split("-");
                const link = "../../balance_sheet/?time={time}".replace("{time}", `${year}-${month.padStart(2, "0")}`);
                window.open(ledger.urlFor(link));
              },
            };
          },
        },
      ],
    },
  ],
});
