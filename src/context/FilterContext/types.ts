import React from "react";

export interface FilterState {
  filterOptions: FilterData[];
  activeFilters: {
    textQuery: string;
  };
}

export type FilterAction =
  | { type: "SET_FILTER_OPTIONS"; payload: FilterData[] }
  | { type: "SET_ACTIVE_FILTERS"; payload: { textQuery: string } };

export interface FilterContextType {
  state: FilterState;
  actions: {
    setFilterOptions: (options: FilterData[]) => void;
    setActiveFilters: (filters: { textQuery: string }) => void;
  };
}
export interface FilterProviderProps {
  children: React.ReactNode;
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
}
