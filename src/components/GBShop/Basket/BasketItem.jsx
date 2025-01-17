import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  handleDecreaseQuantity,
  handleIncreaseQuantity,
  removeFromCart,
} from '../../../api/gb-shop/basket';
import { useSelector } from 'react-redux';
import { currency } from '../../../constants/currency';

const BasketItem = ({ el }) => {
  const { userID } = useSelector((state) => state?.user);
  const [count, setCount] = useState(el?.quantity);

  const handelIncrement = async (itemID) => {
    setCount((prevCount) => prevCount + 1);
    await handleIncreaseQuantity(userID, itemID, count + 1);
  };

  const handelDecrement = async (itemID) => {
    if (count > 1) {
      setCount((prevCount) => prevCount - 1);
      await handleDecreaseQuantity(userID, itemID, count - 1);
    }
  };

  return (
    <div className='border-b border-gray-300 border-t py-5 my-5'>
      <div className='flex items-start justify-between space-x-5'>
        <div className='flex w-full ld:w-[35%]'>
          <div className='w-2/5 h-32 ss:h-36 ld:h-28 lg:h-36 rounded-md overflow-hidden bg-gray-100'>
            <img
              className='w-full h-full object-contain'
              src={el?.item?.image}
              alt='*'
            />
          </div>
          <div className='w-3/5 pl-3 flex flex-col justify-between'>
            <div>
              <NavLink
                to={`/gb-shop/items/${el?.item?.id}`}
                className='font-medium line-clamp-3 text-base leading-[22px] break-all'
              >
                {el?.item?.name || 'Не указано'}
              </NavLink>
              {el?.memory && (
                <div className='flex items-center space-x-1'>
                  <span className='text-xs opacity-60'>Память:</span>
                  <p className='text-xs font-medium'>
                    {el?.memory?.ram} + {el?.memory?.storage}
                  </p>
                </div>
              )}
              {el?.sizes && (
                <div className='flex items-center space-x-1'>
                  <span className='text-xs opacity-60'>Размер:</span>
                  <p className='text-xs font-medium'>{el?.sizes}</p>
                </div>
              )}
              {el?.colors && (
                <div className='flex items-center space-x-1'>
                  <span
                    style={{ background: el?.colors?.color }}
                    className='w-2 h-2 min-w-[8px] rounded-full'
                  ></span>
                  <p className='text-xs'>{el?.colors?.nameRu}</p>
                </div>
              )}
              {el && el.memory !== '' && el.memory !== null ? (
                <div className='text-sm pt-1 opacity-70 font-medium flex items-center'>
                  <span>$ {el?.memory?.addCost.toFixed(1)}</span>
                  <p className='text-[10px] pl-[2px] pt-[1px]'>
                    ({(el?.memory?.addCost * currency).toFixed(1)} с)
                  </p>
                </div>
              ) : (
                <div className='text-sm pt-1 opacity-70 font-medium flex items-center'>
                  <span>
                    {el?.item?.issale
                      ? `$${el?.item?.costSale?.toFixed(1)}`
                      : `$${el?.item?.cost?.toFixed(1)}`}
                  </span>
                  <p className='text-[10px] pl-[2px] pt-[1px]'>
                    (
                    {el?.item?.issale
                      ? (el?.item?.costSale * currency)?.toFixed(1)
                      : (el?.item?.cost * currency)?.toFixed(1)}{' '}
                    с)
                  </p>
                </div>
              )}
              <div className='flex ld:hidden py-2'>
                <div
                  onClick={() => handelDecrement(el?.item?.id)}
                  className='border rounded-tl-sm rounded-bl-sm border-gray-200 min-w-[40px] w-10 h-8 flex justify-center items-center font-medium cursor-pointer'
                >
                  -
                </div>
                <div className='border border-y-gray-200 border-x-0 min-w-[60px] h-8 px-1 flex justify-center items-center text-sm'>
                  {count}
                </div>
                <div
                  onClick={() => handelIncrement(el?.item?.id)}
                  className='border rounded-tr-sm rounded-br-sm border-gray-200 min-w-[40px] w-10 h-8 flex justify-center items-center font-medium cursor-pointer'
                >
                  +
                </div>
              </div>
            </div>
            <span
              onClick={async () => {
                await removeFromCart(userID, el?.item?.id);
              }}
              className='text-[#8A8A8A] border-b border-gray-400 w-max cursor-pointer mt-1 text-sm mm:text-base'
            >
              Удалить
            </span>
          </div>
        </div>
        <div className='hidden ld:block w-[15%]'>
          {el && el.memory !== '' && el.memory !== null ? (
            <div className='font-medium'>
              $ {el?.memory?.addCost.toFixed(1)}{' '}
              <p className='text-xs'>
                ({(el?.memory?.addCost * currency).toFixed(1)} с)
              </p>
            </div>
          ) : (
            <div className='font-medium'>
              {el?.item?.issale
                ? `$${el?.item?.costSale?.toFixed(1)}`
                : `$${el?.item?.cost?.toFixed(1)}`}
              <p className='text-xs'>
                (
                {el?.item?.issale
                  ? (el?.item?.costSale * currency)?.toFixed(1)
                  : (el?.item?.cost * currency)?.toFixed(1)}{' '}
                с)
              </p>
            </div>
          )}
        </div>
        <div className='hidden ld:block w-[20%] lg:w-[28%]'>
          <div className='flex pb-5'>
            <div
              onClick={() => handelDecrement(el?.item?.id)}
              className='border rounded-tl-sm rounded-bl-sm border-gray-200 min-w-[40px] w-10 h-10 flex justify-center items-center font-medium cursor-pointer'
            >
              -
            </div>
            <div className='border border-y-gray-200 border-x-0 min-w-[60px] h-10 px-1 flex justify-center items-center'>
              {count}
            </div>
            <div
              onClick={() => handelIncrement(el?.item?.id)}
              className='border rounded-tr-sm rounded-br-sm border-gray-200 min-w-[40px] w-10 h-10 flex justify-center items-center font-medium cursor-pointer'
            >
              +
            </div>
          </div>
        </div>
        {el && el.memory !== '' && el.memory !== null ? (
          <div className='hidden ld:block w-[15%] font-medium'>
            $ {(el?.memory?.addCost * count).toFixed(1)}
            <p className='text-xs'>
              ({(el?.memory?.addCost * count * currency).toFixed(1)} с)
            </p>
          </div>
        ) : (
          <div className='hidden ld:block w-[15%] font-medium'>
            {el?.item?.issale
              ? `$${(el?.item?.costSale * count).toFixed(1)}`
              : `$${(el?.item?.cost * count).toFixed(1)}`}
            <p className='text-xs'>
              {el?.item?.issale
                ? `(${(el?.item?.costSale * count * currency).toFixed(1)} с)`
                : `(${(el?.item?.cost * count * currency).toFixed(1)} с)`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BasketItem;
