import { init } from "echarts";
import { globSync, writeFileSync } from "node:fs";
import { basename } from "node:path";

const themes = globSync("node_modules/echarts/theme/*.js")
  .map((path) => basename(path, ".js"))
  .sort();

for (const themeName of themes) {
  await import(`echarts/theme/${themeName}.js`);
  const chart = init(null, themeName, { renderer: "svg", ssr: true });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const theme = (chart as any)._theme;
  const themeJson = JSON.stringify(theme, null, 2);
  writeFileSync(`src/panels/echarts/themes/${themeName}.ts`, `export default ${themeJson};`);
}

function toCamelCase(str: string) {
  return str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
}
writeFileSync(
  `src/panels/echarts/themes/index.ts`,
  themes.map((theme) => `export { default as ${toCamelCase(theme)} } from "./${theme}";`).join("\n"),
);
