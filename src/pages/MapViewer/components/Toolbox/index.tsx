import { useState } from 'react';

import { FaRegWindowMinimize } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';

import { TreeComponent } from '@/components/tree/TreeComponent';
import { useToolbox } from '@/hooks/useToolbox';

import { AssetsPanel } from './components/item-assets/AssetsPanel';
import { PurchaseFormPanel } from './components/purchases/PurchaseFormPanel';
import ToolboxCollections from './components/ToolboxCollections';
import ToolboxItems from './components/ToolboxItems';

import './styles.scss';

const CATALOG_URL = `${import.meta.env.VITE_STAC_ENDPOINT}/catalogs`;
const PUBLIC_CATALOG_URL = `${CATALOG_URL}/supported-datasets`;

const Toolbox: React.FC = () => {
  const [toolboxVisible, setToolboxVisible] = useState(true); // TODO: Move to context

  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const catalogPath = searchParams.get('catalogPath');

  const {
    state: { activePage },
  } = useToolbox();

  const renderContent = () => {
    switch (activePage) {
      case 'collections':
        return (
          <TreeComponent
            catalogUrl={catalogPath ? `${CATALOG_URL}/${catalogPath}` : PUBLIC_CATALOG_URL}
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
        <button className="minimize" onClick={() => setToolboxVisible((prev) => !prev)}>
          <FaRegWindowMinimize />
        </button>
      </div>

      {toolboxVisible ? <div className="toolbox__content">{renderContent()}</div> : null}
    </div>
  );
};

export default Toolbox;
