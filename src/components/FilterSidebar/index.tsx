import { useContext } from "react";
import MultiSelectFilter from "./components/MultiSelectFilter";
import TemporalFilter from "./components/TemporalFilter";
import './styles.scss'
import { FilterContext } from "@/context/FilterContext";
import { FilterData } from "@/context/FilterContext/types";


const FilterSidebar: React.FC = (): React.ReactNode => {
  const { state } = useContext(FilterContext);
  const { filterOptions: filterOptions } = state;


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
    <div className="filter-sidebar">
      <div className="filter-header">
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
  );

};

export default FilterSidebar;
