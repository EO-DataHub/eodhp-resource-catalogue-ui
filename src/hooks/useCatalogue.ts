import { useContext } from 'react';

import { CatalogueContext } from '@/context/CatalogueContext';

export const useCatalogue = () => {
  const context = useContext(CatalogueContext);
  if (context === undefined) {
    throw new Error('useCatalogue must be used within a CatalogueProvider');
  }
  return context;
};
