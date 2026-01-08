import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../Core/store';
import { axiosPrivate } from '../Core/axios';
import { settingsStatus } from '../Helpers/types';
import { Settings } from '../Models/Settings';
import { loadedComponentRequest } from '../Models/Requests/LoadComponentRequest';
import { SavePreviousComponentParams } from '../Models/Requests/SavePreviousComponentParams';
import { loadedSubComponentRequest } from '../Models/Requests/LoadSubComponentRequest';
import { Company } from '../Models/Company';

export interface SettingsState {
  status: settingsStatus;
  errorMessage: string;
  version: string;
  settings: Settings;
  showMenu: boolean;
  otherCompanies: Company[];
  switchStatus: string;
  scorecardTab: string;
  scorecardRevenue: boolean;
  scorecardTouchPoints: boolean;
  scorecardCalls: boolean;
  scorecardActions: boolean;
  quickStatsActions: number;
  quickStatsNewOpps: number;
  quickStatsNewOppAnnualized: number;
  quickStatsQuoted: number;
  quickStatsClosed: number;
  quickStatsActionGoal: number;
}

const initialState: SettingsState = {
  status: "unset",
  errorMessage: "",
  version: "",
  showMenu: false,
  otherCompanies: [],
  switchStatus: "",
  settings: {
    _id: "",
    userId: "",
    loadedCompanyId: "",
    created: "",
    modified: "",
    loadedComponentType: "",
    previousComponentType: "",
    sidebarExpanded: true,
    searchText: "",
    loadedSubComponentType: {},
    statsTimeframe: "week",
    statsScope: "me",
    statsTeam: "",
  },
  scorecardTab: "Weekly",
  scorecardRevenue: true,
  scorecardTouchPoints: true,
  scorecardCalls: true,
  scorecardActions: true,
  quickStatsActions: 0,
  quickStatsNewOpps: 0,
  quickStatsNewOppAnnualized: 0,
  quickStatsQuoted: 0,
  quickStatsClosed: 0,
  quickStatsActionGoal: 0
};

export const getQuickStats = createAsyncThunk(
  'get-quick-stats',
  async (params: { companyId: string, scope: string, timeframe: string, teamId: string }) => {  
    let teamId = (params.teamId === "") ? "undefined" : params.teamId;  
    return await axiosPrivate.get('api/settings/quickstats/' + params.companyId + '/' + params.scope + '/' + params.timeframe + '/' + teamId,
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

export const setStatsScope = createAsyncThunk(
  'set-stats-scope',
  async (scope: string) => {    
    return await axiosPrivate.put('api/settings/stats/scope',
      JSON.stringify({scope: scope }),
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

export const setStatsTeam = createAsyncThunk(
  'set-stats-team',
  async (teamId: string) => {    
    return await axiosPrivate.put('api/settings/stats/team',
      JSON.stringify({teamId: teamId }),
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

export const setStatsTimeframe = createAsyncThunk(
  'set-stats-timeframe',
  async (timeframe: string) => {
    return await axiosPrivate.put('api/settings/stats/timeframe',
      JSON.stringify({ timeframe: timeframe }),
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

export const loadComponent = createAsyncThunk(
  'api/settings/component',
  async (component: loadedComponentRequest) => {    
    return await axiosPrivate.put('api/settings/component',
      JSON.stringify(component),
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

export const loadDataSubComponent = createAsyncThunk(
  'api/settings/datasubcomponent',
  async (subComponent: loadedSubComponentRequest) => {    
    return await axiosPrivate.put('api/settings/subcomponent',
      JSON.stringify(subComponent),
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
//// data, meetings, lists, settings
export const loadSubComponent = createAsyncThunk(
  'api/settings/subcomponent',
  async (subComponent: loadedSubComponentRequest) => {    
    return await axiosPrivate.put('api/settings/subcomponent',
      JSON.stringify(subComponent),
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

export const getUserSettings = createAsyncThunk(
  'api/settings/get/user/settings',
  async () => {    
    return await axiosPrivate.get('api/settings',
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

export const getOtherCompanies = createAsyncThunk(
  'api/settings/other/companies',
  async (companyId: string) => {    
    return await axiosPrivate.get('api/settings/other/companies/' + companyId,
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

export const heartBeat = createAsyncThunk(
  'api/settings/heartbeat',
  async () => {    
    return await axiosPrivate.get('api/settings/heartbeat',
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

export const savePreviousComponent = createAsyncThunk(
  'api/settings/previous/component',
  async (previousComponent: SavePreviousComponentParams) => {    
    return await axiosPrivate.put('api/settings/previous/component',
      JSON.stringify(previousComponent),
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

export const toggleSidebar = createAsyncThunk(
  'toggle-sidebar',
  async (value: boolean) => {    
    return await axiosPrivate.put('api/settings/sidebar',
      JSON.stringify({
        value: value
      }),
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

export const updateLoadedCompanyId = createAsyncThunk(
  'update-loaded-company-id',
  async (companyId: string) => {    
    return await axiosPrivate.put('api/settings/loaded/company',
      JSON.stringify({
        companyId: companyId
      }),
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


export const setShowMenu = createAsyncThunk(
  'showw-menu',
  async (show: boolean) => {    
      return show;
});
export const setSearchText = createAsyncThunk(
  'save-search',
  async (text: string) => {    
      return text;
});

export const setSettingsStatus = createAsyncThunk(
  'set-settings-status',
  async (status: settingsStatus) => {    
      return status;
});

export const setSwitchStatus = createAsyncThunk(
  'set-settings-switch-status',
  async (status: string) => {    
      return status;
});

export const setScorecardTab = createAsyncThunk(
  'set-settings-scorecard-tab',
  async (tab: string) => {    
      return tab;
});

export const setScorecardRevenue = createAsyncThunk(
  'set-settings-scorecard-revenue',
  async (value: boolean) => {    
      return value;
});

export const setScorecardTouchPoints = createAsyncThunk(
  'set-settings-scorecard-tocuh-points',
  async (value: boolean) => {    
      return value;
});

export const setScorecardCalls = createAsyncThunk(
  'set-settings-scorecard-calls',
  async (value: boolean) => {    
      return value;
});

export const setScorecardActions = createAsyncThunk(
  'set-settings-scorecard-actions',
  async (value: boolean) => {    
      return value;
});

export const setSettings = createAsyncThunk(
  'set-settings',
  async (settings: Settings) => {    
      return settings;
});

export const SettingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(heartBeat.fulfilled, (state, action) => {
        state.status = 'heartbeat';
        state.version = action.payload.version;
      })
      .addCase(setSettingsStatus.fulfilled, (state, action) => {
        state.status = action.payload;
      })
      .addCase(setSwitchStatus.fulfilled, (state, action) => {
        state.switchStatus = action.payload;
      })
      .addCase(setSearchText.fulfilled, (state, action) => {
        state.status = 'idle';
        let settings: Settings = {...state.settings};
        settings.searchText = action.payload;
        state.settings = settings;
      })
      .addCase(setShowMenu.fulfilled, (state, action) => {
        state.status = 'idle';
        state.showMenu = action.payload;
      })
      .addCase(setScorecardTab.fulfilled, (state, action) => {
        state.status = 'idle';
        state.scorecardTab = action.payload;
      })
      .addCase(setScorecardRevenue.fulfilled, (state, action) => {
        state.status = 'idle';
        state.scorecardRevenue = action.payload;
      })
      .addCase(setScorecardCalls.fulfilled, (state, action) => {
        state.status = 'idle';
        state.scorecardCalls = action.payload;
      })
      .addCase(setScorecardTouchPoints.fulfilled, (state, action) => {
        state.status = 'idle';
        state.scorecardTouchPoints = action.payload;
      })
      .addCase(setScorecardActions.fulfilled, (state, action) => {
        state.status = 'idle';
        state.scorecardActions = action.payload;
      })
      .addCase(getOtherCompanies.fulfilled, (state, action) => {
        state.status = 'idle';
        state.otherCompanies = action.payload;
      })
      .addCase(getQuickStats.fulfilled, (state, action) => {
        state.status = 'idle';
        state.quickStatsActions = action.payload.quickStatsActions;
        state.quickStatsNewOpps = action.payload.quickStatsNewOpps;
        state.quickStatsNewOppAnnualized = action.payload.quickStatsNewOppAnnualized;
        state.quickStatsQuoted = action.payload.quickStatsQuoted;
        state.quickStatsClosed = action.payload.quickStatsClosed;
        state.quickStatsActionGoal = action.payload.quickStatsActionGoal;
      })
      .addCase(toggleSidebar.fulfilled, (state, action) => {
        state.status = 'idle';
        let settings: Settings = {...state.settings};
        settings.sidebarExpanded = action.payload;
        state.settings = settings;
      })
      .addCase(updateLoadedCompanyId.fulfilled, (state, action) => {
        state.switchStatus = 'companySwitched';
        let settings: Settings = {...state.settings};
        settings.loadedCompanyId = action.payload;
        state.settings = settings;
      })
      .addCase(setStatsScope.fulfilled, (state, action) => {
        state.status = "idle";
        let settings: Settings = {...state.settings};
        settings.statsScope = action.payload;
        state.settings = settings;
      })
      .addCase(setStatsTeam.fulfilled, (state, action) => {
        state.status = "idle";
        let settings: Settings = {...state.settings};
        settings.statsTeam = action.payload;
        state.settings = settings;
      })
      .addCase(setStatsTimeframe.fulfilled, (state, action) => {
        state.status = "idle";
        let settings: Settings = {...state.settings};
        settings.statsTimeframe = action.payload;
        state.settings = settings;
      })
      .addCase(setSettings.fulfilled, (state, action) => {
        state.status = 'idle';
        state.settings = action.payload;
      })
      .addCase(loadComponent.pending, (state) => {
        state.status = 'loadingComponent';
      })
      .addCase(loadComponent.fulfilled, (state, action) => {
        state.status = 'idle';
        let settings: Settings = {...state.settings};
        settings.loadedComponentType = action.payload.loadedComponentType;
        state.settings = settings;
      })
      .addCase(loadSubComponent.fulfilled, (state, action) => {
        state.status = "idle";
        let settings: Settings = { ...state.settings };
      
        const current = settings.loadedSubComponentType || {};
        const incoming = action.payload.loadedSubComponentType || {};
      
        settings.loadedSubComponentType = {
          ...current,
          ...incoming,
        };
      
        state.settings = settings;
      })      
      .addCase(savePreviousComponent.fulfilled, (state, action) => {
        state.status = 'idle';
        let settings: Settings = {...state.settings};
        settings.previousComponentType = action.payload.previousComponentType;
        state.settings = settings;
      })
      .addCase(getUserSettings.fulfilled, (state, action) => {
        state.status = 'userSettingsLoaded';
        state.settings = action.payload;
      })
      .addCase(getUserSettings.rejected, (state, action) => {
        state.status = 'failed';
        state.errorMessage = action.error.message as string;
      })
  },
});

export const getSettings = (state: RootState) => state.settings;
export default SettingsSlice.reducer;
