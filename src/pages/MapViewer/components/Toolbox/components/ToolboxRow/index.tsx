import placeholder from '@/assets/placeholders/100.png';
import { titleFromId } from '@/utils/genericUtils';

import { ToolboxItemProps } from './types.js';

import './styles.scss';

const ToolboxRow = ({ thumbnail, title, dataPoints, onClick, children }: ToolboxItemProps) => {
  return (
    <button className="toolbox-row" onClick={onClick}>
      <div className="toolbox-row__left">
        <img
          alt="thumbnail"
          src={thumbnail}
          onError={(e) => {
            console.error('Error loading image:', thumbnail, e);
            e.currentTarget.src = placeholder;
          }}
        />
      </div>

      <div className="toolbox-row__right">
        <span className="toolbox-row__right-title">{titleFromId(title)}</span>
        {dataPoints?.map((dataPoint) => (
          <div key={dataPoint.id} className="toolbox-row__data-point">
            <dataPoint.icon />
            <span className="toolbox-row__data-point-text">{dataPoint.value}</span>
          </div>
        ))}
        {children ? children : null}
      </div>
    </button>
  );
};

export default ToolboxRow;
