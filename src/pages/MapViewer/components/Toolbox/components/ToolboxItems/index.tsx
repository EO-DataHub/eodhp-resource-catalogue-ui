import { useToolbox } from "@/hooks/useToolbox";
import ToolboxRow from "../ToolboxRow";
import {
  parseFeatureDataPoints,
  returnFeatureThumbnail,
} from "@/utils/stacUtils";
import { Feature } from "@/typings/stac";
import "./styles.scss";
import L from "leaflet";
import { useMap } from "react-leaflet";

const ToolboxItems = () => {
  const {
    state: { selectedCollection, selectedCollectionItems },
    actions: { setActivePage },
  } = useToolbox();

  const map = useMap();

  return (
    <div className="toolbox-content-container">
      {/* This header could be its own component, can't see where it would be used though */}
      <div className="toolbox__header">
        <div
          className="toolbox__header-back"
          onClick={() => {
            setActivePage("collections");
          }}
        >
          <span>&lt; Return to Collections</span>
        </div>
        <div className="toolbox__header-title">
          {selectedCollection.title
            ? selectedCollection.title
            : selectedCollection.id}
        </div>
      </div>

      <div className="toolbox__items">
        {selectedCollectionItems?.features?.map((item: Feature) => {
          return (
            <ToolboxRow
              key={item.id}
              title={item.id.toString()}
              thumbnail={returnFeatureThumbnail(item)}
              dataPoints={parseFeatureDataPoints(item)}
              onClick={() => {
                map.eachLayer((layer) => {
                  if (layer instanceof L.GeoJSON) {
                    map.removeLayer(layer);
                  }
                });
                const boundsLayer = L.geoJSON(item.geometry);
                boundsLayer.setStyle({
                  color: "red",
                  weight: 2,
                  fillOpacity: 0,
                });
                boundsLayer.addTo(map);

                map.fitBounds(boundsLayer.getBounds());
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ToolboxItems;