import React, { useEffect, useState } from 'react';

import { useMap } from '@/hooks/useMap';
import { Collection } from '@/typings/stac';
import { fetchData } from '@/utils/genericUtils';
import { addViewToURL, getCollectionFromURL } from '@/utils/urlHandler';

import './styles.scss';
import FeatureMap from './components/FeatureMap/FeatureMap';
import DataTable from './components/Tables/DataTable';

const DatasetDetails = () => {
  const { collections } = useMap();
  const [collection, setCollection] = useState<Collection>(null);
  const [items, setItems] = useState(null);
  const [metaData, setMetadata] = useState(null);

  useEffect(() => {
    addViewToURL('dataset');
    const collectionId = getCollectionFromURL();
    const _collection = collections.filter((c) => c.id === collectionId)[0];
    setCollection(_collection);

    const retrieveItems = async () => {
      const itemLinks = _collection.links.filter((link) => link.rel === 'items');
      const promises = itemLinks.map((link) => fetchData(link.href));
      const response = await Promise.all(promises);
      const _items = response[0].features;
      setItems(_items);
    };
    retrieveItems();

    return () => {
      addViewToURL('map');
    };
  }, [collections]);

  useEffect(() => {
    if (!collection) return;
    const data = {};
    Object.entries(collection.summaries).forEach(([key, value]) => {
      if (key.includes('sar')) {
        if (!data['sar']) data['sar'] = {};
        data['sar'][key] = value;
        return;
      }
      if (key.includes('sat')) {
        if (!data['sat']) data['sat'] = {};
        data['sat'][key] = value;
        return;
      }
      if (!data['general']) data['general'] = {};
      data['general'][key] = value;
    });
    setMetadata(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collection]);

  const renderMetadata = () => {
    if (!metaData) return;
    return Object.entries(metaData).map(([key, value]) => {
      return <DataTable key={key} data={value} header={key} />;
    });
  };

  if (!collection) return;
  return (
    <div className="dataset-details">
      <h1>{collection.title}</h1>
      <h3>{collection.type}</h3>
      <div>
        <h2>Description</h2>
        <div>{collection.description}</div>
        <div>
          {collection.keywords.map((keyword) => (
            <div key={keyword}>{keyword}</div>
          ))}
        </div>
      </div>
      <div>
        <div>
          <div>License</div>
          <div>{collection.license}</div>
        </div>
        <div>
          <div>Temporal extent</div>
          <div>
            {collection.extent.temporal.interval[0]} - {collection.extent.temporal.interval[1]}
          </div>
        </div>
      </div>
      <div>
        <FeatureMap items={items} />
      </div>
      <div>
        <h2>Metadata</h2>
        {renderMetadata()}
      </div>
    </div>
  );
};

export default DatasetDetails;
