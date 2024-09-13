import Draggable from 'react-draggable';
import { FaTable } from 'react-icons/fa6';

import stacBrowserLogo from '@/assets/icons/stac-browser.png';
import { MapComponent } from '@/components/Map';
import { DrawingTools } from '@/components/map/draw-tools/DrawingTools';
import { useApp } from '@/hooks/useApp';

import TimelineFilter from './components/TimelineFilter';
import Toolbox from './components/Toolbox';

import './styles.scss';

const MapViewer = () => {
  const { actions: AppActions } = useApp();
  const { setActiveContent } = AppActions;

  return (
    <div className="map-viewer">
      <MapComponent>
        <Draggable defaultPosition={{ x: 150, y: 150 }} handle=".handle">
          <div className="draggable">
            <Toolbox />
          </div>
        </Draggable>
        <TimelineFilter />
      </MapComponent>

      <button
        aria-label="Data Catalogue"
        className="table-view-icon"
        onClick={() => setActiveContent('dataCatalogue')}
      >
        <FaTable />
      </button>
      <button
        aria-label="STAC Browser"
        className="btn-stac-browser unstyled-button"
        onClick={() =>
          window.open(
            `${import.meta.env.VITE_STAC_BROWSER}/#/external/${import.meta.env.VITE_STAC_ENDPOINT}`,
            '_blank',
          )
        }
      >
        <img alt="STAC Browser" src={stacBrowserLogo} />
      </button>

      <DrawingTools />
    </div>
  );
};

export default MapViewer;
