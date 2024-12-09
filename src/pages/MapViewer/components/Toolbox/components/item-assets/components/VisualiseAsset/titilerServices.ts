export async function fetchAvailableBands(assetHref: string) {
  const url = `${import.meta.env.VITE_TITILER_CORE_ENDPOINT}/cog/info?url=${encodeURIComponent(
    assetHref,
  )}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch band information.');
  }
  const data = await response.json();
  return data.band_descriptions || [];
}

export async function fetchAvailableVariables(assetHref: string, isKerchunk: boolean) {
  const baseUrl = `${import.meta.env.VITE_TITILER_XARRAY_ENDPOINT}/variables`;
  const params = new URLSearchParams();
  params.append('url', assetHref);
  if (isKerchunk) params.append('reference', 'true');

  const response = await fetch(`${baseUrl}?${params.toString()}`);
  if (!response.ok) {
    throw new Error('Failed to fetch variables.');
  }
  return await response.json();
}

export async function fetchStatisticsForRescale(
  assetHref: string,
  assetType: string,
  variable: string,
  isKerchunk: boolean,
  bidx: number,
  availableBands: Array<[string, string]>,
) {
  let url = '';
  if (assetType === 'core') {
    url = `${import.meta.env.VITE_TITILER_CORE_ENDPOINT}/cog/statistics?url=${encodeURIComponent(
      assetHref,
    )}&bidx=${bidx}`;
  } else if (assetType === 'xarray') {
    url = `${import.meta.env.VITE_TITILER_XARRAY_ENDPOINT}/info?url=${encodeURIComponent(
      assetHref,
    )}&variable=${variable}&reference=${isKerchunk}`;
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch statistics for rescale approximation.');
  }

  const data = await response.json();

  // Check for XArray attributes
  if (data.attrs && data.attrs.valid_min && data.attrs.valid_max) {
    return `${data.attrs.valid_min},${data.attrs.valid_max}`;
  } else {
    // Check for Core band statistics
    const bandKey = availableBands[bidx - 1]?.[0];
    if (bandKey && data[bandKey]?.min !== undefined && data[bandKey]?.max !== undefined) {
      return `${data[bandKey].min},${data[bandKey].max}`;
    } else {
      throw new Error('Could not approximate rescale value from data.');
    }
  }
}

export async function fetchHistogramData(
  assetHref: string,
  assetType: string,
  variable: string,
  isKerchunk: boolean,
  bidx: number,
  availableBands: Array<[string, string]>,
) {
  let url = '';
  let formattedData = [];

  if (assetType === 'xarray') {
    url = `${import.meta.env.VITE_TITILER_XARRAY_ENDPOINT}/histogram?url=${encodeURIComponent(
      assetHref,
    )}&variable=${variable}&reference=${isKerchunk}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch histogram data.');
    }
    const data = await response.json();

    formattedData = data.map((item) => ({
      bucketMidpoint: (item.bucket[0] + item.bucket[1]) / 2,
      value: item.value,
    }));
  } else if (assetType === 'core') {
    url = `${import.meta.env.VITE_TITILER_CORE_ENDPOINT}/cog/statistics?url=${encodeURIComponent(
      assetHref,
    )}&bidx=${bidx}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch histogram data.');
    }
    const data = await response.json();

    const bandKey = availableBands[bidx - 1]?.[0];
    if (bandKey && data[bandKey]?.histogram) {
      formattedData = data[bandKey].histogram[0].map((val: number, index: number) => ({
        bucketMidpoint: data[bandKey].histogram[1][index],
        value: val,
      }));
    } else {
      throw new Error('Histogram data not found for the selected band.');
    }
  }

  return formattedData;
}
