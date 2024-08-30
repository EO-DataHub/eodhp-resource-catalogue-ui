import { ChangeEvent } from 'react';

import { FilterData } from '@/context/FilterContext/types';

type QAFilterProps = {
  filterData: FilterData;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
};

export const QAFilter = ({ filterData, onChange }: QAFilterProps) => (
  <div>
    <label htmlFor="options">{filterData.name}</label>

    <select id="options" onChange={onChange}>
      <option value="none">Please select an option</option>

      {filterData.options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);
