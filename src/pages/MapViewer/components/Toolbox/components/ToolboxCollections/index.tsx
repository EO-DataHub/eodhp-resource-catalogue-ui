import { useMapSettings } from '@/hooks/useMapSettings';
import { useToolbox } from '@/hooks/useToolbox';
import { parseCollectionDataPoints } from '@/utils/stacUtils';

import ToolboxRow from '../ToolboxRow';

import './styles.scss';

const ToolboxCollections: React.FC = () => {
  const { state: MapSettingsState } = useMapSettings();
  const { toolboxCollectionsResults: toolboxCollectionsResults } = MapSettingsState;
  const {
    actions: { setActivePage, setSelectedCollection },
  } = useToolbox();

  return (
    <div className="toolbox__collections">
      {toolboxCollectionsResults.map((collection) => (
        <ToolboxRow
          key={collection.id}
          dataPoints={parseCollectionDataPoints(collection)}
          thumbnail={collection.thumbnailUrl}
          title={collection.title ? collection.title : collection.id}
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
