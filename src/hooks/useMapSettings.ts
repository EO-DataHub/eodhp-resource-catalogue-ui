import { useContext } from 'react';

import { MapContext } from '@/context/MapContext';

export const useMapSettings = () => {
  const context = useContext(MapContext);
  if (context === undefined) {
    throw new Error('useMap must be used within a MapProvider');
  }
  return context;
};
