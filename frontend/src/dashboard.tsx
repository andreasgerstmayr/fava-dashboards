import React, { useEffect, useRef } from "react";
import { Dashboard as DashboardType, Ledger, Panel } from "./types";
import * as helpers from "./helpers";
import * as echarts from "echarts";
import { render_d3sankey } from "./sankey";

const DEFAULT_PANEL_WIDTH = "100%";
const DEFAULT_PANEL_HEIGHT = "400px";

type DashboardProps = {
    dashboard: DashboardType;
    ledger: Ledger;
};

export const Dashboard = ({ dashboard, ledger }: DashboardProps) => {
    const renderPanel = (panel: Panel) => {
        switch (panel.type) {
            case "html":
                return <HTMLPanel panel={panel} ledger={ledger} />;
            case "jinja2":
                return <Jinja2Panel panel={panel} ledger={ledger} />;
            case "echarts":
                return <EChartsPanel panel={panel} ledger={ledger} />;
            case "d3_sankey":
                return <D3SankeyPanel panel={panel} ledger={ledger} />;
        }
    };

    return (
        <div id="dashboard">
            {dashboard.panels.map((panel, i) => (
                <div key={i} className="panel" style={{ width: panel.width ?? DEFAULT_PANEL_WIDTH }}>
                    {panel.title && <h2>{panel.title}</h2>}
                    {renderPanel(panel)}
                </div>
            ))}
        </div>
    );
};

const runScript = (ledger: Ledger, panel: Panel) => {
    // pass 'fava' for backwards compatibility
    const scriptFn = new Function("panel", "ledger", "fava", "helpers", panel.script!);
    return scriptFn(panel, ledger, ledger, helpers);
};

type PanelProps = {
    panel: Panel;
    ledger: Ledger;
};

const HTMLPanel = ({ panel, ledger }: PanelProps) => {
    let html: string;
    try {
        html = runScript(ledger, panel);
    } catch (e) {
        return <div style={{ height: panel.height ?? DEFAULT_PANEL_HEIGHT }}>{e}</div>;
    }

    return (
        <div
            style={{ height: panel.height ?? DEFAULT_PANEL_HEIGHT }}
            dangerouslySetInnerHTML={{ __html: runScript(ledger, panel) }}
        />
    );
};

const Jinja2Panel = ({ panel, ledger }: PanelProps) => (
    <div
        style={{ height: panel.height ?? DEFAULT_PANEL_HEIGHT }}
        dangerouslySetInnerHTML={{ __html: panel.template! }}
    />
);

const EChartsPanel = ({ panel, ledger }: PanelProps) => {
    let options: echarts.EChartsOption & {
        onClick?: any;
        onDblClick?: any;
    };

    try {
        options = runScript(ledger, panel);
    } catch (e) {
        return <div style={{ height: panel.height ?? DEFAULT_PANEL_HEIGHT }}>{e}</div>;
    }

    const ref = useRef(null);
    useEffect(() => {
        const chart = echarts.init(ref.current);
        if (options.onClick) {
            chart.on("click", options.onClick);
            delete options.onClick;
        }
        if (options.onDblClick) {
            chart.on("dblclick", options.onDblClick);
            delete options.onDblClick;
        }
        chart.setOption(options);
    }, [panel]);

    return <div style={{ height: panel.height ?? DEFAULT_PANEL_HEIGHT }} ref={ref} />;
};

const D3SankeyPanel = ({ panel, ledger }: PanelProps) => {
    let options: any;
    try {
        options = runScript(ledger, panel);
    } catch (e) {
        return <div style={{ height: panel.height ?? DEFAULT_PANEL_HEIGHT }}>{e}</div>;
    }

    const ref = useRef(null);
    useEffect(() => {
        render_d3sankey(ref.current, options);
    }, [panel]);

    return <div style={{ height: panel.height ?? DEFAULT_PANEL_HEIGHT }} ref={ref} />;
};
