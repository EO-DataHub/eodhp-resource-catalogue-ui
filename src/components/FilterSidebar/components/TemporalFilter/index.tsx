import DatePicker from 'react-datepicker';

import { FilterData } from '@/context/FilterContext/types';
import { formatDate } from '@/utils/date';

import 'react-datepicker/dist/react-datepicker.css';

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
          <DatePicker
            showMonthDropdown
            showYearDropdown
            className="date-picker start-date"
            dateFormat="yyyy/MM/dd"
            id="startDate"
            name="startDate"
            selected={value.start ? new Date(value.start) : new Date()}
            onChange={(date: Date) => onStartDateChange(formatDate(date))}
          />
        </div>
        <div className="date-picker-container">
          {/* Date picker for end date */}
          <label htmlFor="endDate">End</label>
          <DatePicker
            showMonthDropdown
            showYearDropdown
            className="date-picker end-date"
            dateFormat="yyyy/MM/dd"
            id="endDate"
            name="endDate"
            selected={value.end ? new Date(value.end) : new Date()}
            onChange={(date: Date) => onEndDateChange(formatDate(date))}
          />
        </div>
      </div>
    </div>
  );
};

export default TemporalFilter;
