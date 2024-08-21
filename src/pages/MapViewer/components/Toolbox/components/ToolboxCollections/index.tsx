import { useMapSettings } from "@/hooks/useMapSettings";
import "./styles.scss";
import ToolboxRow from "../ToolboxRow";
import { parseCollectionDataPoints } from "@/utils/stacUtils";
import { useToolbox } from "@/hooks/useToolbox";

const ToolboxCollections: React.FC = () => {
  const { state: MapSettingsState } = useMapSettings();
  const { toolboxCollectionsResults: toolboxCollectionsResults } =
    MapSettingsState;
  const {
    actions: { setActivePage, setSelectedCollection },
  } = useToolbox();

  return (
    <div className="toolbox__collections">
      {toolboxCollectionsResults.map((collection) => (
        <ToolboxRow
          key={collection.id}
          thumbnail={collection.thumbnailUrl}
          title={collection.title ? collection.title : collection.id}
          dataPoints={parseCollectionDataPoints(collection)}
          onClick={() => {
            setActivePage("items");
            setSelectedCollection(collection);
          }}
        />
      ))}
    </div>
  );
};

export default ToolboxCollections;
