import { useState } from 'react';

import { Feature, Map } from 'ol';
import { GeoJSON } from 'ol/format';
import { Circle, Geometry } from 'ol/geom';
import { Type } from 'ol/geom/Geometry';
import { fromCircle } from 'ol/geom/Polygon';
import { Draw, Interaction, Modify, Snap } from 'ol/interaction';
import { defaults } from 'ol/interaction/defaults';
import { Options, createBox } from 'ol/interaction/Draw';
import VectorSource from 'ol/source/Vector';
import { PiCircle, PiPolygonFill, PiRectangle } from 'react-icons/pi';
import { RiDeleteBin6Line } from 'react-icons/ri';

import { DATA_PROJECTION, MAP_PROJECTION } from '@/components/Map';
import { useFilters } from '@/hooks/useFilters';

import { DrawingTool } from './DrawingTool';

import './DrawingToolbox.scss';

type DrawingToolboxProps = {
  isDrawingToolboxVisible: boolean;
  map: Map;
  drawingSource: VectorSource<Feature<Geometry>>;
};

enum Shapes {
  CIRCLE = 'Circle',
  BOX = 'box',
  POLYGON = 'Polygon',
  BIN = 'bin',
}

export const DrawingToolbox = ({
  isDrawingToolboxVisible,
  map,
  drawingSource,
}: DrawingToolboxProps) => {
  const {
    actions: { setAoiFilter, addURLParam },
  } = useFilters();

  const [isActive, setIsActive] = useState('');

  const drawShape = (type: Type | string) => {
    setIsActive(type);

    if (drawingSource) {
      drawingSource?.clear();

      if (type !== Shapes.BIN) {
        // I don't know if this is a problem with how I've coded this but if you add an interaction
        // but then never draw, the interaction is left on the map, so you end up drawing multiple
        // features on the next click. The only way I've found to ensure this cannot happen is to
        // clear all interactions and only add back in the defaults.
        map?.getInteractions().clear();
        defaults()
          .getArray()
          .forEach((interaction) => map?.addInteraction(interaction));
        const modify = new Modify({ source: drawingSource });
        map?.addInteraction(modify);

        let options: Options = {
          source: drawingSource,
          type: Shapes.CIRCLE,
        };
        if (type === Shapes.BOX) {
          options = {
            ...options,
            geometryFunction: createBox(),
          };
        } else {
          options = {
            ...options,
            type: type as Type,
          };
        }

        const drawObj = new Draw(options);
        map?.addInteraction(drawObj);

        const snapObj = new Snap({
          source: drawingSource,
        });
        map?.addInteraction(snapObj);

        drawObj?.on('drawend', (event) => {
          const feature = event.feature;
          const writer = new GeoJSON();

          // INFO: We need to clone the feature if already a polygon as the transforming later
          //       will affect the feature drawn on the map. The conversion from `Circle` polygon
          //       is also a new feature.
          let geometry = feature.clone().getGeometry();
          if (type === Shapes.CIRCLE) {
            geometry = fromCircle(feature.getGeometry() as Circle);
          }

          const transformedGeometry = geometry.transform(MAP_PROJECTION, DATA_PROJECTION);
          const geojson = writer.writeGeometryObject(transformedGeometry);

          setAoiFilter(geojson);
          // TODO Typing here is wrong, coordinates should exist on the object
          addURLParam('aoiCoords', geojson.coordinates[0].toString());

          map?.removeInteraction(drawObj as Interaction);
          map?.removeInteraction(snapObj as Interaction);

          setIsActive('');
        });
      } else {
        setAoiFilter(null);
        // TODO Make method to remove URL param for the aoiCoords
        setIsActive('');
      }
    }
  };

  return (
    <div
      aria-label="drawing-toolbox"
      className={`drawing-toolbox ${isDrawingToolboxVisible ? 'open' : 'closed'}`}
      role="region"
    >
      <DrawingTool
        aria-label={Shapes.BOX}
        isActive={isActive === Shapes.BOX}
        tooltip="Draw rectangular AOI"
        onClick={() => drawShape(Shapes.BOX)}
      >
        <PiRectangle />
      </DrawingTool>
      <DrawingTool
        aria-label={Shapes.POLYGON}
        isActive={isActive === Shapes.POLYGON}
        tooltip="Draw Polygon AOI"
        onClick={() => drawShape(Shapes.POLYGON)}
      >
        <PiPolygonFill />
      </DrawingTool>
      <DrawingTool
        aria-label={Shapes.CIRCLE}
        isActive={isActive === Shapes.CIRCLE}
        tooltip="Draw Circular AOI"
        onClick={() => drawShape(Shapes.CIRCLE)}
      >
        <PiCircle />
      </DrawingTool>
      <DrawingTool
        aria-label={Shapes.BIN}
        isActive={isActive === Shapes.BIN}
        tooltip="Delete any visible AOI"
        onClick={() => drawShape(Shapes.BIN)}
      >
        <RiDeleteBin6Line />
      </DrawingTool>
    </div>
  );
};
