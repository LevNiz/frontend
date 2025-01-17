import { ItemsCard } from '../..';
import GBSHopEmpty from '../../../helpers/Errors/GBSHopEmpty';
import { ContentLoading } from '../../../helpers/Loader/Loader';
import { useSelector } from 'react-redux';
import { ErrorServer } from '../../../helpers/Errors/ErrorServer';

const FavoritesItem = () => {
  const { favItems, loading, error } = useSelector((state) => state?.favItems);

  return (
    <>
      {loading ? (
        <ContentLoading extraStyle={380} />
      ) : error ? (
        <ErrorServer />
      ) : favItems?.length ? (
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 lg:gap-7 container pt-4 mm:content'>
          {favItems?.map((el) => (
            <ItemsCard key={el?.id} el={el} favorite={true} />
          ))}
        </div>
      ) : (
        <div className='pt-20'>
          <GBSHopEmpty
            title='Вы еще ничего не сохранили!'
            desc='Сохраните понравившийся товар в разделе GB-Shop.'
          />
        </div>
      )}
    </>
  );
};

export default FavoritesItem;
