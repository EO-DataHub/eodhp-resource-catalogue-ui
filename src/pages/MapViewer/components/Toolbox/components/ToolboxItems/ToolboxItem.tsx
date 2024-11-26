import React, { useEffect, useState } from 'react';

import { Feature } from 'ol';
import { Polygon } from 'ol/geom';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { Stroke, Style } from 'ol/style';
import { FaCheckCircle, FaSpinner, FaTimesCircle } from 'react-icons/fa';

import { ClipboardButton } from '@/components/clipboard/ClipboardButton';
import { FavouriteButton } from '@/components/FavouriteButton/FavouriteButton';
import { DATA_PROJECTION, MAP_PROJECTION } from '@/components/Map';
import { useCatalogue } from '@/hooks/useCatalogue';
import { useMap } from '@/hooks/useMap';
import { useToolbox } from '@/hooks/useToolbox';
import { sendPurchaseRequest } from '@/services/stac';
import { StacItem } from '@/typings/stac';
import { parseFeatureDataPoints, returnFeatureThumbnail } from '@/utils/stacUtils';

import Preview from './Preview/Preview';
import ToolboxRow from '../ToolboxRow';

const COLLECTION_SCENE_ID = 'collection-scene';

interface ToolboxItemProps {
  item: StacItem;
}

type PurchaseStates = 'initial' | 'busy' | 'success' | 'error';

const ToolboxItem = ({ item }: ToolboxItemProps) => {
  const [purchaseState, setPurchaseState] = useState<PurchaseStates>('initial');

  const { addLayer, removeLayer, map } = useMap();

  const {
    state: { selectedCollection },
    actions: { setActivePage, setSelectedCollectionItem },
  } = useToolbox();

  const {
    state: { favouritedItems },
  } = useCatalogue();

  const url = item.links.find((link) => link.rel === 'self')?.href;

  const getPurchaseButtonContent = () => {
    if (purchaseState === 'initial') return 'Purchase Item';
    if (purchaseState === 'busy') return <FaSpinner className="spinner" size="24" />;
    if (purchaseState === 'success') return <FaCheckCircle color="green" size="24" />;
    if (purchaseState === 'error') return <FaTimesCircle color="red" size="24" />;
  };

  useEffect(() => {
    if (purchaseState !== 'success' && purchaseState !== 'error') return;
    setTimeout(() => {
      setPurchaseState('initial');
    }, 1000);
  }, [purchaseState]);

  return (
    <ToolboxRow
      key={item.id}
      dataPoints={parseFeatureDataPoints(item)}
      thumbnail={returnFeatureThumbnail(item)}
      title={item.id.toString()}
      onClick={() => {
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
      }}
    >
      <div className="button-wrapper">
        <button
          className="purchase-btn"
          disabled={purchaseState !== 'initial'}
          onClick={async (event) => {
            event.stopPropagation();
            setPurchaseState('busy');
            try {
              await sendPurchaseRequest();
              setPurchaseState('success');
            } catch (error) {
              setPurchaseState('error');
            }
          }}
        >
          {getPurchaseButtonContent()}
        </button>

        <FavouriteButton
          isFavourite={favouritedItems[selectedCollection.id]?.has(item.id)}
          item={item}
        />

        <ClipboardButton text={url} />
        {item.assets.thumbnail && <Preview item={item} />}
      </div>
    </ToolboxRow>
  );
};

export default ToolboxItem;
