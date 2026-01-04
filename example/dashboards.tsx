/// <reference types="./fava-dashboards.d.ts" />
import { BarSeriesOption, ECElementEvent } from "echarts";
import { Amount, defineConfig, EChartsSpec, Inventory, Ledger, Position, TableSpec, Variable } from "fava-dashboards";

/* eslint-disable @typescript-eslint/no-explicit-any */

// Base colors from fava
const COLOR_PROFIT = "#3daf46";
const COLOR_LOSS = "#af3d3d";

const LOCATION_COLORS = [
  "rgba(100, 181, 246, 0.1)",
  "rgba(129, 199, 132, 0.1)",
  "rgba(255, 183, 77, 0.1)",
  "rgba(149, 117, 21, 0.1)",
  "rgba(239, 83, 80, 0.1)",
  "rgba(77, 208, 225, 0.1)",
  "rgba(255, 138, 101, 0.1)",
  "rgba(171, 71, 188, 0.1)",
];

function locationColorsByIndex(descriptions: string[]): (description: string) => string {
  const unique: string[] = [];
  const seen = new Set<string>();
  for (const d of descriptions) {
    const key = d ?? "";
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(key);
    }
  }
  return (description: string) => {
    const idx = unique.indexOf(description ?? "");
    return LOCATION_COLORS[idx >= 0 ? idx % LOCATION_COLORS.length : 0];
  };
}
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

function movingAverage<T extends { date: string; value: number | null }>(
  data: T[],
  windowSize: number,
  centerWindow: boolean = true,
): { date: string; value: number }[] {
  let sum = 0;
  const transformed = data.map((row, i) => {
    sum += row.value ?? 0;
    if (i >= windowSize) {
      sum -= data[i - windowSize].value ?? 0;
    }
    if (i < windowSize - 1) {
      return { ...row, value: sum / (i + 1) };
    }
    return { date: row.date, value: sum / windowSize };
  });
  if (!centerWindow) {
    // each value is an average of preceding values in thewindow
    return transformed;
  }
  let lastDate = data[data.length - 1].date;
  // if data.length < windowSize, extend until the list is windowSize long
  for (let i = data.length; i < windowSize - 1; i++) {
    if (i - windowSize >= 0) {
      sum -= data[i - windowSize].value ?? 0;
    }
    transformed.push({ date: lastDate, value: sum / i });
    const d = new Date(lastDate);
    d.setDate(d.getDate() + 1);
    lastDate = d.toISOString().slice(0, 10);
  }
  // it's effectively max(data.length, windowSize)
  const newLength = transformed.length;
  // fill one extra window
  for (let j = 0; j < windowSize - 1; j++) {
    if (newLength - windowSize + j >= 0 && newLength - windowSize + j < data.length) {
      sum -= data[newLength - windowSize + j].value ?? 0;
    }
    transformed.push({ date: lastDate, value: sum / (windowSize - j + 1) });
    const d = new Date(lastDate);
    d.setDate(d.getDate() + 1);
    lastDate = d.toISOString().slice(0, 10);
  }
  return data.map((row, i) => {
    // each value is the average of the window centered on the value
    return { date: row.date, value: transformed[i + Math.floor(windowSize / 2)].value };
  });
}

function iterateDays(dateFirst: string, dateLast: string): string[] {
  const dates: string[] = [];
  const d = new Date(dateFirst);
  const last = new Date(dateLast);
  while (d <= last) {
    dates.push(d.toISOString().slice(0, 10));
    d.setDate(d.getDate() + 1);
  }
  return dates;
}

function iterateMonths(dateFirst: string, dateLast: string) {
  const months: { year: number; month: number }[] = [];
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
  const years: number[] = [];
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

async function PeriodicBalanceChart(
  ledger: Ledger,
  currency: string,
  accountFilter: string,
  options: {
    intervalDays?: number;
    splitNumber?: number;
    link?: string;
    color?: string;
    showEvents?: boolean;
  } = {},
): Promise<EChartsSpec> {
  const {
    intervalDays = 7,
    splitNumber = 12,
    link = "../../balance_sheet/?time={time}",
    color,
    showEvents = false,
  } = options;
  const interval = `${intervalDays} days`;
  const offset = `${intervalDays - 1} days`;
  const [result, chartNoteEvents] = await Promise.all([
    ledger.query(
      `SELECT
     DATE_BIN(INTERVAL('${interval}'), date, 1970-01-01) + INTERVAL('${offset}') AS datebin,
     CONVERT(LAST(balance), '${currency}', DATE_BIN(INTERVAL('${interval}'), LAST(date), 1970-01-01) + INTERVAL('${offset}')) AS value
     WHERE account ~ '^Equity:RegularTransacionForSummariesFrom' OR (${accountFilter})
     GROUP BY datebin`,
    ),
    showEvents
      ? ledger
          .query<{
            date: string;
            description: string;
          }>(`SELECT date, description FROM events WHERE type = 'chart_note'`)
          .catch(() => [] as { date: string; description: string }[])
      : Promise.resolve([] as { date: string; description: string }[]),
  ]);
  const dataset = result
    .map((row) => ({
      date: row.datebin,
      value: row.value[currency] ?? 0,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
  const currencyFormatter = getCurrencyFormatter(currency);
  const lineColor = color ?? undefined;
  const markLineData = chartNoteEvents.map((e) => ({
    xAxis: e.date,
    name: e.description ?? "",
  }));
  return {
    grid: {
      left: "5%",
      right: "5%",
    },
    tooltip: {
      trigger: "axis",
      valueFormatter: anyFormatter(currencyFormatter),
    },
    xAxis: {
      type: "time",
      splitNumber,
      splitLine: {
        show: true,
        lineStyle: {
          type: "dotted",
        },
      },
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
        color: lineColor,
        smooth: true,
        connectNulls: true,
        encode: { x: "date", y: "value" },
        areaStyle: {},
        showSymbol: false,
        markLine:
          showEvents && markLineData.length > 0
            ? {
                symbol: ["none", "none"],
                data: markLineData,
                lineStyle: { type: "dotted", color: "rgba(128, 128, 128, 0.5)" },
                label: { show: false, formatter: "{@date}: {b}" },
                emphasis: { label: { show: true } },
              }
            : undefined,
      },
    ],
    onClick: (event) => {
      const datebin = (event.data as { date: string })?.date ?? dataset[event.dataIndex ?? 0]?.date;
      if (datebin) {
        const targetLink = link.replace("{time}", datebin);
        window.open(ledger.urlFor(targetLink));
      }
    },
  };
}

async function StackedPeriodicBalanceChart(
  ledger: Ledger,
  currency: string,
  series: Array<{ name: string; accountFilter: string; color?: string }>,
  options: {
    intervalDays?: number;
    splitNumber?: number;
    link?: string;
    showEvents?: boolean;
  } = {},
): Promise<EChartsSpec> {
  const { intervalDays = 7, splitNumber = 24, link = "../../balance_sheet/?time={time}", showEvents = false } = options;
  const interval = `${intervalDays} days`;
  const offset = `${intervalDays - 1} days`;
  const bql = (accountFilter: string) =>
    `SELECT
     DATE_BIN(INTERVAL('${interval}'), date, 1970-01-01) + INTERVAL('${offset}') AS datebin,
     CONVERT(LAST(balance), '${currency}', DATE_BIN(INTERVAL('${interval}'), LAST(date), 1970-01-01) + INTERVAL('${offset}')) AS value
     WHERE account ~ '^Equity:RegularTransacionForSummariesFrom' OR (${accountFilter})
     GROUP BY datebin`;

  const [seriesResults, chartNoteEvents] = await Promise.all([
    Promise.all(
      series.map(async (s) => {
        const result = await ledger.query(bql(s.accountFilter));
        return {
          name: s.name,
          color: s.color,
          data: result.map((row) => ({
            date: row.datebin,
            value: row.value[currency] ?? 0,
          })),
        };
      }),
    ),
    showEvents
      ? ledger
          .query<{
            date: string;
            description: string;
          }>(`SELECT date, description FROM events WHERE type = 'chart_note'`)
          .catch(() => [] as { date: string; description: string }[])
      : Promise.resolve([] as { date: string; description: string }[]),
  ]);

  const results = seriesResults;
  const markLineData = chartNoteEvents.map((e) => ({
    xAxis: e.date,
    name: e.description ?? "",
  }));

  const allDates = [...new Set(results.flatMap((r) => r.data.map((d) => d.date)))].sort();
  const datasets = results.map((r) => {
    const byDate: Record<string, number> = {};
    for (const row of r.data) {
      byDate[row.date] = row.value;
    }
    return {
      source: allDates.map((date) => ({ date, value: byDate[date] ?? 0 })),
    };
  });

  const currencyFormatter = getCurrencyFormatter(currency);
  return {
    grid: {
      left: "5%",
      right: "5%",
    },
    tooltip: {
      trigger: "axis",
      formatter: (params: any) => {
        const getVal = (p: any) => (typeof p.data?.value === "number" ? p.data.value : 0);
        const total = params.reduce((sum: number, p: any) => sum + getVal(p), 0);
        const pct = (v: number) => (total ? ((v / total) * 100).toFixed(1) : "0");
        const lines = params.map((p: any) => {
          const v = getVal(p);
          return `${p.marker} ${p.seriesName}: <span style="float: right; margin-left: 20px;">${currencyFormatter(v)} (${pct(v)}%)</span>`;
        });
        lines.push(
          `<span style="font-weight: bold">Total:</span> <span style="float: right; margin-left: 20px;">${currencyFormatter(total)} (100%)</span>`,
        );
        const raw = params[0]?.axisValue ?? params[0]?.data?.date;
        const dateStr = new Date(raw).toLocaleDateString();
        return `<span style="font-weight: bold">${dateStr}</span><br/>` + lines.join("<br/>");
      },
    },
    legend: {
      top: "bottom",
    },
    xAxis: {
      type: "time",
      splitNumber,
      splitLine: {
        show: true,
        lineStyle: {
          type: "dotted",
        },
      },
    },
    yAxis: {
      axisLabel: {
        formatter: currencyFormatter,
      },
    },
    dataset: datasets.map((d) => ({ source: d.source })),
    series: results.map((r, i) => ({
      type: "line",
      name: r.name,
      stack: "total",
      color: r.color,
      smooth: true,
      lineStyle: {
        width: 0,
      },
      connectNulls: true,
      datasetIndex: i,
      encode: { x: "date", y: "value" },
      areaStyle: {},
      showSymbol: false,
      emphasis: {
        focus: "series",
      },
      markLine:
        showEvents && markLineData.length > 0 && i === 0
          ? {
              symbol: ["none", "none"],
              data: markLineData,
              lineStyle: { type: "dotted", color: "rgba(128, 128, 128, 0.5)" },
              label: { show: false, formatter: "{@date}: {b}" },
              emphasis: { label: { show: true } },
            }
          : undefined,
    })),
    onClick: (event) => {
      const datebin = (event.data as { date: string })?.date ?? allDates[event.dataIndex ?? 0];
      if (datebin) {
        const targetLink = link.replace("{time}", datebin);
        window.open(ledger.urlFor(targetLink));
      }
    },
  };
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

function addOtherNodes(node: SunburstNode): void {
  if (!node.children?.length) {
    return;
  }
  const childrenSum = node.children.reduce((s, c) => s + (c.value ?? 0), 0);
  const nodeValue = node.value ?? 0;
  if (childrenSum < nodeValue) {
    node.children.push({
      name: "(Other)",
      value: nodeValue - childrenSum,
      children: [],
    });
  }
  for (const child of node.children) {
    addOtherNodes(child);
  }
}

type ExpensesRow = {
  date: string;
  account: string;
  narration: string;
  tags: string;
  value: Inventory;
};

async function ExpensesTable(
  ledger: Ledger,
  currency: string,
  options: { orderBy?: "DESC" | "ASC"; limit?: number; whereFilter?: string } = {},
): Promise<TableSpec<ExpensesRow>> {
  const { orderBy = "DESC", limit = 30, whereFilter = "" } = options;
  const rows = await ledger.query<ExpensesRow>(
    `SELECT date, account, MAXWIDTH(narration, 80) AS narration, JOINSTR(tags) AS tags,
            SUM(CONVERT(position, '${currency}')) AS value
     WHERE account ~ "^Expenses:"${whereFilter}
     ORDER BY value ${orderBy}
     LIMIT ${limit}`,
  );
  const currencyFormatter = getCurrencyFormatter(currency);
  return {
    columns: [
      { field: "date", minWidth: 100 },
      { field: "account", flex: 0.6 },
      { field: "narration", flex: 1 },
      { field: "tags", flex: 0.5, cellClassName: "expenses-tags-muted" },
      {
        field: "value",
        minWidth: 200,
        valueGetter: (_v, row) => row.value[currency] ?? 0,
        valueFormatter: (_v, row) => currencyFormatter(row.value[currency] ?? 0),
        cellClassName: "expenses-value-bold",
      },
    ],
    rows: rows.map((row, i) => ({ ...row, id: i })),
    density: "compact",
    getRowClassName: (params) => (params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"),
    sx: {
      "& .MuiDataGrid-row.even": { backgroundColor: "rgba(0, 0, 0, 0.2)" },
      "& .expenses-value-bold": { fontWeight: "bold" },
      "& .expenses-tags-muted": { color: "text.secondary", fontStyle: "italic" },
    },
    pageSizeOptions: [20, 50, 100],
    initialState: {
      pagination: {
        paginationModel: { page: 0, pageSize: 20 },
      },
    },
  };
}

type SubscriptionsRow = {
  name: string;
  account: string;
  value: Inventory;
  count: number;
  recent: string;
  tags: string;
};

async function SubscriptionsTable(ledger: Ledger, currency: string): Promise<TableSpec<SubscriptionsRow>> {
  const rows = await ledger.query<SubscriptionsRow>(
    `SELECT
     COALESCE(STR(entry.meta['subscriptionName']), payee, MAXWIDTH(description, 15)) AS name,
     account, CONVERT(SUM(position), '${currency}', LAST(date)) AS value, COUNT(1) AS count, LAST(date) AS recent, JOINSTR(tags) AS tags
     WHERE account ~ '^Expenses' AND 'recurring' in tags
     AND date >= DATE_ADD(${ledger.dateLast}, -365)
     GROUP BY name, account, tags
     ORDER BY value DESC`,
  );

  const currencyFormatter = getCurrencyFormatter(currency);
  return {
    columns: [
      { field: "name", flex: 0.8, minWidth: 120 },
      { field: "account", flex: 0.6 },
      {
        field: "value",
        minWidth: 120,
        valueGetter: (_v, row) => row.value[currency] ?? 0,
        valueFormatter: (_v, row) => currencyFormatter(row.value[currency] ?? 0),
        cellClassName: "expenses-value-bold",
      },
      { field: "count", minWidth: 70, flex: 0.2 },
      { field: "recent", minWidth: 100 },
      { field: "tags", flex: 0.5, cellClassName: "expenses-tags-muted" },
    ],
    rows: rows.map((row, i) => ({ ...row, id: i })),
    density: "compact",
    getRowClassName: (params) => (params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"),
    sx: {
      "& .MuiDataGrid-row.even": { backgroundColor: "rgba(0, 0, 0, 0.2)" },
      "& .expenses-value-bold": { fontWeight: "bold" },
      "& .expenses-tags-muted": { color: "text.secondary", fontStyle: "italic" },
    },
    pageSizeOptions: [20, 50, 100],
    initialState: {
      pagination: {
        paginationModel: { page: 0, pageSize: 20 },
      },
    },
  };
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

const currencyVariable: Variable = {
  name: "currency",
  label: "Currency",
  options: async ({ ledger }) => {
    return ledger.operatingCurrencies;
  },
};

function getRecentUKTaxYears(count = 5): { keys: string[]; bounds: Record<string, [string, string]> } {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const currentEndYear = month > 4 || (month === 4 && day >= 6) ? year + 1 : year;
  const keys: string[] = [];
  const bounds: Record<string, [string, string]> = {};
  for (let i = 0; i < count; i++) {
    const endYear = currentEndYear - i;
    const startYear = endYear - 1;
    const key = `${startYear}-${endYear} UK`;
    keys.push(key);
    bounds[key] = [`${startYear}-04-06`, `${endYear}-04-05`];
  }
  return { keys, bounds };
}

function getRecentCalendarTaxYears(count = 5): { keys: string[]; bounds: Record<string, [string, string]> } {
  const year = new Date().getFullYear();
  const keys: string[] = [];
  const bounds: Record<string, [string, string]> = {};
  for (let i = 0; i < count; i++) {
    const y = year - i;
    const key = `${y} Calendar`;
    keys.push(key);
    bounds[key] = [`${y}-01-01`, `${y}-12-31`];
  }
  return { keys, bounds };
}

const ukTaxYears = getRecentUKTaxYears();
const calendarTaxYears = getRecentCalendarTaxYears();
const TAX_YEAR_KEYS = [...ukTaxYears.keys, ...calendarTaxYears.keys];
const TAX_YEAR_BOUNDS: Record<string, [string, string]> = {
  ...ukTaxYears.bounds,
  ...calendarTaxYears.bounds,
};

const taxYearVariable: Variable = {
  name: "taxYear",
  label: "Tax Year",
  default: TAX_YEAR_KEYS[0],
  options: async () => TAX_YEAR_KEYS,
};

const platformVariable: Variable = {
  name: "platform",
  label: "Platform",
  options: async () => [".*", "MyStockBroker", "MyCryptoBroker"],
};

const incomeTypeVariable: Variable = {
  name: "incomeType",
  label: "Income type",
  options: async () => ["ALL", "interest", "staking_income", "dividend", "eri"],
};

const expenseAccountVariable: Variable = {
  name: "expenseAccount",
  label: "Expense account",
  default: "EatingOut",
  options: async ({ ledger }) =>
    Object.keys(ledger.accounts)
      .filter((a) => a.startsWith("Expenses:") && !a.slice(9).includes(":"))
      .map((a) => a.slice(9))
      .sort(),
};

const movingAverageVariable: Variable = {
  name: "window",
  label: "Moving average",
  default: "7 days",
  options: async () => ["3 days", "7 days", "15 days", "30 days", "90 days", "180 days"],
};

const showLocationAreasVariable: Variable = {
  name: "showLocationAreas",
  label: "Location areas",
  default: "Show",
  options: async () => ["Show", "Hide"],
};

const showEventsVariable: Variable = {
  name: "showEvents",
  label: "Events",
  default: "Show",
  options: async () => ["Show", "Hide"],
};

const chartTypeVariable: Variable = {
  name: "chartType",
  label: "Chart type",
  default: "Sunburst",
  options: async () => ["Sunburst", "Treemap"],
};

const INCOME_TYPE_QUERY_CONDITION: Record<string, string> = {
  ALL: "'interest' in tags OR 'staking_income' in tags OR 'dividend' in tags OR 'ERI' in tags",
  interest: "'interest' in tags",
  staking_income: "'staking_income' in tags",
  dividend: "'dividend' in tags",
  eri: "'ERI' in tags",
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
              value: (cumValue += row.value.hasOwnProperty(variables.currency) ? row.value[variables.currency] : 0),
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
            result.forEach((row) => {
              cumValue += -row.value[variables.currency];
            });
            cumValue = 0;
            const dataset = result.map((row) => ({
              date: `${row.year}-${row.month}`,
              value: (cumValue += row.value.hasOwnProperty(variables.currency) ? -row.value[variables.currency] : 0),
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
                      WHERE account ~ '^Expenses:Accommodation' AND NOT 'travel' IN tags
                      GROUP BY year, month`,
                name: "Accommodation",
                stack: "expenses",
                link: "../../account/Expenses:Accommodation/?filter=-#travel&time={time}",
              },
              {
                bql: `SELECT year, month, CONVERT(SUM(position), '${variables.currency}', LAST(date)) AS value
                      WHERE account ~ '^Expenses:EatingOut' AND NOT 'travel' IN tags
                      GROUP BY year, month`,
                name: "EatingOut",
                stack: "expenses",
                link: "../../account/Expenses:EatingOut/?filter=-#travel&time={time}",
              },
              {
                bql: `SELECT year, month, CONVERT(SUM(position), '${variables.currency}', LAST(date)) AS value
                      WHERE account ~ '^Expenses:Groceries' AND NOT 'travel' IN tags
                      GROUP BY year, month`,
                name: "Groceries",
                stack: "expenses",
                link: "../../account/Expenses:Groceries/?filter=-#travel&time={time}",
              },
              {
                bql: `SELECT year, month, CONVERT(SUM(position), '${variables.currency}', LAST(date)) AS value
                      WHERE account ~ '^Expenses:Shopping' AND NOT 'travel' IN tags
                      GROUP BY year, month`,
                name: "Shopping",
                stack: "expenses",
                link: "../../account/Expenses:Shopping/?filter=-#travel&time={time}",
              },
              {
                bql: `SELECT year, month, CONVERT(SUM(position), '${variables.currency}', LAST(date)) AS value
                      WHERE account ~ '^Expenses:Unattributed' AND NOT 'travel' IN tags
                      GROUP BY year, month`,
                name: "Unattributed",
                stack: "expenses",
                link: "../../account/Expenses:Unattributed/?filter=-#travel&time={time}",
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
                      WHERE account ~ '^Expenses:' AND NOT account ~ '^Expenses:(Accommodation|EatingOut|Shopping|Unattributed)' AND NOT 'travel' IN tags
                      GROUP BY year, month`,
                name: "Other",
                stack: "expenses",
                link: '../../account/Expenses/?filter=all(-account:"^Expenses:(Accommodation|EatingOut|Shopping|Unattributed)") -#travel&time={time}',
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
              grid: {
                left: "5%",
                right: "5%",
              },
              xAxis: {
                type: "time",
                splitNumber: 24,
                splitLine: {
                  show: true,
                  lineStyle: {
                    type: "dotted",
                  },
                },
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
                  connectNulls: true,
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
                  connectNulls: true,
                  encode: { x: "date", y: "market_value" },
                },
                {
                  type: "line",
                  name: "Book Value",
                  smooth: true,
                  connectNulls: true,
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
                  connectNulls: true,
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
          height: "600px",
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
                  itemStyle: {
                    borderColor: "#0000",
                    borderWidth: 0,
                  },
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
          height: "600px",
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
                  itemStyle: {
                    borderColor: "#0000",
                    borderWidth: 0,
                  },
                  label: {
                    // rotate: "tangential",
                    minAngle: 10,
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
      name: "Accounts",
      variables: [currencyVariable, showEventsVariable],
      panels: [
        {
          title: "Net Worth by Account",
          width: "100%",
          height: "600px",
          link: "../../balance_sheet/",
          kind: "echarts",
          spec: ({ ledger, variables }) =>
            StackedPeriodicBalanceChart(
              ledger,
              variables.currency,
              [
                {
                  name: "Cash",
                  accountFilter:
                    "account_sortkey(account) ~ '^[01]' AND account ~ '^Assets:(MyFavouriteBank:Cash|MyFavouriteBank:Savings|MyLessFavouriteBank:Cash|MyStockBroker:Cash|Physical:Cash)'",
                  color: "#dcd7a0",
                },
                {
                  name: "MyAutomaticBroker",
                  accountFilter: "account_sortkey(account) ~ '^[01]' AND account ~ '^Assets:MyAutomaticBroker'",
                },
                {
                  name: "MyStockBroker",
                  accountFilter:
                    "account_sortkey(account) ~ '^[01]' AND account ~ '^Assets:MyStockBroker' AND NOT account ~ '^Assets:MyStockBroker:Cash'",
                },
                {
                  name: "MyCryptoBroker",
                  accountFilter: "account_sortkey(account) ~ '^[01]' AND account ~ '^Assets:MyCryptoBroker'",
                },
                {
                  name: "SomeBroker",
                  accountFilter: "account_sortkey(account) ~ '^[01]' AND account ~ '^Assets:SomeBroker'",
                },
                {
                  name: "Liabilities",
                  accountFilter: "account_sortkey(account) ~ '^[01]' AND account ~ '^Liabilities:'",
                },
              ],
              { showEvents: variables.showEvents === "Show" },
            ),
        },
        {
          title: "Notes",
          width: "100%",
          height: "250px",
          kind: "html",
          spec: async () => `
            <p> In order for the chart to work properly you will need to add a regularly occurring transaction to your ledger to generate data points for price conversions (this is current limitation of beanquery).
            For example, you can add a transaction using "beancount_interpolate.recur" plugin:
            <pre>
2020-01-01 A "Regular transaction for summaries" #auxiliary
    recur: " / 6 days"
  Equity:RegularTransacionForSummariesFrom 0 USD
  Equity:RegularTransacionForSummariesTo 0 USD</pre>

            Since it's labeled with a tag and has a distinct "A" flag (or whatever you choose to specify yourself), you have multiple ways to hide it in Fava journal by default.
            </p>
            <p>Balance charts can show vertical marker lines for <code>chart_note</code> events from your ledger.
            Add events in your Beancount file with <code>"chart_note"</code> type and a description.</p>
          `,
        },
        {
          title: "Net Worth",
          width: "100%",
          height: "400px",
          link: "../../income_statement/",
          kind: "echarts",
          spec: ({ ledger, variables }) =>
            PeriodicBalanceChart(ledger, variables.currency, "account_sortkey(account) ~ '^[01]'", {
              color: "#3ba272",
              splitNumber: 24,
              showEvents: variables.showEvents === "Show",
            }),
        },
        {
          title: "Cash",
          width: "50%",
          height: "400px",
          link: "../../income_statement/",
          kind: "echarts",
          spec: ({ ledger, variables }) =>
            PeriodicBalanceChart(
              ledger,
              variables.currency,
              "account_sortkey(account) ~ '^[01]' AND account ~ '^Assets:(MyFavouriteBank:Cash|MyFavouriteBank:Savings|MyLessFavouriteBank:Cash|MyStockBroker:Cash|Physical:Cash)'",
              { intervalDays: 3, color: "#dcd7a0", showEvents: variables.showEvents === "Show" },
            ),
        },
        {
          title: "MyAutomaticBroker",
          width: "50%",
          height: "400px",
          link: "../../income_statement/",
          kind: "echarts",
          spec: ({ ledger, variables }) =>
            PeriodicBalanceChart(
              ledger,
              variables.currency,
              "account_sortkey(account) ~ '^[01]' AND account ~ '^Assets:MyAutomaticBroker'",
              { showEvents: variables.showEvents === "Show" },
            ),
        },
        {
          title: "MyStockBroker",
          width: "50%",
          height: "400px",
          link: "../../income_statement/",
          kind: "echarts",
          spec: ({ ledger, variables }) =>
            PeriodicBalanceChart(
              ledger,
              variables.currency,
              "account_sortkey(account) ~ '^[01]' AND account ~ '^Assets:MyStockBroker' AND NOT account ~ '^Assets:MyStockBroker:Cash'",
              { showEvents: variables.showEvents === "Show" },
            ),
        },
        {
          title: "MyCryptoBroker",
          width: "50%",
          height: "400px",
          link: "../../income_statement/",
          kind: "echarts",
          spec: ({ ledger, variables }) =>
            PeriodicBalanceChart(
              ledger,
              variables.currency,
              "account_sortkey(account) ~ '^[01]' AND account ~ '^Assets:MyCryptoBroker'",
              { showEvents: variables.showEvents === "Show" },
            ),
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
              value: -(row.value[variables.currency] ?? 0),
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
              value: row.value[variables.currency] ?? 0,
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
              value: -(row.value[variables.currency] ?? 0),
            }));
            const avgIncome = sumValue(incomeDataset) / countMonths(ledger);

            const expenses = await ledger.query(
              `SELECT year, month, CONVERT(SUM(position), '${variables.currency}') AS value
               WHERE account ~ '^Expenses:'
               GROUP BY year, month`,
            );
            const expensesDataset = expenses.map((row) => ({
              date: `${row.year}-${row.month}`,
              value: row.value[variables.currency] ?? 0,
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
          title: "Unattributed Expenses 🔧",
          width: "100%",
          link: "../../income_statement/",
          kind: "echarts",
          spec: async ({ ledger, variables }) => {
            const currencyFormatter = getCurrencyFormatter(variables.currency);
            const months = iterateMonths(ledger.dateFirst, ledger.dateLast);
            const monthKeys = months.map((m) => `${m.year}-${String(m.month).padStart(2, "0")}`);

            const result = await ledger.query(
              `SELECT year, month, CONVERT(SUM(position), '${variables.currency}', LAST(date)) AS value, account
               WHERE account ~ '^Expenses:Unattributed'
               GROUP BY year, month, account`,
            );

            const amounts: Record<string, Record<string, number>> = {};
            for (const row of result) {
              const monthKey = `${row.year}-${String(row.month).padStart(2, "0")}`;
              if (!amounts[row.account]) {
                amounts[row.account] = {};
              }
              amounts[row.account][monthKey] = row.value[variables.currency] ?? 0;
            }
            const accounts = Object.keys(amounts);

            const accountLink = "../../account/{account}/?time={time}";
            return {
              grid: {
                left: "5%",
                right: 400,
              },
              tooltip: {
                trigger: "axis",
                valueFormatter: anyFormatter(currencyFormatter),
              },
              legend: {
                type: "scroll",
                orient: "vertical",
                right: 10,
                top: "middle",
              },
              xAxis: {
                type: "category",
                data: monthKeys,
              },
              yAxis: {
                axisLabel: {
                  formatter: currencyFormatter,
                },
              },
              series: accounts.map((account) => ({
                type: "bar",
                name: account,
                stack: "expenses",
                data: monthKeys.map((month) => amounts[account][month] ?? 0),
              })),
              onClick: (event: any) => {
                const monthKey = event.name;
                const account = event.seriesName;
                const [year, month] = monthKey.split("-");
                const link = accountLink.replace("{time}", `${year}-${month}`).replace("{account}", account);
                window.open(ledger.urlFor(link));
              },
            };
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
              const savings = -(row.value[variables.currency] ?? 0);
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
          height: "600px",
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
            const totalValue = accountTree.children[0]?.value ?? 0;

            return {
              tooltip: {
                formatter: (params: any) =>
                  `${params.marker} ${params.name} <span style="padding-left: 15px;">${currencyFormatter(params.value)}</span> (${totalValue ? ((params.value / totalValue) * 100).toFixed(0) : 0}%)`,
              },
              series: [
                {
                  type: "sunburst",
                  itemStyle: {
                    borderColor: "#0000",
                    borderWidth: 0,
                  },
                  radius: "100%",
                  levels: [
                    {},
                    {
                      r0: "25%",
                      r: "60%",
                      itemStyle: {
                        borderWidth: 1,
                      },
                      label: {
                        align: "right",
                        minAngle: 4,
                      },
                    },
                    {
                      r0: "60%",
                      r: "100%",
                      label: {
                        align: "right",
                        minAngle: 2,
                      },
                    },
                  ],
                  label: {
                    minAngle: 10,
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
          height: "600px",
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
            const totalValue = accountTree.children[0]?.value ?? 0;

            return {
              tooltip: {
                formatter: (params: any) =>
                  `${params.marker} ${params.name} <span style="padding-left: 15px;">${currencyFormatter(params.value)}</span> (${totalValue ? ((params.value / totalValue) * 100).toFixed(0) : 0}%)`,
              },
              series: [
                {
                  type: "sunburst",
                  radius: "100%",
                  levels: [
                    {},
                    {
                      r0: "25%",
                      r: "60%",
                      itemStyle: {
                        borderWidth: 1,
                      },
                      label: {
                        align: "right",
                        minAngle: 4,
                      },
                    },
                    {
                      r0: "60%",
                      r: "100%",
                      label: {
                        align: "right",
                        minAngle: 2,
                      },
                    },
                  ],
                  itemStyle: {
                    borderColor: "#0000",
                    borderWidth: 0,
                  },
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
          title: "EatingOut Expenses 🥐",
          width: "50%",
          height: "400px",
          link: "../../account/Expenses:EatingOut/",
          kind: "echarts",
          spec: async ({ ledger, variables }) => {
            const currencyFormatter = getCurrencyFormatter(variables.currency);
            const result = await ledger.query(
              `SELECT year, month, CONVERT(SUM(position), '${variables.currency}', LAST(date)) AS value
               WHERE account ~ '^Expenses:EatingOut:'
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
                const link = "../../account/Expenses:EatingOut/?time={time}".replace(
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
          title: "Expenses Over Time 🌊",
          width: "100%",
          height: "700px",
          kind: "echarts",
          spec: async ({ ledger, variables }) => {
            const currencyFormatter = getCurrencyFormatter(variables.currency);
            const maxAccounts = 18; // number of accounts to show, sorted by sum
            const accountsInTooltip = 12;

            const result = await ledger.query<{ year: number; month: number; account: string; value: Inventory }>(
              `SELECT year, month, root(account, 2) AS account, CONVERT(SUM(position), '${variables.currency}', LAST(date)) AS value
               WHERE account ~ "^Expenses:"
               GROUP BY account, year, month`,
            );

            const accountSums: Record<string, number> = {};
            const values: [string, number, string][] = [];
            for (const row of result) {
              const value = row.value[variables.currency] ?? 0;
              accountSums[row.account] = (accountSums[row.account] ?? 0) + value;
              if (value > 0) {
                values.push([`${row.year}/${String(row.month).padStart(2, "0")}`, value, row.account]);
              }
            }

            const accounts = Object.entries(accountSums)
              .sort(([, a], [, b]) => b - a)
              .map(([name]) => name)
              .slice(0, maxAccounts);

            const filteredValues = values.filter((v) => accounts.includes(v[2]));

            return {
              tooltip: {
                trigger: "axis" as const,
                textStyle: {
                  fontSize: 14,
                },
                formatter: (params: any) => {
                  const series = Array.isArray(params) ? params : [params];
                  const top = [...series].sort((a, b) => b.value[1] - a.value[1]).slice(0, accountsInTooltip);
                  const total = top.reduce((sum, a) => sum + a.value[1], 0);
                  const date = top[0]?.value?.[0] ?? "";
                  return (
                    `<h2>${date}</h2>` +
                    top
                      .map(
                        (acc) =>
                          `<b style='color: ${acc.color}; font-weight: 600'>${acc.name}:</b> ${currencyFormatter(
                            acc.value[1],
                          )}`,
                      )
                      .join("<br>") +
                    `<br/><br/><b style='font-weight: 700'>Total: ${currencyFormatter(total)}</b>`
                  );
                },
                axisPointer: {
                  type: "line" as const,
                  lineStyle: {
                    color: "rgba(120,120,120,0.8)",
                    width: 1.5,
                    type: "solid",
                  },
                },
              },
              legend: {
                data: accounts,
              },
              singleAxis: {
                top: 50,
                bottom: 120,
                splitNumber: 24,
                axisTick: {},
                axisLabel: {},
                type: "time" as const,
                axisPointer: {
                  animation: true,
                  label: {
                    show: true,
                  },
                },
                splitLine: {
                  show: true,
                  lineStyle: {
                    type: "dashed",
                    opacity: 0.6,
                    width: 1.5,
                  },
                },
              },
              series: [
                {
                  type: "themeRiver" as const,
                  emphasis: {
                    itemStyle: {
                      shadowBlur: 20,
                      shadowColor: "rgba(0, 0, 0, 0.8)",
                    },
                    label: {
                      fontSize: 18,
                      fontWeight: "bold",
                    },
                  },
                  label: {
                    fontSize: 9,
                  },
                  data: filteredValues,
                },
              ],
              onClick: (event: any) => {
                const time = String((event.value as any[])?.[0] ?? event.name ?? "").replace("/", "-");
                const account = String(event.seriesName ?? (event.value as any[])?.[2] ?? "");
                const link = "../../account/{account}/?time={time}"
                  .replace("{account}", account)
                  .replace("{time}", time);
                window.open(ledger.urlFor(link));
              },
            };
          },
        },
        {
          title: "Top biggest expenses",
          width: "100%",
          height: "820px",
          kind: "table",
          spec: ({ ledger, variables }) => ExpensesTable(ledger, variables.currency, { orderBy: "DESC", limit: 200 }),
        },
      ],
    },
    {
      name: "Expenses Detailed",
      variables: [currencyVariable],
      panels: [
        {
          title: "Income 💰",
          width: "33.3%",
          height: "60px",
          link: "../../account/Income/?r=changes",
          kind: "html",
          spec: async ({ ledger, variables }) => {
            const currencyFormatter = getCurrencyFormatter(variables.currency);
            const result = await ledger.query(
              `SELECT CONVERT(SUM(position), '${variables.currency}', LAST(date)) AS value WHERE account ~ '^Income:'`,
            );
            const value = -(result[0]?.value[variables.currency] ?? -0);
            return `<div style="font-size: 40px; font-weight: bold; color: #3daf46; text-align: center;">${currencyFormatter(value)}</div>`;
          },
        },
        {
          title: "Expenses 💸",
          width: "33.3%",
          height: "60px",
          link: "../../account/Expenses/?r=changes",
          kind: "html",
          spec: async ({ ledger, variables }) => {
            const currencyFormatter = getCurrencyFormatter(variables.currency);
            const result = await ledger.query(
              `SELECT CONVERT(SUM(position), '${variables.currency}', LAST(date)) AS value WHERE account ~ '^Expenses:'`,
            );
            const value = result[0]?.value[variables.currency] ?? 0;
            return `<div style="font-size: 40px; font-weight: bold; color: #af3d3d; text-align: center;">${currencyFormatter(value)}</div>`;
          },
        },
        {
          title: "Savings ✨",
          width: "33.3%",
          height: "60px",
          link: "../../income_statement/",
          kind: "html",
          spec: async ({ ledger, variables }) => {
            const currencyFormatter = getCurrencyFormatter(variables.currency);
            const [incomeResult, expensesResult] = await Promise.all([
              ledger.query(
                `SELECT CONVERT(SUM(position), '${variables.currency}') AS value WHERE account ~ '^Income:'`,
              ),
              ledger.query(
                `SELECT CONVERT(SUM(position), '${variables.currency}') AS value WHERE account ~ '^Expenses:'`,
              ),
            ]);
            const income = -(incomeResult[0]?.value[variables.currency] ?? -0);
            const expenses = expensesResult[0]?.value[variables.currency] ?? 0;
            const rate = income - expenses;
            return `<div style="font-size: 40px; font-weight: bold; color: #3daf46; text-align: center;">${currencyFormatter(rate)}</div>`;
          },
        },
        {
          title: "Categories",
          width: "60%",
          height: "600px",
          link: "../../account/Expenses/?interval=day",
          kind: "echarts",
          variables: [chartTypeVariable],
          spec: async ({ ledger, variables }) => {
            const currencyFormatter = getCurrencyFormatter(variables.currency);
            const result = await ledger.query(
              `SELECT root(account, 3) AS account, CONVERT(SUM(position), '${variables.currency}', LAST(date)) AS value
               WHERE account ~ '^Expenses:'
               GROUP BY account`,
            );
            const filteredResult = result.filter((r) => (r.value[variables.currency] ?? 0) > 0);
            const accountTree = buildAccountTree(
              filteredResult,
              (row) => row.value[variables.currency] ?? 0,
              (parts, i) => parts[i],
            );
            if (variables.chartType === "Treemap") {
              addOtherNodes(accountTree);
            }
            const totalValue = accountTree.children[0]?.value ?? 0;
            const treeData = accountTree.children[0]?.children ?? [];
            const isTreemap = variables.chartType === "Treemap";

            return {
              tooltip: {
                formatter: (params: any) =>
                  `${params.marker} ${params.name} <span style="padding-left: 15px;">${currencyFormatter(params.value)}</span> (${totalValue ? ((params.value / totalValue) * 100).toFixed(0) : 0}%)`,
              },
              series: [
                isTreemap
                  ? {
                      type: "treemap",
                      label: {
                        show: true,
                        position: "inside",
                        formatter: (info: any) => `${info.name}\n${currencyFormatter(info.value)}`,
                      },
                      upperLabel: { show: true, height: 20 },
                      itemStyle: { borderColor: "#0000", borderWidth: 0 },
                      data: treeData,
                    }
                  : {
                      type: "sunburst",
                      radius: "100%",
                      levels: [
                        {},
                        { r0: "25%", r: "60%", itemStyle: { borderWidth: 1 }, label: { align: "right", minAngle: 4 } },
                        { r0: "60%", r: "100%", label: { align: "right", minAngle: 2 } },
                      ],
                      itemStyle: { borderColor: "#0000", borderWidth: 0 },
                      data: treeData,
                    },
              ],
              onDblClick: (event: ECElementEvent) => {
                const pathParts = event.treePathInfo
                  .map((i: any) => i.name)
                  .filter((name: string) => name !== "(Other)");
                const account = "Expenses:" + pathParts.join(":");
                const link = "../../account/{account}/?interval=day".replace("{account}", account);
                window.open(ledger.urlFor(link));
              },
            };
          },
        },
        {
          title: "Recurring, Regular and Irregular Expenses 🔁",
          width: "40%",
          height: "600px",
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
            const months = iterateMonths(ledger.dateFirst, ledger.dateLast).map((m) => `${m.month}/${m.year}`);
            const amounts: Record<string, Record<string, number>> = {};
            for (const q of queries) {
              amounts[q.name] = {};
              for (const row of await ledger.query(q.bql)) {
                amounts[q.name][`${row.month}/${row.year}`] = row.value[variables.currency] ?? 0;
              }
            }
            return {
              tooltip: { valueFormatter: anyFormatter(currencyFormatter) },
              legend: { top: "bottom" },
              grid: { left: 100 },
              xAxis: { axisLabel: { formatter: currencyFormatter } },
              yAxis: { data: months },
              series: queries.map((q) => ({
                type: "bar",
                name: q.name,
                stack: "expenses",
                data: months.map((month) => amounts[q.name][month] ?? 0),
              })),
              onClick: (event: any) => {
                const query = queries.find((q) => q.name === event.seriesName);
                if (query) {
                  const [month, year] = event.name.split("/");
                  const link = query.link.replace("{time}", `${year}-${month.padStart(2, "0")}`);
                  window.open(ledger.urlFor(link));
                }
              },
            };
          },
        },
        {
          title: "Calendar Heatmap 📅",
          width: "100%",
          height: "450px",
          link: "../../journal/?time={time}",
          kind: "echarts",
          spec: async ({ ledger, variables }) => {
            const storedThemeSetting = document.documentElement.style.colorScheme;
            const isDarkMode =
              storedThemeSetting == "dark" ||
              (window.matchMedia?.("(prefers-color-scheme: dark)").matches && storedThemeSetting != "light");
            const outerLineStyleColor = isDarkMode ? "lightgray" : "black";
            const result = await ledger.query(
              `SELECT date, root(account, 2) AS account, CONVERT(SUM(position), '${variables.currency}', LAST(date)) AS value
               WHERE account ~ "^Expenses:"
               GROUP BY account, date`,
            );
            const amounts: Record<string, number> = {};
            const counts: Record<string, number> = {};
            let maxAmount = 0;
            for (const row of result) {
              if (isNaN(row.value[variables.currency] ?? 0)) {
                continue;
              }
              amounts[row.date] = (amounts[row.date] ?? 0) + (row.value[variables.currency] ?? 0);
              maxAmount = Math.max(maxAmount, amounts[row.date]);
              const year = row.date.substring(0, 4);
              counts[year] = (counts[year] ?? 0) + 1;
            }
            const allValues = Object.values(amounts).sort((a, b) => a - b);
            const maxScaleValue = allValues[Math.floor(allValues.length * 0.95)] ?? 0;
            let allYears = Object.keys(counts);
            allYears = allYears.slice(0, 3);
            const calendars = allYears.map((year, ind) => ({
              left: 80,
              right: 100,
              top: ind * 150,
              cellSize: [10, 15],
              range: year,
              splitLine: { lineStyle: { color: outerLineStyleColor } },
              itemStyle: { borderWidth: 0.5 },
              dayLabel: { firstDay: 1 },
              yearLabel: { show: true, margin: 40 },
            }));
            const seriesData = allYears.map((_, ind) => ({
              type: "heatmap" as const,
              coordinateSystem: "calendar" as const,
              calendarIndex: ind,
              data: Object.entries(amounts),
            }));
            return {
              tooltip: {
                position: "top",
                formatter: (p: any) =>
                  p.data[0] + ":<br/>" + "<b style='font-weight: 700'>" + p.data[1] + ` ${variables.currency}</b>`,
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
              onClick: (event: any) => {
                const link = "../../journal/?time={time}".replace("{time}", (event.data as string[])[0]);
                window.open(ledger.urlFor(link));
              },
            };
          },
        },
        {
          title: "Account Expenses Timeline",
          width: "100%",
          height: "600px",
          link: "../../account/Expenses/",
          kind: "echarts",
          variables: [expenseAccountVariable, movingAverageVariable, showLocationAreasVariable],
          spec: async ({ ledger, variables }) => {
            const account = `Expenses:${variables.expenseAccount}`;
            const windowSize = parseInt(variables.window, 10);
            const showLocationAreas = variables.showLocationAreas === "Show";
            const currencyFormatter = getCurrencyFormatter(variables.currency);
            const [result, locationEvents] = await Promise.all([
              ledger.query(
                `SELECT date, CONVERT(SUM(position), '${variables.currency}', LAST(date)) AS value
                 WHERE account ~ '^${account.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(:|$)'
                 GROUP BY date`,
              ),
              showLocationAreas
                ? ledger
                    .query<{
                      date: string;
                      description: string;
                    }>(`SELECT date, description FROM events WHERE type = 'location'`)
                    .catch(() => [] as { date: string; description: string }[])
                : Promise.resolve([] as { date: string; description: string }[]),
            ]);
            const sorted = [...result].sort((a, b) => a.date.localeCompare(b.date));
            const valueByDate = new Map(sorted.map((row) => [row.date, row.value[variables.currency] ?? 0]));
            const dates = sorted.length > 0 ? iterateDays(sorted[0].date, sorted[sorted.length - 1].date) : [];
            const dataset = dates.map((date) => ({
              date,
              value: valueByDate.get(date) ?? 0,
            }));
            const maData = movingAverage(dataset, windowSize);

            const lastDate = dates.length > 0 ? dates[dates.length - 1] : "";
            const sortedEvents = [...locationEvents].sort((a, b) => a.date.localeCompare(b.date));
            const locationColor = locationColorsByIndex(sortedEvents.map((e) => e.description ?? ""));
            const markAreaData: [Record<string, unknown>, Record<string, unknown>][] = [];
            for (let i = 0; i < sortedEvents.length; i++) {
              const startDate = sortedEvents[i].date;
              const endDate = i < sortedEvents.length - 1 ? sortedEvents[i + 1].date : lastDate || startDate;
              if (startDate <= endDate) {
                const desc = sortedEvents[i].description ?? "";
                markAreaData.push([
                  { xAxis: startDate, name: desc, itemStyle: { color: locationColor(desc) } },
                  { xAxis: endDate },
                ]);
              }
            }

            return {
              legend: { show: true, top: 0 },

              grid: {
                left: "5%",
                right: "5%",
                top: "60",
              },
              tooltip: {
                trigger: "axis",
                show: true,
                valueFormatter: anyFormatter(currencyFormatter),
              },
              xAxis: {
                type: "time",
                splitNumber: 24,
                splitLine: {
                  show: true,
                  lineStyle: {
                    type: "dotted",
                  },
                },
              },
              yAxis: {
                axisLabel: {
                  formatter: currencyFormatter,
                },
              },
              dataZoom: [
                // { type: "inside", xAxisIndex: 0 },
                { type: "slider", yAxisIndex: 0, minValueSpan: 0, maxValueSpan: 1000, filterMode: "none" },
                { type: "slider", xAxisIndex: 0 },
              ],
              dataset: [
                { id: "raw", source: dataset },
                { id: "ma", source: maData },
              ],
              series: [
                {
                  type: "line",
                  name: `${variables.expenseAccount} Expenses`,
                  smooth: true,
                  showSymbol: false,
                  datasetId: "raw",
                  encode: { x: "date", y: "value" },
                  connectNulls: true,
                },
                {
                  type: "line",
                  name: `Moving average (${variables.window})`,
                  smooth: true,
                  showSymbol: false,
                  datasetId: "ma",
                  encode: { x: "date", y: "value" },
                  lineStyle: { width: 2 },
                  connectNulls: true,
                  labelLayout: {
                    moveOverlap: "shiftY",
                    hideOverlap: true,
                  },
                  markArea:
                    showLocationAreas && markAreaData.length > 0
                      ? { silent: true, data: markAreaData, z: -1 }
                      : undefined,
                },
              ],
              onClick: (event) => {
                const dateStr = (event.data as { date: string }).date;
                const link = `../../account/${account}/?time={time}`.replace("{time}", dateStr);
                window.open(ledger.urlFor(link));
              },
            };
          },
        },
        {
          title: "Notes",
          width: "100%",
          height: "150px",
          kind: "html",
          spec: async () =>
            `<div style="font-size: 15px; text-align: center;">
              <div>Tag transactions with <b>#recurring</b> or <b>#irregular</b> to further classify expenses by periodicity (the rest are classified as "Regular"). Tag transactions with <b>#travel</b> and <b>#trip-&lt;destination-and-trip-id&gt;</b> for transactions to appear in the <a href="../../extension/FavaDashboards/?dashboard=travelling">Travelling</a> dashboard.</div>
              <br />
              <div>Values in Unattributed expenses that are too large (in either of the lists) are a sign that you need to enter or import more data for more precise tracking, or that you have an error somewhere. Negative expenses should not normally happen so that list below may be useful to clean up / debug your data.</div>
            </div>`,
        },
        {
          title: "Top biggest expenses",
          width: "100%",
          height: "820px",
          kind: "table",
          spec: ({ ledger, variables }) => ExpensesTable(ledger, variables.currency, { orderBy: "DESC", limit: 200 }),
        },
        {
          title: "Top negative expenses",
          width: "100%",
          height: "820px",
          kind: "table",
          spec: ({ ledger, variables }) =>
            ExpensesTable(ledger, variables.currency, {
              orderBy: "ASC",
              limit: 200,
              whereFilter: " AND position.units.number < 0",
            }),
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
            const result = await ledger.query<{ year: number; value: Amount }>(
              `SELECT year, CONVERT(SUM(position), '${variables.currency}', LAST(date)) AS value
               WHERE account ~ '^Expenses:' AND 'travel' IN tags
               GROUP BY year`,
            );
            const years = iterateYears(ledger.dateFirst, ledger.dateLast);
            const amounts: Record<number, number> = {};
            for (const row of result) {
              amounts[row.year] = row.value[variables.currency] ?? 0;
            }
            const linkTemplate = "../../account/Expenses/?filter=#travel&time={time}";
            return {
              grid: {
                left: "5%",
                right: "5%",
              },
              tooltip: {
                valueFormatter: anyFormatter(currencyFormatter),
              },
              xAxis: {
                data: years,
              },
              yAxis: {
                axisLabel: {
                  formatter: currencyFormatter,
                },
              },
              series: [
                {
                  type: "line",
                  smooth: true,
                  data: years.map((year) => amounts[year] ?? 0),
                },
              ],
              onClick: (event) => {
                const link = linkTemplate.replace("{time}", String(event.name));
                window.open(ledger.urlFor(link));
              },
            };
          },
        },
        {
          title: "Destinations ✈️",
          width: "100%",
          height: "300px",
          link: "../../income_statement/?filter=#travel",
          kind: "echarts",
          spec: async ({ ledger, variables }) => {
            const currencyFormatter = getCurrencyFormatter(variables.currency);
            const result = await ledger.query<{ tags: string[]; value: Amount }>(
              `SELECT tags, CONVERT(position, '${variables.currency}', date) AS value
               WHERE account ~ '^Expenses:' AND 'travel' IN tags
               ORDER BY date ASC`,
            );

            const travels: string[] = [];
            const amounts: Record<string, number> = {};
            for (const row of result) {
              const tag = row.tags.find((t) => t.match(/trip\-/));
              if (tag) {
                if (!(tag in amounts)) {
                  travels.push(tag);
                  amounts[tag] = 0;
                }
                amounts[tag] += row.value.number;
              }
            }
            travels.reverse();
            return {
              tooltip: {
                valueFormatter: anyFormatter(currencyFormatter),
              },
              grid: {
                containLabel: true,
                left: 0,
              },
              xAxis: {
                type: "value",
                axisLabel: {
                  formatter: currencyFormatter,
                },
              },
              yAxis: {
                type: "category",
                data: travels,
              },
              series: [
                {
                  type: "bar",
                  data: travels.map((travel) => amounts[travel]),
                  label: {
                    show: true,
                    position: "right",
                    formatter: (params: any) => currencyFormatter(params.value),
                  },
                },
              ],
              onClick: (event) => {
                const link = `../../extension/FavaDashboards/?dashboard=travelling&filter=${encodeURIComponent("#" + (event.name as string))}`;
                window.open(ledger.urlFor(link));
              },
            };
          },
        },
      ],
    },
    {
      name: "Subscriptions",
      variables: [currencyVariable],
      panels: [
        {
          title: "Quick links 🔗",
          width: "100%",
          height: "30px",
          kind: "html",
          spec: async ({ ledger }) => {
            const expensesLink = ledger.urlFor(
              "../../extension/FavaDashboards/?dashboard=expenses&filter=%23recurring&time=month-12+to+month-1",
            );
            const journalLink = ledger.urlFor("../../journal/?filter=%23recurring&time=month-12+to+day");
            const candidatesFilter =
              "-%23recurring+-%23fake+any%28account%3A%27Expenses%27%29+all%28-account%3A%27Liabilities%27%29+all%28-account%3A%27Income%27%29+-narration%3A%27Padding.*%27";
            const candidatesLink = ledger.urlFor(`../../journal/?filter=${candidatesFilter}&time=month-12+to+day`);
            return `<div style="font-size: 15px; text-align: center;">
              <a style="font-weight: bold;" href="${expensesLink}">Expenses breakdown</a> ·
              <a style="font-weight: bold;" href="${journalLink}">Journal</a> ·
              <a style="font-weight: bold;" href="${candidatesLink}">Candidates</a>
            </div>`;
          },
        },
        {
          title: "Notes",
          width: "100%",
          height: "30px",
          kind: "html",
          spec: async () =>
            `<div style="font-size: 15px; text-align: center;">
              Transactions marked as <b>#recurring</b> will appear here. Add <b>subscriptionName</b> metadata to transaction manually or using <b>filterMap</b> plugin.
              You can also follow examples on using <b>#subscription-year</b> tag.

            </div>`,
        },
        {
          title: "Recurring (last year)",
          width: "100%",
          height: "600px",
          kind: "table",
          spec: ({ ledger, variables }) => SubscriptionsTable(ledger, variables.currency),
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
          height: "750px",
          link: "../../income_statement/",
          kind: "echarts",
          spec: async ({ ledger, variables }) => {
            const currencyFormatter = getCurrencyFormatter(variables.currency);
            const result = await ledger.query(
              `SELECT account, CONVERT(SUM(position), '${variables.currency}') AS value
               WHERE account ~ '^(Income|Expenses):'
               GROUP BY account`,
            );
            const months = countMonths(ledger);
            const valueThreshold = 10; // skip nodes below this value

            type SankeyNode = { name: string; label?: string };
            const nodes: SankeyNode[] = [{ name: "Income" }];
            const links: { source: string; target: string; value: number }[] = [];
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
              tooltip: {
                trigger: "item",
                formatter: (params: any) => {
                  if (params.dataType === "edge") {
                    return `${params.data.source} → ${params.data.target}<br/>${currencyFormatter(params.data.value)}`;
                  }
                  return `${params.name}<br/>${currencyFormatter(params.value ?? 0)}`;
                },
              },
              series: [
                {
                  type: "sankey",
                  left: 10,
                  right: 10,
                  top: 20,
                  bottom: 20,
                  nodeGap: 10,
                  nodeWidth: 15,
                  data: nodes.map((n) => ({ name: n.name })),
                  links,
                  label: {
                    formatter: (params: any) => {
                      const node = nodes.find((nd) => nd.name === params.name);
                      const displayName = node?.label ?? params.name.split(":").pop() ?? params.name;
                      return `${displayName} ${currencyFormatter(params.value ?? 0)}`;
                    },
                  },
                  emphasis: {
                    focus: "adjacency",
                  },
                  nodeAlign: "left",
                  lineStyle: {
                    color: "gradient",
                    curveness: 0.5,
                  },
                  roam: true,
                },
              ],
              onClick: (event) => {
                const name = (event.data as { name?: string })?.name;
                if (!name || name === "Savings") {
                  return;
                }
                const link = "../../account/{account}/".replace("{account}", name);
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
    {
      name: "Tax",
      variables: [taxYearVariable, platformVariable, incomeTypeVariable, currencyVariable],
      panels: [
        {
          title: "Income transactions",
          width: "70%",
          height: "600px",
          kind: "table",
          spec: async ({ ledger, variables }) => {
            type Row = {
              date: string;
              account: string;
              narration: string;
              position: Position;
              converted: Amount;
            };
            const accountFilter =
              variables.platform === ".*" ? "account ~ '^Income:'" : `account ~ '^Income:${variables.platform}'`;
            const rows = await ledger.query<Row>(
              `SELECT date, account, narration, position, CONVERT(position, '${variables.currency}', date) AS converted
               WHERE ${accountFilter} AND ${INCOME_TYPE_QUERY_CONDITION[variables.incomeType]}
               AND date >= ${TAX_YEAR_BOUNDS[variables.taxYear][0]}
               AND date <= ${TAX_YEAR_BOUNDS[variables.taxYear][1]}`,
            );

            const currencyFormatter = getCurrencyFormatter(variables.currency);
            const table: TableSpec<Row> = {
              rowHeight: 26,
              getRowClassName: (params) => (params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"),
              columns: [
                { field: "date", minWidth: 100 },
                { field: "account", minWidth: 300 },
                { field: "narration", flex: 1 },
                {
                  field: "position",
                  minWidth: 100,
                  valueGetter: (_value, row) => -row.position.units.number,
                  valueFormatter: (_value, row) =>
                    `${(-row.position.units.number).toFixed(4)} ${row.position.units.currency}`,
                },
                {
                  field: "converted",
                  minWidth: 100,
                  valueGetter: (_value, row) => -row.converted.number,
                  valueFormatter: (_value, row) => currencyFormatter(-row.converted.number),
                },
              ],
              rows: rows.map((row, i) => ({ ...row, id: i })),
            };
            return table;
          },
        },
        {
          title: "Total income",
          width: "30%",
          height: "600px",
          kind: "echarts",
          spec: async ({ ledger, variables }) => {
            type Row = {
              account: string;
              total: Inventory;
            };
            const accountFilter =
              variables.platform === ".*" ? "account ~ '^Income:'" : `account ~ '^Income:${variables.platform}'`;
            const rows = await ledger.query<Row>(
              `SELECT account, SUM(CONVERT(position, '${variables.currency}', date)) AS total
               WHERE ${accountFilter} AND ${INCOME_TYPE_QUERY_CONDITION[variables.incomeType]}
               AND date >= ${TAX_YEAR_BOUNDS[variables.taxYear][0]}
               AND date <= ${TAX_YEAR_BOUNDS[variables.taxYear][1]}
               GROUP BY account`,
            );

            const currencyFormatter = getCurrencyFormatter(variables.currency);
            const currencyKey = variables.currency;
            return {
              series: [
                {
                  name: "Interest",
                  type: "treemap",
                  label: {
                    show: true,
                    position: "inside",
                    formatter: (info: any) =>
                      info.treePathInfo.length > 1
                        ? `${info.treePathInfo.map((i: any) => i.name).join(":")}:\n\n {total|${currencyFormatter(-info.value)}}`
                        : `Total: ${currencyFormatter(-info.value)}`,
                    rich: {
                      total: {
                        fontSize: 22,
                        fontWeight: "bold",
                      },
                    },
                  },
                  upperLabel: {
                    show: true,
                    height: 30,
                    backgroundColor: "#000",
                  },
                  data: rows.map((r) => ({
                    name: r.account,
                    value: -(r.total[currencyKey] ?? 0),
                    children: [],
                  })),
                },
              ],
            };
          },
        },
      ],
    },
  ],
  // theme: {
  //   echarts: EChartsThemes.vintage,
  //   dashboard: {
  //     panel: {
  //       style: {
  //         backgroundColor: EChartsThemes.vintage.backgroundColor,
  //         color: "#333333",
  //         ".title": {
  //           color: "#333333",
  //         },
  //         "a": {
  //           color: "#333333",
  //         },
  //         "& .MuiDataGrid-root": {
  //           color: "#333333",
  //           backgroundColor: EChartsThemes.vintage.backgroundColor,
  //         },
  //         "& .MuiDataGrid-row.even": {
  //           backgroundColor: "rgba(215, 171, 130, 0.15)",
  //         },
  //         "& .MuiDataGrid-root .MuiDataGrid-columnHeaders": {
  //           backgroundColor: "rgba(215, 171, 130, 0.25)",
  //         },
  //         "& .MuiDataGrid-root .MuiDataGrid-columnHeader": {
  //           backgroundColor: "rgba(215, 171, 130, 0.25)",
  //         },
  //       },
  //     },
  //   },
  // },
});
