import { combineReducers, configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import depotReducer from './slices/depotSlice';
import parcelReducer from './slices/parcelSlice';
import countryReducer from './slices/countrySlice';
import cityReducer from './slices/citySlice';
import applicationReducer from './slices/applicationSlice';

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
};

const rootReducer = combineReducers({
  user: userReducer,
  depots: depotReducer,
  parcels: parcelReducer,
  countries: countryReducer,
  cities: cityReducer,
  applications: applicationReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
