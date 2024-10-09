import { useCallback, useEffect, useState } from 'react';

import { bboxPolygon } from '@turf/bbox-polygon';
import { booleanIntersects } from '@turf/boolean-intersects';
import { polygon } from '@turf/helpers';
// import { Position } from 'geojson';
import { useDebounce } from 'react-use';

import { useFilters } from '@/hooks/useFilters';

import './Tree.scss';

// Types for catalog and collection data
type Link = {
  rel: string;
  href: string;
};

type Collection = {
  id: string;
  title: string;
  type: 'Collection';
  extent: {
    temporal: {
      interval: string[];
    };
    spatial: {
      bbox: [[number, number, number, number]];
    };
  };
};

type Catalog = {
  id: string;
  title: string;
  type: 'Catalog';
  catalogs?: Catalog[]; // sub-catalogs
  collections?: Collection[]; // collections
};

// Utility function to fetch data from a given URL
const fetchData = async (url: string) => {
  const response = await fetch(url);
  return response.json();
};

// Fetch collections separately for a given catalog ID
// const fetchCollections = async (url: string): Promise<Collection[]> => {
//   const collectionsUrl = `/api/collections/${catalogId}`; // Adjust the URL to match your API endpoint
//   return fetchData(collectionsUrl);
// };

const CATALOG = 'Catalog';
const COLLECTION = 'Collection';

export const TreeComponent = ({ catalogUrl }: { catalogUrl: string }) => {
  const [treeData, setTreeData] = useState<Catalog | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<{ [key: string]: boolean }>({});
  const [filteredTreeData, setFilteredTreeData] = useState<Catalog | null>(null);

  const {
    state: { activeFilters },
  } = useFilters();

  // Recursive function to fetch and build the tree structure
  const fetchCatalog = useCallback(async (url: string): Promise<Catalog> => {
    const catalogData = await fetchData(url);
    // console.log('CATALOG DATA: ', catalogData);

    // Check if the current catalog has sub-catalogs or collections
    const subCatalogs: Catalog[] = await Promise.all(
      catalogData.links
        ?.filter((link) => link.rel === 'child')
        .map(
          (link: Link) => fetchCatalog(link.href), // Recursively fetch sub-catalogs
        ) || [],
    );
    // console.log('SUB CATALOG DATA: ', subCatalogs);

    // const collections: Collection[] = catalogData.collections || [];
    // Fetch collections for the current catalog
    const collectionUrl = catalogData.links
      .filter((link) => link.rel === 'data')
      .filter((link) => link.href.includes('/collections'))
      .map((link) => link.href)[0];
    // console.log('COLLECTION URL: ', collectionUrl);

    let collections: Collection[] = [];
    if (collectionUrl) {
      collections = await fetchData(collectionUrl);
    }

    // Return the catalog with its children (sub-catalogs and collections)
    const data = {
      ...catalogData,
      catalogs: subCatalogs, // The recursively fetched sub-catalogs
      collections: collections.collections, // The leaf node collections
    };
    // console.log('COMBINED DATA: ', data);

    return data;
  }, []);

  // Fetch the top-level catalog when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      const topLevelCatalog = await fetchCatalog(catalogUrl);
      setTreeData(topLevelCatalog);
    };

    fetchData();
  }, [catalogUrl, fetchCatalog]);

  // console.log('TREE DATA: ', treeData);
  // Recursive function to filter tree nodes based on the filter text
  const filterTree = useCallback(
    (node: Catalog | Collection): Catalog | Collection | null => {
      const label = node?.title.trim() !== '' ? node.title : node?.id;

      const matchesTextFilter = label.toLowerCase().includes(activeFilters.textQuery.toLowerCase());

      let matchesTemporalFilter = true;
      if (node.type === COLLECTION && activeFilters.temporal) {
        const { start, end } = activeFilters.temporal;
        if (start && end) {
          const collectionTemporal = node.extent.temporal?.interval[0];
          const filterStart = new Date(start);
          const filterEnd = new Date(end);
          const collectionStart = new Date(collectionTemporal[0]);
          const collectionEnd = new Date(collectionTemporal[1]);

          matchesTemporalFilter = collectionStart <= filterEnd && collectionEnd >= filterStart;
        }
      }
      // console.log('FILTERS: ', activeFilters);

      let matchesSpatialFilter = true;
      if (node.type === COLLECTION && activeFilters.aoi) {
        const { bbox } = node.extent.spatial;
        // console.log('COLLECTION POLY: ', bbox);
        const collectionPolygon = bboxPolygon(bbox[0]);
        // // const collectionPolygon = bboxPolygon([-180, -90, 180, 90]);
        // console.log('BBOX POLY: ', collectionPolygon);
        if (activeFilters.aoi.type === 'Polygon') {
          const filterPolygon = polygon(activeFilters.aoi.coordinates);
          matchesSpatialFilter = booleanIntersects(collectionPolygon, filterPolygon);
        }
      }
      console.log('MATCHES SPATIAL: ', { node: node.id, matchesSpatialFilter });

      if (node.type === CATALOG) {
        const filteredSubCatalogs = node.catalogs
          ?.map((subCatalog) => filterTree(subCatalog))
          .filter((subCatalog) => subCatalog !== null) as Catalog[];
        const filteredCollections = node.collections?.filter((collection) => {
          const collectionLabel = collection.title.trim() !== '' ? collection.title : collection.id;
          const matchesCollectionTextFilter = collectionLabel
            .toLowerCase()
            .includes(activeFilters.textQuery.toLowerCase());

          let matchesCollectionTemporalFilter = true;
          if (activeFilters.temporal) {
            const { start, end } = activeFilters.temporal;
            if (start && end) {
              const collectionTemporal = collection.extent.temporal?.interval[0];
              const filterStart = new Date(start);
              const filterEnd = new Date(end);
              const collectionStart = new Date(collectionTemporal[0]);
              const collectionEnd = new Date(collectionTemporal[1]);

              matchesCollectionTemporalFilter =
                collectionStart <= filterEnd && collectionEnd >= filterStart;
            }
          }

          return (
            matchesCollectionTextFilter && matchesCollectionTemporalFilter && matchesSpatialFilter
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
    },
    [activeFilters],
  );

  // Debounce the filtering of the tree
  useDebounce(
    () => {
      if (treeData) {
        const filteredData = filterTree(treeData);
        setFilteredTreeData(filteredData as Catalog);
      }
    },
    300, // Delay of 300ms
    [treeData, activeFilters, filterTree],
  );

  // Toggle the expansion state of a catalog node
  const toggleExpand = (nodeId: string) => {
    setExpandedNodes((prevState) => ({
      ...prevState,
      [nodeId]: !prevState[nodeId], // Toggle the expanded state of this node
    }));
  };

  const handleLeafClick = (node: Collection) => {
    console.log('Leaf node clicked:', node);
    // Execute some action
    // setSelectedCollection(node);
    // setActivePage('items');
  };

  console.log('TREE DATA: ', { treeData, filteredTreeData });

  // Render the tree structure
  const renderTree = (node: Catalog | Collection) => {
    // console.log('Node Type: ', node.type);

    const label = node?.title.trim() !== '' ? node.title : node?.id;

    if (node.type === CATALOG) {
      const isExpanded = expandedNodes[node.id] || false; // Check if this catalog is expanded

      return (
        <li key={node.id}>
          <button className="node" onClick={() => toggleExpand(node.id)}>
            {isExpanded ? '[-]' : '[+]'} {label} (Catalog)
          </button>

          {isExpanded ? (
            <ul>
              {node.catalogs?.map((subCatalog) => renderTree(subCatalog))}
              {/* {node.collections?.map((collection) => renderTree(collection))} */}
              {node.collections?.map((collection) => (
                <li key={collection.id}>
                  <button className="node" onClick={() => handleLeafClick(collection)}>
                    {collection.id} (Collection)
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </li>
      );
    }
  };

  return (
    <div>
      <h3>Catalog Tree</h3>
      {filteredTreeData ? <ul>{renderTree(filteredTreeData)}</ul> : <div>Loading...</div>}
    </div>
  );
};
