import { TileLayer, useMapEvents } from "react-leaflet";
import { useDebounce } from "react-use";
import { useState } from "react";
import { useFilters } from "@/hooks/useFilters";

const Map = () => {
  const map = useMapEvents({});
  const [position, setPosition] = useState(map.getCenter());

  const {
    actions: { setBoundsFilter },
  } = useFilters();

  useDebounce(
    () => {
      const bounds = map.getBounds();
      setBoundsFilter(
        bounds.getWest(),
        bounds.getSouth(),
        bounds.getEast(),
        bounds.getNorth()
      );
    },
    300,
    [position]
  );

  map.on("moveend", () => {
    setPosition(map.getCenter());
  });

  return (
    <div>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
    </div>
  );
};

export default Map;
