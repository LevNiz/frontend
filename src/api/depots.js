import {
  fetchDepotsFailure,
  fetchDepotsStart,
  fetchDepotsSuccess,
} from '../redux/slices/depotSlice';
import { request } from './axios';

// Fetch all Depots:
export const fetchDepots = async (dispatch) => {
  dispatch(fetchDepotsStart());
  try {
    const res = await request.get('core/depot/');
    dispatch(fetchDepotsSuccess(res?.data?.results));
  } catch (error) {
    dispatch(fetchDepotsFailure(error));
  }
};

// Fetch Depots detail:
export const fetchDepotsDetail = async (id) => {
  try {
    const res = await request.get(`core/depot/${id}/`);
    return { success: true, data: res?.data };
  } catch (error) {
    return { success: false, data: error };
  }
};

// Search depot:
export const searchDepot = async (depotName) => {
  try {
    const res = await request.get(`core/depot/?search=${depotName}`);
    return { success: true, data: res?.data?.results };
  } catch (error) {
    return { success: false, data: error };
  }
};
