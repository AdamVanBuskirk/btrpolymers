
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../Core/store';
import { axiosPrivate } from '../Core/axios';

export interface SettingsState {
  status: string;
}

const initialState: SettingsState = {
  status: "unset",
};


export const SettingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
  },
});

export const getSettings = (state: RootState) => state.settings;
export default SettingsSlice.reducer;
