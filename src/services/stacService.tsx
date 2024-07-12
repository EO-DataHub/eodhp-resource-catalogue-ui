// Example Typescript request to get STAC Collections
export const getStacCollections = async () => {
  const url = `https://example.com/stac/collections`;
  const response = await fetch(url); // We will use axios in the future that allows us to use interceptors.
  const data = await response.json();
  return data;
}
