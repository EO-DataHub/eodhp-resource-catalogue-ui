import { FilterData } from "./types";

// Placeholder for now, this will be dynamically generated based on the data
export const exampleFilterData: FilterData[] = [
  {
    id: 0,
    type: "date-range",
    name: "Temporal Extent",
  },
  {
    id: 1,
    name: "Filter 1",
    type: "multi-select",
    options: [
      { id: 1, name: "Option 1" },
      { id: 2, name: "Option 2" },
    ],
  },
  {
    id: 2,
    name: "Filter 2",
    type: "multi-select",
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
    type: "multi-select",
    options: [
      { id: 1, name: "Option 1" },
      { id: 2, name: "Option 2" },
      { id: 3, name: "Option 3" },
    ],
  },
];