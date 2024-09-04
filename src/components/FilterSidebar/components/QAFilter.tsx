import { ChangeEvent, useState } from 'react';

import { FilterData } from '@/context/FilterContext/types';

type QAFilterProps = {
  filterData: FilterData;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
};

export const QAFilter = ({ filterData, onChange }: QAFilterProps) => {
  const [selectedItem, setSelectedItem] = useState('');

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedItem(event.target.value);
    onChange(event);
  };

  return (
    <div>
      <label htmlFor="options">{filterData.name}</label>

      <select id="options" value={selectedItem} onChange={handleChange}>
        <option disabled={true} value="">
          Please select an option
        </option>

        {filterData.options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};
