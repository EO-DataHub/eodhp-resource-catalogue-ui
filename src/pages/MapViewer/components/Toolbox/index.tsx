import "./styles.scss";
import ToolboxItem from "./components/ToolboxItem";

import { useMap } from "react-leaflet";
import { useState } from "react";
import { Tooltip } from "react-tooltip";
import { useMapSettings } from "@/hooks/useMapSettings";
import { parseCollectionDataPoints } from "@/utils/stacUtils";
import "react-tooltip/dist/react-tooltip.css";

const Toolbox: React.FC = () => {
  const [toolboxVisible, setToolboxVisible] = useState(true); // TODO: Move to context
  const map = useMap();
  const { state: MapSettingsState } = useMapSettings();
  const { toolboxCollectionsResults: toolboxCollectionsResults } =
    MapSettingsState;

  return (
    <div
      id="toolbox"
      className={`toolbox ${
        toolboxVisible ? "toolbox--visible" : "toolbox--hidden"
      }`}
      onMouseDown={() => map.dragging.disable()}
      onMouseUp={() => map.dragging.enable()}
    >
      <div className="toolbox__window-actions">
        <Tooltip id="window-tooltip" place="top-start" />
        <span
          className="toolbox__window-action"
          onClick={() => setToolboxVisible(false)}
          data-tooltip-id="window-tooltip"
          data-tooltip-html={
            "As there is no design yet for where the toolbox can 'dock' or minimise too, this will just hide the toolbox." +
            "<br/>Refresh the page to get it back for now" +
            "<br/><br/> Any ideas for where this could clearly go, please let us know!"
          }
        >
          _
        </span>
        <span
          className="toolbox__window-action"
          onClick={() => setToolboxVisible(false)}
          data-tooltip-id="window-tooltip"
          data-tooltip-html={
            "As there is no design yet for where the toolbox can 'dock' or minimise too, this will just hide the toolbox." +
            "<br/>Refresh the page to get it back for now" +
            "<br/><br/> Any ideas for where this could clearly go, please let us know!"
          }
        >
          X
        </span>
      </div>

      <div className="toolbox__content">
        {toolboxCollectionsResults.map((collection, index) => (
          <ToolboxItem
            key={index}
            thumbnail={collection.thumbnailUrl}
            title={collection.title ? collection.title : collection.id}
            dataPoints={parseCollectionDataPoints(collection)}
          />
        ))}
      </div>
    </div>
  );
};

export default Toolbox;
