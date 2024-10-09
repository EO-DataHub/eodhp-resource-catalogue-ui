import { ReactNode, useEffect } from 'react';

import { Map, View } from 'ol';
import { ScaleLine, defaults as defaultControls } from 'ol/control';
// import { Control, ScaleLine, defaults as defaultControls } from 'ol/control';
import { Tile as TileLayer } from 'ol/layer';
import { fromLonLat } from 'ol/proj';
import { OSM } from 'ol/source';
import { Tooltip } from 'react-tooltip';

import { useMap } from '@/hooks/useMap';

import 'ol/ol.css';

export const MAP_PROJECTION = 'EPSG:3857';
export const DATA_PROJECTION = 'EPSG:4326';

type MapComponentProps = {
  children: ReactNode;
};

/**
 * This component  manages the main map, this is where the basemap layers
 * and basic controls are added to the map. The map component encapsulates
 * a number of child components, used to interact with the map itself.
 *
 * @return {*}
 */
export const MapComponent = ({ children }: MapComponentProps) => {
  const {
    mapRef,
    mapConfig: { center, zoom },
    setMap,
  } = useMap();

  useEffect(() => {
    const osmLayer = new TileLayer({
      preload: Infinity,
      source: new OSM(),
    });
    osmLayer.set('name', 'OSM');
    osmLayer.set('basemap', true);

    const layers = [osmLayer];

    const scaleLine = new ScaleLine({
      units: 'metric',
    });

    const map = new Map({
      target: 'map',
      controls: defaultControls().extend([scaleLine]),
      layers,
      view: new View({
        projection: MAP_PROJECTION,
        center: fromLonLat(center),
        zoom,
      }),
    });

    setMap(map);

    const attachTooltips = () => {
      const zoomInButton = document.querySelector('.ol-zoom-in');
      const zoomOutButton = document.querySelector('.ol-zoom-out');

      if (zoomInButton) {
        // Remove default title, so we don't get duplicate tooltips.
        zoomInButton.removeAttribute('title');

        zoomInButton.setAttribute('data-tooltip-content', 'Zoom In');
      }

      if (zoomOutButton) {
        // Remove default title, so we don't get duplicate tooltips.
        zoomOutButton.removeAttribute('title');

        zoomOutButton.setAttribute('data-tooltip-content', 'Zoom Out');
      }
    };

    // Wait for DOM rendering before attaching tooltips
    setTimeout(attachTooltips, 0);

    return () => {
      map?.setTarget(undefined);
    };
  }, [center, setMap, zoom]);

  return (
    <div className="flex-grow">
      <div ref={mapRef} className="flex-grow" id="map">
        {children}
      </div>
      <Tooltip anchorSelect=".ol-zoom-in, .ol-zoom-out" place="right" />
    </div>
  );
};
