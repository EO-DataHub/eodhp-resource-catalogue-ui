export const addCatalogueToPath = (name: string) => {
  let path = import.meta.env.VITE_BASE_PATH;
  path += `${name}`;
  const searchParams = new URLSearchParams(location.search);
  const newUrl = `${path}?${searchParams.toString()}`;
  history.replaceState(null, '', newUrl);
};

export const getCatalogueFromPath = () => {
  const catalogue = location.pathname.replace(import.meta.env.VITE_BASE_PATH, '');
  return catalogue.replace(/\/$/, '').split('/')[0];
};

export const removeCatalogueFromPath = () => {
  addCatalogueToPath('');
};

export const addCollectionToPath = (name: string) => {
  const catalogue = getCatalogueFromPath();
  const path = `${catalogue}/${name}`;
  addCatalogueToPath(path);
};

export const removeCollectionFromPath = () => {
  const catalogue = getCatalogueFromPath();
  addCatalogueToPath(catalogue);
};

export const getCollectionFromPath = () => {
  const catalogue = location.pathname.replace(import.meta.env.VITE_BASE_PATH, '');
  return catalogue.replace(/\/$/, '').split('/')[1];
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
