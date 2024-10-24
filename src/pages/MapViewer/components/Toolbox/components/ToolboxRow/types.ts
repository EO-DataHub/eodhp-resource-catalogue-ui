import { ReactNode } from 'react';

export interface ToolboxItemProps {
  thumbnail: string;
  title: string;
  dataPoints?: DataPoint[];
  onClick: () => void;
  children?: ReactNode;
}

export interface DataPoint {
  icon: React.FC;
  alt: string;
  text: string;
  tooltip: string;
}
