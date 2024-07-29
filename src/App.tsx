import DataCatalogue from "./pages/DataCatalogue";
import MapViewer from "./pages/MapViewer";
import React from "react";
import FilterSidebar from "./components/FilterSidebar";
import { TbLayoutSidebarRightCollapseFilled } from "react-icons/tb";
import { useApp } from "@/hooks/useApp";

const App: React.FC = () => {
  const { state: AppState, actions: AppActions } = useApp();
  const { filterSidebarOpen, activeContent } = AppState;
  const { setFilterSidebarOpen } = AppActions;

  return (
    <div className="main">
      <div className={`left-sidebar-container ${filterSidebarOpen ? "left-sidebar-container-open" : "left-sidebar-container-closed"}`}>
        <FilterSidebar />
      </div>
      {
        !filterSidebarOpen && (
          <div className="filter-collapse-open"
            onClick={() => setFilterSidebarOpen(true)}
          >
            <TbLayoutSidebarRightCollapseFilled />
          </div>
        )
      }
      <div className={`main-content-container ${!filterSidebarOpen ? "main-content-container-full" : ""}`}>
        {activeContent === "dataCatalogue" && <DataCatalogue />}
        {activeContent === "map" && <MapViewer />}
      </div>
    </div>
  );
};

export default App;
