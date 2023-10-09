import { useEffect } from "react";
import { CalcDeliveryItem } from "../../components"
import { fetchCities } from "../../api/cities";
import { fetchCountries } from "../../api/countries";
import { useDispatch } from "react-redux";

const CalculateDelivery = () => {

  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      await fetchCities(dispatch);
      await fetchCountries(dispatch);
    })();
  }, []);

  return (
    <div className='py-24 content min-h-[720px]'>
      <h1 className='text-3xl pt-5 pb-8 font-medium'>Рассчитать доставку</h1>
      <CalcDeliveryItem />
    </div>
  )
}

export default CalculateDelivery