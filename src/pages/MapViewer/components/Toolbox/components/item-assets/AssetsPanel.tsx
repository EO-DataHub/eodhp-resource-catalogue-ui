import { ClipboardButton } from '@/components/clipboard/ClipboardButton';
import { useToolbox } from '@/hooks/useToolbox';

import './AssetsPanel.scss';

type Asset = {
  key: string;
  value: string;
};

export const AssetsPanel = () => {
  const {
    state: { selectedCollectionItem },
    actions: { setActivePage },
  } = useToolbox();

  // Reduce the object of objects down to an array of key/value objects e.g.
  // [{ cloud: 'https:/....' }, ..., { saturated_pixel: 'https:/....' }]
  // If at a later date we decide we want more from the StacAsset object displayed
  // we can just add that to the new object added to the `acc` array.
  const assets = Object.keys(selectedCollectionItem.assets).reduce<Asset[]>((acc, key) => {
    acc = [...acc, { key, value: selectedCollectionItem.assets[key].href }];

    return acc;
  }, []);

  return (
    <div>
      <div className="toolbox__header">
        <button className="button-link" onClick={() => setActivePage('items')}>
          <span>&lt; Return to Items</span>
        </button>
      </div>

      <ul>
        {assets && assets.length > 0 ? (
          assets.map((asset) => (
            <li key={asset.key} className="asset-row">
              <label className="label" htmlFor={asset.key}>
                {asset.key}:
              </label>
              <input readOnly id={asset.key} type="text" value={asset.value} />
              <ClipboardButton text={asset.value} />
            </li>
          ))
        ) : (
          <p>No assets to show</p>
        )}
      </ul>
    </div>
  );
};
