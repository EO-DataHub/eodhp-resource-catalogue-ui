import React, { createContext, useReducer } from 'react';

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

  const setFilterSidebarOpen = (isOpen: boolean) => {
    dispatch({ type: 'SET_FILTER_SIDEBAR_OPEN', payload: isOpen });
  };

  const setActiveContent = (content: string) => {
    dispatch({ type: 'SET_ACTIVE_CONTENT', payload: content });
  };

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
