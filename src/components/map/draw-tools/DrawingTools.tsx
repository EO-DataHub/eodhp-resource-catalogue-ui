import { useEffect, useState } from 'react';

import { Feature, Map } from 'ol';
import { Geometry } from 'ol/geom';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { PiPencilSimpleLineFill } from 'react-icons/pi';
import { Tooltip } from 'react-tooltip';

import { useMap } from '@/hooks/useMap';

import { DrawingToolbox } from './DrawingToolbox';

import './DrawingTools.scss';

export const DrawingTools = () => {
  const { map } = useMap();

  const [isDrawingToolboxVisible, setIsDrawingToolboxVisible] = useState<boolean>(false);
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
      <Tooltip id="drawTools" />

      <button
        aria-label="Map Drawing Tools"
        className="bbox"
        data-tooltip-content="Map Drawing tools"
        data-tooltip-id="drawTools"
        onClick={() => setIsDrawingToolboxVisible((prev) => !prev)}
      >
        <PiPencilSimpleLineFill />
      </button>

      <DrawingToolbox
        drawingSource={drawingSource}
        isDrawingToolboxVisible={isDrawingToolboxVisible}
        map={map as Map}
      />
    </div>
  );
};
