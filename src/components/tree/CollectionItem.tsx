import { FaInfoCircle } from 'react-icons/fa';
import { MdInsertDriveFile } from 'react-icons/md';

import { useApp } from '@/hooks/useApp';
import { Collection } from '@/typings/stac';
import { updateUrl } from '@/utils/urlHandler';

type CollectionItemProps = {
  collection: Collection;
  handleLeafClick: (collection: Collection) => void;
};

export const CollectionItem = ({ collection, handleLeafClick }: CollectionItemProps) => {
  const { actions: AppActions } = useApp();
  const { setActiveContent } = AppActions;

  const viewDatasetDetails = (e) => {
    e.stopPropagation();

    updateUrl(collection);
    setActiveContent('dataset');
  };

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

        <FaInfoCircle onClick={(e) => viewDatasetDetails(e)} />
      </div>
    </li>
  );
};
