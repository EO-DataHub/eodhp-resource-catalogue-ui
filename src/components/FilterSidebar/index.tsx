import { FilterData } from "@/context/FilterContext/types";
import { useApp } from "@/hooks/useApp";
import { useFilters } from "@/hooks/useFilters";
import { TbLayoutSidebarLeftCollapseFilled } from "react-icons/tb";
import MultiSelectFilter from "./components/MultiSelectFilter";
import TemporalFilter from "./components/TemporalFilter";
import './styles.scss';

const FilterSidebar: React.FC = () => {
  const { actions: AppActions } = useApp();
  const { setFilterSidebarOpen } = AppActions;

  const { state: FilterState } = useFilters();
  const { filterOptions: filterOptions } = FilterState;

  const renderFilterComponent = (filter: FilterData) => {
    switch (filter.type) {
      case "multi-select":
        return <MultiSelectFilter filterData={filter} />;
      case "date-range":
        return <TemporalFilter filterData={filter} />;
      default:
        return null;
    }
  }

  return (
    <>
      <div className={`filter-sidebar`}>
        <div className="filter-title">
          <h4>Filter By</h4>
        </div>

        <div className="filter-body">
          {filterOptions?.map((filter: FilterData) => (
            <div key={filter.id} className="filter">
              {renderFilterComponent(filter)}
            </div>
          ))}
        </div>

        <div className="filter-footer">
          <button>Reset</button>
        </div>

      </div>

      <div className="filter-collapse-close"
        onClick={() => setFilterSidebarOpen(false)}
      >
        <TbLayoutSidebarLeftCollapseFilled />
      </div>
    </>
  );

};

export default FilterSidebar;
