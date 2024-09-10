import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import Select, { GroupBase, Props as SelectProps } from 'react-select';

type OptionType = {
  value: string;
  label: string;
};

type SelectFieldProps<T extends FieldValues> = {
  label: string;
  name: Path<T>;
  control: Control<T>;
  options: OptionType[];
  placeholder?: string;
  isSearchable?: boolean;
} & Omit<SelectProps<OptionType, boolean, GroupBase<OptionType>>, 'options'>;

export const SelectField = <T extends FieldValues>({
  label,
  name,
  control,
  options,
  isSearchable = true,
  ...rest
}: SelectFieldProps<T>) => {
  return (
    <>
      <label htmlFor={name}>{label}</label>
      <Controller
        control={control}
        name={name}
        render={({ field, fieldState }) => (
          <>
            <Select
              id={name}
              name={name}
              {...field}
              isSearchable={isSearchable}
              options={options}
              {...rest}
            />

            {fieldState.error && <p className="field-error">{fieldState.error.message}</p>}
          </>
        )}
      />
    </>
  );
};
