import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { fetchHomeItems } from '../../../api/gb-shop/homeItems';
import {
  Brands,
  MainCategories,
  MainBlock,
  CategorySlider,
} from '../../../components';
import { scrollToTop } from '../../../helpers/ScrollToTop/scrollToTop';
import rightArrow from '../../../assets/gb-shop/icons/right.svg';

const MainPage = () => {
  const { homeItems, loading, error } = useSelector(
    (state) => state?.homeItems
  );
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      await fetchHomeItems(dispatch);
    })();
  }, [dispatch]);

  useEffect(() => {
    scrollToTop();
  }, []);

  return (
    <div className='pt-28 pb-10 content'>
      <MainBlock />
      <MainCategories />
      <Brands />
      {homeItems?.map((el) => (
        <div key={el?.id}>
          <div className='flex justify-between items-center bg-[#FBFBFB] py-2 px-5 mt-12'>
            <h3 className='font-bold font-ubuntu text-[#030303] text-3xl'>
              {el?.category?.nameRus}
            </h3>
            <NavLink
              className='flex items-center justify-end'
              to='items'
              state={{
                from: el?.category?.nameRus,
                category: el?.category?.id,
              }}
            >
              <span className='font-medium text-xl mr-2 text-[#FEDE2B]'>
                Все
              </span>
              <img src={rightArrow} alt='*' />
            </NavLink>
          </div>
          <CategorySlider items={el?.items} loading={loading} error={error} />
        </div>
      ))}
    </div>
  );
};

export default MainPage;