import React, { createContext, useReducer } from "react";
import { AppState, AppAction, AppContextType, AppProviderProps } from "./types";

const initialState: AppState = {
  headerTitle: "EODHP DataHub",
};

const reducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case "SET_HEADER_TITLE":
      return { ...state, headerTitle: action.payload };
    default:
      return state;
  }
};

const AppContext = createContext<AppContextType>({
  state: initialState,
  actions: {
    setHeaderTitle: () => {},
  },
});

const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setHeaderTitle = (payload: string) => {
    dispatch({ type: "SET_HEADER_TITLE", payload });
  };

  const value = {
    state: {
      headerTitle: state.headerTitle,
    },
    actions: {
      setHeaderTitle,
    },
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export { AppContext, AppProvider };
