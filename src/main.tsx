import React from 'react';

import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { AppProvider } from '@/context/AppContext';
import { CatalogueProvider } from '@/context/CatalogueContext';
import { FilterProvider } from '@/context/FilterContext';
import { MapProvider } from '@/context/MapContext';
import { ToolboxProvider } from '@/context/ToolboxContext';

import App from './App';

import './index.scss';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AppProvider>
        <CatalogueProvider>
          <FilterProvider>
            <MapProvider>
              <ToolboxProvider>
                <App />
              </ToolboxProvider>
            </MapProvider>
          </FilterProvider>
        </CatalogueProvider>
      </AppProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
