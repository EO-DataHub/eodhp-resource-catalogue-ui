import React from "react";

export interface FilterState {
  filterOptions: FilterData[];
  activeFilters: FilterActiveFilters;
}

export type FilterAction =
  | { type: "SET_FILTER_OPTIONS"; payload: FilterData[] }
  | { type: "SET_ACTIVE_FILTERS"; payload: FilterActiveFilters };

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

interface Bounds {
  west: number;
  south: number;
  east: number;
  north: number;
}

interface Temporal {
  start: string;
  end: string;
}

export interface FilterData {
  id: number;
  name: string;
  type: "multi-select" | "date-range" | "text-input";
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
