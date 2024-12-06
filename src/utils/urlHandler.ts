export const addCatalogueToPath = (name: string) => {
  const view = getViewFomURL();
  const basePath = import.meta.env.VITE_BASE_PATH;

  // Construct the new path
  const path = `${basePath}${name}`;
  const searchParams = new URLSearchParams(location.search);
  const newUrl = `${path}?${searchParams.toString()}`;

  // Update the browser's URL
  history.replaceState(null, '', newUrl);

  if (view) addViewToURL(view);
};

export const getCatalogueFromURL = (): string | undefined => {
  const path = location.pathname;
  if (!path.includes('catalogs')) return;
  const postCataloguePath = path.split('/catalogs')[1];
  if (postCataloguePath.includes('/collections')) {
    return postCataloguePath.split('/collections')[0];
  }
  const pathArray = postCataloguePath.split('/');
  const slicedArray = pathArray.slice(0, pathArray.length - 1);
  return slicedArray.join('/');
};

export const removeCatalogueFromPath = () => {
  addCatalogueToPath('');
};

type ViewOptions = 'map' | 'list' | 'qa' | string;

export const addViewToURL = (view: ViewOptions): void => {
  let path = window.location.pathname;
  const splitPath = path.split('/');
  const endPath = splitPath[splitPath.length - 1];

  // Check if the current end of the path matches a view option
  if (['map', 'list', 'qa'].includes(endPath)) {
    // Replace the existing view option with the new one
    path = `${splitPath.slice(0, -1).join('/')}/${view}`;
  } else {
    // Append the new view option to the path
    path += path.endsWith('/') ? `${view}` : `/${view}`;
  }

  // Preserve existing query parameters
  const searchParams = new URLSearchParams(location.search);
  const newUrl = `${path}?${searchParams.toString()}`;

  history.replaceState(null, '', newUrl);
};

export const getViewFomURL = () => {
  const catalogue = location.pathname.replace(import.meta.env.VITE_BASE_PATH, '');
  const splitURL = catalogue.replace(/\/$/, '').split('/');
  return splitURL[splitURL.length - 1];
};

export const setQueryParam = (name: string, value: string): void => {
  const searchParams = new URLSearchParams(location.search);
  searchParams.set(name, value);
  const newUrl = `${location.pathname}?${searchParams.toString()}`;
  history.replaceState(null, '', newUrl);
};

export const getQueryParam = (name: string): string => {
  const searchParams = new URLSearchParams(location.search);
  const param = searchParams.get(name);
  return param;
};

export const removeQueryParam = (name: string) => {
  const searchParams = new URLSearchParams(location.search);
  searchParams.delete(name);
  const newUrl = `${location.pathname}?${searchParams.toString()}`;
  history.replaceState(null, '', newUrl);
};
