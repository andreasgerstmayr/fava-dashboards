// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function runAsyncFunction<T>(src: string, args: Record<string, any> = {}): Promise<T> {
  const paramNames = Object.keys(args);
  const paramValues = Object.values(args);

  const AsyncFunction = async function () {}.constructor;
  const fn = AsyncFunction(...paramNames, src);
  return fn(...paramValues);
}
