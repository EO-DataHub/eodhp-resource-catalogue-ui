import { Navigate, Route, Routes } from "react-router-dom";
import { useState } from "react";
import MapViewer from "./pages/MapViewer";
import DataCatalogue from "./pages/DataCatalogue";
import React from "react";
import FilterSidebar from "./components/FilterSidebar";
import { TbLayoutSidebarRightCollapseFilled } from "react-icons/tb";

const App: React.FC = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(true);
  return (
    <>
      <div className="main">

        <div className={`left-sidebar-container ${isFilterOpen ? "left-sidebar-container-open" : "left-sidebar-container-closed"}`}>
          <FilterSidebar
            isFilterOpen={isFilterOpen}
            setIsFilterOpen={setIsFilterOpen}
          />
        </div>
        {
          !isFilterOpen && (
            <div className="filter-collapse-open"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <TbLayoutSidebarRightCollapseFilled />
            </div>
          )
        }


        <div className="main-content-container">
          <DataCatalogue />
        </div>
      </div>
    </>
  );
};

export default App;
