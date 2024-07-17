import React from "react";

export interface FilterState {
  filterOptions: FilterData[];
  activeFilters: {
    textQuery: string;
  };
}

export interface FilterAction {
  type: string;
  payload?: any // eslint-disable-line @typescript-eslint/no-explicit-any
}

export interface FilterContextType {
  state: {
    headerTitle: string;
  };
  actions: {
    setHeaderTitle: (title: string) => void;
  };
}

export interface FilterProviderProps {
  children: React.ReactNode;
}

export interface FilterData {
  id: number;
  name: string;
  type: "multi-select" | "date-range";
  options?: FilterOption[];
}

export interface FilterOption {
  id: number;
  name: string;
}
