import React, { useEffect, useRef } from 'react';

import { Map, View } from 'ol';
import 'ol/ol.css';
import TileLayer from 'ol/layer/Tile';
import { fromLonLat } from 'ol/proj';
import { OSM } from 'ol/source';
import STACLayer from 'ol-stac';

import { MAP_PROJECTION } from '@/components/Map';

interface FeatureMapProps {
  items: [object];
  featureMap: Map;
  setFeatureMap: (map: Map) => void;
}

const FeatureMap = ({ items, featureMap, setFeatureMap }: FeatureMapProps) => {
  const stacLayerRef = useRef(null);

  useEffect(() => {
    const osmLayer = new TileLayer({
      preload: Infinity,
      source: new OSM(),
    });
    osmLayer.set('name', 'OSM');
    osmLayer.set('basemap', true);

    const layers = [osmLayer];

    const map = new Map({
      target: 'featureMap',
      layers,
      view: new View({
        projection: MAP_PROJECTION,
        center: fromLonLat([0, 0]),
        zoom: 2,
      }),
    });
    setFeatureMap(map);
    return () => {
      map.setTarget(null);
    };
  }, [setFeatureMap]);

  useEffect(() => {
    if (!items || !featureMap) return;

    const combinedData = {
      type: 'FeatureCollection',
      features: items.map((item) => ({
        ...item,
        type: 'Feature',
      })),
    };

    const stacLayer = new STACLayer({
      data: combinedData,
      displayPreview: true,
    });

    featureMap.addLayer(stacLayer);
    stacLayerRef.current = stacLayer;
  }, [featureMap, items]);

  return <div className="dataset-details-map" id="featureMap" />;
};

export default FeatureMap;
