import CopyButton from '@/components/CopyButton/CopyButton';
import { titleFromId } from '@/utils/genericUtils';

import { ToolboxItemProps } from './types.js';
import './styles.scss';

const ToolboxRow = ({ thumbnail, title, copyLink, dataPoints, onClick }: ToolboxItemProps) => {
  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
    <div className="toolbox-row" onClick={onClick}>
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
      {copyLink ? <CopyButton copyLink={copyLink} title={title} /> : null}
    </div>
  );
};

export default ToolboxRow;
