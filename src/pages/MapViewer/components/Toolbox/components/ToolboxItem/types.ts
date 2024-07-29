export interface ToolboxItemProps {
  thumbnail: string;
  title: string;
  dataPoints: DataPoint[];
}

export interface DataPoint {
  icon: React.FC;
  alt: string;
  text: string;
}