import { useCallback, useEffect, useState } from 'react';

import { useDebounce } from 'react-use';

import { useFilters } from '@/hooks/useFilters';
import { useToolbox } from '@/hooks/useToolbox';
import { Collection, Link } from '@/typings/stac';

import { TreeNode } from './TreeNode';
import { filterTree } from './utils';

import './Tree.scss';

export type TreeCatalog = {
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

type TreeProps = {
  catalogUrl: string;
};

export const Tree = ({ catalogUrl }: TreeProps) => {
  const [treeData, setTreeData] = useState<TreeCatalog[]>([]);
  const [expandedNodes, setExpandedNodes] = useState<{ [key: string]: boolean }>({});
  const [filteredTreeData, setFilteredTreeData] = useState<TreeCatalog[]>([]);

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

  // Fetch the ROOTS array of URLs when the component mounts
  useEffect(() => {
    const fetchRoots = async () => {
      const rootsResponse = await fetchData(catalogUrl);

      const rootCatalogUrls = rootsResponse.catalogs.reduce((acc, obj) => {
        const selfLink = obj.links.find((link: Link) => link.rel === 'self');

        if (selfLink) {
          acc.push(selfLink.href);
        }

        return acc;
      }, []);

      const topLevelCatalogs = await Promise.all(
        rootCatalogUrls.map((url: string) => fetchCatalog(url)),
      );
      setTreeData(topLevelCatalogs);
    };

    fetchRoots();
  }, [catalogUrl, fetchCatalog]);

  // Recursive function to filter tree nodes based on the filter text
  const filter = useCallback(
    (node: TreeCatalog | Collection): TreeCatalog | Collection | null =>
      filterTree(node, activeFilters),
    [activeFilters],
  );

  // Debounce the filtering of the tree
  useDebounce(
    () => {
      if (treeData.length > 0) {
        const filteredData = treeData
          .map((catalog) => filter(catalog))
          .filter(Boolean) as TreeCatalog[];
        setFilteredTreeData(filteredData);
      }
    },
    300,
    [treeData, activeFilters, filter],
  );

  // Toggle the expansion state of a catalog node
  const toggleExpand = (nodeId: string) => {
    setExpandedNodes((prevState) => ({
      ...prevState,
      [nodeId]: !prevState[nodeId], // Toggle the expanded state of this node
    }));
  };

  const handleLeafClick = (node: Collection) => {
    setSelectedCollection(node);
    setActivePage('items');
  };

  return (
    <div>
      {filteredTreeData.length > 0 ? (
        <ul className="branch">
          {filteredTreeData.map((catalog) => (
            <TreeNode
              key={catalog.id}
              expandedNodes={expandedNodes}
              handleLeafClick={handleLeafClick}
              node={catalog}
              toggleExpand={toggleExpand}
            />
          ))}
        </ul>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};
