import React, { useEffect } from 'react';

import { addViewToURL, setQueryParam } from '@/utils/urlHandler';

import DataCatalogueTable from './components/DataCatalogueTable';
import TopBar from './components/TopBar';

import './styles.scss';

const DataCatalogue = () => {
  // Set query params on mount / dismount
  useEffect(() => {
    addViewToURL('list');
    return () => {
      addViewToURL('map');
    };
  }, []);

  return (
    <div className="data-catalogue">
      <TopBar />
      <DataCatalogueTable />
    </div>
  );
};

export default DataCatalogue;
