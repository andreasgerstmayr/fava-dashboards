import { EChartsOption } from "echarts";

type MaybePromise<T> = T | Promise<T>;

export interface Dashboard {
  name: string;
  panels: Panel[];
}

export type Panel = EChartsPanel | HTMLPanel;

interface BasePanel {
  title: string;
  description?: string;
  link?: string;
  width?: string | number;
  height?: string | number;
}

interface EChartsPanel extends BasePanel {
  type: "echarts";
  render: (ctx: RenderContext) => MaybePromise<EChartsOption>;
}

interface HTMLPanel extends BasePanel {
  type: "html";
  render: (ctx: RenderContext) => MaybePromise<string>;
}

interface RenderContext {
  panel: Panel;
  ledger: Ledger;
  query: (bql: string) => Promise<Record<string, any>[]>;
}

export interface Ledger {
  /** first date in the current date filter */
  dateFirst: string;

  /** last date in the current date filter */
  dateLast: string;

  /** configured operating currencies of the ledger */
  operatingCurrencies: string[];

  /** shortcut for the first configured operating currency of the ledger */
  ccy: string;

  /** declared accounts of the ledger */
  accounts: any[];

  /** declared commodities of the ledger */
  commodities: any[];
}

export class SDK {
  constructor(private dashboards: Dashboard[] = []) {}

  addDashboard(name: string, configure: (dashboard: DashboardBuilder) => void | Promise<void>) {
    const dashboard: Dashboard = { name, panels: [] };
    this.dashboards.push(dashboard);
    configure(new DashboardBuilder(dashboard));
  }
}

class DashboardBuilder {
  constructor(private dashboard: Dashboard) {}

  addPanel(title: string, configure: (panel: PanelBuilder) => void | Promise<void>) {
    const panel: Panel = { title };
    this.dashboard.panels.push(panel);
    configure(new PanelBuilder(panel));
  }
}

class PanelBuilder {
  constructor(private panel: Panel) {}
  title(value: string) {
    this.panel.title = value;
  }
  description(value?: string) {
    this.panel.description = value;
  }
  link(value?: string) {
    this.panel.link = value;
  }
  width(value?: string | number) {
    this.panel.width = value;
  }
  height(value?: string | number) {
    this.panel.height = value;
  }
}
