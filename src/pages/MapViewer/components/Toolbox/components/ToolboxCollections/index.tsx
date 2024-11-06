import { useMap } from '@/hooks/useMap';
import { useToolbox } from '@/hooks/useToolbox';
import { parseCollectionDataPoints } from '@/utils/stacUtils';

import ToolboxRow from '../ToolboxRow';

import './styles.scss';

const ToolboxCollections: React.FC = () => {
  const { collections } = useMap();

  const {
    actions: { setActivePage, setSelectedCollection },
  } = useToolbox();

  return (
    <div className="toolbox__collections">
      {collections?.map((collection) => (
        <ToolboxRow
          key={collection.id}
          dataPoints={parseCollectionDataPoints(collection)}
          thumbnail={collection.thumbnailUrl}
          title={collection.title ? collection.title : collection.id}
          licence={collection.licence ? collection.licence as string : 'None found'}
          onClick={() => {
            setActivePage('items');
            setSelectedCollection(collection);
          }}
        />
      ))}
    </div>
  );
};

export default ToolboxCollections;
