export interface ToolboxItemProps {
  thumbnail: string;
  title: string;
  dataPoints?: DataPoint[];
  onClick: () => void;
}

export interface DataPoint {
  icon: React.FC;
  alt: string;
  text: string;
  tooltip: string;
}