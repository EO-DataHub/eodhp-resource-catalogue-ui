import { ReactNode } from 'react';

import './SubmitButton.scss';

type SubmitButtonProps = {
  children: string | ReactNode;
};

export const SubmitButton = ({ children }: SubmitButtonProps) => {
  return (
    <button className="submit-button" type="submit">
      {children}
    </button>
  );
};
