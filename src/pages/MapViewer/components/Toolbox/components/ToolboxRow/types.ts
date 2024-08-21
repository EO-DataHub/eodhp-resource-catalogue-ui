export interface ToolboxItemProps {
  thumbnail: string;
  title: string;
  dataPoints?: DataPoint[];
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export interface DataPoint {
  icon: React.FC;
  alt: string;
  text: string;
  tooltip: string;
}