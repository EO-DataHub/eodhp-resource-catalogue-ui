import { MdExpandLess, MdExpandMore } from 'react-icons/md';

import { useCatalogue } from '@/hooks/useCatalogue';
import ToolboxRow from '@/pages/MapViewer/components/Toolbox/components/ToolboxRow';
import { fetchFavouritedItems } from '@/services/stac';
import { Collection } from '@/typings/stac';
import { parseCollectionDataPoints } from '@/utils/stacUtils';

import { TreeCatalog } from './Tree';

type TreeNodeProps = {
  node: TreeCatalog | Collection;
  toggleExpand: (nodeId: string) => void;
  expandedNodes: { [key: string]: boolean };
  handleLeafClick: (node: Collection) => void;
};

const CATALOG = 'Catalog';

export const TreeNode = ({ node, toggleExpand, expandedNodes, handleLeafClick }: TreeNodeProps) => {
  const label = node?.title?.trim() !== '' ? node?.title : node?.id;

  const {
    actions: { setFavouritedItems },
  } = useCatalogue();

  if (node.type === CATALOG) {
    const isExpanded = expandedNodes[node.id] ?? false;

    return (
      <li key={node.id} className="leaf">
        <button className="node" onClick={() => toggleExpand(node.id)}>
          {isExpanded ? <MdExpandLess /> : <MdExpandMore />} {label}
        </button>

        {isExpanded ? (
          <ul className="branch">
            {node.catalogs?.map((subCatalog) => (
              <TreeNode
                key={subCatalog.id}
                expandedNodes={expandedNodes}
                handleLeafClick={handleLeafClick}
                node={subCatalog}
                toggleExpand={toggleExpand}
              />
            ))}
            {node.collections?.map((collection) => {
              // Extract the thumbnail URL from the assets object
              const thumbnailUrl = '';

              return (
                <li key={collection.id}>
                  <ToolboxRow
                    key={collection.id}
                    dataPoints={parseCollectionDataPoints(collection)}
                    thumbnail={thumbnailUrl}
                    title={collection.title ? collection.title : collection.id}
                    onClick={async () => {
                      const favouritedItems = await fetchFavouritedItems(collection.id);
                      setFavouritedItems(collection.id, favouritedItems);
                      handleLeafClick(collection);
                    }}
                  />
                </li>
              );
            })}
          </ul>
        ) : null}
      </li>
    );
  }
};
