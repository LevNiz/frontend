import mainBigImg1 from '../../../assets/gb-shop/images/main/mainBigImg1.jpg';
import mainBigImg2 from '../../../assets/gb-shop/images/main/mainBigImg2.jpg';
import mainImg1 from '../../../assets/gb-shop/images/main/mainImg1.jpg';
import mainImg2 from '../../../assets/gb-shop/images/main/mainImg2.jpg';
import sale from '../../../assets/gb-shop/images/main/sale.svg';

const MainBlock = () => {
  return (
    <div className='grid grid-cols-3 gap-7 pt-5 pb-10'>
      <div className='overflow-hidden rounded-md'>
        <img className='mx-auto' src={mainBigImg1} alt='*' />
      </div>
      <div className='flex flex-col justify-between items-center text-center'>
        <div className='overflow-hidden rounded-md'>
          <img src={mainImg1} alt='*' />
        </div>
        <div>
          <h1 className='font-ubuntu text-6xl text-[#484848] font-medium mb-5'>
            Black Friday
          </h1>
          <img className='mx-auto' src={sale} alt='*' />
        </div>
        <div>
          <h4 className='text-[#484848] tracking-[2px] text-xl uppercase mb-5'>
            Новая коллекция
          </h4>
          <button className='bg-black text-white p-3 max-w-[200px] w-full font-medium rounded-md hover:opacity-80 duration-150'>
            Купить
          </button>
        </div>
        <div className='overflow-hidden rounded-md'>
          <img src={mainImg2} alt='*' />
        </div>
      </div>
      <div className='overflow-hidden rounded-md'>
        <img className='mx-auto' src={mainBigImg2} alt='*' />
      </div>
    </div>
  );
};

export default MainBlock;
