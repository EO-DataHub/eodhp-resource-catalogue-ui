import { MouseEvent, ReactNode } from 'react';

import { Tooltip } from 'react-tooltip';

import './DrawingTool.scss';

type DrawingToolProps = {
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
  isActive: boolean;
  tooltip?: string;
  children: ReactNode;
};

export const DrawingTool = ({
  onClick,
  isActive,
  tooltip = '',
  children,
  ...rest
}: DrawingToolProps) => (
  <>
    <Tooltip id="drawTool" />

    <button
      className={`tool ${isActive ? 'active' : ''}`}
      data-tooltip-content={tooltip}
      data-tooltip-id="drawTool"
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  </>
);
