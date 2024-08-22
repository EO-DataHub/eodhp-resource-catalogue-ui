import React from 'react';

export interface ButtonProps {
  className?: string;
  onClick: () => void;
  children: React.ReactNode;
}
