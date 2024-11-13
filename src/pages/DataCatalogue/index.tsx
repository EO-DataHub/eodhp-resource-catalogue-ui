import React, { useEffect } from 'react';

import { setQueryParam } from '@/utils/urlHandler';

import DataCatalogueTable from './components/DataCatalogueTable';
import TopBar from './components/TopBar';

import './styles.scss';

const DataCatalogue = () => {
  // Set query params on mount / dismount
  useEffect(() => {
    setQueryParam('view', 'dataCatalogue');
    return () => {
      setQueryParam('view', 'map');
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
