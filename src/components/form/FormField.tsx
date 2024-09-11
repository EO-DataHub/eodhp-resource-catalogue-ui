import { FieldError, FieldValues, Path, UseFormRegister } from 'react-hook-form';

import './FormField.scss';

type FormFieldProps<T extends FieldValues> = {
  label: string;
  name: Path<T>;
  type: string;
  placeholder?: string;
  register: UseFormRegister<T>;
  error?: FieldError;
  disabled?: boolean;
  min?: string;
};

export const FormField = <T extends FieldValues>({
  label,
  name,
  type,
  placeholder,
  register,
  error,
  disabled = false,
  min,
}: FormFieldProps<T>) => (
  <>
    <label htmlFor={name}>{label}</label>
    <input
      id={name}
      placeholder={placeholder ?? ''}
      type={type}
      {...register(name)}
      className="form-field"
      disabled={disabled}
      style={{
        borderColor: error ? '#ff0000' : '#000',
      }}
      {...(type === 'date' && min ? { min } : {})}
    />
    {error && (
      <p aria-label="field-error" className="field-error">
        {error.message}
      </p>
    )}
  </>
);
