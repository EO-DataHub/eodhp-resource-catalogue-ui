import React from 'react';

import { GeoJSONGeometry } from 'ol/format/GeoJSON';

import { Temporal } from '@/typings/common';

export interface FilterState {
  filterOptions: FilterData[];
  activeFilters: FilterActiveFilters;
}

export type FilterAction =
  | { type: 'SET_FILTER_OPTIONS'; payload: FilterData[] }
  | { type: 'SET_ACTIVE_FILTERS'; payload: FilterActiveFilters };

export interface FilterContextType {
  state: FilterState;
  actions: {
    setFilterOptions: (options: FilterData[]) => void;
    setActiveFilters: (filters: FilterActiveFilters) => void;
    setTemporalStartFilter: (start: string) => void;
    setTemporalEndFilter: (end: string) => void;
    setAoiFilter: (geometry: GeoJSONGeometry) => void;
    setResultsPerPage: (resultsPerPage: number) => void;
    setResultsPage: (resultsPage: number) => void;
    resetFilters: () => void;
  };
}

export interface FilterProviderProps {
  children: React.ReactNode;
}

export interface FilterData {
  name: string;
  type: 'multi-select' | 'date-range' | 'text-input' | 'combobox';
  options?: FilterOption[] | ComboFilterOption[];
}

export interface FilterOption {
  id: number;
  name: string;
}

type ComboFilterOption = {
  value: 'pass' | 'partial' | 'fail' | 'none';
  label: string;
};

export interface FilterActiveFilters {
  textQuery: string;
  temporal: Temporal;
  aoi: GeoJSONGeometry;
  qualityAssurance?: string;
  resultsPerPage?: number;
  resultsPage?: number;
}
