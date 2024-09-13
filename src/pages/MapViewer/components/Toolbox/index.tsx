import { Suspense, lazy, useState } from 'react';

import { FaRegWindowMinimize } from 'react-icons/fa';

import { useToolbox } from '@/hooks/useToolbox';

import { AssetsPanel } from './components/item-assets/AssetsPanel';
// import { PurchaseFormPanel } from './components/purchases/PurchaseFormPanel';
import ToolboxCollections from './components/ToolboxCollections';
import ToolboxItems from './components/ToolboxItems';

import './styles.scss';

const PurchaseFormPanel = lazy(() =>
  import('./components/purchases/PurchaseFormPanel').then((module) => ({
    default: module.PurchaseFormPanel,
  })),
);

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
      case 'assets':
        return <AssetsPanel />;
      case 'purchase':
        return (
          <Suspense>
            <PurchaseFormPanel />
          </Suspense>
        );
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
