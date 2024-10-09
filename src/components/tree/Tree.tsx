import React, { useEffect, useState } from 'react';

import type { StacCatalog, StacCollection } from 'stac-ts';

// import { useFilters } from '@/hooks/useFilters';
import { useMap } from '@/hooks/useMap';
import { useToolbox } from '@/hooks/useToolbox';
import { Collection } from '@/typings/stac';

import { TreeNode } from './TreeNode';
// import { Collection } from '@/typings/stac';

export type Node = StacCatalog | StacCollection;

// export type Node = {
//   id: string;
//   name: string;
//   hasChildren: boolean;
// };

// const ENVIRONMENT = 'dev';
const ENVIRONMENT = 'test';
const HOST = `https://${ENVIRONMENT}.eodatahub.org.uk`;

export const Tree = () => {
  const [rootNodes, setRootNodes] = useState<Node[]>([]);

  // const { collections } = useMap();
  // console.log('COLLECTIUONS: ', collections);

  const {
    actions: { setActivePage, setSelectedCollection },
  } = useToolbox();

  // const {
  //   state: { activeFilters },
  // } = useFilters();

  useEffect(() => {
    // Fetch root nodes from API
    const fetchRootNodes = async () => {
      const response = await fetch(`${HOST}/api/catalogue/stac/catalogs/supported-datasets`);
      const data = await response.json();
      setRootNodes([data]);
    };

    fetchRootNodes();
  }, []);

  const fetchChildren = async (node: Node) => {
    // console.log('FETCHING CHILDREN');
    const onFulfilled = (response) => {
      if (response.status !== 200 && !response.ok) {
        throw new Error(`[${response.status}] Unable to fetch resource`);
      }
      return response.json();
    };

    const onRejected = (err) => {
      console.error(err);
    };

    // console.log('NODE: ', node);
    // Extract `data` rels to get child nodes.
    // Get hrefs to `catalogs` and `collection` endpoints
    const urls = node.links.filter((link) => link.rel === 'data').map((link) => link.href);
    // console.log('URLS: ', urls);
    const promises = urls.map((url) =>
      fetch(url)
        .then(onFulfilled, onRejected)
        .catch((err) => console.error('[request failed]', err.message)),
    );
    const results = await Promise.all(promises);
    // console.log('RESULTS: ', results);

    return results;
  };

  const handleLeafClick = (node: Collection) => {
    console.log('Leaf node clicked:', node);
    // Execute some action
    setSelectedCollection(node);
    setActivePage('items');
  };

  // const filterNodes = (nodes: Node[]) => {
  //   return nodes.filter((node) =>
  //     node.title.toLowerCase().includes(activeFilters.textQuery.toLowerCase()),
  //   );
  // };

  // const filteredNodes = filterNodes(rootNodes);
  // console.log('FILTERED ROOT NODES: ', { rootNodes, filteredNodes });

  return (
    <ul>
      {rootNodes.map((node) => (
        <TreeNode
          key={node.id}
          fetchChildren={fetchChildren}
          node={node}
          onLeafClick={handleLeafClick}
          // activeFilters={activeFilters}
        />
      ))}
    </ul>
  );
};
