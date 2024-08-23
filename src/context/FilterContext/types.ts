import React from 'react';

import { Bounds, Temporal } from '@/typings/common';

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
    setBoundsFilter: (Bounds: Bounds) => void;
    resetFilters: () => void;
  };
}

export interface FilterProviderProps {
  children: React.ReactNode;
}

export interface FilterData {
  name: string;
  type: 'multi-select' | 'date-range' | 'text-input';
  options?: FilterOption[];
}

export interface FilterOption {
  id: number;
  name: string;
}

export interface FilterActiveFilters {
  textQuery: string;
  temporal: Temporal;
  bounds: Bounds;
}
