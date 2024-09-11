import { zodResolver } from '@hookform/resolvers/zod';
import { area } from '@turf/area';
import { bboxPolygon } from '@turf/bbox-polygon';
import { convertArea } from '@turf/helpers';
import { SubmitHandler, useForm } from 'react-hook-form';
import { ZodType, z } from 'zod';

import { FormField } from '@/components/form/FormField';
import { SubmitButton } from '@/components/form/SubmitButton';
import { Feature as StacFeature } from '@/typings/stac';

type FormValues = {
  name: string;
  products: string;
  collectionId: string;
  aoi: string;
  apiKey: string;
  contract: string;
  licence: string;
};

const PurchaseFormSchema = z.object({
  name: z.string().min(3, { message: 'Must be at least 3 characters' }),
  products: z.string().min(3, { message: 'Must be at least 3 characters' }),
  collectionId: z.string().min(3, { message: 'Must be at least 3 characters' }),
  aoi: z.string().min(3, { message: 'Must be at least 3 characters' }),
  apiKey: z.string().min(3, { message: 'Must be at least 3 characters' }),
  contract: z.string().min(3, { message: 'Must be at least 3 characters' }),
  licence: z.string().min(3, { message: 'Must be at least 3 characters' }),
}) as ZodType<FormValues>;

type PurchaseFormProps = {
  selectedItem: StacFeature;
};

const defaultValues: FormValues = {
  name: '',
  products: '',
  collectionId: '',
  aoi: '',
  apiKey: '',
  contract: '',
  licence: '',
};

export const PurchaseForm = ({ selectedItem }: PurchaseFormProps) => {
  const itemBboxPolygon = bboxPolygon(selectedItem.bbox);
  const aoiInMetres = area(itemBboxPolygon);
  const aoiInKilometers = convertArea(aoiInMetres);
  const displayArea = Math.round(aoiInKilometers * 10) / 10;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    mode: 'onBlur',
    resolver: zodResolver(PurchaseFormSchema),
    defaultValues: { ...defaultValues, aoi: `${displayArea} km2` },
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => console.log('SUBMIT FORM DATA: ', data);

  return (
    <form className="form" onSubmit={handleSubmit(onSubmit)}>
      <FormField<FormValues>
        error={errors.name}
        label="OrderName:"
        name="name"
        placeholder="Enter an Order ID"
        register={register}
        type="text"
      />

      <FormField<FormValues>
        error={errors.products}
        label="Products:"
        name="products"
        register={register}
        type="text"
      />

      <FormField<FormValues>
        error={errors.collectionId}
        label="Collection ID:"
        name="collectionId"
        register={register}
        type="text"
      />

      <FormField<FormValues>
        disabled
        error={errors.aoi}
        label="Order Size:"
        name="aoi"
        register={register}
        type="text"
      />

      <FormField<FormValues>
        error={errors.apiKey}
        label="API Key:"
        name="apiKey"
        register={register}
        type="text"
      />

      <FormField<FormValues>
        error={errors.contract}
        label="Contract:"
        name="contract"
        register={register}
        type="text"
      />

      <FormField<FormValues>
        error={errors.licence}
        label="Licence:"
        name="licence"
        register={register}
        type="text"
      />

      <SubmitButton>Create Order</SubmitButton>
    </form>
  );
};
