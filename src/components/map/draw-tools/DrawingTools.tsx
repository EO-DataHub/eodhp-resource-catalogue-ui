import { useState } from 'react';

import { Map } from 'ol';
import { PiPencilSimpleLineFill } from 'react-icons/pi';
import { Tooltip } from 'react-tooltip';

import { useMap } from '@/hooks/useMap';

import { DrawingToolbox } from './DrawingToolbox';

import './DrawingTools.scss';

export const DrawingTools = () => {
  const { map } = useMap();

  const [isDrawingToolboxVisible, setIsDrawingToolboxVisible] = useState<boolean>(false);

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

      <DrawingToolbox isDrawingToolboxVisible={isDrawingToolboxVisible} map={map as Map} />
    </div>
  );
};
