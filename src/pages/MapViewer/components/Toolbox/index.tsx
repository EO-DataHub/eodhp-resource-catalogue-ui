import { useState } from 'react';

import { FaRegWindowMinimize } from 'react-icons/fa';

import { useToolbox } from '@/hooks/useToolbox';

import { AssetsPanel } from './components/item-assets/AssetsPanel';
import { PurchaseFormPanel } from './components/purchases/PurchaseFormPanel';
import ToolboxCollections from './components/ToolboxCollections';
import ToolboxItems from './components/ToolboxItems';

import './styles.scss';

const Toolbox: React.FC = () => {
  const [toolboxVisible, setToolboxVisible] = useState(true); // TODO: Move to context

  const {
    state: { activePage },
  } = useToolbox();

  const renderContent = () => {
    switch (activePage) {
      case 'collections':
        return <ToolboxCollections />;
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
