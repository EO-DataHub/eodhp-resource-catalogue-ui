import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { SubmitHandler, useForm } from 'react-hook-form';
import { ZodType, z } from 'zod';

import { FormField } from '@/components/form/FormField';
import { RangeSliderField } from '@/components/form/RangeSliderField';
import { SelectField } from '@/components/form/SelectField';
import { SubmitButton } from '@/components/form/SubmitButton';

type SelectData = {
  value: string;
  label: string;
};

type FormValues = {
  from?: string;
  to?: string;
  dataSource: SelectData;
  itemType: SelectData;
  productBundle: SelectData;
  cloudCover: string;
};

const DATE_REGEX = /^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/;

const QueryFormSchema = z
  .object({
    from: z.string().regex(DATE_REGEX, { message: 'Must be of format YYYY-MM-DD' }),
    to: z.string().regex(DATE_REGEX, { message: 'Must be of format YYYY-MM-DD' }),
    dataSource: z.object({
      label: z.string(),
      value: z.string(),
    }),
    itemType: z.object({
      label: z.string(),
      value: z.string(),
    }),
    productBundle: z.object({
      label: z.string(),
      value: z.string(),
    }),
    cloudCover: z.string(),
  })
  .refine(({ from, to }) => to >= from, {
    message: 'To date cannot be earlier than from date.',
    path: ['from'],
  }) as ZodType<FormValues>;

const dataSources: SelectData[] = [
  {
    value: 'pneo',
    label: 'PNeo',
  },
  {
    value: 'pleiades',
    label: 'Pleiades',
  },
  {
    value: 'spot',
    label: 'SPOT',
  },
  {
    value: 'planetscope',
    label: 'PlanetScope',
  },
  {
    value: 'skysat',
    label: 'SkySat',
  },
];

const itemTypes: SelectData[] = [
  {
    value: 'psscene',
    label: 'PSScene',
  },
  {
    value: 'skysatcollect',
    label: 'SkySatCollect',
  },
];

const productBundles: SelectData[] = [
  {
    value: 'visual',
    label: 'Visual (orthorectified)',
  },
  {
    value: 'general',
    label: 'General Use (orthorectified, panshapened)',
  },
  {
    value: 'analytic',
    label: 'Analytic (orthorectified, surface reflectance)',
  },
  {
    value: 'basic',
    label: 'Basic (orthorectified, top of atmosphere)',
  },
];

const defaultValues: FormValues = {
  from: null,
  to: null,
  dataSource: dataSources[0],
  itemType: itemTypes[0],
  productBundle: productBundles[0],
  cloudCover: '100',
};

export const QueryForm = () => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    mode: 'onBlur',
    resolver: zodResolver(QueryFormSchema),
    defaultValues,
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => console.log('SUBMIT FORM DATA: ', data);

  const today = format(new Date(), 'yyyy-MM-dd');

  return (
    <form className="form" onSubmit={handleSubmit(onSubmit)}>
      <FormField<FormValues>
        error={errors.from}
        label="From:"
        min={today}
        name="from"
        register={register}
        type="date"
      />

      <FormField<FormValues>
        error={errors.to}
        label="To:"
        min={today}
        name="to"
        register={register}
        type="date"
      />

      <SelectField<FormValues>
        control={control}
        label="Data source:"
        name="dataSource"
        options={dataSources}
      />

      <SelectField<FormValues>
        control={control}
        label="Item type:"
        name="itemType"
        options={itemTypes}
      />

      <SelectField<FormValues>
        control={control}
        label="Product Bundle:"
        name="productBundle"
        options={productBundles}
      />

      <RangeSliderField<FormValues>
        label="Cloud Cover:"
        max={100}
        min={0}
        name="cloudCover"
        register={register}
      />

      <SubmitButton>Search</SubmitButton>
    </form>
  );
};
