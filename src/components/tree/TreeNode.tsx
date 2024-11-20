import {
  MdExpandLess,
  MdExpandMore,
  MdFolder,
  MdFolderOpen,
  MdInsertDriveFile,
} from 'react-icons/md';

import { TreeCatalog } from '@/pages/MapViewer/components/Toolbox';
import { Collection } from '@/typings/stac';

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
    if (!node.catalogs?.length && !node.collections?.length) return null;

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
            {node.collections?.map((collection) => (
              <li key={collection.id} className="leaf">
                <div
                  className="collection-item"
                  role="button"
                  tabIndex={0}
                  onClick={async () => {
                    handleLeafClick(collection);
                  }}
                  onKeyPress={async (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleLeafClick(collection);
                    }
                  }}
                >
                  <span className="collection-icon">
                    <MdInsertDriveFile />
                  </span>
                  <span className="collection-label">
                    {collection.title ? collection.title : collection.id}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        ) : null}
      </li>
    );
  }
};
