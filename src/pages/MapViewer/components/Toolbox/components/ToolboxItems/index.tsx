/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { Feature } from 'ol';
import { Polygon } from 'ol/geom';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { Stroke, Style } from 'ol/style';

import { ClipboardButton } from '@/components/clipboard/ClipboardButton';
import { DATA_PROJECTION, MAP_PROJECTION } from '@/components/Map';
import { useMap } from '@/hooks/useMap';
import { useToolbox } from '@/hooks/useToolbox';
import { StacItem } from '@/typings/stac';
import { parseFeatureDataPoints, returnFeatureThumbnail } from '@/utils/stacUtils';

import { ToolboxItemSkeleton } from './ToolboxItemSkeleton';
import ToolboxRow from '../ToolboxRow';

import './styles.scss';

const COLLECTION_SCENE_ID = 'collection-scene';

const ToolboxItems = () => {
  const {
    state: { selectedCollection, selectedCollectionItems },
    actions: { setActivePage, setSelectedCollectionItem },
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
        {!selectedCollectionItems ? <ToolboxItemSkeleton /> : null}

        {selectedCollectionItems && selectedCollectionItems.features.length < 1 ? (
          <p className="no-items">No items available, make sure you have drawn an AOI</p>
        ) : (
          selectedCollectionItems?.features?.map((item: StacItem) => {
            const url = item.links.find((link) => link.rel === 'self')?.href;

            return (
              <ToolboxRow
                key={item.id}
                dataPoints={parseFeatureDataPoints(item)}
                thumbnail={returnFeatureThumbnail(item)}
                title={item.id.toString()}
                onClick={(e) => {
                  setActivePage('assets');
                  setSelectedCollectionItem(item);

                  if (item.geometry.type !== 'Polygon') {
                    console.error('Selected item is not a polygon');
                    return;
                  }

                  // Create a map layer for selected collection item.
                  const polygon = new Feature({
                    geometry: new Polygon(item.geometry.coordinates),
                    name: item.id,
                  });

                  // Reproject the geometry from EPSG:4326 to what is used by the map i.e. EPSG:3857
                  polygon.getGeometry().transform(DATA_PROJECTION, MAP_PROJECTION);

                  const sceneSource = new VectorSource({
                    features: [polygon],
                  });

                  const sceneLayer = new VectorLayer({
                    source: sceneSource,
                    style: new Style({
                      stroke: new Stroke({
                        color: 'red',
                        width: 2,
                      }),
                    }),
                  });
                  sceneLayer.set('name', COLLECTION_SCENE_ID);

                  // Remove any previously set layer.
                  removeLayer(COLLECTION_SCENE_ID);
                  // Add new collection scene layer.
                  addLayer(sceneLayer);

                  // Zoom the map to the buffered extent of the scene.
                  map.getView().fit(polygon.getGeometry(), { padding: [20, 20, 20, 20] });

                  if (e.shiftKey) {
                    if (url) {
                      window.open(url, '_blank');
                    }
                  }
                }}
              >
                <div className="button-wrapper">
                  <button
                    className="purchase-btn"
                    onClick={(event) => {
                      event.stopPropagation();
                      setActivePage('purchase');
                    }}
                  >
                    Purchase Item
                  </button>
                  <ClipboardButton text={url} />
                </div>
              </ToolboxRow>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ToolboxItems;
