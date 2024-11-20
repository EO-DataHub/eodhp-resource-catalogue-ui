import React, { useContext, useEffect, useRef } from 'react';
import './styles.scss';

import STACLayer from 'ol-stac/layer/STAC';
import { FaSearch } from 'react-icons/fa';
import { Tooltip } from 'react-tooltip';

import { MapContext } from '@/context/MapContext';
import { StacItem } from '@/typings/stac';

type PreviewProps = {
  item: StacItem;
};

const Preview = ({ item }: PreviewProps) => {
  const { addPreviewLayer } = useContext(MapContext);
  const layerRef = useRef(null);

  useEffect(() => {
    const stacLayer = new STACLayer({ data: item, displayPreview: true });
    layerRef.current = stacLayer;
  }, [item]);

  const handleClick = (event) => {
    event.stopPropagation();
    addPreviewLayer(layerRef.current);
  };

  return (
    <div>
      <Tooltip id="preview-button" />
      <button
        className="btn"
        data-tooltip-content={'View preview'}
        data-tooltip-id="preview-button"
        onClick={handleClick}
      >
        <FaSearch />
      </button>
    </div>
  );
};

export default Preview;
