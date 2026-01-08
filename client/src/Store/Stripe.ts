import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../Core/store';
import { axiosPrivate, axiosPublic } from '../Core/axios';
import { stripeStatus } from '../Helpers/types';
import { StripePlan } from '../Models/Requests/StripePlan';
import { StripePayment } from '../Models/Requests/StripePayment';

export interface StripeState {
  plans: Array<StripePlan>;
  status: stripeStatus;
  errorMessage: string;
  mostRecentPayment: StripePayment | null;
  clientSecret: string;
}

const initialState: StripeState = {
  plans: [],
  status: "unset",
  errorMessage: "",
  mostRecentPayment: null,
  clientSecret: ""

};

export const getPlans = createAsyncThunk(
  'api/stripe/get/plans',
  async () => {    
    return await axiosPublic.get('api/stripe',
      {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      }
    ).then(
      (res) => {
        return res.data;
      }
    );
});

export const getMostRecentPayment = createAsyncThunk(
  'api/stripe/get/recent/payment',
  async (companyId: string) => {
    return await axiosPrivate.get('api/stripe/recent/payment/' + companyId,
      {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true 
      }
    ).then(res => res.data);
});

export const deleteMostRecentPayment = createAsyncThunk(
  'api/stripe/delete/recent/payment',
  async (params: { companyId: string, _id: string }) => {    
    return await axiosPrivate.delete(`api/stripe/recent/payment/${params.companyId}/${params._id}`,
      {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
      }
    ).then(
      (res) => {
          return res.data;
      }
    );
});

export const createSubscription = createAsyncThunk(
  'api/stripe/create/subscription',
  async (params: { companyId: string, priceId: string, qty: number }) => {    
      return await axiosPrivate.post('api/stripe/create/subscription',
          JSON.stringify(params),
          {
              headers: { 'Content-Type': 'application/json' },
              withCredentials: true
          }
      ).then(
          (res) => {
              return res.data;
          }
      );
});

export const cancelSubscription = createAsyncThunk(
  'api/stripe/cancel/subscription',
  async (params: { companyId: string, subscriptionId: string}) => {    
      return await axiosPrivate.post('api/stripe/cancel/subscription',
          JSON.stringify(params),
          {
              headers: { 'Content-Type': 'application/json' },
              withCredentials: true
          }
      ).then(
          (res) => {
              return res.data;
          }
      );
});

export const createSetupIntent = createAsyncThunk(
  'api/stripe/create-setup-intent',
  async (params: { companyId: string }) => {    
    return await axiosPrivate.post('api/stripe/create-setup-intent',
      JSON.stringify(params),
      {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      }
    ).then(
      (res) => {
        return res.data;
      }
    );
});

export const setDefaultPayment = createAsyncThunk(
  'api/stripe/set-default-payment',
  async (params: { companyId: string, customerId: string, subscriptionId: string, paymentMethodId: string }) => {    
    return await axiosPrivate.post('api/stripe/set-default-payment',
      JSON.stringify(params),
      {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      }
    ).then(
      (res) => {
        return res.data;
      }
    );
});

export const setStripeStatus = createAsyncThunk(
  'set/stripe/status',
  async (status: stripeStatus) => {    
      return status;
});

export const StripeSlice = createSlice({
  name: 'strip',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(setStripeStatus.fulfilled, (state, action) => {
        state.status = action.payload;
      })
      .addCase(deleteMostRecentPayment.fulfilled, (state, action) => {
        state.status = 'idle';
        state.mostRecentPayment = action.payload;
      })
      .addCase(getMostRecentPayment.rejected, (state, action) => {
        state.status = 'idle';
        state.mostRecentPayment = null;
      })
      .addCase(getMostRecentPayment.fulfilled, (state, action) => {
        state.status = 'idle';
        state.mostRecentPayment = action.payload;
      })
      .addCase(getPlans.fulfilled, (state, action) => {
        state.status = 'idle';
        state.plans = action.payload;
      })
      .addCase(createSubscription.fulfilled, (state, action) => {
        state.status = 'idle';
        state.mostRecentPayment = action.payload.payment;
        state.clientSecret = action.payload.clientSecret;
      })
      .addCase(createSetupIntent.fulfilled, (state, action) => {
        state.status = 'idle';
        state.clientSecret = action.payload.clientSecret;
      })
      .addCase(cancelSubscription.fulfilled, (state, action) => {
        state.status = 'subscriptionCanceled';
        state.mostRecentPayment = action.payload;
      })
  },
});

export const getStripe = (state: RootState) => state.stripe;
export default StripeSlice.reducer;
