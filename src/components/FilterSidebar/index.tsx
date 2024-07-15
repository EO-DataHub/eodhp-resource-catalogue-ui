import MultiSelectFilter from "./components/MultiSelectFilter";
import { FilterData } from "./types";
import './styles.scss'

const exampleFilterData: FilterData[] = [
  {
    id: 1,
    name: "Filter 1",
    options: [
      { id: 1, name: "Option 1" },
      { id: 2, name: "Option 2" },
    ],
  },
  {
    id: 2,
    name: "Filter 2",
    options: [
      { id: 1, name: "Option 1" },
      { id: 2, name: "Option 2" },
      { id: 3, name: "Option 3" },
      { id: 4, name: "Option 4" },
      { id: 5, name: "Option 5" },
      { id: 6, name: "Option 6" },
    ],
  },
  {
    id: 3,
    name: "Filter 3",
    options: [
      { id: 1, name: "Option 1" },
      { id: 2, name: "Option 2" },
      { id: 3, name: "Option 3" },
    ],
  },
];

const FilterSidebar: React.FC = () => {
  return (
    <div className="filter-sidebar">
      <div className="filter-header">
        <h4>Filter By</h4>
      </div>

      <div className="filter-body">
        {exampleFilterData.map((filter) => (
          <div key={filter.id} className="filter">
            <MultiSelectFilter filterData={filter} />
          </div>
        ))}
      </div>

    </div>
  );
}

export default FilterSidebar;
