import { FilterData } from "@/context/FilterContext/types";
import './styles.scss'

const TemporalFilter: React.FC<{ filterData: FilterData }> = ({ filterData }) => {
  return (
    <div className="temporal-filter">
      <div className="filter-header">
        <span>{filterData.name}</span>
      </div>
      <div className="filter-options">
        <div className="date-picker-container">
          {/* Date picker for start date */}
          <label>Start</label>
          <input type="date" className="date-picker start-date" />
        </div>
        <div className="date-picker-container">
          {/* Date picker for end date */}
          <label>End</label>
          <input type="date" className="date-picker end-date" />
        </div>
      </div>
    </div>
  );
}

export default TemporalFilter;
