export interface AppState {
  headerTitle: string;
}

export interface AppAction {
  type: string;
  payload?: any;
}

export interface AppContextType {
  state: AppState;
  setHeaderTitle: (title: string) => void;
}

export interface AppProviderProps {
  children: React.ReactNode;
}
