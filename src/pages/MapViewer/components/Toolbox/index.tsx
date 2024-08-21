import "./styles.scss";
import { useMap } from "react-leaflet";
import { useState } from "react";
import { Tooltip } from "react-tooltip";
import { useToolbox } from "@/hooks/useToolbox";
import ToolboxCollections from "./components/ToolboxCollections";
import ToolboxItems from "./components/ToolboxItems";

const Toolbox: React.FC = () => {
  const [toolboxVisible, setToolboxVisible] = useState(true); // TODO: Move to context

  const {
    state: { activePage },
  } = useToolbox();

  const map = useMap();

  const renderContent = () => {
    switch (activePage) {
      case "collections":
        return <ToolboxCollections />;
      case "items":
        return <ToolboxItems />;
      default:
        return <ToolboxCollections />;
    }
  };

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

      <div className="toolbox__content">{renderContent()}</div>
    </div>
  );
};

export default Toolbox;
