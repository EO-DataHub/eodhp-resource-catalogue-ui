import { FilterData } from '@/context/FilterContext/types';
import './styles.scss';

type MultiSelectFilterProps = {
  filterData: FilterData;
};

const MultiSelectFilter = ({ filterData }: MultiSelectFilterProps) => {
  return (
    <div className="multi-select-filter">
      <div className="filter-header">
        <span>{filterData.name}</span>
      </div>
      <div className="filter-options">
        {filterData?.options?.map((option) => (
          <div key={option.id} className="filter-option">
            <input id={option.name} name={option.name} type="checkbox" value={option.name} />
            <label htmlFor={option.name}>{option.name}</label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MultiSelectFilter;
