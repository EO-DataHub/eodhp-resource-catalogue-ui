import { FilterData } from "@/context/FilterContext/types";
import './styles.scss'

const MultiSelectFilter: React.FC<{ filterData: FilterData }> = ({ filterData }) => {
  return (
    <div className="multi-select-filter">
      <div className="filter-header">
        <span>{filterData.name}</span>
      </div>
      <div className="filter-options">
        {filterData?.options?.map((option) => (
          <div key={option.id} className="filter-option">
            <input type="checkbox" id={option.name} name={option.name} value={option.name} />
            <label htmlFor={option.name}>{option.name}</label>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MultiSelectFilter;
