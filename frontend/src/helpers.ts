export const iterateMonths = (dateFirst: string, dateLast: string) => {
    const months: { year: number; month: number }[] = [];
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
};

export const iterateYears = (dateFirst: string, dateLast: string) => {
    const years: number[] = [];
    let year = parseInt(dateFirst.split("-")[0]);
    let lastYear = parseInt(dateLast.split("-")[0]);

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

export const buildAccountTree = (
    rows: any[],
    valueFn: (row: any) => number,
    nameFn: (parts: string[], i: number) => string
) => {
    nameFn = nameFn ?? ((parts: string[], i: number) => parts.slice(0, i + 1).join(":"));

    const accountTree: { children: AccountTreeNode[] } = { children: [] };
    for (let row of rows) {
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
