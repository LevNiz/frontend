import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import logo from '../../assets/icons/logo2.svg';
import back from '../../assets/icons/back.svg';
import location from '../../assets/icons/location2.svg';
import profile from '../../assets/icons/profile.svg';
import leftArrow from '../../assets/icons/arrow-left.svg';

const Auth = () => {
  const [isChecked, setIsChecked] = useState(true);
  const navigate = useNavigate();
  return (
    <div className='flex w-full h-screen'>
      <div className='hidden mm:w-2/5 lg:w-2/6 bg-black mm:flex justify-center items-center'>
        <div onClick={() => navigate(-1)}>
          <img
            className='absolute top-10 left-10 cursor-pointer'
            src={back}
            alt='*'
          />
        </div>
        <NavLink to='/'>
          <img src={logo} alt='*' />
        </NavLink>
      </div>
      <div className='w-full mm:w-3/5 lg:w-4/6 flex flex-col mm:justify-around items-center py-14 mm:py-20 px-4 overflow-y-scroll'>
        <div className='mm:hidden' onClick={() => navigate('/')}>
          <img
            className='absolute top-4 left-4 cursor-pointer'
            src={leftArrow}
            alt='*'
          />
        </div>
        <h1 className='text-2xl mm:text-[32px] font-medium pb-5'>
          Регистрация
        </h1>
        <form className='mm:max-w-[400px] w-full'>
          <div>
            <p className='font-bold mb-2'>ФИО</p>
            <div className='mb-6 relative'>
              <input
                className='w-full border border-colGray2 p-[16px] mm:p-[15px_20px_15px_44px] rounded-lg focus:border-black focus:outline-none'
                type='text'
                placeholder='Полное имя'
              />
              <img
                className='absolute top-[15px] left-[10px] hidden mm:block'
                src={profile}
                alt='*'
              />
            </div>
          </div>
          <div>
            <p className='font-bold mb-2'>Ваш email</p>
            <div className='mb-6 relative'>
              <input
                className='w-full border border-colGray2 p-[16px] mm:p-[15px_20px_15px_44px] rounded-lg focus:border-black focus:outline-none'
                type='email'
                placeholder='Введите ваш email'
              />
              <img
                className='absolute top-[15px] left-[10px] hidden mm:block'
                src={profile}
                alt='*'
              />
            </div>
          </div>
          <div>
            <p className='font-bold mb-2'>Адрес</p>
            <div className='mb-6 relative'>
              <input
                className='w-full border border-colGray2 p-[16px] mm:p-[15px_20px_15px_44px] rounded-lg focus:border-black focus:outline-none'
                type='text'
                placeholder='Адрес проживания'
              />
              <img
                className='absolute top-[15px] left-[10px] hidden mm:block'
                src={location}
                alt='*'
              />
            </div>
          </div>
          <div className='mb-12'>
            <input
              className='hidden'
              onChange={() => setIsChecked(!isChecked)}
              checked={isChecked}
              type='checkbox'
              id='checkbox'
            />
            <label
              htmlFor='checkbox'
              className='text-sm flex items-center cursor-pointer'
            >
              <div className='w-7 h-7 mr-2 flex justify-center items-center bg-yellow-300 border border-white rounded'>
                {isChecked ? (
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    xmlnsXlink='http://www.w3.org/1999/xlink'
                    width='20'
                    height='20'
                    viewBox='0 0 30 30.000001'
                    version='1.0'
                  >
                    <defs>
                      <clipPath id='id1'>
                        <path d='M 2.328125 4.222656 L 27.734375 4.222656 L 27.734375 24.542969 L 2.328125 24.542969 Z M 2.328125 4.222656 ' />
                      </clipPath>
                    </defs>
                    <g clipPath='url(#id1)'>
                      <path
                        fill='#fff'
                        d='M 27.5 7.53125 L 24.464844 4.542969 C 24.15625 4.238281 23.65625 4.238281 23.347656 4.542969 L 11.035156 16.667969 L 6.824219 12.523438 C 6.527344 12.230469 6 12.230469 5.703125 12.523438 L 2.640625 15.539062 C 2.332031 15.84375 2.332031 16.335938 2.640625 16.640625 L 10.445312 24.324219 C 10.59375 24.472656 10.796875 24.554688 11.007812 24.554688 C 11.214844 24.554688 11.417969 24.472656 11.566406 24.324219 L 27.5 8.632812 C 27.648438 8.488281 27.734375 8.289062 27.734375 8.082031 C 27.734375 7.875 27.648438 7.679688 27.5 7.53125 Z M 27.5 7.53125 '
                        fillOpacity='1'
                        fillRule='nonzero'
                      />
                    </g>
                  </svg>
                ) : (
                  ''
                )}
              </div>
              Политика конфиденциальности
            </label>
          </div>
          <NavLink
            to='password'
            className='p-[17px] rounded-lg bg-black text-white flex justify-center items-center w-full font-bold hover:opacity-80 duration-150'
          >
            Далее
          </NavLink>
        </form>
        <div className='text-center'>
          <p className='text-base text-black font-medium mt-5 mb-1'>
            У вас есть аккаунт?
          </p>
          <NavLink to='/login' className='text-xl text-colYellow'>
            Войти
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Auth;
