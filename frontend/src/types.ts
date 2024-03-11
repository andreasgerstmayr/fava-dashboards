export interface Ledger {}

export interface Panel {
    title?: string;
    width?: string;
    height?: string;
    type: "html" | "jinja2" | "echarts" | "d3_sankey";
    script?: string;
    template?: string;
}

export interface Dashboard {
    name: string;
    panels: Panel[];
}

export type Utils = { [k: string]: any };

export interface Bootstrap {
    ledger: Ledger;
    dashboard: Dashboard;
}
