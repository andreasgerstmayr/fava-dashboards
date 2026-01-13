/// <reference types="./fava-dashboards.d.ts" />
import { defineConfig, echartsThemes } from "fava-dashboards";

/* eslint-disable @typescript-eslint/no-explicit-any */

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

export default defineConfig({
  theme: {
    echarts: echartsThemes.vintage, // theme that was used in echarts v5
    dashboard: {
      panel: {
        style: {
          backgroundColor: echartsThemes.vintage.backgroundColor,
          ".title": {
            color: echartsThemes.vintage.title.textStyle.color,
          },
        },
      },
    },
  },
  dashboards: [
    {
      name: "Custom Theme",
      variables: [
        {
          name: "currency",
          label: "Currency",
          options: async ({ ledger }) => {
            return ledger.operatingCurrencies;
          },
        },
      ],
      panels: [
        {
          title: "Portfolio Gains ✨",
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
      ],
    },
  ],
});
