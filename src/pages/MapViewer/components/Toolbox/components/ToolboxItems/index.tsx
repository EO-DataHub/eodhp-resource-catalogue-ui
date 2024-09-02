/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { Feature } from 'ol';
import { buffer } from 'ol/extent';
import { Polygon } from 'ol/geom';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { Stroke, Style } from 'ol/style';

import { DATA_PROJECTION, MAP_PROJECTION } from '@/components/Map';
import { useMap } from '@/hooks/useMap';
import { useToolbox } from '@/hooks/useToolbox';
import { Feature as StacFeature } from '@/typings/stac';
import { parseFeatureDataPoints, returnFeatureThumbnail } from '@/utils/stacUtils';

import ToolboxRow from '../ToolboxRow';

import './styles.scss';

const COLLECTION_SCENE_ID = 'collection-scene';

const ToolboxItems = () => {
  const {
    state: { selectedCollection, selectedCollectionItems },
    actions: { setActivePage },
  } = useToolbox();

  const { addLayer, removeLayer, map } = useMap();

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
        {selectedCollectionItems?.features?.map((item: StacFeature) => {
          return (
            <ToolboxRow
              key={item.id}
              dataPoints={parseFeatureDataPoints(item)}
              thumbnail={returnFeatureThumbnail(item)}
              title={item.id.toString()}
              onClick={(e) => {
                const polygon = new Feature({
                  geometry: new Polygon(item.geometry.coordinates),
                  name: item.id,
                });

                // Reproject the geometry from EPSG:4326 to what is used by the map i.e. EPSG:3857
                polygon.getGeometry().transform(DATA_PROJECTION, MAP_PROJECTION);
                const bufferedExtent = buffer(polygon.getGeometry().getExtent(), 0.1);

                const vectorSource1 = new VectorSource({
                  features: [polygon],
                });

                const vectorLayer = new VectorLayer({
                  source: vectorSource1,
                  style: new Style({
                    stroke: new Stroke({
                      color: 'red',
                      width: 2,
                    }),
                  }),
                });
                vectorLayer.set('name', COLLECTION_SCENE_ID);

                // Remove any previously set layer.
                removeLayer(COLLECTION_SCENE_ID);
                // Add new collection scene layer.
                addLayer(vectorLayer);

                // Zoom the map to the buffered extent of the scene.
                map.getView().fit(bufferedExtent);

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
