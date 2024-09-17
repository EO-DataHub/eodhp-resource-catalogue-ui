import { useEffect, useState } from 'react';

import { FaRegCopy } from 'react-icons/fa';
import { Tooltip } from 'react-tooltip';

import { titleFromId } from '@/utils/genericUtils';

import { ToolboxItemProps } from './types.js';

import './styles.scss';

const ToolboxRow = ({ thumbnail, title, copyLink, dataPoints, onClick }: ToolboxItemProps) => {
  const [showTooltip, setShowTooltip] = useState(false);

  // Handler for copy button
  const handleCopy = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    e.stopPropagation();

    if (copyLink) {
      navigator.clipboard
        .writeText(copyLink)
        .then(() => {
          setShowTooltip(true);
          console.log('Tooltip shown');
        })
        .catch((err) => {
          console.error('Failed to copy link:', err);
        });
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showTooltip) {
      timer = setTimeout(() => {
        console.log('Tooltip hidden');
        setShowTooltip(false);
      }, 2000); // Tooltip visible for 2 seconds
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [showTooltip]);

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
      {copyLink && (
        <>
          <button
            className="toolbox-row__copy-link"
            data-tooltip-content={'Copied'}
            data-tooltip-id={`copyTooltip-${title}`}
            type="button"
            onMouseUp={handleCopy}
          >
            <FaRegCopy />
          </button>
          <Tooltip id={`copyTooltip-${title}`} isOpen={showTooltip} />
        </>
      )}
    </div>
  );
};

export default ToolboxRow;
