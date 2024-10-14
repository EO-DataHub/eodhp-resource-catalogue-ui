import { useCallback, useEffect, useState } from 'react';

import { bboxPolygon } from '@turf/bbox-polygon';
import { booleanIntersects } from '@turf/boolean-intersects';
import { polygon } from '@turf/helpers';
import { useDebounce } from 'react-use';

import folder from '@/assets/icons/folder.png';
import { useFilters } from '@/hooks/useFilters';
import { useToolbox } from '@/hooks/useToolbox';
import ToolboxRow from '@/pages/MapViewer/components/Toolbox/components/ToolboxRow';
import { Collection, Link } from '@/typings/stac';
import { parseCollectionDataPoints } from '@/utils/stacUtils';

import './Tree.scss';

type TreeCatalog = {
  id: string;
  title: string;
  type: 'Catalog';
  catalogs?: TreeCatalog[]; // sub-catalogs
  collections?: Collection[]; // collections
};

// Utility function to fetch data from a given URL
const fetchData = async (url: string) => {
  const response = await fetch(url);
  return response.json();
};

const CATALOG = 'Catalog';
const COLLECTION = 'Collection';

export const TreeComponent = ({ catalogUrl }: { catalogUrl: string }) => {
  const [treeData, setTreeData] = useState<TreeCatalog | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<{ [key: string]: boolean }>({});
  const [filteredTreeData, setFilteredTreeData] = useState<TreeCatalog | null>(null);

  const {
    state: { activeFilters },
  } = useFilters();

  const {
    actions: { setActivePage, setSelectedCollection },
  } = useToolbox();

  // Recursive function to fetch and build the tree structure
  const fetchCatalog = useCallback(async (url: string): Promise<TreeCatalog> => {
    const catalogData = await fetchData(url);

    // Check if the current catalog has sub-catalogs or collections
    const subCatalogs: TreeCatalog[] = await Promise.all(
      catalogData.links
        ?.filter((link) => link.rel === 'child')
        .map((link: Link) => fetchCatalog(link.href)) || [],
    );

    const collectionUrl = catalogData.links
      .filter((link) => link.rel === 'data')
      .filter((link) => link.href.includes('/collections'))
      .map((link) => link.href)[0];

    let collections: Collection[] = [];
    if (collectionUrl) {
      const collectionsResponse = await fetchData(collectionUrl);
      collections = collectionsResponse.collections;
    }

    // Return the catalog with its children (sub-catalogs and collections)
    return {
      ...catalogData,
      catalogs: subCatalogs,
      collections,
    };
  }, []);

  // Fetch the top-level catalog when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      const topLevelCatalog = await fetchCatalog(catalogUrl);
      setTreeData(topLevelCatalog);
    };

    fetchData();
  }, [catalogUrl, fetchCatalog]);

  // Recursive function to filter tree nodes based on the filter text
  const filterTree = useCallback(
    (node: TreeCatalog | Collection): TreeCatalog | Collection | null => {
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

      let matchesSpatialFilter = true;
      if (node.type === COLLECTION && activeFilters.aoi) {
        const { bbox } = node.extent.spatial;
        const collectionPolygon = bboxPolygon([bbox[0][0], bbox[0][1], bbox[0][2], bbox[0][3]]);

        if (activeFilters.aoi.type === 'Polygon') {
          const filterPolygon = polygon(activeFilters.aoi.coordinates);
          matchesSpatialFilter = booleanIntersects(collectionPolygon, filterPolygon);
        }
      }

      if (node.type === CATALOG) {
        const filteredSubCatalogs = node.catalogs
          ?.map((subCatalog) => filterTree(subCatalog))
          .filter((subCatalog) => subCatalog !== null) as TreeCatalog[];
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

          let matchesCollectionSpatialFilter = true;
          if (activeFilters.aoi && activeFilters.aoi.type === 'Polygon') {
            matchesCollectionSpatialFilter = booleanIntersects(
              bboxPolygon([
                collection.extent.spatial.bbox[0][0],
                collection.extent.spatial.bbox[0][1],
                collection.extent.spatial.bbox[0][2],
                collection.extent.spatial.bbox[0][3],
              ]),
              polygon(activeFilters.aoi.coordinates),
            );
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
    },
    [activeFilters],
  );

  // Debounce the filtering of the tree
  useDebounce(
    () => {
      if (treeData) {
        const filteredData = filterTree(treeData);
        setFilteredTreeData(filteredData as TreeCatalog);
      }
    },
    300,
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
    setSelectedCollection(node);
    setActivePage('items');
  };

  // Render the tree structure
  const renderTree = (node: TreeCatalog | Collection) => {
    const label = node?.title.trim() !== '' ? node.title : node?.id;

    if (node.type === CATALOG) {
      const isExpanded = expandedNodes[node.id] ?? false;

      return (
        <li key={node.id}>
          <button className="node" onClick={() => toggleExpand(node.id)}>
            {isExpanded ? '[-]' : '[+]'} {label}
          </button>

          {isExpanded ? (
            <ul className="branch">
              {node.catalogs?.map((subCatalog) => renderTree(subCatalog))}
              {node.collections?.map((collection) => (
                <li key={collection.id}>
                  {/* <button className="node" onClick={() => handleLeafClick(collection)}> */}
                  {/* {collection.id} (Collection) */}
                  <ToolboxRow
                    key={collection.id}
                    dataPoints={parseCollectionDataPoints(collection)}
                    thumbnail={collection.thumbnailUrl ?? folder}
                    title={collection.title ? collection.title : collection.id}
                    onClick={() => handleLeafClick(collection)}
                  />
                  {/* </button> */}
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
      {filteredTreeData ? (
        <ul className="branch">{renderTree(filteredTreeData)}</ul>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};
