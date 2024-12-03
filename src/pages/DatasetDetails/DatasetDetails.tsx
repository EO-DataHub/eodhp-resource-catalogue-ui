import React, { useEffect, useState } from 'react';

import { Map } from 'ol';
import { FaMap } from 'react-icons/fa';

import { useApp } from '@/hooks/useApp';
import { useMap } from '@/hooks/useMap';
import { fetchFromPath } from '@/services/stac';
import { Collection } from '@/typings/stac';
import { formatDate } from '@/utils/date';
import { fetchData } from '@/utils/genericUtils';
import { addViewToURL } from '@/utils/urlHandler';

import './styles.scss';
import FeatureList from './components/FeatureList/FeatureList';
import FeatureMap from './components/FeatureMap/FeatureMap';
import DataTable from './components/Tables/DataTable';

const DatasetDetails = () => {
  const { collections } = useMap();
  const [collection, setCollection] = useState<Collection>(null);
  const [items, setItems] = useState(null);
  const [metaData, setMetadata] = useState(null);
  const [featureMap, setFeatureMap] = useState<Map>();

  const { actions: AppActions } = useApp();
  const { setActiveContent } = AppActions;

  useEffect(() => {
    addViewToURL('dataset');

    const fetchCollection = async () => {
      const _collection = await fetchFromPath();
      setCollection(_collection);

      const itemLinks = _collection.links.filter((link) => link.rel === 'items');
      const promises = itemLinks.map((link) => fetchData(link.href));
      const response = await Promise.all(promises);
      const _items = response[0].features;
      setItems(_items);
    };
    fetchCollection();

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
  }, [collection]);

  const renderHeaders = () => {
    return (
      <div>
        <h1 className="dataset-details-title">{collection.title}</h1>
        <h3 className="dataset-details-type">{collection.type}</h3>
      </div>
    );
  };

  const renderDescription = () => {
    return (
      <>
        <h2 className="dataset-details-title">Description</h2>
        <div>{collection.description}</div>
      </>
    );
  };

  const renderKeywords = () => {
    return (
      <div className="dataset-details-keywords-container">
        {collection.keywords.map((keyword) => (
          <div key={keyword} className="dataset-details-keywords">
            {keyword}
          </div>
        ))}
      </div>
    );
  };

  const renderLicense = () => {
    return (
      <div className="dataset-details-group">
        <div className="dataset-details-title">License</div>
        <div className="dataset-details-item">{collection.license}</div>
      </div>
    );
  };

  const renderTemporal = () => {
    return (
      <div className="dataset-details-group">
        <div className="dataset-details-title">Temporal extent</div>
        <div className="dataset-details-item">
          {formatDate(collection.extent.temporal.interval[0][0])} -{' '}
          {formatDate(collection.extent.temporal.interval[0][1])}
        </div>
      </div>
    );
  };

  const renderFeatures = () => {
    return (
      <div className="dataset-details-features">
        <FeatureMap featureMap={featureMap} items={items} setFeatureMap={setFeatureMap} />
        <FeatureList items={items} />
      </div>
    );
  };

  const renderMetadata = () => {
    if (!metaData) return;

    return (
      <>
        <h2 className="dataset-details-title">Metadata</h2>
        {Object.entries(metaData).map(([key, value]) => {
          return <DataTable key={key} data={value} header={key} />;
        })}
      </>
    );
  };

  if (!collection) return;
  return (
    <div className="dataset-details">
      <FaMap
        className="dataset-details-back"
        onClick={() => {
          setActiveContent('map');
        }}
      />
      {renderHeaders()}
      <div>
        {renderDescription()}
        {renderKeywords()}
      </div>
      <div>
        {renderLicense()}
        {renderTemporal()}
        {renderFeatures()}
      </div>
      <div>{renderMetadata()}</div>
    </div>
  );
};

export default DatasetDetails;
