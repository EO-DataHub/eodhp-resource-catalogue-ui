import Draggable from 'react-draggable';
import { FaTable } from 'react-icons/fa6';
import { MapContainer } from 'react-leaflet';

import stacBrowserLogo from '@/assets/icons/stac-browser.png';
import { useApp } from '@/hooks/useApp';
import { useMapSettings } from '@/hooks/useMapSettings';

import Map from './components/Map';
import TimelineFilter from './components/TimelineFilter';
import Toolbox from './components/Toolbox';

// eslint-disable-next-line
import L from 'leaflet';

import 'leaflet/dist/leaflet.css';
import './styles.scss';

const MapViewer = () => {
  const { actions: AppActions } = useApp();
  const { setActiveContent } = AppActions;

  const { state } = useMapSettings();
  const { center } = state;
  return (
    <div className="map-viewer">
      <MapContainer center={center} zoom={13}>
        <Draggable defaultPosition={{ x: 150, y: 150 }}>
          <div className="draggable">
            <Toolbox />
          </div>
        </Draggable>
        <Map />
        <TimelineFilter />
      </MapContainer>

      <div className="table-view-icon" onClick={() => setActiveContent('dataCatalogue')}>
        <FaTable />
      </div>
      <div
        className="btn-stac-browser"
        onClick={() =>
          window.open(
            `${import.meta.env.VITE_STAC_BROWSER}/#/external/${import.meta.env.VITE_STAC_ENDPOINT}`,
            '_blank',
          )
        }
      >
        <img alt="STAC Browser" src={stacBrowserLogo} />
      </div>
    </div>
  );
};

export default MapViewer;
