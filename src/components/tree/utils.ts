import { bboxPolygon, booleanIntersects, polygon } from '@turf/turf';

import { FilterActiveFilters } from '@/context/FilterContext/types';
import { Collection } from '@/typings/stac';

export const CATALOG = 'Catalog';

const COLLECTION = 'Collection';

const filterByText = (label: string, filter: string) => {
  return label?.trim().toLowerCase().includes(filter?.trim().toLowerCase());
};

const filterByTemporal = (node: Collection, activeFilters: FilterActiveFilters) => {
  const { start, end } = activeFilters.temporal;
  if (start && end) {
    const collectionTemporal = node.extent.temporal?.interval[0];
    const filterStart = new Date(start);
    const filterEnd = new Date(end);
    const collectionStart = new Date(collectionTemporal[0]);
    const collectionEnd = new Date(collectionTemporal[1]);

    return collectionStart <= filterEnd && collectionEnd >= filterStart;
  }

  return true;
};

const filterBySpatial = (node: Collection, activeFilters: FilterActiveFilters) => {
  const { bbox } = node.extent.spatial;

  if (bbox.length !== 0) {
    const collectionPolygon = bboxPolygon([bbox[0][0], bbox[0][1], bbox[0][2], bbox[0][3]]);

    if (activeFilters.aoi.type === 'Polygon') {
      const filterPolygon = polygon(activeFilters.aoi.coordinates);
      return booleanIntersects(collectionPolygon, filterPolygon);
    }
  }

  return true;
};

export const filterTree = (
  node: TreeCatalog | Collection,
  activeFilters: FilterActiveFilters,
  visited = new Set<string>(),
): TreeCatalog | Collection | null => {
  if (visited.has(node.id)) {
    return null;
  }
  visited.add(node.id);

  const label = node?.title?.trim() !== '' ? node.title : node?.id;
  const matchesTextFilter = filterByText(label, activeFilters.textQuery);

  let matchesTemporalFilter = true;
  if (node.type === COLLECTION && activeFilters.temporal) {
    matchesTemporalFilter = filterByTemporal(node, activeFilters);
  }

  let matchesSpatialFilter = true;
  if (node.type === COLLECTION && activeFilters.aoi) {
    matchesSpatialFilter = filterBySpatial(node, activeFilters);
  }

  if (node.type === CATALOG) {
    const filteredSubCatalogs = node.catalogs
      ?.map((subCatalog) => filterTree(subCatalog, activeFilters, new Set(visited)))
      .filter((subCatalog) => subCatalog !== null) as TreeCatalog[];
    const filteredCollections = node.collections?.filter((collection) => {
      const collectionLabel = collection?.title?.trim() !== '' ? collection.title : collection?.id;
      const matchesCollectionTextFilter = filterByText(collectionLabel, activeFilters.textQuery);

      let matchesCollectionTemporalFilter = true;
      if (activeFilters.temporal) {
        matchesCollectionTemporalFilter = filterByTemporal(collection, activeFilters);
      }

      let matchesCollectionSpatialFilter = true;
      if (activeFilters.aoi) {
        matchesCollectionSpatialFilter = filterBySpatial(collection, activeFilters);
      }

      return (
        matchesCollectionTextFilter &&
        matchesCollectionTemporalFilter &&
        matchesCollectionSpatialFilter
      );
    });

    if (matchesTextFilter || filteredSubCatalogs.length > 0 || filteredCollections.length > 0) {
      return {
        ...node,
        catalogs: filteredSubCatalogs,
        collections: filteredCollections,
      };
    }
  } else if (node.type === COLLECTION) {
    if (matchesTextFilter && matchesTemporalFilter && matchesSpatialFilter) {
      return node;
    }
  }
  return null;
};

export const getParentId = (catalog: TreeCatalog): string | null => {
  const parentLink = catalog.links.find((link) => link.rel === 'parent');
  if (parentLink) {
    const hrefParts = parentLink.href.split('/catalogs/');
    if (hrefParts.length > 1) {
      const pathParts = hrefParts[1].split('/');
      return pathParts[pathParts.length - 1];
    }
  }
  return null;
};

export const buildTree = async (flatCatalogs: TreeCatalog[]): Promise<TreeCatalog[]> => {
  const idToCatalog: { [id: string]: TreeCatalog } = {};
  const rootCatalogs: TreeCatalog[] = [];

  flatCatalogs.forEach((catalog) => {
    idToCatalog[catalog.id] = { ...catalog, catalogs: [], collections: [] };
  });

  for (const catalog of flatCatalogs) {
    const parentId = getParentId(catalog);
    if (parentId && parentId !== 'root' && idToCatalog[parentId]) {
      idToCatalog[parentId].catalogs.push(idToCatalog[catalog.id]);
    } else {
      rootCatalogs.push(idToCatalog[catalog.id]);
    }
  }

  await Promise.all(
    flatCatalogs.map(async (catalog) => {
      const currentCatalog = idToCatalog[catalog.id];
      const childLinks = currentCatalog.links.filter((link) => link.rel === 'child');

      await Promise.all(
        childLinks.map(async (link) => {
          if (link.href.includes('/collections/')) {
            try {
              const response = await fetch(link.href);
              const collection = await response.json();
              currentCatalog.collections.push(collection);
            } catch (error) {
              console.error(`Failed to fetch collection at ${link.href}:`, error);
            }
          }
        }),
      );
    }),
  );

  return rootCatalogs;
};
