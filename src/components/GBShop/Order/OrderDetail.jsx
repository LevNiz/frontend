import { Controller, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import Select from 'react-select';
import noImg from '../../../assets/images/no-image.svg';

const OrderDetail = () => {
  const { addresses } = useSelector((state) => state?.addresses);
  const {
    control,
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const { state } = useLocation();

  const addressOptions = addresses?.map((el) => ({
    value: el?.id,
    label: el?.country?.nameRu + ', ' + el?.city?.nameRu + ', ' + el?.address,
  }));

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='pt-16'>
      <div className='flex space-x-10'>
        <div className='w-2/5'>
          <div className='relative'>
            <h3 className='font-medium mb-3 text-[#484848]'>Адрес доставки</h3>
            <p
              className={`${
                addresses?.length ? 'hidden' : ''
              } opacity-50 -mt-2 mb-2 text-sm`}
            >
              Вы еще не добавили адрес для доставки. Добавьте новый адрес.
            </p>
            {addresses?.length ? (
              <>
                <Controller
                  name='address'
                  control={control}
                  rules={{
                    required: 'Поле обязательно к заполнению!',
                  }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={addressOptions}
                      placeholder='Выберите адрес доставки'
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
                {errors?.address && (
                  <p className='text-red-500 mt-1 text-sm'>
                    {errors?.address.message || 'Error!'}
                  </p>
                )}
              </>
            ) : (
              <div
                className={`${
                  addresses?.length ? 'hidden' : ''
                } font-medium hover:opacity-80 px-4 h-12 rounded-md bg-black text-white duration-150 sm:max-w-xs w-full mt-2 cursor-pointer flex justify-center items-center`}
              >
                Добавить новый адрес
              </div>
            )}
          </div>
          <div className='pt-5'>
            <h3 className='font-medium mb-3 text-[#484848]'>Комментарий</h3>
            <textarea
              className='w-full border border-colGray2 p-4 rounded-md focus:border-black focus:outline-none resize-none'
              placeholder='Комментарий'
              {...register('comment', {
                required: false,
              })}
            />
          </div>
        </div>
        <div className='w-3/5 p-5 rounded-md bg-[#F5F5F5] space-y-5'>
          {state?.map((el, index) => (
            <div key={index} className='flex'>
              <div className='w-32 h-32 min-w-[128px] rounded-md overflow-hidden bg-white'>
                <img
                  className='w-full h-full object-contain'
                  src={el?.item?.image}
                  alt='*'
                />
              </div>
              <div className='flex flex-col justify-between w-full'>
                <div className='pl-3 pt-2'>
                  <h5 className='font-medium'>{el?.item?.name}</h5>
                  <div className='flex items-center pt-1'>
                    <div className='min-w-[24px] w-6 h-6 rounded-full overflow-hidden border border-gray-300 bg-white'>
                      <img
                        className='w-full h-full object-contain rounded-full p-[2px]'
                        src={el?.item?.supplier?.avatar}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = noImg;
                        }}
                        alt='*'
                      />
                    </div>
                    <p className='text-sm text-[#A7A9B7] ml-1'>
                      {el?.item?.supplier?.fullname}
                    </p>
                  </div>
                </div>
                <p className='font-medium ml-3 pb-3 text-right'>
                  $ {el?.item?.cost}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className='flex justify-end pt-10'>
        <button
          type='button'
          onClick={handleSubmit(onSubmit)}
          className='font-medium hover:opacity-80 px-4 h-14 rounded-md bg-black text-white duration-150 sm:max-w-xs w-full'
        >
          Подтвердить
        </button>
      </div>
    </form>
  );
};

export default OrderDetail;
