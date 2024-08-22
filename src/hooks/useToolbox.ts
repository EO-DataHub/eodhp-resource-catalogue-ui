import { useContext } from 'react';

import { ToolboxContext } from '@/context/ToolboxContext';

export const useToolbox = () => {
  const context = useContext(ToolboxContext);
  if (context === undefined) {
    throw new Error('useApp must be used within a AppProvider');
  }
  return context;
};
