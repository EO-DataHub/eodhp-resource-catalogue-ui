import React from 'react';

import { StacItem } from '@/typings/stac';

interface FeatureListProps {
  items: [StacItem];
}

const FeatureList = ({ items }: FeatureListProps) => {
  const renderItem = (item: StacItem) => {
    return (
      <div className="dataset-details-list-item">
        <h2 className="dataset-details-list-content">{item.id}</h2>
      </div>
    );
  };

  if (!items) return;
  return <div className="dataset-details-list">{items.map((item) => renderItem(item))}</div>;
};

export default FeatureList;
