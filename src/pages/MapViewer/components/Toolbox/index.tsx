import './styles.scss'
import ToolboxItem from './components/ToolboxItem'
import { CiCalendarDate } from "react-icons/ci";
import { IoTimeOutline } from "react-icons/io5";
import { CiCloudOn } from "react-icons/ci";
import { TbAxisX } from "react-icons/tb";
import { useMap } from 'react-leaflet';

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
    thumbnail: '/placeholders/hgb.png',
    title: 'HGB',
    dataPoints: PLACEHOLDER_DATAPOINTS
  },
  {
    thumbnail: '/placeholders/landsat.png',
    title: 'Landsat',
    dataPoints: PLACEHOLDER_DATAPOINTS
  },
  {
    thumbnail: '/placeholders/sentinel-2.png',
    title: 'Sentinel-2',
    dataPoints: PLACEHOLDER_DATAPOINTS
  },
  {
    thumbnail: '/placeholders/terraclimate.png',
    title: 'TerraClimate',
    dataPoints: PLACEHOLDER_DATAPOINTS
  }
];

const PLACEHOLDER_ITEMS = [...PLACEHOLDER_ITEMS_GROUP, ...PLACEHOLDER_ITEMS_GROUP, ...PLACEHOLDER_ITEMS_GROUP, ...PLACEHOLDER_ITEMS_GROUP];

const Toolbox: React.FC = () => {

  const map = useMap();

  return (
    <div className="toolbox"
      onMouseDown={() => map.dragging.disable()}
      onMouseUp={() => map.dragging.enable()}
    >
      <div className="toolbox__window-actions">
        <button className="toolbox__window-action">_</button>
        <button className="toolbox__window-action">X</button>
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

    </div>
  );
}

export default Toolbox;