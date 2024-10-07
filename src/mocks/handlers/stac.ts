import { HttpResponse, http } from 'msw';

import { getCollections } from '../fixtures/stac';

const API_URL = '/api/catalogue/stac/collections';

const getStacCollectionsData = http.get(`*${API_URL}*`, () => HttpResponse.json(getCollections()));

const handlers = [getStacCollectionsData];

export default handlers;
