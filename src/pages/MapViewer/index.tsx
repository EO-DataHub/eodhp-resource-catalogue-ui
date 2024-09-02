import type { Feature, Map } from 'ol'; // Import Map type
import { Geometry } from 'ol/geom';
import { Draw, Interaction, Snap } from 'ol/interaction';
import { createBox } from 'ol/interaction/Draw';
import { transformExtent } from 'ol/proj';
import VectorSource from 'ol/source/Vector';
import Draggable from 'react-draggable';
import { FaTable } from 'react-icons/fa6';

import stacBrowserLogo from '@/assets/icons/stac-browser.png';
import { DATA_PROJECTION, MAP_PROJECTION, MapComponent } from '@/components/Map';
import { DrawingTools } from '@/components/map/DrawingTools';
import { useApp } from '@/hooks/useApp';
import { useFilters } from '@/hooks/useFilters';
import { useMap } from '@/hooks/useMap';

import TimelineFilter from './components/TimelineFilter';
import Toolbox from './components/Toolbox';

import './styles.scss';

const MapViewer = () => {
  const { actions: AppActions } = useApp();
  const { setActiveContent } = AppActions;

  const { map } = useMap();

  const {
    actions: { setBoundsFilter },
  } = useFilters();

  const drawRectangle = (drawingSource: VectorSource<Feature<Geometry>>) => {
    if (drawingSource) {
      drawingSource?.clear();

      const drawObj = new Draw({
        source: drawingSource,
        type: 'Circle',
        geometryFunction: createBox(),
      });

      map?.addInteraction(drawObj);

      const snapObj = new Snap({
        source: drawingSource,
      });
      map?.addInteraction(snapObj);

      drawObj?.on('drawend', (event) => {
        const feature = event.feature;

        const extent = feature.getGeometry()?.getExtent();
        const transformedExtent = transformExtent(extent, MAP_PROJECTION, DATA_PROJECTION);
        if (transformedExtent) {
          const bounds = {
            west: transformedExtent[0],
            south: transformedExtent[1],
            east: transformedExtent[2],
            north: transformedExtent[3],
          };
          setBoundsFilter(bounds);
        }

        map?.removeInteraction(drawObj as Interaction);
        map?.removeInteraction(snapObj as Interaction);
      });
    }
  };

  return (
    <div className="map-viewer">
      <MapComponent>
        <Draggable defaultPosition={{ x: 150, y: 150 }}>
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

      <DrawingTools drawRectangle={drawRectangle} map={map as Map} />
    </div>
  );
};

export default MapViewer;
