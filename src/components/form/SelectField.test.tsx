import { SubmitHandler, useForm } from 'react-hook-form';

import { render, screen, userEvent } from '@/utils/renderers';

import { SelectField } from './SelectField';

interface FormValues {
  select: string;
}

// Mock form setup
const MockForm = ({ onSubmit }: { onSubmit: SubmitHandler<FormValues> }) => {
  const { control, handleSubmit } = useForm<FormValues>();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <SelectField
        control={control}
        label="Select an option"
        name="select"
        options={[
          { value: 'option1', label: 'Option 1' },
          { value: 'option2', label: 'Option 2' },
        ]}
      />

      <button type="submit">Submit</button>
    </form>
  );
};

describe('SelectField Component', () => {
  it('should render with label and options', () => {
    render(<MockForm onSubmit={vi.fn()} />);

    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('should select an option', async () => {
    render(<MockForm onSubmit={vi.fn()} />);

    const user = userEvent.setup();
    const select = screen.getByRole('combobox');

    expect(screen.queryByText('Option 1')).not.toBeInTheDocument();

    await user.click(select);
    await user.click(screen.getByRole('option', { name: /option 1/i }));

    expect(screen.getByText('Option 1')).toBeInTheDocument();
  });
});
