import { FilterData } from './types';

// Placeholder for now, this will be dynamically generated based on the data
export const exampleFilterData: FilterData[] = [
  {
    type: 'text-input',
    name: 'Search',
  },
  {
    type: 'date-range',
    name: 'Temporal Extent',
  },
  {
    name: 'Product Type',
    type: 'multi-select',
    options: [
      { id: 1, name: 'Satellite Imagery' },
      { id: 2, name: 'Aerial Imagery' },
      { id: 3, name: 'Lidar' },
      { id: 4, name: 'Radar' },
      { id: 5, name: 'Thermal Imagery' },
      { id: 6, name: 'Multispectral Imagery' },
    ],
  },
  {
    name: 'Quality Assurance',
    type: 'combobox',
    options: [
      { value: 'pass', label: 'Pass' },
      { value: 'partial', label: 'Partial' },
      { value: 'fail', label: 'Fail' },
    ],
  },
  {
    name: 'License',
    type: 'multi-select',
    options: [
      { id: 1, name: 'CC-BY' },
      { id: 2, name: 'Proprietary' },
      { id: 3, name: 'Open Data' },
    ],
  },
  {
    name: 'Service Type',
    type: 'multi-select',
    options: [
      { id: 1, name: 'Commercial' },
      { id: 2, name: 'Research' },
      { id: 3, name: 'Government' },
      { id: 4, name: 'Community' },
    ],
  },
  {
    name: 'Data Type',
    type: 'multi-select',
    options: [
      { id: 1, name: 'Notebooks' },
      { id: 2, name: 'Datasets' },
      { id: 3, name: 'Workflows' },
    ],
  },
];
