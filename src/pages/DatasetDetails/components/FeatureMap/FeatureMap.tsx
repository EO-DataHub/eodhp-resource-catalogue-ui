import React, { useEffect, useState } from 'react';

import { Map, View } from 'ol';
import 'ol/ol.css';
import TileLayer from 'ol/layer/Tile';
import { fromLonLat } from 'ol/proj';
import { OSM } from 'ol/source';

import { MAP_PROJECTION } from '@/components/Map';

interface FeatureMapProps {
  items: unknown;
}

const FeatureMap = ({ items }: FeatureMapProps) => {
  const [featureMap, setFeatureMap] = useState<Map>();

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
  }, []);

  return <div id="featureMap" style={{ width: 500, height: 500 }} />;
};

export default FeatureMap;
