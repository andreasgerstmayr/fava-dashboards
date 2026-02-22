import { Extractor, ExtractorConfig } from "@microsoft/api-extractor";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const baseDir = path.join(fileURLToPath(import.meta.url), "../../..");
const tmpPath = "_tmp";

function rmSymlink(path: string) {
  try {
    fs.unlinkSync(path);
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== "ENOENT") {
      throw err;
    }
  }
}

function runExtractorFor(sourcePath: string, entryPointFilePath: string, outFilePath: string) {
  // api-extractor skips node_modules, therefore create a temporarily symlink
  if (sourcePath.startsWith("node_modules/")) {
    rmSymlink(tmpPath);
    fs.symlinkSync(sourcePath, tmpPath, "dir");
    sourcePath = tmpPath;
  }

  try {
    const config = ExtractorConfig.prepare({
      configObject: {
        projectFolder: sourcePath,
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
  } finally {
    rmSymlink(tmpPath);
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
  runExtractorFor("node_modules/@mui/x-data-grid", "index.d.ts", "dist/mui-x-data-grid.d.ts");
  runExtractorFor("node_modules/@types/d3-sankey", "index.d.ts", "dist/d3-sankey.d.ts");

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
  ${fs.readFileSync("node_modules/@types/react/index.d.ts", "utf8")}
}

declare module "react/jsx-runtime" {
  ${fs.readFileSync("node_modules/@types/react/jsx-runtime.d.ts", "utf8").replaceAll('from "./"', 'from "react"')}
}
`;

  fs.writeFileSync("../example/fava-dashboards.d.ts", bundle, "utf8");
}

run();
