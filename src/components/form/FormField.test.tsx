import { SubmitHandler, UseFormRegister, useForm } from 'react-hook-form';

import { render, screen, userEvent, waitFor } from '@/utils/renderers';

import { FormField } from './FormField';

interface FormValues {
  name: string;
  startDate: string;
}

// Mock form setup
const MockForm = ({ onSubmit }: { onSubmit: SubmitHandler<FormValues> }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormField<FormValues>
        error={errors.name}
        label="Name"
        name="name" // Explicitly type this as 'name' from FormValues
        placeholder="Enter your name"
        register={register}
        type="text"
      />

      <FormField<FormValues>
        label="Start Date"
        min="2024-09-01"
        name="startDate" // Explicitly type this as 'startDate' from FormValues
        register={register}
        type="date"
      />

      <button type="submit">Submit</button>
    </form>
  );
};

describe('FormField Component', () => {
  const mockRegister: UseFormRegister<FormValues> = () => ({
    // @ts-expect-error: Typescript error I cannot seem to resolve
    name: 'name',
    onChange: vi.fn(),
    onBlur: vi.fn(),
    ref: vi.fn(),
  });

  it('should render inputs with label', () => {
    render(<MockForm onSubmit={vi.fn()} />);

    expect(screen.getByRole('textbox', { name: /name/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/start date/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('should apply error styles when error is present', () => {
    const errorMsg = 'This field is required';

    render(
      <FormField<FormValues>
        error={{ message: errorMsg, type: 'required' }}
        label="Name"
        name="name"
        register={mockRegister}
        type="text"
      />,
    );

    expect(screen.getByRole('textbox', { name: /name/i })).toHaveStyle({ borderColor: '#ff0000' });
    expect(screen.getByRole('paragraph', { name: /field-error/i })).toBeInTheDocument();
  });

  it('should handle disabled state', () => {
    render(
      <FormField<FormValues>
        disabled
        label="Name"
        name="name"
        register={mockRegister}
        type="text"
      />,
    );

    expect(screen.getByRole('textbox', { name: /name/i })).toBeDisabled();
  });

  it('should apply min attribute for date input', () => {
    render(
      <FormField<FormValues>
        label="Start Date"
        min="2024-09-01"
        name="startDate"
        register={mockRegister}
        type="date"
      />,
    );

    expect(screen.getByLabelText('Start Date')).toHaveAttribute('min', '2024-09-01');
  });

  it('should submit form with user input', async () => {
    const onSubmit = vi.fn();

    render(<MockForm onSubmit={onSubmit} />);

    await userEvent.type(screen.getByRole('textbox', { name: /name/i }), 'John Doe');
    await userEvent.type(screen.getByLabelText('Start Date'), '2024-09-02');

    await userEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        {
          name: 'John Doe',
          startDate: '2024-09-02',
        },
        expect.anything(),
      );
    });
  });
});
