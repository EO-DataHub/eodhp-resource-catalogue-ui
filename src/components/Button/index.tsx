import React from 'react';
import './styles.scss';
import { ButtonProps } from './types';

const Button: React.FC<ButtonProps> = ({ className, onClick, children }) => {
  return (
    <button className={`button ${className}`} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
