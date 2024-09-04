import { FilterData } from '@/context/FilterContext/types';
import { render, screen, userEvent } from '@/utils/renderers';

import { QAFilter } from './QAFilter';

// Mock data for the FilterData type
const filterData: FilterData = {
  name: 'Test Filter',
  type: 'combobox',
  options: [
    { value: 'pass', label: 'Pass' },
    { value: 'partial', label: 'Partial' },
    { value: 'fail', label: 'Fail' },
  ],
};

describe('QAFilter Component', () => {
  it('should render correctly with filter data', () => {
    render(<QAFilter filterData={filterData} onChange={() => {}} />);

    // Check if the label is rendered
    expect(screen.getByRole('combobox', { name: /test filter/i })).toBeInTheDocument();

    // Check if the options are rendered correctly
    expect(screen.getByRole('option', { name: /please select an option/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /pass/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /partial/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /fail/i })).toBeInTheDocument();
    expect(screen.getByText('Please select an option')).toBeInTheDocument();
  });

  it('should call onChange when an option is selected', async () => {
    const user = userEvent.setup();

    const handleChange = vi.fn();

    render(<QAFilter filterData={filterData} onChange={handleChange} />);

    // Select the dropdown
    const selectElement = screen.getByRole('combobox', { name: /test filter/i });

    const value = 'partial';

    // Interact with the combobox using userEvent
    await user.selectOptions(selectElement, value);

    // Ensure the event handler is called
    expect(selectElement).toHaveValue(value);

    // Ensure the event handler is called with the correct event
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange.mock.calls[0][0].target.value).toBe(value);
  });

  it('should display the correct selected option', async () => {
    const user = userEvent.setup();

    render(<QAFilter filterData={filterData} onChange={() => {}} />);

    // Select the dropdown
    const selectElement = screen.getByRole('combobox', {
      name: /test filter/i,
    }) as HTMLSelectElement;

    const value = 'fail';

    // Interact with the combobox using userEvent
    await user.selectOptions(selectElement, value);

    // Ensure the select element displays the correct value
    expect(selectElement.value).toBe(value);
  });
});
