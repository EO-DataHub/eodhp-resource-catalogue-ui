import { FilterData } from '@/context/FilterContext/types';

import './styles.scss';

const TemporalFilter: React.FC<{
  filterData: FilterData;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  value: { start: string; end: string };
}> = ({ filterData, onStartDateChange, onEndDateChange, value }) => {
  return (
    <div className="temporal-filter">
      <div className="filter-header">
        <span>{filterData.name}</span>
      </div>
      <div className="filter-options">
        <div className="date-picker-container">
          {/* Date picker for start date */}
          <label>Start</label>
          <input
            className="date-picker start-date"
            type="date"
            value={value.start}
            onChange={(e) => onStartDateChange(e.target.value)}
          />
        </div>
        <div className="date-picker-container">
          {/* Date picker for end date */}
          <label>End</label>
          <input
            className="date-picker end-date"
            type="date"
            value={value.end}
            onChange={(e) => onEndDateChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default TemporalFilter;
