import React, { createContext, useReducer } from "react";
import { FilterState, FilterAction, FilterContextType, FilterProviderProps, FilterData } from "./types";
import { exampleFilterData } from "./placeholderData";

const initialState: FilterState = {
  headerTitle: "EODHP DataHub",
  filterOptions: exampleFilterData,
};

interface FilterState {
  headerTitle: string;
  filterOptions: FilterData[];
}

const reducer = (state: FilterState, action: FilterAction): FilterState => {
  switch (action.type) {
    case "SET_HEADER_TITLE":
      return { ...state, headerTitle: action.payload };
    case "SET_FILTER_OPTIONS":
      return { ...state, filterOptions: action.payload };
    default:
      return state;
  }
};

interface FilterContextType {
  state: {
    headerTitle: string;
  };
  actions: {
    setHeaderTitle: (title: string) => void;
    setFilterOptions: (options: any) => void;
  };
}

const FilterContext = createContext<FilterContextType>({
  state: initialState,
  actions: {
    setHeaderTitle: () => {},
    setFilterOptions: () => {},
  },
});

const FilterProvider: React.FC<FilterProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setHeaderTitle = (payload: string) => {
    dispatch({ type: "SET_HEADER_TITLE", payload });
  };

  const setFilterOptions = (payload: any) => {
    dispatch({ type: "SET_FILTER_OPTIONS", payload });
  }

  const value = {
    state: {
      headerTitle: state.headerTitle,
      filterOptions: state.filterOptions,
    },
    actions: {
      setHeaderTitle,
      setFilterOptions,
    },
  };

  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
};

export { FilterContext, FilterProvider };
