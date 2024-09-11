import { ReactNode } from 'react';

import { FaMinus, FaPlus } from 'react-icons/fa';

import './Accordion.scss';

type AccordionItemProps = {
  label: string;
  isActive: boolean;
  onClick: () => void;
  children: ReactNode;
};

export const AccordionItem = ({ label, onClick, isActive, children }: AccordionItemProps) => {
  return (
    <li className={`accordion-item`}>
      <button className={`title ${isActive ? 'active' : ''}`} onClick={onClick}>
        {label}
        <span className="control">{isActive ? <FaMinus /> : <FaPlus />}</span>
      </button>

      {isActive ? <div className="content">{children}</div> : null}
    </li>
  );
};
