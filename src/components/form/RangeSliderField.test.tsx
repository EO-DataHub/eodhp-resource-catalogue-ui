import { UseFormRegisterReturn } from 'react-hook-form';

import { render, screen, userEvent } from '@/utils/renderers';

import { RangeSliderField } from './RangeSliderField';

describe('RangeSliderField Component', () => {
  const mockRegister = vi.fn().mockReturnValue({} as UseFormRegisterReturn);

  it('should render the range slider with correct label and attributes', () => {
    render(
      <RangeSliderField
        label="Select a value"
        max={100}
        min={0}
        name="range"
        register={mockRegister}
      />,
    );

    const slider = screen.getByRole('slider', { name: /select a value/i });

    expect(slider).toBeInTheDocument();
    expect(slider).toHaveAttribute('min', '0');
    expect(slider).toHaveAttribute('max', '100');
  });

  it('should allow the user to interact with the slider', async () => {
    const user = userEvent.setup();
    render(
      <RangeSliderField
        label="Select a value"
        max={100}
        min={0}
        name="range"
        register={mockRegister}
      />,
    );

    const slider = screen.getByRole('slider', { name: /select a value/i });
    await user.type(slider, '50');

    expect(slider).toHaveValue('50');
  });

  it('should disable the slider when the disabled prop is true', () => {
    render(
      <RangeSliderField
        disabled
        label="Select a value"
        max={100}
        min={0}
        name="range"
        register={mockRegister}
      />,
    );

    expect(screen.getByRole('slider', { name: /select a value/i })).toBeDisabled();
  });
});
