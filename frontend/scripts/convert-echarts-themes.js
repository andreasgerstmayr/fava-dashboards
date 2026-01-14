#!/usr/bin/env node
/* eslint-env node */
/* global console, process */

// Generates a TypeScript file containing every ECharts theme found in node_modules/echarts/theme.
import fs from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const themesDir = path.resolve(scriptDir, "..", "node_modules", "echarts", "theme");
const outputThemesFile = path.resolve(scriptDir, "..", "src", "panels", "echarts", "themes", "echartsThemes.ts");
const filePrefix = `// Generated file, do not edit directly. Run "make convert-echarts-themes" (or "node scripts/convert-echarts-themes.js") from frontend/ to regenerate.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type EChartsThemes = Record<string, Record<string, any>>;

// see https://echarts.apache.org/en/download-theme.html
// and https://github.com/apache/echarts/tree/master/theme
export const echartsThemes = {
`;
const filePostfix = `} satisfies EChartsThemes;

export type EChartsThemeName = keyof typeof echartsThemes;
`;

function createEChartsMock(fileName, registry) {
  return {
    registerTheme(name, themeDefinition) {
      console.log(`[${fileName}] registerTheme(${name})`);
      registry.set(name, themeDefinition);
    },
  };
}

function createThemeRequire(filePath, mockEcharts) {
  const localRequire = createRequire(filePath);
  return (specifier) => {
    if (specifier === "echarts" || specifier === "echarts/lib/echarts") {
      return mockEcharts;
    }
    return localRequire(specifier);
  };
}

function createThemeContext(fileName, mockEcharts, themeRequire) {
  const exports = {};
  const module = { exports };
  const define = (dependencies, factory) => {
    if (typeof factory === "function") {
      factory(exports, mockEcharts);
    }
  };
  define.amd = true;

  return {
    exports,
    module,
    require: themeRequire,
    console,
    echarts: mockEcharts,
    define,
    global: {},
    window: {},
    self: {},
  };
}

async function importThemes() {
  const entries = await fs.readdir(themesDir, { withFileTypes: true });
  const themeFiles = entries.filter(
    (entry) =>
      entry.isFile() && (entry.name.endsWith(".js") || entry.name.endsWith(".mjs") || entry.name.endsWith(".cjs")),
  );

  if (!themeFiles.length) {
    console.warn(`No theme files found in ${themesDir}`);
    return;
  }

  const registeredThemes = new Map();

  for (const file of themeFiles) {
    const filePath = path.join(themesDir, file.name);
    const mockEcharts = createEChartsMock(file.name, registeredThemes);
    const themeRequire = createThemeRequire(filePath, mockEcharts);
    const context = vm.createContext(createThemeContext(file.name, mockEcharts, themeRequire));

    try {
      const code = await fs.readFile(filePath, "utf-8");
      const script = new vm.Script(code, { filename: filePath });
      script.runInContext(context);
      console.log(`Imported ${file.name}`);
    } catch (error) {
      console.error(`Failed to import ${file.name}:`, error);
    }
  }

  if (!registeredThemes.size) {
    console.warn("No themes were registered.");
    return;
  }

  console.log(`Registered ${registeredThemes.size} themes.`);

  const convertedThemesObject = Object.fromEntries(registeredThemes);
  const serializedThemes = JSON.stringify(convertedThemesObject, null, 2);
  const innerBody = serializedThemes.slice(1, -1);
  const fileContent = `${filePrefix}${innerBody}${filePostfix}`;

  try {
    await fs.writeFile(outputThemesFile, fileContent, "utf8");
    console.log(`Wrote converted themes to ${outputThemesFile}`);
  } catch (error) {
    console.error("Failed to write converted themes file:", error);
  }
}

try {
  await importThemes();
} catch (error) {
  console.error("Unable to import ECharts themes:", error);
  process.exit(1);
}
