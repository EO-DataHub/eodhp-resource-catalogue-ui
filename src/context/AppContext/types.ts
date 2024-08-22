import React from 'react';

export interface AppState {
  filterSidebarOpen: boolean;
  activeContent: string;
}

export type AppAction =
  | { type: 'SET_FILTER_SIDEBAR_OPEN'; payload: boolean }
  | { type: 'SET_ACTIVE_CONTENT'; payload: string };

export interface AppContextType {
  state: AppState;
  actions: {
    setFilterSidebarOpen: (isOpen: boolean) => void;
    setActiveContent: (content: string) => void;
  };
}

export interface AppProviderProps {
  children: React.ReactNode;
}
