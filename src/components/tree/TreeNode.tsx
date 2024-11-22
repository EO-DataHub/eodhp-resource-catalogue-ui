import { MdExpandLess, MdExpandMore, MdFolder, MdFolderOpen } from 'react-icons/md';

import { Collection } from '@/typings/stac';

import { CollectionItem } from './CollectionItem';

type TreeNodeProps = {
  node: TreeCatalog | Collection;
  toggleExpand: (node: TreeCatalog | Collection) => void;
  expandedNodes: { [key: string]: boolean };
  handleLeafClick: (node: Collection) => void;
};

const CATALOG = 'Catalog';

export const TreeNode = ({ node, toggleExpand, expandedNodes, handleLeafClick }: TreeNodeProps) => {
  const label = node?.title?.trim() !== '' ? node?.title : node?.id;

  if (node.type === CATALOG) {
    const isExpanded = expandedNodes[node.id] ?? false;

    return (
      <li key={node.id} className="leaf">
        <div
          className="node"
          role="button"
          tabIndex={0}
          onClick={() => toggleExpand(node)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              toggleExpand(node);
            }
          }}
        >
          <button className="expand-icon">
            {isExpanded ? <MdExpandLess /> : <MdExpandMore />}
          </button>
          <span className="node-icon">{isExpanded ? <MdFolderOpen /> : <MdFolder />}</span>
          <button className="node-label">{label}</button>
        </div>

        {isExpanded && (
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
            {node.collections?.map((collection) => (
              <CollectionItem
                key={collection.id}
                collection={collection}
                handleLeafClick={handleLeafClick}
              />
            ))}
          </ul>
        )}
      </li>
    );
  } else {
    return null;
  }
};
