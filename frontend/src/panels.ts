import * as echartslib from "echarts";
import { render_d3sankey } from "./sankey";
import { PanelCtx } from "./types";

function runFunction(src: string, args: Record<string, any>): Promise<any> {
    const AsyncFunction = async function () {}.constructor;
    const params = Object.entries(args);
    const fn = AsyncFunction(
        params.map(([k, _]) => k),
        src,
    );
    return fn(...params.map(([_, v]) => v));
}

function runScript(ctx: PanelCtx) {
    return runFunction(ctx.panel.script!, {
        ...ctx,
        // pass 'fava' for backwards compatibility
        fava: ctx.ledger,
    });
}

export async function html(ctx: PanelCtx, elem: HTMLDivElement) {
    try {
        elem.innerHTML = await runScript(ctx);
    } catch (e) {
        elem.innerHTML = e;
    }
}

export async function echarts(ctx: PanelCtx, elem: HTMLDivElement) {
    let options: echartslib.EChartsOption;
    try {
        options = await runScript(ctx);
    } catch (e) {
        elem.innerHTML = e;
        return;
    }

    const renderer = window.navigator.userAgent === "puppeteer" ? "svg" : undefined;
    const chart = echartslib.init(elem, undefined, { renderer });
    if (options.onClick) {
        chart.on("click", (options as any).onClick);
        delete options.onClick;
    }
    if (options.onDblClick) {
        chart.on("dblclick", (options as any).onDblClick);
        delete options.onDblClick;
    }
    chart.setOption(options);
}

export async function d3_sankey(ctx: PanelCtx, elem: HTMLDivElement) {
    let options: any;
    try {
        options = await runScript(ctx);
    } catch (e) {
        elem.innerHTML = e;
        return;
    }

    render_d3sankey(elem, options);
}

export async function jinja2(ctx: PanelCtx, elem: HTMLDivElement) {
    elem.innerHTML = ctx.panel.template ?? "";
}
