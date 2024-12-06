import React, { createContext, useEffect, useReducer, useState } from 'react';

import { Feature } from 'ol';
import { Polygon } from 'ol/geom';
import { fromLonLat } from 'ol/proj';

import { useFilters } from '@/hooks/useFilters';
import { useMap } from '@/hooks/useMap';
import { useToolbox } from '@/hooks/useToolbox';
import { getQueryParam, getViewFomURL } from '@/utils/urlHandler';

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
  const [filtersRead, setFiltersRead] = useState(false);
  const [collectionsRead, setCollectionsRead] = useState(false);

  const {
    actions: { setTemporalFilter },
  } = useFilters();
  const {
    actions: { setSelectedCollection, setActivePage },
  } = useToolbox();
  const { drawingSource, collections } = useMap();

  const setFilterSidebarOpen = (isOpen: boolean) => {
    dispatch({ type: 'SET_FILTER_SIDEBAR_OPEN', payload: isOpen });
  };

  const setActiveContent = (content: string) => {
    dispatch({ type: 'SET_ACTIVE_CONTENT', payload: content });
  };

  // Read in query params and set if they exist
  useEffect(() => {
    if (filtersRead) return;
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
    setTemporalFilter({
      temporal: { start: startDate, end: endDate },
      textQuery,
      aoi: aoi ? aoi : null,
      qualityAssurance: qa,
    });
    setFiltersRead(true);
  }, [drawingSource, filtersRead, setTemporalFilter]);

  useEffect(() => {
    if (collectionsRead) return;

    const viewStr = getViewFomURL();
    const viewMap = {
      map: 'map',
      list: 'dataCatalogue',
      qa: 'qa',
      dataset: 'dataset',
    };
    setActiveContent(viewMap[viewStr]);

    setCollectionsRead(true);
  }, [collections, collectionsRead, setActivePage, setSelectedCollection]);

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
