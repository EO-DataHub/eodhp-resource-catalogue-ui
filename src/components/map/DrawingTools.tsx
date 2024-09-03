import { useEffect, useState } from 'react';

import { Feature, Map } from 'ol';
import { Geometry } from 'ol/geom';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { MdOutlineRectangle } from 'react-icons/md';

import './styles.scss';

type DrawingToolsProps = {
  map: Map;
  drawRectangle: (drawingSource: VectorSource<Feature<Geometry>>) => void;
};

export const DrawingTools = ({ map, drawRectangle }: DrawingToolsProps) => {
  const [drawingSource, setDrawingSource] = useState<VectorSource<Feature<Geometry>> | undefined>(
    undefined,
  );

  useEffect(() => {
    // Drawing layer
    const source = new VectorSource();

    const vectorLayer = new VectorLayer({
      source,
      style: {
        'fill-color': 'rgba(255, 255, 255, 0.2)',
        'stroke-color': '#ffcc33',
        'stroke-width': 2,
        'circle-radius': 7,
        'circle-fill-color': '#ffcc33',
      },
    });
    vectorLayer.set('name', 'aoiLayer');
    vectorLayer.setZIndex(10);

    setDrawingSource(source);
    map?.addLayer(vectorLayer);

    return () => {
      map?.removeLayer(vectorLayer);
    };
  }, [map]);

  return (
    <div className="drawing-tools">
      <button
        aria-label="Rectangle button"
        className="bbox"
        onClick={() => drawRectangle(drawingSource as VectorSource<Feature<Geometry>>)}
      >
        <MdOutlineRectangle />
      </button>
    </div>
  );
};
