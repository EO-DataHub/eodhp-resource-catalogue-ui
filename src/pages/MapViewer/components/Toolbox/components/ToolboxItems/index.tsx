import ResponsivePagination from 'react-responsive-pagination';

import { useFilters } from '@/hooks/useFilters';
import { useToolbox } from '@/hooks/useToolbox';
import { StacItem } from '@/typings/stac';

import ToolboxItem from './ToolboxItem';
import { ToolboxItemSkeleton } from './ToolboxItemSkeleton';

import './styles.scss';
import 'react-responsive-pagination/themes/classic.css';

const ToolboxItems = () => {
  const {
    state: { selectedCollection, selectedCollectionItems, isCollectionItemsPending },
    actions: { setActivePage, returnResultsPage },
  } = useToolbox();

  // console.log('Selected Collection', selectedCollection);
  // console.log('Selected Collection Items', selectedCollectionItems);

  const {
    state: { activeFilters },
    actions: { setResultsPage },
  } = useFilters();

  if (isCollectionItemsPending) {
    return <ToolboxItemSkeleton />;
  }

  const returnTotalPages = () => {
    if (selectedCollectionItems?.context) {
      return Math.ceil(selectedCollectionItems.context.matched / activeFilters.resultsPerPage);
    }
    return 0;
  };

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
        {!isCollectionItemsPending && selectedCollectionItems?.features?.length > 0 ? (
          <div className="toolbox__header-title">
            {selectedCollection.title ? selectedCollection.title : selectedCollection.id}
          </div>
        ) : (
          <div className="toolbox__header-error">
            {`No items found for ${selectedCollection.title ? selectedCollection.title : selectedCollection.id} that match the current filters`}
          </div>
        )}
        <ResponsivePagination
          current={activeFilters.resultsPage}
          total={returnTotalPages()}
          onPageChange={(e) => {
            setResultsPage(e);
          }}
        />
      </div>

      <div className="toolbox__items">
        {returnResultsPage().map((item: StacItem) => {
          return <ToolboxItem key={item.id} item={item} />;
        })}
      </div>
    </div>
  );
};

export default ToolboxItems;
