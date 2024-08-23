import { titleFromId } from '@/utils/genericUtils';

import { ToolboxItemProps } from './types.js';

import './styles.scss';

const ToolboxRow = ({ thumbnail, title, dataPoints, onClick }: ToolboxItemProps) => {
  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div className="toolbox-row" onMouseUp={onClick}>
      <div className="toolbox-row__left">
        <img
          alt="thumbnail"
          src={thumbnail}
          onError={(e) => {
            console.error('Error loading image:', thumbnail, e);
            e.currentTarget.src = 'https://via.placeholder.com/100';
          }}
        />
      </div>
      <div className="toolbox-row__right">
        <span className="toolbox-row__right-title">{titleFromId(title)}</span>
        {dataPoints?.map((dataPoint) => (
          <div key={dataPoint.text} className="toolbox-row__data-point">
            <dataPoint.icon />
            <span className="toolbox-row__data-point-text">{dataPoint.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ToolboxRow;
