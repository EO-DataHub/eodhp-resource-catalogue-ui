import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';

import { useDebounce } from 'react-use';

import { useFilters } from '@/hooks/useFilters';
import { useToolbox } from '@/hooks/useToolbox';
import { Collection } from '@/typings/stac';
import { fetchPathPartsFromUrl } from '@/utils/genericUtils';
import { updateUrl } from '@/utils/urlHandler';

import { TreeHeader } from './TreeHeader';
import { TreeNode } from './TreeNode';
import { buildTree, filterTree } from './utils';

import './Tree.scss';

type TreeProps = {
  treeData: TreeCatalog[];
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
        })();
      }
    },
    300,
    [treeData, activeFilters, filter],
  );

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
