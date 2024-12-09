import { TbMapCog } from 'react-icons/tb';
import { Tooltip } from 'react-tooltip';

import './VisualiseAssetButton.scss';

type VisualiseAssetButtonProps = {
  onClick: () => void;
};

export const VisualiseAssetButton = ({ onClick }: VisualiseAssetButtonProps) => {
  return (
    <div className="visualisation">
      <Tooltip id="visualisation-button" />
      <button
        className="btn"
        data-tooltip-content="Visualisation Settings"
        data-tooltip-id="visualisation-button"
        onClick={onClick}
      >
        <TbMapCog />
      </button>
    </div>
  );
};
