import React from 'react';

import { TbLayoutSidebarRightCollapseFilled } from 'react-icons/tb';

import FilterSidebar from '@/components/FilterSidebar';
import { useApp } from '@/hooks/useApp';
import DataCatalogue from '@/pages/DataCatalogue';
import MapViewer from '@/pages/MapViewer';

const App: React.FC = () => {
  const { state: AppState, actions: AppActions } = useApp();
  const { filterSidebarOpen, activeContent } = AppState;
  const { setFilterSidebarOpen } = AppActions;

  return (
    <div className="main">
      <div
        className={`left-sidebar-container ${filterSidebarOpen ? 'left-sidebar-container-open' : 'left-sidebar-container-closed'}`}
      >
        <FilterSidebar />
      </div>
      {!filterSidebarOpen && (
        <button
          className="filter-collapse-open unstyled-button"
          onClick={() => setFilterSidebarOpen(true)}
        >
          <TbLayoutSidebarRightCollapseFilled />
        </button>
      )}
      <div
        className={`main-content-container ${!filterSidebarOpen ? 'main-content-container-full' : ''}`}
      >
        {activeContent === 'dataCatalogue' && <DataCatalogue />}
        {activeContent === 'map' && <MapViewer />}
      </div>
    </div>
  );
};

export default App;
