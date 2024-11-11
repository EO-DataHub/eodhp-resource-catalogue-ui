type fragmentData = {
  type: 'view' | 'auth' | 'catalogue' | 'centre' | 'zoom' | 'aoi' | 'filter';
  value: string;
  filterName?: string;
};

const URL_INDICES = {
  view: 0,
  auth: 1,
  catalogue: 2,
  centre: 3,
  zoom: 4,
  aoi: 5,
};

export const updateURL = (data: fragmentData) => {
  const pathName = window.location.href.split(import.meta.env.BASE_URL)[1] || '';
  const split = pathName.split('/');
  const urlStructure = {};
  Object.keys(URL_INDICES).forEach((key) => {
    urlStructure[key] = {
      index: URL_INDICES[key],
      value: split[URL_INDICES[key]] || '',
    };
  });
  if (data.type !== 'filter') urlStructure[data.type].value = data.value;

  const newPath = Object.keys(urlStructure)
    .sort((a, b) => urlStructure[a].index - urlStructure[b].index)
    .map((key) => urlStructure[key].value)
    .join('/');

  let filters = split[split.length - 1] || '';
  if (data.type === 'filter') {
    let parsedFilters;
    try {
      parsedFilters = JSON.parse(decodeURIComponent(filters));
    } catch (error) {
      parsedFilters = {};
    } finally {
      parsedFilters[data.filterName] = data.value;
      filters = encodeURIComponent(JSON.stringify(parsedFilters));
    }
  }

  const newUrl = `${import.meta.env.BASE_URL}${newPath}/${filters}`;

  history.replaceState(null, '', newUrl);
};

export const setQueryParam = (name: string, value: string) => {
  const searchParams = new URLSearchParams(location.search);
  searchParams.set(name, value);
  const newUrl = `${import.meta.env.BASE_URL}?${searchParams.toString()}`;
  history.replaceState(null, '', newUrl);
};

export const getQueryParam = (name: string) => {
  const searchParams = new URLSearchParams(location.search);
  const param = searchParams.get(name);
  return param;
};
