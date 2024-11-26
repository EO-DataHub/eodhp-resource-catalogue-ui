import React, { useEffect, useState } from 'react';

import { useMap } from '@/hooks/useMap';
import { Collection } from '@/typings/stac';
import { addViewToURL, getCollectionFromURL } from '@/utils/urlHandler';
import './styles.scss';

const DatasetDetails = () => {
  const { collections } = useMap();
  const [collection, setCollection] = useState<Collection>(null);

  useEffect(() => {
    addViewToURL('dataset');
    const collectionId = getCollectionFromURL();
    const _collection = collections.filter((c) => c.id === collectionId)[0];
    setCollection(_collection);

    return () => {
      addViewToURL('map');
    };
  }, [collections]);

  if (!collection) return;
  return <div className="dataset-details"></div>;
};

export default DatasetDetails;
