import React, { createContext, useReducer } from 'react';

import { GeoJSONGeometry } from 'ol/format/GeoJSON';
import { useNavigate } from 'react-router-dom';

import { exampleFilterData } from './placeholderData';
import {
  FilterAction,
  FilterActiveFilters,
  FilterContextType,
  FilterData,
  FilterProviderProps,
  FilterState,
} from './types';

const initialState: FilterState = {
  filterOptions: exampleFilterData,
  activeFilters: {
    textQuery: '',
    temporal: {
      start: '',
      end: '',
    },
    aoi: null,
    qualityAssurance: null,
  },
};

const reducer = (state: FilterState, action: FilterAction): FilterState => {
  switch (action.type) {
    case 'SET_FILTER_OPTIONS':
      return { ...state, filterOptions: action.payload };
    case 'SET_ACTIVE_FILTERS':
      return { ...state, activeFilters: action.payload };
    default:
      return state;
  }
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

const FilterProvider: React.FC<FilterProviderProps> = ({ children }) => {
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(reducer, initialState);

  const setFilterOptions = (payload: FilterData[]) => {
    dispatch({ type: 'SET_FILTER_OPTIONS', payload });
  };

  const setActiveFilters = (payload: FilterActiveFilters) => {
    dispatch({ type: 'SET_ACTIVE_FILTERS', payload });
  };

  const setTemporalStartFilter = (end: string) => {
    setActiveFilters({
      ...state.activeFilters,
      temporal: {
        ...state.activeFilters.temporal,
        start: end,
      },
    });
  };

  const setTemporalEndFilter = (end: string) => {
    setActiveFilters({
      ...state.activeFilters,
      temporal: {
        ...state.activeFilters.temporal,
        end: end,
      },
    });
  };

  const setAoiFilter = (geometry: GeoJSONGeometry) => {
    setActiveFilters({
      ...state.activeFilters,
      aoi: geometry,
    });
  };

  const resetFilters = () =>
    setActiveFilters({
      textQuery: '',
      temporal: {
        start: '',
        end: '',
      },
      aoi: null,
    });

  const addURLParam = (name: string, value: string) => {
    const queryParams = new URLSearchParams(window.location.search);
    queryParams.set(name, value);
    navigate(`?${queryParams.toString()}`, { replace: true });
  };

  const value = {
    state: {
      filterOptions: state.filterOptions,
      activeFilters: state.activeFilters,
    },
    actions: {
      setFilterOptions,
      setActiveFilters,
      setTemporalStartFilter,
      setTemporalEndFilter,
      setAoiFilter,
      resetFilters,
      addURLParam,
    },
  };

  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
};

export { FilterContext, FilterProvider };
