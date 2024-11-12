import { useToolbox } from '@/hooks/useToolbox';
import { StacItem } from '@/typings/stac';

import ToolboxItem from './ToolboxItem';
import { ToolboxItemSkeleton } from './ToolboxItemSkeleton';

import './styles.scss';

const ToolboxItems = () => {
  const {
    state: { selectedCollection, selectedCollectionItems, isCollectionItemsPending },
    actions: { setActivePage },
  } = useToolbox();

  if (isCollectionItemsPending) {
    return <ToolboxItemSkeleton />;
  }

  return (
    <div className="toolbox-content-container">
      {/* This header could be its own component, can't see where it would be used though */}
      <div className="toolbox__header">
        <button
          className="toolbox__header-back"
          onClick={() => {
            setActivePage('collections');
          }}
        >
          <span>&lt; Return to Collections</span>
        </button>
        <div className="toolbox__header-title">
          {selectedCollection.title ? selectedCollection.title : selectedCollection.id}
        </div>
      </div>

      <div className="toolbox__items">
        {selectedCollectionItems?.features?.map((item: StacItem) => {
          return <ToolboxItem item={item}/>;
        })}
      </div>
    </div>
  );
};

export default ToolboxItems;
