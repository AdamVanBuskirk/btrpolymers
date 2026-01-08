import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../Core/store';
import { axiosPublic, axiosPrivate } from '../Core/axios';
import { sliceStatus } from '../Helpers/types';
import { EmailSupportParam } from '../Models/Requests/EmailSupportParam';

export interface UtilityState {
  //marketingSource: string;
  status: sliceStatus;
  errorMessage: string;
}

const initialState: UtilityState = {
  //marketingSource: "",
  status: "unset",
  errorMessage: "",
};

export const emailSupport = createAsyncThunk(
  'api/utility/email/support',
  async (param: EmailSupportParam) => {    
    return await axiosPublic.post('api/utility/email/support',
      JSON.stringify(param),
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

export const emailSales = createAsyncThunk(
  'api/utility/email/sales',
  async (param: {
      firstName: string,
      lastName: string,
      email: string,
      message: string
  }) => {    
    return await axiosPublic.post('api/utility/email/sales',
      JSON.stringify(param),
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

export const UtilitySlice = createSlice({
  name: 'utility',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(emailSupport.fulfilled, (state, action) => {
        state.status = 'idle';
      })
      .addCase(emailSupport.rejected, (state, action) => {
        state.status = 'failed';
        state.errorMessage = action.error.message as string;
      })
  },
});

export const getUtility = (state: RootState) => state.utility;
export default UtilitySlice.reducer;
