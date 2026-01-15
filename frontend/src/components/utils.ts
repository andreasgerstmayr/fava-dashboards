import { transform } from "@babel/standalone";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function runFunction<T>(src: string, args: Record<string, any> = {}): Promise<T> {
  const paramNames = Object.keys(args);
  const paramValues = Object.values(args);

  const fn = new Function(...paramNames, src);
  return fn(...paramValues);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function runAsyncFunction<T>(src: string, args: Record<string, any> = {}): Promise<T> {
  const paramNames = Object.keys(args);
  const paramValues = Object.values(args);

  const AsyncFunction = async function () {}.constructor;
  const fn = AsyncFunction(...paramNames, src);
  return fn(...paramValues);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function loadTSX(code: string, dependencies: Record<string, unknown>): any {
  // Transform TSX into CommonJS using @babel/standalone
  const transformedCode = transform(code, {
    sourceType: "module",
    filename: "dashboard.tsx",
    presets: ["react", "typescript"],
    plugins: ["transform-modules-commonjs"],
  });
  if (!transformedCode.code) {
    throw new Error("Error transforming TSX to JavaScript");
  }

  // Custom require function to load dependencies
  const require = (name: string): unknown => {
    const dependency = dependencies[name];
    if (!dependency) {
      throw new Error(`Unsupported import: ${name}`);
    }
    return dependency;
  };

  // Evaluate JS using the custom require() function
  const module = { exports: { default: {} as Record<string, unknown> | undefined } };
  runFunction(transformedCode.code, { require, module, exports: module.exports });
  return module.exports.default ?? {};
}
