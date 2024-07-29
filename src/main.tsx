import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import { BrowserRouter } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { FilterProvider } from "./context/FilterContext";
import App from "./App";
import { CatalogueProvider } from "./context/CatalogueContext";
import { MapProvider } from "./context/MapContext";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error('Failed to find the root element');

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AppProvider>
        <CatalogueProvider>
          <FilterProvider>
            <MapProvider>
              <App />
            </MapProvider>
          </FilterProvider>
        </CatalogueProvider>
      </AppProvider>
    </BrowserRouter>
  </React.StrictMode>
);
