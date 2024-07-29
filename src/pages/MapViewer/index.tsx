import "./styles.scss";
import { MapContainer } from 'react-leaflet'
import Map from "./components/Map";
import 'leaflet/dist/leaflet.css'
import Draggable from 'react-draggable'
import Toolbox from "./components/Toolbox/Toolbox";

const MapViewer = () => {

  return (
    <div className="map-viewer">

      <Draggable  
        defaultPosition={{ x: 0, y: 0 }}
        onDrag={(e, ui) => {
          console.log(ui.x, ui.y)
        }}
        >
        <div className="draggable">
          <Toolbox />
        </div>
      </Draggable>

      <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false}>
        <Map />
      </MapContainer>

    </div>
  );
};

export default MapViewer;
