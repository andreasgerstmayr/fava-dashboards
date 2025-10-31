import { Extractor, ExtractorConfig } from "@microsoft/api-extractor";
import { execSync } from "child_process";
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
  execSync("mkdir tmp");

  // workaround, because packages in node_modules are handled differently
  execSync("cp -a node_modules/@mui/x-data-grid tmp");
  execSync("cp -a node_modules/@types/d3-sankey tmp");

  runExtractorFor(".", "dist/src/index.d.ts", "dist/fava-dashboards.d.ts");
  runExtractorFor("tmp/x-data-grid", "index.d.ts", "dist/mui-x-data-grid.d.ts");
  runExtractorFor("tmp/d3-sankey", "index.d.ts", "dist/d3-sankey.d.ts");

  execSync("rm -r tmp");

  const bundle = `
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
`;

  fs.writeFileSync("../example/fava-dashboards.d.ts", bundle, "utf8");
}

run();
