import './styles.scss'
import ToolboxItem from './components/ToolboxItem'
import { CiCalendarDate } from "react-icons/ci";
import { IoTimeOutline } from "react-icons/io5";
import { CiCloudOn } from "react-icons/ci";
import { TbAxisX } from "react-icons/tb";
import { useMap } from 'react-leaflet';
import { useState } from 'react';

// Placeholder images
import hgb from "@/assets/placeholders/hgb.png";
import landsat from "@/assets/placeholders/landsat.png";
import sentinel2 from "@/assets/placeholders/sentinel-2.png";
import terraclimate from "@/assets/placeholders/terraclimate.png";

const PLACEHOLDER_DATAPOINTS = [
  {
    icon: CiCalendarDate,
    alt: 'placeholder-icon',
    text: '2024.06.01'
  },
  {
    icon: IoTimeOutline,
    alt: 'placeholder-icon',
    text: '10:39:51 UTC'
  },
  {
    icon: CiCloudOn,
    alt: 'placeholder-icon',
    text: '45.0 %',
  },
  {
    icon: TbAxisX,
    alt: 'placeholder-icon',
    text: 'MGRS: 32T LM L2A'
  }
]

const PLACEHOLDER_ITEMS_GROUP = [
  {
    thumbnail: hgb,
    title: 'HGB',
    dataPoints: PLACEHOLDER_DATAPOINTS
  },
  {
    thumbnail: landsat,
    title: 'Landsat',
    dataPoints: PLACEHOLDER_DATAPOINTS
  },
  {
    thumbnail: sentinel2,
    title: 'Sentinel-2',
    dataPoints: PLACEHOLDER_DATAPOINTS
  },
  {
    thumbnail: terraclimate,
    title: 'TerraClimate',
    dataPoints: PLACEHOLDER_DATAPOINTS
  }
];

const PLACEHOLDER_ITEMS = [...PLACEHOLDER_ITEMS_GROUP, ...PLACEHOLDER_ITEMS_GROUP, ...PLACEHOLDER_ITEMS_GROUP, ...PLACEHOLDER_ITEMS_GROUP];

const Toolbox: React.FC = () => {

  const [toolboxVisible, setToolboxVisible] = useState(true);
  const map = useMap();

  return (
    <div className={`toolbox ${toolboxVisible ? 'toolbox--visible' : 'toolbox--hidden'}`}
      onMouseDown={() => map.dragging.disable()}
      onMouseUp={() => map.dragging.enable()}
    >
      <div className="toolbox__window-actions">
        <span className="toolbox__window-action"
          onClick={() => setToolboxVisible(false)}
        >_</span>
        <span className="toolbox__window-action"
          onClick={() => setToolboxVisible(false)}
        >X</span>
      </div>

      <div className="toolbox__content">
        {PLACEHOLDER_ITEMS.map((item, index) => (
          <ToolboxItem
            key={index}
            thumbnail={item.thumbnail}
            title={item.title}
            dataPoints={item.dataPoints}
          />
        ))}
      </div>

    </div >
  );
}

export default Toolbox;