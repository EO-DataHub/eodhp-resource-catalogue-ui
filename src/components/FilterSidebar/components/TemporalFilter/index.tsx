import { FilterData } from '@/context/FilterContext/types';
import { formatDate } from '@/utils/date';

import './styles.scss';

type TemporalFilterProps = {
  filterData: FilterData;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  value: { start: string; end: string };
};

const TemporalFilter = ({
  filterData,
  onStartDateChange,
  onEndDateChange,
  value,
}: TemporalFilterProps) => {
  return (
    <div className="temporal-filter">
      <div className="filter-header">
        <span>{filterData.name}</span>
      </div>
      <div className="filter-options">
        <div className="date-picker-container">
          {/* Date picker for start date */}
          <label htmlFor="startDate">Start</label>
          <input
            className="date-picker start-date"
            id="startDate"
            name="startDate"
            type="date"
            value={value.start}
            onChange={(e) => onStartDateChange(formatDate(e.target.value))}
          />
        </div>
        <div className="date-picker-container">
          {/* Date picker for end date */}
          <label htmlFor="endDate">End</label>
          <input
            className="date-picker end-date"
            id="endDate"
            name="endDate"
            type="date"
            value={value.end}
            onChange={(e) => onEndDateChange(formatDate(e.target.value))}
          />
        </div>
      </div>
    </div>
  );
};

export default TemporalFilter;
