import { Fragment, useCallback, useEffect, useState } from 'react';

import { GrCatalogOption } from 'react-icons/gr';
import { MdOutlineCollections } from 'react-icons/md';
import { StacCatalog, StacCollection } from 'stac-ts';

import { FilterActiveFilters } from '@/context/FilterContext/types';
import { useFilters } from '@/hooks/useFilters';

import { Node } from './Tree';

import './Tree.scss';

interface TreeNodeProps {
  node: Node;
  fetchChildren: (node: Node) => Promise<Child[]>;
  onLeafClick: (node: Node) => void;
}

type Child = {
  catalogs?: StacCatalog[];
  collections?: StacCollection[];
};

export const TreeNode = ({ node, fetchChildren, onLeafClick }: TreeNodeProps) => {
  const [children, setChildren] = useState<Child[]>([]);
  const [filteredNodes, setFilteredNodes] = useState<Child[]>([]);
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  // console.log('CHILDREN: ', children);

  const {
    state: { activeFilters },
  } = useFilters();

  const filterChildren = useCallback(
    (children: Child[], activeFilters: FilterActiveFilters): Child[] => {
      const filteredChildren = children.map((child) => ({
        catalogs: child.catalogs?.filter((catalog) =>
          catalog.id.toLowerCase().includes(activeFilters?.textQuery?.toLowerCase()),
        ),
        collections: child.collections?.filter((collection) =>
          collection.id.toLowerCase().includes(activeFilters?.textQuery?.toLowerCase()),
        ),
      }));
      console.log('FILTERED CHILDREN: ', { children, filteredChildren });

      return filteredChildren;
    },
    [activeFilters], // Dependencies for useCallback
  );

  useEffect(() => {
    setFilteredNodes(filterChildren(children, activeFilters));
  }, [activeFilters, children, filterChildren]);

  // const applyFilters = (fetchedChildren: Child[]) => {
  //   // Example: filtering based on title or ID of catalogs/collections
  //   return fetchedChildren.filter((child) => {
  //     const catalogsMatch = child.catalogs?.some(
  //       (catalog) =>
  //         catalog.title.includes(activeFilters.textQuery) ||
  //         catalog.id.includes(activeFilters.textQuery),
  //     );
  //     const collectionsMatch = child.collections?.some(
  //       (collection) =>
  //         collection.title.includes(activeFilters.textQuery) ||
  //         collection.id.includes(activeFilters.textQuery),
  //     );
  //     return catalogsMatch || collectionsMatch;
  //   });
  // };

  // const handleExpand = async () => {
  //   if (!expanded) {
  //     setLoading(true);
  //     const fetchedChildren = await fetchChildren(node);

  //     // Apply filters before updating the state
  //     const filteredChildren = applyFilters(fetchedChildren);
  //     console.log('FILTERED: ', { fetchedChildren, filteredChildren });

  //     setChildren(filteredChildren);
  //     setLoading(false);
  //   }
  //   setExpanded(!expanded);
  // };
  const handleExpand = async () => {
    if (!expanded) {
      setLoading(true);
      const fetchedChildren = await fetchChildren(node);
      setChildren(fetchedChildren);
      setFilteredNodes(filterChildren(fetchedChildren, activeFilters));
      setLoading(false);
    }
    setExpanded(!expanded);
  };

  return (
    <li>
      <button className="node" onClick={handleExpand}>
        <GrCatalogOption />
        {node?.title.trim() !== '' ? node.title : node?.id} {loading && 'Loading...'}
      </button>
      {expanded && (
        <ul>
          {filteredNodes.map((child) => (
            <Fragment key={child.catalogs?.[0]?.id || child.collections?.[0]?.id}>
              {child.catalogs?.map((catalog) => (
                <TreeNode
                  key={catalog.id}
                  fetchChildren={fetchChildren}
                  node={catalog}
                  onLeafClick={onLeafClick}
                />
              ))}
              {child.collections?.map((collection) => {
                console.log('DISPLAY CHILDREN KEY: ', { child, collection });
                return (
                  <li key={collection.id}>
                    <button className="node" onClick={() => onLeafClick(collection)}>
                      <MdOutlineCollections />
                      {collection.id} Collection
                    </button>
                  </li>
                );
              })}
            </Fragment>
          ))}
        </ul>
      )}
    </li>
  );
};
