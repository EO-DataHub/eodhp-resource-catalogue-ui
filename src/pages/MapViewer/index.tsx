import "./styles.scss";
import { MapContainer } from 'react-leaflet'
import Map from "./components/Map";
import 'leaflet/dist/leaflet.css'
import Draggable from 'react-draggable'
import Toolbox from "./components/Toolbox";
// eslint-disable-next-line
import L from 'leaflet'
import { useMapSettings } from "@/hooks/useMapSettings";

const MapViewer = () => {
  const { state } = useMapSettings();
  const { center } = state;
  return (
    <div className="map-viewer">
      <MapContainer center={center} zoom={13} >
        <Draggable
          defaultPosition={{ x: 0, y: 0 }}
        >
          <div className="draggable">
            <Toolbox />
          </div>
        </Draggable>
        <Map />
      </MapContainer>
    </div>
  );
};

export default MapViewer;
