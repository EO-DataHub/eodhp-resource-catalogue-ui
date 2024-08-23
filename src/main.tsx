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

const enableMocking = async () => {
  if (process.env.NODE_ENV !== 'development') {
    return;
  }

  const { worker } = await import('@/mocks/browser');

  // `worker.start()` returns a Promise that resolves
  // once the Service Worker is up and ready to intercept requests.
  return worker.start({
    serviceWorker: {
      url: '/static-apps/resource-catalogue/main/mockServiceWorker.js',
    },
  });
};

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

const root = ReactDOM.createRoot(rootElement);

enableMocking().then(() => {
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
});
