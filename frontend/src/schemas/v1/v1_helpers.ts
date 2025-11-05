/**
 * @deprecated
 */
export const iterateMonths = (dateFirst: string, dateLast: string) => {
  console.warn("helpers.iterateMonths() is deprecated, please define this function in utils.inline in dashboards.yaml");

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
};

/**
 * @deprecated
 */
export const iterateYears = (dateFirst: string, dateLast: string) => {
  console.warn("helpers.iterateMonths() is deprecated, please define this function in utils.inline in dashboards.yaml");

  const years: number[] = [];
  let year = parseInt(dateFirst.split("-")[0]);
  const lastYear = parseInt(dateLast.split("-")[0]);

  for (; year <= lastYear; year++) {
    years.push(year);
  }
  return years;
};

interface AccountTreeNode {
  name: string;
  children: AccountTreeNode[];
  value: number;
}

/**
 * @deprecated
 */
export const buildAccountTree = (
  rows: any[], // eslint-disable-line @typescript-eslint/no-explicit-any
  valueFn: (row: any) => number, // eslint-disable-line @typescript-eslint/no-explicit-any
  nameFn: (parts: string[], i: number) => string,
) => {
  console.warn("helpers.iterateMonths() is deprecated, please define this function in utils.inline in dashboards.yaml");

  nameFn = nameFn ?? ((parts: string[], i: number) => parts.slice(0, i + 1).join(":"));

  const accountTree: { children: AccountTreeNode[] } = { children: [] };
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

      child.value += valueFn(row);
      node = child;
    }
  }
  return accountTree;
};

// https://github.com/beancount/fava/blob/fb59849ccd4535f808d295594e6db7d8a5d249a6/frontend/src/stores/url.ts#L5-L12
const urlSyncedParams = ["account", "charts", "conversion", "filter", "interval", "time"];

/**
 * add current Fava filter parameters to url
 */
export const urlFor = (url: string) => {
  url = url.replaceAll("#", "%23");

  const currentURL = new URL(window.location.href);
  const newURL = new URL(url, window.location.href);

  for (const param of urlSyncedParams) {
    if (currentURL.searchParams.has(param) && !newURL.searchParams.has(param)) {
      newURL.searchParams.set(param, currentURL.searchParams.get(param)!);
    }
  }

  return newURL.toString();
};
