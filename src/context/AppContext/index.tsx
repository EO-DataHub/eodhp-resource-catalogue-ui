import React, { createContext, useEffect, useReducer, useState } from 'react';

import { Feature } from 'ol';
import { Polygon } from 'ol/geom';
import { fromLonLat } from 'ol/proj';

import { useFilters } from '@/hooks/useFilters';
import { useMap } from '@/hooks/useMap';
import { getQueryParam } from '@/utils/urlHandler';

import { AppAction, AppContextType, AppProviderProps, AppState } from './types';

const initialState: AppState = {
  filterSidebarOpen: true,
  activeContent: 'map',
};

const reducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_FILTER_SIDEBAR_OPEN':
      return { ...state, filterSidebarOpen: action.payload };
    case 'SET_ACTIVE_CONTENT':
      return { ...state, activeContent: action.payload };
    default:
      return state;
  }
};

const AppContext = createContext<AppContextType | undefined>(undefined);

const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [urlRead, setUrlRead] = useState(false);

  const { actions } = useFilters();
  const { drawingSource } = useMap();

  const setFilterSidebarOpen = (isOpen: boolean) => {
    dispatch({ type: 'SET_FILTER_SIDEBAR_OPEN', payload: isOpen });
  };

  const setActiveContent = (content: string) => {
    dispatch({ type: 'SET_ACTIVE_CONTENT', payload: content });
  };

  // Read in query params and set if they exist
  useEffect(() => {
    if (urlRead) return;
    if (!drawingSource) return;
    const startDate = getQueryParam('startDate') || null;
    const endDate = getQueryParam('endDate') || null;
    const textQuery = getQueryParam('filterText') || '';
    const qa = getQueryParam('qaFilter') || '';
    const aoiCoordinatesStr = getQueryParam('aoi') || '';
    let aoi;
    if (aoiCoordinatesStr) {
      const floatArray = aoiCoordinatesStr.split(',').map(parseFloat);
      const coords = [];
      for (let i = 0; i < floatArray.length; i += 2) {
        coords.push(floatArray.slice(i, i + 2));
      }
      aoi = { coordinates: [coords], type: 'Polygon' };
      const transformedCoords = coords.map((coord) => fromLonLat(coord));
      const polygon = new Polygon([transformedCoords]);
      const feature = new Feature({ geometry: polygon });
      drawingSource.addFeature(feature);
    }
    actions.setTemporalFilter({
      temporal: { start: startDate, end: endDate },
      textQuery,
      aoi: aoi ? aoi : null,
      qualityAssurance: qa,
    });

    // Set view to map / dataCatalogue / qa
    const view = getQueryParam('view');
    setActiveContent(view);

    setUrlRead(true);
  }, [drawingSource, actions, urlRead]);

  const value = {
    state,
    actions: {
      setFilterSidebarOpen,
      setActiveContent,
    },
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export { AppContext, AppProvider };
