import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import logo from '../../assets/icons/logo2.svg';
import back from '../../assets/icons/back.svg';

const Auth = () => {
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
        <Outlet />
      </div>
    </div>
  );
};

export default Auth;
