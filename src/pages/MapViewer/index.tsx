import { useRef } from 'react';

import Draggable from 'react-draggable';
import { FaTable } from 'react-icons/fa6';
import { VscPreview } from 'react-icons/vsc';
import { useLocation } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';

import stacBrowserLogo from '@/assets/icons/stac-browser.png';
import { MapComponent } from '@/components/Map';
import { DrawingTools } from '@/components/map/draw-tools/DrawingTools';
import { useApp } from '@/hooks/useApp';
import { setQueryParam } from '@/utils/urlHandler';

import TimelineFilter from './components/TimelineFilter';
import Toolbox from './components/Toolbox';

import './styles.scss';

const MapViewer = () => {
  const nodeRef = useRef(null);
  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const catalogPath = searchParams.get('catalogPath');

  const { actions: AppActions } = useApp();
  const { setActiveContent } = AppActions;

  const stacBrowserUrl = `https://${window.location.host}/static-apps/stac-browser/main/index.html#/${import.meta.env.VITE_STAC_ENDPOINT}/${catalogPath ? 'catalogs/' + catalogPath : ''}`;

  return (
    <div className="map-viewer">
      <MapComponent>
        <Tooltip id="map-buttons" />

        <Draggable defaultPosition={{ x: 150, y: 150 }} handle=".handle" nodeRef={nodeRef}>
          <div ref={nodeRef} className="draggable">
            <Toolbox />
          </div>
        </Draggable>
        <TimelineFilter />
      </MapComponent>

      <div className="horizontal">
        <button
          aria-label="STAC Browser"
          className="btn-stac-browser unstyled-button"
          data-tooltip-content="Open in STAC Browser"
          data-tooltip-id="map-buttons"
          onClick={() => window.open(stacBrowserUrl, '_blank')}
        >
          <img alt="STAC Browser" src={stacBrowserLogo} />
        </button>
      </div>

      <div className="vertical">
        <button
          aria-label="Data Catalogue"
          data-tooltip-content="View Data Catalogue"
          data-tooltip-id="map-buttons"
          onClick={() => {
            setActiveContent('dataCatalogue');
          }}
        >
          <FaTable />
        </button>
        <button
          aria-label="QA Panel"
          data-tooltip-content="View Q&A"
          data-tooltip-id="map-buttons"
          onClick={() => setActiveContent('qa')}
        >
          <VscPreview />
        </button>
      </div>

      <DrawingTools />
    </div>
  );
};

export default MapViewer;
