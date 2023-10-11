import { useEffect, useState } from 'react';
import CalcDeliveryForm from './CalcDeliveryForm';
import { fetchCosts } from '../../api/costs';
import CalcDeliveryTariffs from './CalcDeliveryTariffs';
import { useNavigate } from 'react-router-dom';

const CalcDeliveryItem = () => {
  const [costs, setCosts] = useState('');
  const [parcelCost, setParcelCost] = useState('');
  const [isClickedForm, setIsClickedForm] = useState(false);
  const [orderData, setOrderData] = useState({});
  const [tariff, setTariff] = useState(null);

  const navigate = useNavigate();

  const handleButtonClick = () => {
    setIsClickedForm(false);
    setTariff(!tariff);
  };

  const handleGetTariff = (data) => {
    setTariff(data);
  };

  useEffect(() => {
    (async () => {
      const { success, data } = await fetchCosts();
      if (success) {
        setCosts(data);
      }
    })();
  }, []);

  const onSubmitCalc = (data) => {
    const cityParcelCost = costs?.find(
      (cost) =>
        cost?.fromCity === data?.senderCity?.value &&
        cost?.toCity === data?.receiverCity?.value
    );
    if (cityParcelCost) {
      const costPerKg = cityParcelCost.costPerKg;
      let parcelCost;
      if (data.parcelSize.value === 'custom') {
        const { width, length, height } = data;
        const parcelWeight = (width * length * height) / 5000;
        parcelCost = Math.max(parcelWeight, data.weight) * costPerKg;
      } else {
        parcelCost = data.parcelSize.value * costPerKg;
      }
      setParcelCost(parcelCost.toFixed(2));
      setIsClickedForm(true);
      setOrderData(data);
    } else {
      alert('Цена доставки не указана! (из города / в город)');
    }
  };

  return (
    <>
      <div
        className={`${
          isClickedForm ? 'pointer-events-none opacity-40' : ''
        } shadow-[0_8px_34px_#00000026] p-7 rounded-xl`}
      >
        <h3 className='text-xl text-[#6747e5] pb-3 font-medium'>
          Основные параметры
        </h3>
        <CalcDeliveryForm onSubmit={onSubmitCalc} />
      </div>
      {isClickedForm && (
        <div className='flex mt-10'>
          <CalcDeliveryTariffs
            parcelCost={parcelCost}
            onHandleGetTariff={handleGetTariff}
          />
          <div className='w-[33%] shadow-[0_8px_34px_#00000026] p-7 rounded-xl h-[fit-content]'>
            <button
              onClick={handleButtonClick}
              className='font-medium hover:opacity-80 p-4 rounded-lg bg-colYellow duration-150 max-w-[320px] w-full'
            >
              Изменить параматеры
            </button>
            <button
              disabled={!tariff}
              onClick={() =>
                navigate('/order-delivery', {
                  state: {
                    orderData: orderData,
                    tariff: tariff,
                    parcelCost: parcelCost,
                  },
                })
              }
              className={`${
                !tariff ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-80'
              } font-medium p-4 rounded-lg bg-black text-white duration-150 max-w-[320px] w-full mt-4`}
            >
              Оформить заявку
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default CalcDeliveryItem;
