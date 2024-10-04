import React from 'react';

import { TbLayoutSidebarRightCollapseFilled } from 'react-icons/tb';

import { Axe } from '@/components/Axe';
import FilterSidebar from '@/components/FilterSidebar';
import { useApp } from '@/hooks/useApp';
import DataCatalogue from '@/pages/DataCatalogue';
import MapViewer from '@/pages/MapViewer';
import { QAPanel } from '@/pages/q-and-a/QAPanel';

const App: React.FC = () => {
  const { state: AppState, actions: AppActions } = useApp();
  const { filterSidebarOpen, activeContent } = AppState;
  const { setFilterSidebarOpen } = AppActions;

  return (
    <main className="main">
      <Axe />

      <h1 className="offscreen">Map Catalogue</h1>

      <div
        className={`left-sidebar-container ${filterSidebarOpen ? 'left-sidebar-container-open' : 'left-sidebar-container-closed'}`}
      >
        <FilterSidebar />
      </div>
      {!filterSidebarOpen && (
        <button
          aria-label="Collapse Sidebar Open"
          className="filter-collapse-open unstyled-button"
          onClick={() => setFilterSidebarOpen(true)}
        >
          <TbLayoutSidebarRightCollapseFilled />
        </button>
      )}
      <div
        className={`main-content-container ${!filterSidebarOpen ? 'main-content-container-full' : ''}`}
      >
        {activeContent === 'dataCatalogue' ? <DataCatalogue /> : null}
        {activeContent === 'map' ? <MapViewer /> : null}
        {activeContent === 'qa' ? <QAPanel /> : null}
      </div>
    </main>
  );
};

export default App;
