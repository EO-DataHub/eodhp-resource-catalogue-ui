import React from 'react';

export const Axe = () => {
  // Check we are not in production, axe should only be used during development.
  if (typeof window !== 'undefined' && import.meta.env.MODE === 'development') {
    Promise.all([import('@axe-core/react'), import('react-dom')]).then(([axe, ReactDOM]) =>
      axe.default(React, ReactDOM, 1000),
    );
  }

  return null;
};
