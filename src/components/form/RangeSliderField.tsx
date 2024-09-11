import { Path, UseFormRegister } from 'react-hook-form';

import './RangeSliderField.scss';

type RangeSliderFieldProps<TFormValues> = {
  label: string;
  name: Path<TFormValues>;
  register: UseFormRegister<TFormValues>;
  min: number;
  max: number;
  disabled?: boolean;
};

export const RangeSliderField = <TFormValues extends Record<string, unknown>>({
  label,
  name,
  register,
  min,
  max,
  disabled = false,
}: RangeSliderFieldProps<TFormValues>) => {
  return (
    <>
      <label htmlFor={name}>{label}</label>
      <div className="range-slider">
        <input
          disabled={disabled}
          id={name}
          type="range"
          {...register(name)}
          className="form-field"
          list="values"
          max={max}
          min={min}
        />
        <datalist id="values">
          <option label="0" value="0"></option>
          <option label="25" value="25"></option>
          <option label="50" value="50"></option>
          <option label="75" value="75"></option>
          <option label="100" value="100"></option>
        </datalist>
      </div>
    </>
  );
};
