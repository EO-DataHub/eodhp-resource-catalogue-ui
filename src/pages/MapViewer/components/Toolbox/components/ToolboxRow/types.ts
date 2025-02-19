import { ReactNode } from 'react';

export interface ToolboxItemProps {
  thumbnail: string;
  title: string;
  dataPoints?: DataPoint[];
  onClick: () => void;
  children?: ReactNode;
}

export interface DataPoint {
  id: string;
  icon: React.FC;
  alt: string;
  value: string | ReactNode;
  tooltip: string;
}
