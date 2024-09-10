import { addDays, format } from 'date-fns';

import { render, screen, userEvent } from '@/utils/renderers';

import { QueryForm } from './QueryForm';

describe('QueryForm Component', () => {
  it('should render the form fields correctly', () => {
    render(<QueryForm />);

    // Check if all form fields and submit button are rendered
    expect(screen.getByLabelText('From:')).toBeInTheDocument();
    expect(screen.getByLabelText('To:')).toBeInTheDocument();
    expect(screen.getByText('Data source:')).toBeInTheDocument();
    expect(screen.getByText('Item type:')).toBeInTheDocument();
    expect(screen.getByText('Product Bundle:')).toBeInTheDocument();
    expect(screen.getByRole('slider', { name: 'Cloud Cover:' })).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  it('should validate date format and shows error for incorrect date', async () => {
    const user = userEvent.setup();
    render(<QueryForm />);

    // Enter invalid dates
    await user.type(screen.getByLabelText('From:'), '2021-02-30'); // Invalid date
    await user.type(screen.getByLabelText('To:'), '2021-02-25'); // Valid date

    // Try submitting the form
    await user.click(screen.getByRole('button', { name: /search/i }));

    // Expect validation errors for invalid date
    expect(screen.getByRole('paragraph', { name: /field-error/i })).toBeInTheDocument();
    expect(screen.getByText('Must be of format YYYY-MM-DD')).toBeInTheDocument();
  });

  it('should validate that "To" date cannot be earlier than "From" date', async () => {
    const user = userEvent.setup();
    render(<QueryForm />);

    // Enter valid but conflicting dates e.g. from tomorrow, to today.
    const today = new Date();
    const tomorrow = addDays(today, 1);
    await user.type(screen.getByLabelText('From:'), format(tomorrow, 'yyyy-MM-dd'));
    await user.type(screen.getByLabelText('To:'), format(today, 'yyyy-MM-dd'));

    // Try submitting the form
    await user.click(screen.getByRole('button', { name: /search/i }));

    // Expect validation error about date mismatch
    expect(screen.queryByText('To date cannot be earlier than from date.')).toBeInTheDocument();
  });

  it('should submit the form with valid data', async () => {
    const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    const user = userEvent.setup();
    render(<QueryForm />);

    // Enter valid data
    const today = new Date();
    const tomorrow = addDays(today, 1);
    await user.type(screen.getByLabelText('From:'), format(today, 'yyyy-MM-dd'));
    await user.type(screen.getByLabelText('To:'), format(tomorrow, 'yyyy-MM-dd'));
    await user.type(screen.getByRole('slider', { name: 'Cloud Cover:' }), '50');

    // Submit form
    await user.click(screen.getByRole('button', { name: /search/i }));

    // Expect no validation errors
    expect(screen.queryByText('Must be of format YYYY-MM-DD')).not.toBeInTheDocument();
    expect(screen.queryByText('To data cannot be earlier than from date.')).not.toBeInTheDocument();

    expect(consoleLogSpy).toHaveBeenCalledWith('SUBMIT FORM DATA: ', {
      from: format(today, 'yyyy-MM-dd'),
      to: format(tomorrow, 'yyyy-MM-dd'),
      cloudCover: '100',
      // Ensure these match your form data setup
      dataSource: { value: 'pneo', label: 'PNeo' }, // Example values
      itemType: { value: 'psscene', label: 'PSScene' },
      productBundle: { value: 'visual', label: 'Visual (orthorectified)' },
    });

    // Clean up the spy
    consoleLogSpy.mockRestore();
  });

  it('should handle selection of data source, item type, and product bundle', async () => {
    const user = userEvent.setup();
    render(<QueryForm />);

    // Use getAllByRole to find all comboboxes (multiple react-select components)
    const comboboxes = screen.getAllByRole('combobox');
    expect(comboboxes).toHaveLength(3);

    // Interact with the first combobox (Data Source)
    await user.click(comboboxes[0]);
    await user.click(screen.getByText('Pleiades'));
    expect(screen.getByText('Pleiades')).toBeInTheDocument();

    // Interact with the second combobox (Item Type)
    await user.click(comboboxes[1]);
    await user.click(screen.getByText('SkySatCollect'));
    expect(screen.getByText('SkySatCollect')).toBeInTheDocument();

    // Interact with the second combobox (Product Bundle)
    await user.click(comboboxes[2]);
    await user.click(screen.getByText('General Use (orthorectified, panshapened)'));
    expect(screen.getByText('General Use (orthorectified, panshapened)')).toBeInTheDocument();
  });
});
