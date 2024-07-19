import React, { createContext, useReducer } from "react";
import { FilterState, FilterAction, FilterContextType, FilterProviderProps } from "./types";
import { exampleFilterData } from "./placeholderData";

const initialState: FilterState = {
  filterOptions: exampleFilterData,
  activeFilters: {
    textQuery: "",
  }
};



const reducer = (state: FilterState, action: FilterAction): FilterState => {
  switch (action.type) {
    case "SET_FILTER_OPTIONS":
      return { ...state, filterOptions: action.payload };
    case "SET_ACTIVE_FILTERS":
      return { ...state, activeFilters: action.payload };
    default:
      return state;
  }
};

const FilterContext = createContext<FilterContextType>({
  state: initialState,
  actions: {
    setFilterOptions: () => { },
    setActiveFilters: () => { },
  },
});

const FilterProvider: React.FC<FilterProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setFilterOptions = (payload: any) => {
    dispatch({ type: "SET_FILTER_OPTIONS", payload });
  }

  const setActiveFilters = (payload: any) => {
    dispatch({ type: "SET_ACTIVE_FILTERS", payload });
  }

  const value = {
    state: {
      filterOptions: state.filterOptions,
      activeFilters: state.activeFilters
    },
    actions: {
      setFilterOptions,
      setActiveFilters,
    },
  };

  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
};

export { FilterContext, FilterProvider };
