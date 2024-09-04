import { TbLayoutSidebarLeftCollapseFilled } from 'react-icons/tb';

import { QAFilter } from '@/components/FilterSidebar/components/QAFilter';
import { FilterData } from '@/context/FilterContext/types';
import { useApp } from '@/hooks/useApp';
import { useFilters } from '@/hooks/useFilters';

import MultiSelectFilter from './components/MultiSelectFilter';
import TemporalFilter from './components/TemporalFilter';
import TextFilter from './components/TextFilter';

import './styles.scss';

const FilterSidebar: React.FC = () => {
  const { actions: AppActions } = useApp();
  const { setFilterSidebarOpen } = AppActions;

  const { state: FilterState, actions: FilterActions } = useFilters();
  const { filterOptions: filterOptions, activeFilters: activeFilters } = FilterState;
  const { setActiveFilters, setTemporalStartFilter, setTemporalEndFilter, resetFilters } =
    FilterActions;

  const renderFilterComponent = (filter: FilterData) => {
    switch (filter.type) {
      case 'multi-select':
        return <MultiSelectFilter filterData={filter} />;
      case 'date-range':
        return (
          <TemporalFilter
            filterData={filter}
            value={activeFilters.temporal}
            onEndDateChange={(value: string) => {
              setTemporalEndFilter(value);
            }}
            onStartDateChange={(value: string) => {
              setTemporalStartFilter(value);
            }}
          />
        );
      case 'text-input':
        return (
          <TextFilter
            placeholder={filter.name}
            value={activeFilters.textQuery}
            onFilterChange={(value: string) =>
              setActiveFilters({ ...activeFilters, textQuery: value })
            }
          />
        );
      case 'combobox':
        return (
          <QAFilter
            filterData={filter}
            onChange={(event) =>
              setActiveFilters({ ...activeFilters, qualityAssurance: event.target.value })
            }
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className="filter-sidebar">
        <div className="filter-title">
          <span>Filter By</span>
        </div>

        <div className="filter-body">
          {filterOptions?.map((filter: FilterData) => (
            <div key={`fs-${filter.name}`} className="filter">
              {renderFilterComponent(filter)}
            </div>
          ))}
        </div>

        <div className="filter-footer">
          <button onClick={() => resetFilters()}>Reset</button>
        </div>
      </div>

      <button
        aria-label="Collapse Sidebar Close"
        className="filter-collapse-close unstyled-button"
        onClick={() => setFilterSidebarOpen(false)}
      >
        <TbLayoutSidebarLeftCollapseFilled />
      </button>
    </>
  );
};

export default FilterSidebar;
