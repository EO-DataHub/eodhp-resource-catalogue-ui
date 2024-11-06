import { Dispatch, SetStateAction, useCallback, useState } from 'react';

import { useDebounce } from 'react-use';

import { useFilters } from '@/hooks/useFilters';
import { useToolbox } from '@/hooks/useToolbox';
import { Collection } from '@/typings/stac';

import { TreeNode } from './TreeNode';
import { filterTree } from './utils';

import './Tree.scss';

export type TreeCatalog = {
  id: string;
  title: string;
  type: 'Catalog';
  licence?: string;
  catalogs?: TreeCatalog[]; // sub-catalogs
  collections?: Collection[]; // collections
};

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
      {filteredTreeData ? (
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
