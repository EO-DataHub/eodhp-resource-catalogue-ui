import React from 'react';

import { ButtonProps } from './types';

import './styles.scss';

const Button: React.FC<ButtonProps> = ({ className, onClick, children }) => {
  return (
    <button className={`button ${className}`} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
