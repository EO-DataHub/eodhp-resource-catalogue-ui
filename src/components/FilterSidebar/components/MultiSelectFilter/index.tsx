import { FilterData } from "../../types";
import './styles.scss'

const MultiSelectFilter: React.FC<{ filterData: FilterData }> = ({ filterData }) => {
  return (
    <div className="multi-select-filter">
      <div className="filter-header">
        <h4>{filterData.name}</h4>
        </div>
      <div className="filter-options">

        {filterData.options.map((option) => (
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
