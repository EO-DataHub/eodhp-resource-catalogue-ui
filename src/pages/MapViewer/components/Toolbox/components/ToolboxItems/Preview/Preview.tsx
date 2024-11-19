import React, { useContext, useEffect, useRef, useState } from 'react';
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
  const [showingPreview, setShowingPreview] = useState(false);
  const { map } = useContext(MapContext);
  const layerRef = useRef(null);

  useEffect(() => {
    const stacLayer = new STACLayer({ data: item, displayPreview: true });
    layerRef.current = stacLayer;

    return () => {
      map.removeLayer(layerRef.current);
    };
  }, [item]);

  const handleClick = (event) => {
    event.stopPropagation();
    if (showingPreview) {
      map.removeLayer(layerRef.current);
    }
    if (!showingPreview) {
      map.addLayer(layerRef.current);
      map.getView().fit(layerRef.current.getExtent());
    }
    setShowingPreview(!showingPreview);
  };

  const getTooltip = (): string => {
    if (showingPreview) return 'Remove preview';
    if (!showingPreview) return 'Show preview';
  };

  return (
    <div>
      <Tooltip id="preview-button" />
      <button
        className="btn"
        data-tooltip-content={getTooltip()}
        data-tooltip-id="preview-button"
        onClick={handleClick}
      >
        <FaSearch />
      </button>
    </div>
  );
};

export default Preview;
