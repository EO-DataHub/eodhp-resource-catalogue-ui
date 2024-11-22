import { MdInsertDriveFile } from 'react-icons/md';

import { Collection } from '@/typings/stac';

type CollectionItemProps = {
  collection: Collection;
  handleLeafClick: (collection: Collection) => void;
};

export const CollectionItem = ({ collection, handleLeafClick }: CollectionItemProps) => {
  return (
    <li key={collection.id} className="leaf">
      <div
        className="collection-item"
        role="button"
        tabIndex={0}
        onClick={() => handleLeafClick(collection)}
        onKeyPress={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleLeafClick(collection);
          }
        }}
      >
        <span className="collection-icon">
          <MdInsertDriveFile />
        </span>
        <span className="collection-label">
          {collection.title ? collection.title : collection.id}
        </span>
      </div>
    </li>
  );
};
