export {};

declare global {
  type MapConfig = {
    center: number[];
    zoom: number;
  };

  type Layer = {
    name: string;
    title: string;
  };
}
