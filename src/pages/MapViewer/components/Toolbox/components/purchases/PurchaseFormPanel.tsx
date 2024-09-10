import { useState } from 'react';

import { Accordion } from '@/components/accordion/Accordion';
import { AccordionItem } from '@/components/accordion/AccordionItem';
import { useToolbox } from '@/hooks/useToolbox';

import { PurchaseForm } from './PurchaseForm';
import { QueryForm } from './QueryForm';

import './PurchaseFormPanel.scss';

export const PurchaseFormPanel = () => {
  const {
    state: { selectedCollectionItem },
    actions: { setActivePage },
  } = useToolbox();

  const [selectedItem, setSelectedItem] = useState(null);

  return (
    <div>
      <div className="toolbox__header">
        <button
          className="button-link"
          onClick={() => {
            setActivePage('items');
          }}
        >
          <span>&lt; Return to Items</span>
        </button>
      </div>

      <Accordion>
        <AccordionItem
          isActive={selectedItem === 'Query type'}
          label="Query type"
          onClick={() => {
            setSelectedItem((prev) => (prev === 'Query type' ? null : 'Query type'));
          }}
        >
          <QueryForm />
        </AccordionItem>

        <AccordionItem
          isActive={selectedItem === 'Create Order'}
          label="Create Order"
          onClick={() => {
            setSelectedItem((prev) => (prev === 'Create Order' ? null : 'Create Order'));
          }}
        >
          <PurchaseForm selectedItem={selectedCollectionItem} />
        </AccordionItem>
      </Accordion>
    </div>
  );
};
