import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';

import { useDebounce } from 'react-use';

import { useFilters } from '@/hooks/useFilters';
import { useToolbox } from '@/hooks/useToolbox';
import { TreeCatalog } from '@/pages/MapViewer/components/Toolbox';
import { Collection } from '@/typings/stac';
import { fetchPathPartsFromUrl } from '@/utils/genericUtils';

import { TreeHeader } from './TreeHeader';
import { TreeNode } from './TreeNode';
import { filterTree } from './utils';
import './Tree.scss';

type TreeProps = {
  treeData: TreeCatalog[]; // This is the flat list from the API
  expandedNodes: { [key: string]: boolean };
  setExpandedNodes: Dispatch<SetStateAction<{ [key: string]: boolean }>>;
};

export const Tree = ({ treeData, expandedNodes, setExpandedNodes }: TreeProps) => {
  const [filteredTreeData, setFilteredTreeData] = useState<TreeCatalog[]>(null);

  const {
    state: { activeFilters },
  } = useFilters();

  const {
    actions: { setActivePage, setSelectedCollection },
  } = useToolbox();

  const filter = useCallback(
    (node: TreeCatalog | Collection): TreeCatalog | Collection | null =>
      filterTree(node, activeFilters),
    [activeFilters],
  );

  const buildTree = async (flatCatalogs: TreeCatalog[]): Promise<TreeCatalog[]> => {
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

  const getParentId = (catalog: TreeCatalog): string | null => {
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

  useEffect(() => {
    const parseURL = () => {
      const catalogPathParts = fetchPathPartsFromUrl();

      const initialExpandedNodes: { [key: string]: boolean } = {};
      catalogPathParts.forEach((catalogId) => {
        initialExpandedNodes[catalogId] = true;
      });

      setExpandedNodes(initialExpandedNodes);
    };

    parseURL();

    const handlePopState = () => {
      parseURL();
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [setExpandedNodes]);

  useDebounce(
    () => {
      if (treeData.length > 0) {
        (async () => {
          const tree = await buildTree(treeData);
          const filteredData = tree
            .map((catalog) => filter(catalog))
            .filter(Boolean) as TreeCatalog[];
          setFilteredTreeData(filteredData);
          console.log('Filtered Tree Data:', filteredData);
        })();
      }
    },
    300,
    [treeData, activeFilters, filter],
  );

  const updateUrl = (node: TreeCatalog | Collection) => {
    const url = node.links.find((link) => link.rel === 'self')?.href;
    if (url) {
      const path = url.split('catalogs/')[1];
      const currentPath = window.location.pathname;
      // Preserve the suffix (/map or /list)
      const suffixMatch = currentPath.match(/\/(map|list)$/);
      const suffix = suffixMatch ? suffixMatch[0] : '';
      const newPath = `${import.meta.env.VITE_BASE_PATH || ''}/catalogs/${path}${suffix}`;
      window.history.pushState({}, '', newPath);
    }
  };

  const toggleExpand = (node: TreeCatalog | Collection) => {
    setExpandedNodes((prevState) => ({
      ...prevState,
      [node.id]: !prevState[node.id],
    }));
    updateUrl(node);
  };

  const handleLeafClick = (node: Collection) => {
    setSelectedCollection(node);
    setActivePage('items');
    updateUrl(node);
  };

  return (
    <div>
      <TreeHeader />
      {filteredTreeData ? (
        <ul className="branch root">
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
        <div className="spinner-container">
          <div className="spinner" />
        </div>
      )}
    </div>
  );
};
