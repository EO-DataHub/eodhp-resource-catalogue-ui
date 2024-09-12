import { MouseEvent, ReactNode } from 'react';

import './DrawingTool.scss';

type DrawingToolProps = {
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
  isActive: boolean;
  children: ReactNode;
};

export const DrawingTool = ({ onClick, isActive, children, ...rest }: DrawingToolProps) => (
  <button className={`tool ${isActive ? 'active' : ''}`} onClick={onClick} {...rest}>
    {children}
  </button>
);
