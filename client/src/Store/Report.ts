import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../Core/store';
import { axiosPrivate } from '../Core/axios';
import { companyStatus } from '../Helpers/types';



interface ActionLeaderBoard {
  teamId: string;
  weekChoice: string;

  actionColumns: { id: string; label: string }[];
  amountColumns: { id: string; label: string }[];

  shortRange: ActionLeaderBoardDetail[];
  longRange: ActionLeaderBoardDetail[];
}

interface ActionLeaderBoardDetail {
  rank: number;
  userId: string;

  fullName: string;
  email: string;
  teamName: string;

  totalActions: number;
  submissions: number;
  avgActionsPerSubmission: number;
  successOfWeek: number;

  actionsById: Record<string, number>;   // actionId -> count
  amountsById: Record<string, number>;   // amountId -> sum
}


export interface ReportState {
  actionsLeaderboard: ActionLeaderBoard[]
  status: companyStatus;
  errorMessage: string;
}

const initialState: ReportState = {
  actionsLeaderboard: [],
  status: "unset",
  errorMessage: "",
};


export const getActionsLeaderboardReport = createAsyncThunk(
  'get-actions-leaderboard-report',
  async (params: { companyId: string, teamId: string, weekChoice: string, timezone: string }) => {    
    return await axiosPrivate.get('api/report/company/' + params.companyId + '/team/' + params.teamId + '/' + params.weekChoice + '?timezone=' + params.timezone,
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

export const ReportSlice = createSlice({
  name: 'report',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(getActionsLeaderboardReport.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getActionsLeaderboardReport.rejected, (state, action) => {
        state.status = 'failed';
        state.errorMessage = action.error.message as string;
      })
      .addCase(getActionsLeaderboardReport.fulfilled, (state, action) => {
        state.status = 'idle';
        state.actionsLeaderboard = [...action.payload];
      })
  },
});

export const getReport = (state: RootState) => state.report;
export default ReportSlice.reducer;
