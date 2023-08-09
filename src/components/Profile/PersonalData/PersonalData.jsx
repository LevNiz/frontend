import location from './../../../assets/icons/location2.svg';
import profile from './../../../assets/icons/profile.svg';
import call from './../../../assets/icons/call3.svg';
import email from './../../../assets/icons/email.svg';

const PersonalData = () => {
  return (
    <div className='py-5 px-12 w-full'>
      <div className='flex'>
        <div className='max-w-[110px] min-w-[110px] h-[110px] overflow-hidden rounded-full mr-6'>
          <img
            className='w-full h-full object-cover'
            src='https://www.pointpark.edu/news-education/education-media/Ava-Cook_1000_Natalie-Caine.jpg'
            alt='*'
          />
        </div>
        <div className='flex flex-col justify-center'>
          <h4 className='text-xl font-bold'>Айнура Асанова</h4>
          <p className='font-medium'>Бишкек</p>
        </div>
      </div>
      <form>
        <div className='grid grid-cols-2 gap-8 mt-12'>
          <div>
            <p className='font-bold mb-2'>ФИО</p>
            <div className='mb-4 relative'>
              <input
                className='w-full border border-colGray2 p-[15px_20px_15px_44px] rounded-lg focus:border-black focus:outline-none'
                type='text'
                defaultValue='Айнура Асанова'
                placeholder='Полное имя'
              />
              <img
                className='absolute top-[15px] left-[10px]'
                src={profile}
                alt='*'
              />
            </div>
          </div>
          <div>
            <p className='font-bold mb-2'>Номер телефона</p>
            <div className='mb-4 relative'>
              <input
                className='w-full border border-colGray2 p-[15px_20px_15px_44px] rounded-lg focus:border-black focus:outline-none'
                type='text'
                defaultValue='+996 123 456 678'
                placeholder='Номер телефона'
              />
              <img
                className='absolute top-[15px] left-[10px]'
                src={call}
                alt='*'
              />
            </div>
          </div>
          <div>
            <p className='font-bold mb-2'>Электронная почта</p>
            <div className='mb-4 relative'>
              <input
                className='w-full border border-colGray2 p-[15px_20px_15px_44px] rounded-lg focus:border-black focus:outline-none'
                type='email'
                defaultValue='email@gmail.com'
                placeholder='Электронная почта'
              />
              <img
                className='absolute top-[15px] left-[10px]'
                src={email}
                alt='*'
              />
            </div>
          </div>
          <div>
            <p className='font-bold mb-2'>Место проживания</p>
            <div className='mb-4 relative'>
              <input
                className='w-full border border-colGray2 p-[15px_20px_15px_44px] rounded-lg focus:border-black focus:outline-none'
                type='text'
                defaultValue='Бишкек, Кыргызстан'
                placeholder='Место проживания'
              />
              <img
                className='absolute top-[15px] left-[10px]'
                src={location}
                alt='*'
              />
            </div>
          </div>
        </div>
        <div className='flex justify-end mt-24'>
          <button className='max-w-[255px] ml-5 w-full bg-black h-[50px] font-semibold text-white rounded-[10px] hover:opacity-80 duration-150'>
            Сохранить
          </button>
        </div>
      </form>
    </div>
  );
};

export default PersonalData;