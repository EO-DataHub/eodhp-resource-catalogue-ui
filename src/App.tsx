import { Navigate, Route, Routes } from "react-router-dom";

import MapViewer from "./pages/MapViewer";
import DataCatalogue from "./pages/DataCatalogue";
import React from "react";
import FilterSidebar from "./components/FilterSidebar";

const App: React.FC = () => {
  return (
    <>
      <div className="main">
        <div className="left-sidebar-container">
          <FilterSidebar />
        </div>

        <div className="main-content-container">
          <DataCatalogue />
        </div>
      </div>
    </>
  );
};

export default App;
