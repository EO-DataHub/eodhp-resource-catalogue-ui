/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import L from 'leaflet';
import { useMap } from 'react-leaflet';

import { useToolbox } from '@/hooks/useToolbox';
import { Feature } from '@/typings/stac';
import { parseFeatureDataPoints, returnFeatureThumbnail } from '@/utils/stacUtils';

import ToolboxRow from '../ToolboxRow';

import './styles.scss';

const ToolboxItems = () => {
  const {
    state: { selectedCollection, selectedCollectionItems },
    actions: { setActivePage },
  } = useToolbox();

  const map = useMap();

  return (
    <div className="toolbox-content-container">
      {/* This header could be its own component, can't see where it would be used though */}
      <div className="toolbox__header">
        <div
          className="toolbox__header-back"
          onClick={() => {
            setActivePage('collections');
          }}
        >
          <span>&lt; Return to Collections</span>
        </div>
        <div className="toolbox__header-title">
          {selectedCollection.title ? selectedCollection.title : selectedCollection.id}
        </div>
      </div>

      <div className="toolbox__items">
        {selectedCollectionItems?.features?.map((item: Feature) => {
          return (
            <ToolboxRow
              key={item.id}
              dataPoints={parseFeatureDataPoints(item)}
              thumbnail={returnFeatureThumbnail(item)}
              title={item.id.toString()}
              onClick={(e) => {
                // Temporary function to add layer to the map
                map.eachLayer((layer) => {
                  if (layer instanceof L.GeoJSON) {
                    map.removeLayer(layer);
                  }
                });
                const boundsLayer = L.geoJSON(item.geometry);
                boundsLayer.setStyle({
                  color: 'red',
                  weight: 2,
                  fillOpacity: 0,
                });
                boundsLayer.addTo(map);
                map.fitBounds(boundsLayer.getBounds());

                if (e.shiftKey) {
                  const url = item.links.find((link) => link.rel === 'self')?.href;
                  if (url) {
                    window.open(url, '_blank');
                  }
                }
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ToolboxItems;
