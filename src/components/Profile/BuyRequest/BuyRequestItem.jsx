import { NavLink } from 'react-router-dom';
import arrow from '../../../assets/icons/arrow-left.svg';

const BuyRequestItem = ({ data }) => {
  return (
    <div className='py-8 grid ld:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-5'>
      <NavLink
        to=''
        onClick={() => alert('Функция будет доступна в ближайшее время!')}
        className='bg-colBgGray2 p-2 sm:p-4 rounded-lg border border-gray-300'
      >
        <div className='w-full mb-3'>
          <div className='flex justify-between items-center'>
            <h4 className='font-medium break-all line-clamp-1 pr-2'>
              {data?.name || 'Не указана'}
            </h4>
            <p className='text-xs text-colGray font-medium mt-1'>
              {data?.dateCreated?.split('T')[0] || 'Не указана'}
            </p>
          </div>
          <div className='flex items-center'>
            <span className='text-sm my-1 pr-1'>Ссылка:</span>
            <p className='text-sm text-blue-500 break-all line-clamp-1'>
              {data?.link || 'Не указана'}
            </p>
          </div>
        </div>
        <div className='flex justify-between items-center'>
          <div className='w-max px-3 py-1 text-center cursor-pointer text-[8px] sm:text-[10px] rounded-lg bg-colPurple2'>
            {data?.status == 'done'
              ? 'Готово'
              : data?.status == 'on_way'
              ? 'В пути'
              : data?.status == 'arrived'
              ? 'Получено'
              : data?.status == 'created'
              ? 'Создан'
              : 'Не указано'}
          </div>
          <img className='rotate-180' src={arrow} alt='*' />
        </div>
      </NavLink>
    </div>
  );
};

export default BuyRequestItem;
