#!/usr/bin/env node

import { globSync, readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";

const bundleModules = [
  "dist/src/**/*.d.ts",
  "node_modules/echarts/**/*.d.ts",
  "node_modules/@types/d3-sankey/**/*.d.ts",
  "node_modules/@mui/x-data-grid/**/*.d.ts",
  "node_modules/@types/react/**/*.d.ts",
];
const outFile = "../example/fava-dashboards.d.ts";

let result = "";
for (const mod of bundleModules) {
  for (const file of globSync(mod, { withFileTypes: true })) {
    if (file.isFile()) {
      result += bundleFile(join(file.parentPath, file.name));
    }
  }
}

writeFileSync(outFile, result);
console.log(`✅ Created ${outFile}`);

function modName(path: string) {
  let mod = path;
  mod = mod.replace(/^dist\/src/, "fava-dashboards");
  mod = mod.replace(/^node_modules\//, "");
  mod = mod.replace("@types/", "");
  mod = mod.replace("/index.d.ts", "");
  mod = mod.replace(".d.ts", "");
  return mod;
}

function bundleFile(path: string) {
  console.log(`Bundling ${path}`);

  const replaceMatch = (_match: string, importPrefix: string, importPath: string) => {
    if (!importPath.startsWith(".")) {
      // Skip absolute import
      return `${importPrefix}from "${importPath}"`;
    }

    let resolved = importPath;
    resolved = resolved.replace(".js", "");
    resolved = join(dirname(path), resolved + ".d.ts");

    console.log("Import", importPath, "from file", path, "got resolved to", resolved);
    return `${importPrefix}from "${modName(resolved)}"`;
  };

  let content = readFileSync(path, "utf8");
  content = content.replace(/^(import.*?)from ['"]([^'"]+)['"]/gm, replaceMatch);
  content = content.replace(/^(export.*?)from ['"]([^'"]+)['"]/gm, replaceMatch);
  content = content.replaceAll("declare ", "");
  content = content.replaceAll("\n", "\n  ");

  return `
declare module "${modName(path)}" {
  ${content}
}`;
}
