import { useContext } from 'react';

import { MapContext } from '@/context/MapContext';

export const useMap = () => {
  const context = useContext(MapContext);

  if (!context) {
    throw Error('The component needs to be wrapped in a <MapProvider /> component.');
  }

  return context;
};
