import { init } from "echarts";
import { globSync, writeFileSync } from "node:fs";
import { basename } from "node:path";

import "echarts/theme/azul.js";
import "echarts/theme/bee-inspired.js";
import "echarts/theme/blue.js";
import "echarts/theme/caravan.js";
import "echarts/theme/carp.js";
import "echarts/theme/cool.js";
import "echarts/theme/dark-blue.js";
import "echarts/theme/dark-bold.js";
import "echarts/theme/dark-digerati.js";
import "echarts/theme/dark-fresh-cut.js";
import "echarts/theme/dark-mushroom.js";
import "echarts/theme/dark.js";
import "echarts/theme/eduardo.js";
import "echarts/theme/forest.js";
import "echarts/theme/fresh-cut.js";
import "echarts/theme/fruit.js";
import "echarts/theme/gray.js";
import "echarts/theme/green.js";
import "echarts/theme/helianthus.js";
import "echarts/theme/infographic.js";
import "echarts/theme/inspired.js";
import "echarts/theme/jazz.js";
import "echarts/theme/london.js";
import "echarts/theme/macarons.js";
import "echarts/theme/macarons2.js";
import "echarts/theme/mint.js";
import "echarts/theme/rainbow.js";
import "echarts/theme/red-velvet.js";
import "echarts/theme/red.js";
import "echarts/theme/roma.js";
import "echarts/theme/royal.js";
import "echarts/theme/sakura.js";
import "echarts/theme/shine.js";
import "echarts/theme/tech-blue.js";
import "echarts/theme/v5.js";
import "echarts/theme/vintage.js";

const themes = globSync("node_modules/echarts/theme/*.js").map((path) => basename(path, ".js"));
for (const themeName of themes) {
  const chart = init(null, themeName, { renderer: "svg", ssr: true });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const theme = (chart as any)._theme;
  const themeJson = JSON.stringify(theme, null, 2);
  writeFileSync(`src/panels/echarts/themes/${themeName}.ts`, `export default ${themeJson};`);
}

function toCamelCase(str: string) {
  return str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
}
writeFileSync(
  `src/panels/echarts/themes/index.ts`,
  themes.map((theme) => `export { default as ${toCamelCase(theme)} } from "./${theme}";`).join("\n"),
);
