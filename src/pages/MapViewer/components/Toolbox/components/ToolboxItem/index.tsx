import './types';
import './styles.scss';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { ToolboxItemProps } from './types';

const ToolboxItem = (ItemData: ToolboxItemProps) => {
  const { thumbnail, title, dataPoints } = ItemData;

  const map = useMap();

  const handleAddPlaceholderLayer = () => {
    const placeholderPolygon : GeoJSON.FeatureCollection = {
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
    placeholderLayer.addTo(map);
  }

  return (
    <div className="toolbox-item"
      onClick={handleAddPlaceholderLayer}
    >
      <div className="toolbox-item__left">
        <img src={thumbnail} alt="thumbnail" />
      </div>
      <div className="toolbox-item__right">
        <h3>{title}</h3>
        {dataPoints.map((dataPoint, index) => (
          <div key={index} className="toolbox-item__data-point"
          >
            <dataPoint.icon />
            <p
              className="toolbox-item__data-point-text"
            >{dataPoint.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ToolboxItem;