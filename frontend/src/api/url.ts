// https://github.com/beancount/fava/blob/fb59849ccd4535f808d295594e6db7d8a5d249a6/frontend/src/stores/url.ts#L5-L12
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
