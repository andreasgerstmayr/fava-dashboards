// https://github.com/beancount/fava/blob/b12a90c7645e702b0d398292bdddd90645e31a88/frontend/src/stores/url.ts#L41-L48
const urlSyncedParams = ["account", "charts", "conversion", "filter", "interval", "time"];

/**
 * add current Fava filter parameters to url
 */
export const urlFor = (url: string) => {
  url = url.replaceAll("#", "%23");

  const currentURL = new URL(window.location.href);
  const newURL = new URL(url, window.location.href);

  for (const param of urlSyncedParams) {
    if (currentURL.searchParams.has(param) && !newURL.searchParams.has(param)) {
      newURL.searchParams.set(param, currentURL.searchParams.get(param)!);
    }
  }

  return newURL.toString();
};
