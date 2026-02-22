import { Extractor, ExtractorConfig } from "@microsoft/api-extractor";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const baseDir = path.join(fileURLToPath(import.meta.url), "../../..");

function runExtractorFor(projectFolder: string, entryPointFilePath: string, outFilePath: string) {
  const config = ExtractorConfig.prepare({
    configObject: {
      projectFolder: projectFolder,
      mainEntryPointFilePath: entryPointFilePath,
      compiler: {
        tsconfigFilePath: path.join(baseDir, "tsconfig.json"),
      },
      dtsRollup: {
        enabled: true,
        publicTrimmedFilePath: path.join(baseDir, outFilePath),
      },
      newlineKind: "lf",
    },
    packageJsonFullPath: path.join(baseDir, "package.json"),
    configObjectFullPath: undefined,
  });

  const result = Extractor.invoke(config, { localBuild: true });
  if (!result.succeeded) {
    throw new Error(`${entryPointFilePath}: ${result.errorCount} errors`);
  }
}

function embedFile(path: string) {
  let content = fs.readFileSync(path, "utf8");
  content = content.replaceAll("declare ", "");
  content = content.replaceAll("\n", "\n  ");
  return content;
}

function run() {
  runExtractorFor(".", "dist/src/index.d.ts", "dist/fava-dashboards.d.ts");
  runExtractorFor("scripts/dts/@mui__x-data-grid", "index.d.ts", "dist/mui-x-data-grid.d.ts");
  runExtractorFor("scripts/dts/@types__d3-sankey", "index.d.ts", "dist/d3-sankey.d.ts");

  const bundle = `// This file is auto-generated and contains type declarations for fava-dashboards and its dependencies.
// It is only required when using TypeScript (dashboards.tsx) and enables type checking and auto completion in the code editor.

declare module "fava-dashboards" {
  ${embedFile("dist/fava-dashboards.d.ts")}
}

declare module "echarts" {
  ${embedFile("node_modules/echarts/types/dist/echarts.d.ts")}
}

declare module "d3-sankey" {
  ${embedFile("dist/d3-sankey.d.ts")}
}

declare module "@mui/x-data-grid" {
  ${embedFile("dist/mui-x-data-grid.d.ts")}
}

declare module "react" {
  ${fs.readFileSync("scripts/dts/@types__react/index.d.ts", "utf8")}
}

declare module "react/jsx-runtime" {
  ${fs.readFileSync("scripts/dts/@types__react/jsx-runtime.d.ts", "utf8").replaceAll('from "./"', 'from "react"')}
}
`;

  fs.writeFileSync("../example/fava-dashboards.d.ts", bundle, "utf8");
}

run();
