import React, { useState } from 'react';

import { ClipboardButton } from '@/components/clipboard/ClipboardButton';
import { useToolbox } from '@/hooks/useToolbox';

import { TiTilerCustomisationPanel } from './components/VisualiseAsset/TiTilerCustomisationPanel';
import { VisualiseAssetButton } from './components/VisualiseAsset/VisualiseAssetButton';
import './AssetsPanel.scss';

export const AssetsPanel = () => {
  const {
    state: { selectedCollectionItem },
    actions: { setActivePage },
  } = useToolbox();

  const [expandedAssetKey, setExpandedAssetKey] = useState(null);

  const assets = Object.keys(selectedCollectionItem.assets).reduce((acc, key) => {
    acc = [...acc, { key, value: selectedCollectionItem.assets[key] }];
    return acc;
  }, []);

  const toggleCustomisationPanel = (assetKey) => {
    setExpandedAssetKey(expandedAssetKey === assetKey ? null : assetKey);
  };

  return (
    <div>
      <div>
        <button
          className="toolbox__header-back"
          onClick={() => {
            setActivePage('items');
          }}
        >
          <span>&lt; Return to Items</span>
        </button>
        <div className="toolbox__header-title">Assets List </div>
      </div>

      <div className="asset-list-container">
        {assets && assets.length > 0 ? (
          <ul className="asset-list">
            {assets.map((asset) => (
              <li key={asset.key} className="asset-row">
                <div className="asset-info">
                  <label className="asset-label" htmlFor={asset.key}>
                    {asset.key}
                  </label>
                  <input
                    readOnly
                    className="asset-input"
                    id={asset.key}
                    title={asset.value.href}
                    type="text"
                    value={asset.value.href}
                  />
                </div>
                <div className="asset-buttons">
                  <ClipboardButton text={asset.value.href} />
                  <VisualiseAssetButton onClick={() => toggleCustomisationPanel(asset.key)} />
                </div>
                {expandedAssetKey === asset.key && (
                  <div className="customisation-panel">
                    <TiTilerCustomisationPanel asset={asset.value} />
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-assets">No assets to show</p>
        )}
      </div>
    </div>
  );
};
