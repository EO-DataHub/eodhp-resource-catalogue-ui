import React from "react";

export interface AppState {
  headerTitle: string;
}

export interface AppAction {
  type: string;
  payload?: any // eslint-disable-line @typescript-eslint/no-explicit-any
}

export interface AppContextType {
  state: {
    headerTitle: string;
  };
  actions: {
    setHeaderTitle: (title: string) => void;
  };
}

export interface AppProviderProps {
  children: React.ReactNode;
}
