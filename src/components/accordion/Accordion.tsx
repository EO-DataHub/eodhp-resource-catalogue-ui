import { ReactNode } from 'react';

type AccordionItemProps = {
  children: ReactNode;
};

export const Accordion = ({ children }: AccordionItemProps) => {
  return <ul className="accordion">{children}</ul>;
};
