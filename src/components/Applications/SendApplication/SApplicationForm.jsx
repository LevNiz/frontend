import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Select from 'react-select';
import { fetchParcelCategories } from '../../../api/parcels';
import OrderDeliveryTariffs from './SApplicationTariffs';
import attention from '../../../assets/icons/attention.svg';
import info from '../../../assets/icons/attention2.svg';
import boxSize from '../../../assets/images/box-size.jpeg';
import { fetchAllDepots } from '../../../api/depots';
import { useSelector } from 'react-redux';

const SApplicationForm = ({ state, onSubmit, onHandleTariff, cost }) => {
  const { costs } = useSelector((state) => state?.costs);

  const [fromDepotCity, setFromDepotCity] = useState([]);
  const [toDepotCity, setToDepotCity] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [parcelData, setParcelData] = useState([]);
  const [parcelSize, setParcelSize] = useState(state?.orderData?.parcelSize);
  const [scopeWeight, setScopeWeight] = useState(null);
  const [selectedTariff, setSelectedTariff] = useState(state?.tariff);
  const [selectedSenderCity, setSelectedSenderCity] = useState(
    state?.orderData?.senderCity
  );
  const [selectedReceiverCity, setSelectedReceiverCity] = useState(
    state?.orderData?.receiverCity
  );

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const allDepotsData = await fetchAllDepots();
      const fromCity = allDepotsData?.filter((depot) =>
        costs?.some((cost) => cost?.fromCity?.id === depot?.city?.id)
      );
      const toCity = allDepotsData?.filter((depot) =>
        costs?.some((cost) => cost?.toCity?.id === depot?.city?.id)
      );
      setFromDepotCity(fromCity);
      setToDepotCity(toCity);
      setIsLoading(false);
    })();
  }, [costs]);

  const handleSenderCityChange = (selectedOption) => {
    setSelectedSenderCity(selectedOption);
  };

  const handleReceiverCityChange = (selectedOption) => {
    setSelectedReceiverCity(selectedOption);
  };

  const onChoseTariff = (data) => {
    setSelectedTariff(data);
  };

  const senderCityOptions = fromDepotCity?.map((el) => ({
    value: el?.city?.id,
    label: `${el.country?.nameRu}, ${el?.city?.nameRu}`,
    fromCountry: el.country.id,
    isDisabled:
      selectedReceiverCity && el?.city?.id === selectedReceiverCity.value,
  }));

  const receiverCityOptions = toDepotCity?.map((el) => ({
    value: el?.city?.id,
    label: `${el?.country?.nameRu}, ${el?.city?.nameRu}`,
    toCountry: el.country.id,
    isDisabled:
      !selectedSenderCity ||
      !costs?.some(
        (cost) =>
          cost?.fromCity?.id === selectedSenderCity?.value &&
          cost?.toCity?.id === el?.city?.id
      ),
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
      <form className='md:pl-5 lg:pl-10 mb-6'>
        <div className='grid ld:grid-cols-2 lg:grid-cols-3 gap-6'>
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
                  isLoading={isLoading}
                  placeholder='Выберите город'
                  onChange={(selectedOption) => {
                    field.onChange(selectedOption);
                    handleSenderCityChange(selectedOption);
                  }}
                  menuPortalTarget={document.body}
                  styles={{
                    control: (provided, state) => ({
                      ...provided,
                      padding: '8px',
                      boxShadow: state.isFocused ? 0 : 0,
                      border: state.isFocused ? '1px solid #999' : '',
                      '&:hover': {
                        border: state.isFocused ? '1px solid #999' : '',
                      },
                    }),
                    menuPortal: (provided) => ({
                      ...provided,
                      zIndex: 9999999,
                    }),
                    menu: (provided) => ({
                      ...provided,
                      position: 'absolute',
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
                  isLoading={isLoading}
                  placeholder='Выберите город'
                  onChange={(selectedOption) => {
                    field.onChange(selectedOption);
                    handleReceiverCityChange(selectedOption);
                  }}
                  menuPortalTarget={document.body}
                  styles={{
                    control: (provided, state) => ({
                      ...provided,
                      padding: '8px',
                      boxShadow: state.isFocused ? 0 : 0,
                      border: state.isFocused ? '1px solid #999' : '',
                      '&:hover': {
                        border: state.isFocused ? '1px solid #999' : '',
                      },
                    }),
                    menuPortal: (provided) => ({
                      ...provided,
                      zIndex: 9999999,
                    }),
                    menu: (provided) => ({
                      ...provided,
                      position: 'absolute',
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
            <p className='font-medium lg:mb-2 ld:min-h-[40px] lg:min-h-[auto] flex items-end mb-3'>
              Размер посылки
            </p>
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
                    {
                      value: 'measurement',
                      label: 'Измерить на складе',
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
                  menuPortalTarget={document.body}
                  styles={{
                    control: (provided, state) => ({
                      ...provided,
                      padding: '8px',
                      boxShadow: state.isFocused ? 0 : 0,
                      border: state.isFocused ? '1px solid #999' : '',
                      '&:hover': {
                        border: state.isFocused ? '1px solid #999' : '',
                      },
                    }),
                    menuPortal: (provided) => ({
                      ...provided,
                      zIndex: 9999999,
                    }),
                    menu: (provided) => ({
                      ...provided,
                      position: 'absolute',
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
          {parcelSize?.label === 'Точные' && (
            <>
              <div>
                <div className='flex items-center'>
                  <p className='font-medium'>Габариты, см</p>
                  <div className='relative ml-2 group'>
                    <img className='w-5 cursor-pointer' src={info} alt='*' />
                    <div className='absolute w-64 sm:w-80 p-5 bg-white shadow-[0_8px_34px_#00000026] z-[9999] top-7 ld:top-5 -left-28 ss:-left-24 ld:-left-80 lg:left-5 hidden group-hover:block lg:rounded-2xl rounded-tl-none'>
                      <img className='w-4/6 mx-auto' src={boxSize} alt='*' />
                      <p className='text-xs sm:text-sm'>
                        Стоимость доставки рассчитывается по наибольшему весу -{' '}
                        <strong>физическому</strong> или{' '}
                        <strong>объёмному</strong>.
                        <br />
                        Физический вес - это масса груза за кг.
                        <br />
                        Объёмный вес - это место, занимаемое отправлением при
                        перевозке, рассчитывается по формуле: длина * ширина *
                        высота в см / 5000.
                      </p>
                    </div>
                  </div>
                </div>
                <p className='text-xs mb-3 font-light opacity-70'>
                  (длина, ширина, высота)
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
                <p className='font-medium mb-3 ld:min-h-[40px] flex items-end'>
                  Вес посылки, кг
                </p>
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
          )}
        </div>
        <div className='md:flex justify-between items-end mt-5'>
          {parcelSize?.label === 'Точные' ? (
            <div>
              {scopeWeight !== null ? (
                <>
                  <p className='font-medium leading-4'>Объёмный вес, кг</p>
                  <p className='text-xs mt-1'>
                    Объёмный вес - рассчитывается по формуле: длина * ширина *
                    высота в см / 5000
                  </p>
                  <div className='border border-colGray2 p-[14px] rounded-[4px] w-max min-w-[110px] mb-3 mt-2'>
                    {scopeWeight.toFixed(2)}
                  </div>
                  <div className='flex items-start p-3 rounded-lg bg-orange-200 max-w-[362px] w-full'>
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
        tariffCost={cost}
        onHandleTariff={onHandleTariff}
        onChoseTariff={onChoseTariff}
      />
      <div className='md:ml-5 lg:ml-10 py-5'>
        <button
          onClick={handleSubmit(onSubmit)}
          type='submit'
          disabled={!selectedTariff}
          className={`${
            !selectedTariff
              ? 'bg-[#D9D8D8] cursor-not-allowed'
              : 'hover:opacity-80 text-white bg-black'
          } font-medium p-3 ss:p-4 mm:p-3 flex justify-center items-center text-lg rounded-lg duration-150 mm:max-w-[280px] w-full mt-3 sm:mt-5`}
        >
          Рассчитать
        </button>
      </div>
    </>
  );
};

export default SApplicationForm;
