import './types';
import './styles.scss';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { ToolboxItemProps } from './types';
import './leaflet-wmts.js';
import { beautifyKey } from "utils/genericUtils";

const ToolboxItem = (ItemData: ToolboxItemProps) => {
  const { thumbnail, title, dataPoints } = ItemData;

  const map = useMap();

  // Temporary proof of concept function
  const handleAddPlaceholderLayer = () => {
    const placeholderPolygon: GeoJSON.FeatureCollection = {
      "type": "FeatureCollection",
      "features": [
        {
          "type": "Feature",
          "properties": {},
          "geometry": {
            "coordinates": [
              [
                [
                  -3.0324353580539594,
                  52.9084424157154
                ],
                [
                  -3.0324353580539594,
                  50.792073133218906
                ],
                [
                  1.4379522473695374,
                  50.792073133218906
                ],
                [
                  1.4379522473695374,
                  52.9084424157154
                ],
                [
                  -3.0324353580539594,
                  52.9084424157154
                ]
              ]
            ],
            "type": "Polygon"
          }
        }
      ]
    }
    const placeholderLayer = L.geoJSON(placeholderPolygon);
    placeholderLayer.setStyle({
      color: 'red',
      weight: 2,
      fillOpacity: 0,
    });
    placeholderLayer.addTo(map);
  }

  // Temporary proof of concept function
  const handleAddWMTSLayer = () => {
    const url = "https://test.eodatahub.org.uk/vs/cache/ows/wmts";

    const options: L.TileLayer.WMTSOptions = {
      tileMatrixSet: 'GoogleMapsCompatible',
      layer: 'LST_COLLECTION__LST_VISUALIZATION',
      time: '2024-06-18T13:22:03Z/2024-07-08T12:40:47Z',
    };

    const wmtsLayer = L.tileLayer.wmts(url, options);
    wmtsLayer.addTo(map);
  };

  return (

    <div
      className="toolbox-item"
      onMouseUp={(e) => {
        // For proof of functionality with polygons and WMTS layers. The following applies to all Toolbox items:
        // - Shift + Click: Add placeholder polygon
        // - Click: Add WMTS layer from EOX View Server
        // - Ctrl + Click: Remove all GeoJSON and WMTS layers
        if (e.shiftKey) {
          handleAddPlaceholderLayer();
        }
        else if (e.ctrlKey) {
          map.eachLayer((layer) => {
            if (layer instanceof L.GeoJSON || layer instanceof L.TileLayer.WMTS) {
              map.removeLayer(layer);
            }
          })
        }
        else {
          handleAddWMTSLayer();
        }
      }}
    >
      <div className="toolbox-item__left">
        <img src={thumbnail} alt="thumbnail" />
      </div>
      <div className="toolbox-item__right">
        <span className="toolbox-item__right-title">{beautifyKey(title)}</span>
        {dataPoints.map((dataPoint, index) => (
          <div key={index} className="toolbox-item__data-point"
          >
            <dataPoint.icon />
            <span
              className="toolbox-item__data-point-text"
            >{dataPoint.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ToolboxItem;