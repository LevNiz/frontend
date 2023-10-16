import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import Select from 'react-select';
import { fetchParcelCategories } from '../../api/parcels';
import attention from './../../assets/icons/attention.svg';
import OrderDeliveryTariffs from './OrderDeliveryTariffs';

const OrderDeliveryForm = ({ state, onSubmit, onHandleTariff, cost }) => {
  const { cities } = useSelector((state) => state?.cities);

  const [parcelData, setParcelData] = useState([]);
  const [parcelSize, setParcelSize] = useState(state?.orderData?.parcelSize);
  const [scopeWeight, setScopeWeight] = useState(null);
  const [selectedSenderCity, setSelectedSenderCity] = useState(
    state?.orderData?.senderCity
  );
  const [selectedReceiverCity, setSelectedReceiverCity] = useState(
    state?.orderData?.receiverCity
  );

  const handleSenderCityChange = (selectedOption) => {
    setSelectedSenderCity(selectedOption);
  };

  const handleReceiverCityChange = (selectedOption) => {
    setSelectedReceiverCity(selectedOption);
  };

  const senderCityOptions = cities.map((el) => ({
    value: el.id,
    label: `${el.nameRu}, ${el.country.nameRu}`,
    fromCountry: el.country.id,
    isDisabled: selectedReceiverCity && el.id === selectedReceiverCity.value,
  }));

  const receiverCityOptions = cities.map((el) => ({
    value: el.id,
    label: `${el.nameRu}, ${el.country.nameRu}`,
    toCountry: el.country.id,
    isDisabled: selectedSenderCity && el.id === selectedSenderCity.value,
  }));

  const {
    handleSubmit,
    control,
    register,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      senderCity: state?.orderData?.senderCity,
      receiverCity: state?.orderData?.receiverCity,
      parcelSize: state?.orderData?.parcelSize,
      length: state?.orderData?.length,
      width: state?.orderData?.width,
      height: state?.orderData?.height,
    },
  });

  const parcelSizeSelect = watch('parcelSize');
  const length = watch('length');
  const width = watch('width');
  const height = watch('height');
  const weight = watch('weight');

  useEffect(() => {
    if (
      weight !== undefined &&
      height !== undefined &&
      width !== undefined &&
      length !== undefined
    ) {
      const parcelWeight = (width * length * height) / 5000;
      setScopeWeight(parcelWeight > weight ? parcelWeight : null);
    }
  }, [weight, height, width, length]);

  useEffect(() => {
    (async () => {
      const { success, data } = await fetchParcelCategories();
      if (success) {
        setParcelData(data);
      }
    })();
  }, []);

  return (
    <>
      <form className='pl-10 mb-6'>
        <div className='grid grid-cols-3 gap-6'>
          <div>
            <p className='font-medium mb-2'>Город отправки</p>
            <Controller
              name='senderCity'
              control={control}
              rules={{ required: 'Поле обязательно к заполнению!' }}
              render={({ field }) => (
                <Select
                  {...field}
                  options={senderCityOptions}
                  placeholder='Выберите город'
                  onChange={(selectedOption) => {
                    field.onChange(selectedOption);
                    handleSenderCityChange(selectedOption);
                  }}
                  styles={{
                    control: (provided, state) => ({
                      ...provided,
                      boxShadow: state.isFocused ? 0 : 0,
                      border: state.isFocused ? '1px solid #999' : '',
                      '&:hover': {
                        border: state.isFocused ? '1px solid #999' : '',
                      },
                      padding: '8px',
                    }),
                  }}
                />
              )}
            />
            {errors?.senderCity && (
              <p className='text-red-500 mt-1 text-sm'>
                {errors?.senderCity.message || 'Error!'}
              </p>
            )}
          </div>
          <div>
            <p className='font-medium mb-2'>Город назначения</p>
            <Controller
              name='receiverCity'
              control={control}
              rules={{ required: 'Поле обязательно к заполнению!' }}
              render={({ field }) => (
                <Select
                  {...field}
                  options={receiverCityOptions}
                  placeholder='Выберите город'
                  onChange={(selectedOption) => {
                    field.onChange(selectedOption);
                    handleReceiverCityChange(selectedOption);
                  }}
                  styles={{
                    control: (provided, state) => ({
                      ...provided,
                      boxShadow: state.isFocused ? 0 : 0,
                      border: state.isFocused ? '1px solid #999' : '',
                      '&:hover': {
                        border: state.isFocused ? '1px solid #999' : '',
                      },
                      padding: '8px',
                    }),
                  }}
                />
              )}
            />
            {errors?.receiverCity && (
              <p className='text-red-500 mt-1 text-sm'>
                {errors?.receiverCity.message || 'Error!'}
              </p>
            )}
          </div>
          <div>
            <p className='font-medium mb-2'>Размер посылки</p>
            <Controller
              name='parcelSize'
              control={control}
              rules={{ required: 'Поле обязательно к заполнению!' }}
              render={({ field }) => (
                <Select
                  {...field}
                  options={[
                    {
                      value: 'custom',
                      label: 'Точные',
                    },
                    ...(parcelData || []).map((el) => ({
                      value: el?.id,
                      label: `${el?.nameRu} (${el?.length}x${el?.width}x${el?.height} см)`,
                      weight: el?.weight,
                    })),
                  ]}
                  placeholder='Выберите размер'
                  isSearchable={false}
                  onChange={(selectedOption) => {
                    field.onChange(selectedOption);
                    setParcelSize(selectedOption);
                  }}
                  styles={{
                    control: (provided, state) => ({
                      ...provided,
                      boxShadow: state.isFocused ? 0 : 0,
                      border: state.isFocused ? '1px solid #999' : '',
                      '&:hover': {
                        border: state.isFocused ? '1px solid #999' : '',
                      },
                      padding: '8px',
                    }),
                  }}
                />
              )}
            />
            {errors?.parcelSize && (
              <p className='text-red-500 mt-1 text-sm'>
                {errors?.parcelSize.message || 'Error!'}
              </p>
            )}
          </div>
          {parcelSize?.label === 'Точные' ? (
            <>
              <div>
                <p className='font-medium mb-2'>
                  Габариты, см
                  <span className='text-xs ml-2 font-light'>
                    (длина, ширина, высота)
                  </span>
                </p>
                <div className='flex justify-between items-center'>
                  <input
                    className='w-full border border-colGray2 p-[14px] rounded-[4px] focus:border-black focus:outline-none'
                    placeholder='Длина'
                    type='number'
                    step='0.000001'
                    {...register('length', {
                      required: true,
                    })}
                  />
                  <span className='mx-2'>x</span>
                  <input
                    className='w-full border border-colGray2 p-[14px] rounded-[4px] focus:border-black focus:outline-none'
                    placeholder='Ширина'
                    type='number'
                    step='0.000001'
                    {...register('width', {
                      required: true,
                    })}
                  />
                  <span className='mx-2'>x</span>
                  <input
                    className='w-full border border-colGray2 p-[14px] rounded-[4px] focus:border-black focus:outline-none'
                    placeholder='Высота'
                    type='number'
                    step='0.000001'
                    {...register('height', {
                      required: true,
                    })}
                  />
                </div>
              </div>
              <div>
                <p className='font-medium mb-2'>Вес посылки, кг</p>
                <div className='flex justify-between items-center max-w-[140px]'>
                  <input
                    className='w-full border border-colGray2 p-[14px] rounded-[4px] focus:border-black focus:outline-none'
                    placeholder='Вес'
                    type='number'
                    step='0.000001'
                    defaultValue='0.1'
                    {...register('weight', {
                      required: true,
                    })}
                  />
                </div>
              </div>
            </>
          ) : (
            ''
          )}
        </div>
        <div className='flex justify-between items-end mt-5'>
          {parcelSize?.label === 'Точные' ? (
            <div>
              {scopeWeight !== null ? (
                <>
                  <p className='font-medium leading-4'>Объёмный вес, кг</p>
                  <p className='text-[12px]'>
                    Объёмный вес - рассчитывается по формуле: длина * ширина *
                    высота в см / 5000
                  </p>
                  <div className='border border-colGray2 p-[14px] rounded-[4px] w-max min-w-[110px] mb-3 mt-2'>
                    {scopeWeight}
                  </div>
                  <div className='flex items-start p-3 w-max rounded-lg bg-orange-200'>
                    <img className='mt-[2px]' src={attention} alt='*' />
                    <div className='ml-2'>
                      <h5 className='text-red-500 font-medium text-sm'>
                        Обратите внимание!
                      </h5>
                      <p className='text-xs'>
                        По габаритам объёмный вес превышает физический, <br />
                        поэтому услуги будут рассчитаны по объёмному весу.
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                ''
              )}
            </div>
          ) : parcelSizeSelect?.weight ? (
            <div>
              <p className='font-medium leading-4'>Вес, кг</p>
              <div className='border border-colGray2 p-[14px] rounded-[4px] w-max min-w-[110px] mb-3 mt-2'>
                До {parcelSizeSelect?.weight} кг
              </div>
            </div>
          ) : (
            <div></div>
          )}
        </div>
      </form>
      <OrderDeliveryTariffs
        state={state}
        parcelCost={cost}
        onHandleTariff={onHandleTariff}
      />
      <button
        onClick={handleSubmit(onSubmit)}
        type='submit'
        className='font-medium hover:opacity-80 p-3 flex justify-center items-center ml-auto rounded-lg bg-black text-white duration-150 max-w-[280px] w-full mt-5'
      >
        Рассчитать
      </button>
    </>
  );
};

export default OrderDeliveryForm;
