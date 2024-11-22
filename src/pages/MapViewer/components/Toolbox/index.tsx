import { useEffect, useState } from 'react';

import { FaRegWindowMinimize } from 'react-icons/fa';

import { Tree } from '@/components/tree/Tree';
import { useToolbox } from '@/hooks/useToolbox';
import { useTreeData } from '@/hooks/useTreeData';
import { fetchData, fetchPathPartsFromUrl } from '@/utils/genericUtils';

import { AssetsPanel } from './components/item-assets/AssetsPanel';
import { PurchaseFormPanel } from './components/purchases/PurchaseFormPanel';
import ToolboxCollections from './components/ToolboxCollections';
import ToolboxItems from './components/ToolboxItems';

import './styles.scss';

const Toolbox = () => {
  const [toolboxVisible, setToolboxVisible] = useState(true);
  const [expandedNodes, setExpandedNodes] = useState<{ [key: string]: boolean }>({});

  const treeData = useTreeData();

  const {
    state: { activePage },
    actions: { setActivePage, setSelectedCollection },
  } = useToolbox();

  useEffect(() => {
    const fetchFromPath = async () => {
      const catalogPathParts = fetchPathPartsFromUrl();

      if (catalogPathParts[catalogPathParts.length - 2] === 'collections') {
        const collection = await fetchData(
          `${import.meta.env.VITE_STAC_ENDPOINT}/catalogs/${catalogPathParts.join('/')}`,
        );
        setSelectedCollection(collection);
        setActivePage('items');
      }
    };

    fetchFromPath();
  }, [setSelectedCollection, setActivePage]);

  const renderContent = () => {
    switch (activePage) {
      case 'collections':
        return (
          <Tree
            expandedNodes={expandedNodes}
            setExpandedNodes={setExpandedNodes}
            treeData={treeData}
          />
        );
      case 'items':
        return <ToolboxItems />;
      case 'purchase':
        return <PurchaseFormPanel />;
      case 'assets':
        return <AssetsPanel />;
      default:
        return <ToolboxCollections />;
    }
  };

  return (
    <div className={`toolbox`} id="toolbox">
      <div className="handle toolbox__window-actions">
        <button
          aria-label="minimize toolbox dialog"
          className="minimize"
          onClick={() => setToolboxVisible((prev) => !prev)}
        >
          <FaRegWindowMinimize />
        </button>
      </div>

      {toolboxVisible && <div className="toolbox__content">{renderContent()}</div>}
    </div>
  );
};

export default Toolbox;
