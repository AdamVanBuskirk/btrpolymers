import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../Core/store';
import { axiosPrivate, axiosPublic } from '../Core/axios';
import { companyStatus } from '../Helpers/types';
import { Member } from '../Models/Requests/Member';
import { Company } from '../Models/Company';
import { SaveCompany } from '../Models/Requests/SaveCompany';
import { ProspectType } from '../Models/ProspectType';
import { Action } from '../Models/Action';
import { Amount } from '../Models/Amount';
import { Outreach } from '../Models/Outreach';
import { Prospect } from '../Models/Prospect';
import { Industry } from '../Models/Industry';
import { CompanyAction } from '../Models/CompanyAction';
import { CompanyAmount } from '../Models/CompanyAmount';
import { Team } from '../Models/Team';
import { Role } from '../Models/Role';
import { SuccessStory } from '../Models/SuccessStory';

export interface CompanyState {
  company: Company | undefined;
  members: Array<Member>;
  teams: Array<Team>;
  outreach: Array<Outreach>;
  prospects: Array<Prospect>;
  prospectTypes: Array<ProspectType>;
  actions: Array<Action>;
  companyActions: Array<CompanyAction>;
  companyAmounts: Array<CompanyAmount>;
  amounts: Array<Amount>;
  industries: Array<Industry>;
  roles: Array<Role>;
  status: companyStatus;
  errorMessage: string;
  inviteCompany: Company | undefined;
  successStories: SuccessStory[];
}

const initialState: CompanyState = {
  company: undefined,
  members: [],
  teams: [],
  outreach: [],
  prospects: [],
  prospectTypes: [],
  actions: [],
  amounts: [],
  industries: [],
  roles: [],
  status: "unset",
  errorMessage: "",
  companyActions: [],
  companyAmounts: [],
  inviteCompany: undefined,
  successStories: [],
};

export const getSuccessStories = createAsyncThunk(
  'get-success-stories',
  async (companyId: string) => {    
    return await axiosPrivate.get('api/company/' + companyId +'/stories',
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

export const getMembers = createAsyncThunk(
  'get-members',
  async (companyId: string) => {    
    return await axiosPrivate.get('api/company/' + companyId +'/member',
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

export const getTeams = createAsyncThunk(
  'get-teams',
  async (companyId: string) => {    
    return await axiosPrivate.get('api/company/' + companyId +'/team',
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

export const getProspectTypes = createAsyncThunk(
  'get-prospectTypes',
  async () => {    
    return await axiosPrivate.get('api/company/prospect/types',
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

export const getActions = createAsyncThunk(
  'get-actions',
  async () => {    
    return await axiosPrivate.get('api/company/actions',
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

export const getCompanyActions = createAsyncThunk(
  'get-company-actions',
  async (companyId: string) => {    
    return await axiosPrivate.get('api/company/' + companyId + '/actions',
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

export const getIndustries = createAsyncThunk(
  'get-industries',
  async () => {    
    return await axiosPrivate.get('api/company/industries',
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

export const getRoles = createAsyncThunk(
  'get-roles',
  async () => {    
    return await axiosPrivate.get('api/company/role',
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

export const getAmounts = createAsyncThunk(
  'get-amounts',
  async () => {    
    return await axiosPrivate.get('api/company/amounts',
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

export const getCompanyAmounts = createAsyncThunk(
  'get--company-amounts',
  async (companyId: string) => {    
    return await axiosPrivate.get('api/company/' +  companyId + '/amounts',
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

export const getCompanyInfoById = createAsyncThunk(
  'get-company-info-by-id',
  async (companyId: string) => {    
    return await axiosPrivate.get('api/company/info/' + companyId,
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

export const saveCompany = createAsyncThunk(
  'save-company',
  async (settings: SaveCompany) => {    
      return await axiosPublic.post('api/company',
          JSON.stringify(settings),
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

export const archiveSuccess = createAsyncThunk(
  'archive-success',
  async (params: { archive: boolean, companyId: string, outreachId: string }) => {    
      return await axiosPublic.put('api/company/archive/success',
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

export const createTeam = createAsyncThunk(
  'create-team',
  async (params: { companyId: string, name: string, actionGoal?: number }) => {    
    return await axiosPublic.post('api/company/team',
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

export const saveTeam = createAsyncThunk(
  'save-team',
  async (params: { teamId: string, name: string, actionGoal?: number }) => {    
    return await axiosPublic.put('api/company/team',
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

export const saveUser = createAsyncThunk(
  'save-user',
  async (params: { companyId: string, user: Member }) => {    
    return await axiosPublic.put('api/company/user',
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

export const saveGoal = createAsyncThunk(
  'save-goal',
  async (params: { companyId: string, goal?: number, prospectVisibility?: string }) => {    
    return await axiosPublic.post('api/company/goal',
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

export const inviteUser = createAsyncThunk(
  'invite-user',
  async (params: { companyId: string, user: {
      firstName: string,
      lastName: string,
      email: string,
      role: string,
      teams: String[],
      includeInReports: boolean,
      actionGoal?: number,
  }}) => {    
    return await axiosPublic.post('api/company/invite',
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

export const getCompanyPublic = createAsyncThunk(
  'get-company-public',
  async (params: { companyId: string, link: string }) => {    
    return await axiosPublic.get('api/invite/company/' + params.companyId +'/' + params.link,
        {
          headers: { 'Content-Type': 'application/json' },
        }
    ).then(
      (res) => {
          return res.data;
      }
    );
});

export const resendInvite = createAsyncThunk(
  'invite-user-resend',
  async (params: { companyId: string, email: string }) => {    
    return await axiosPublic.post('api/company/invite/resend',
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

export const saveOutreach = createAsyncThunk(
  'save-outreach',
  async (outreach: any) => {    
      return await axiosPublic.post('api/company/outreach',
          JSON.stringify(outreach),
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

export const getOutreach = createAsyncThunk(
  'get-outreach',
  async (companyId: string) => {    
    return await axiosPrivate.get('api/company/' + companyId + '/outreach',
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

export const getProspects = createAsyncThunk(
  'get-prospects',
  async (companyId: string) => {    
    return await axiosPrivate.get('api/company/' + companyId + '/prospect',
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

export const saveProspect = createAsyncThunk(
  'save-prospect',
  async (prospect: Prospect) => {    
    return await axiosPublic.post('api/company/prospect',
      JSON.stringify(prospect),
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

export const saveCustomActionsAndAmmounts = createAsyncThunk(
  'save-company-actions-amounts',
  async (params: {
    companyId: string,
    actions: CompanyAction[],
    amounts: CompanyAmount[],
  }) => {    
    return await axiosPublic.post('api/company/custom/actions/amounts',
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

export const saveTeamMembers = createAsyncThunk(
  'save-team-members',
  async (params: { teamId: string, userIds: string[] }) => {    
    return await axiosPublic.post('api/company/team/members',
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

export const deleteProspect = createAsyncThunk(
  'delete-prospect',
  async (prospectId: string) => {    
    return await axiosPublic.delete('api/company/prospect/' + prospectId,
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

export const deleteUser = createAsyncThunk(
  'delete-user',
  async (params: {companyId: string, userId: string }) => {    
    return await axiosPublic.delete('api/company/' + params.companyId + '/user/' + params.userId,
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

export const deleteUserInvite = createAsyncThunk(
  'delete-user-invite',
  async (param: { companyId: string, email: string }) => {    
    return await axiosPublic.delete('api/company/user/invite/' + param.companyId + "/" + param.email,
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

export const deleteTeam = createAsyncThunk(
  'delete-team',
  async (teamId: string) => {    
    return await axiosPublic.delete('api/company/team/' + teamId,
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

export const deleteOutreach = createAsyncThunk(
  'delete-outreach',
  async (outreachId: string) => {    
    return await axiosPublic.delete('api/company/outreach/' + outreachId,
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

export const setCompanyStatus = createAsyncThunk(
  'set-company-status',
  async (status: companyStatus) => {    
      return status;
});

export const setMembers = createAsyncThunk(
  'set-members',
  async (members: Array<Member>) => {    
      return members;
});

export const setTeams = createAsyncThunk(
  'set-teams',
  async (teams: Array<Team>) => {    
      return teams;
});

export const setProspects = createAsyncThunk(
  'set-prospects',
  async (prospects: Array<Prospect>) => {    
      return prospects;
});

export const setCompanyActions = createAsyncThunk(
  'set-company-actions',
  async (companyActions: Array<CompanyAction>) => {    
      return companyActions;
});

export const setCompanyAmounts = createAsyncThunk(
  'set-company-amounts',
  async (companyAmounts: Array<CompanyAmount>) => {    
      return companyAmounts;
});

export const setOutreach = createAsyncThunk(
  'set-outreach',
  async (outreach: Array<Outreach>) => {    
      return outreach;
});
export const setSuccessStories = createAsyncThunk(
  'set-success-stories',
  async (successStories: Array<SuccessStory>) => {    
      return successStories;
});
export const setCompany = createAsyncThunk(
  'set-company',
  async (company: Company) => {    
      return company;
});

export const CompanySlice = createSlice({
  name: 'company',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCompanyPublic.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getCompanyPublic.fulfilled, (state, action) => {
        state.status = 'publicCompanyLoaded';
        state.inviteCompany = {...action.payload};
      })
      .addCase(getCompanyPublic.rejected, (state, action) => {
        state.status = 'failed';
        state.errorMessage = action.error.message as string;
      })
      .addCase(setMembers.fulfilled, (state, action) => {
        state.status = 'idle';
        state.members = [...action.payload];
      })
      .addCase(setTeams.fulfilled, (state, action) => {
        state.status = 'idle';
        state.teams = [...action.payload];
      })
      .addCase(setProspects.fulfilled, (state, action) => {
        state.status = 'idle';
        state.prospects = [...action.payload];
      })
      .addCase(setCompanyActions.fulfilled, (state, action) => {
        state.status = 'idle';
        state.companyActions = [...action.payload];
      })
      .addCase(setCompanyAmounts.fulfilled, (state, action) => {
        state.status = 'idle';
        state.companyAmounts = [...action.payload];
      })
      .addCase(setOutreach.fulfilled, (state, action) => {
        state.status = 'idle';
        state.outreach = [...action.payload];
      })
      .addCase(setSuccessStories.fulfilled, (state, action) => {
        state.status = 'idle';
        state.successStories = [...action.payload];
      })
      .addCase(getMembers.pending, (state) => {
        state.status = 'loadingMembers';
      })
      .addCase(getMembers.fulfilled, (state, action) => {
        state.status = 'idle';
        state.members = [...action.payload];
      })
      .addCase(getSuccessStories.pending, (state) => {
        state.status = 'loadingSuccessStories';
      })
      .addCase(getSuccessStories.fulfilled, (state, action) => {
        state.status = 'idle';
        state.successStories = [...action.payload];
      })
      .addCase(inviteUser.fulfilled, (state, action) => {
        state.status = 'idle';
        state.members = [...action.payload];
      })
      .addCase(getMembers.rejected, (state, action) => {
        state.status = 'failed';
        state.errorMessage = action.error.message as string;
      })
      .addCase(getTeams.fulfilled, (state, action) => {
        state.status = 'idle';
        state.teams = [...action.payload];
      })
      .addCase(getOutreach.fulfilled, (state, action) => {
        state.status = 'idle';
        state.outreach = [...action.payload];
      })
      .addCase(getProspects.fulfilled, (state, action) => {
        state.status = 'idle';
        state.prospects = [...action.payload];
      })
      .addCase(getProspectTypes.fulfilled, (state, action) => {
        state.status = 'idle';
        state.prospectTypes = [...action.payload];
      })
      .addCase(getActions.fulfilled, (state, action) => {
        state.status = 'idle';
        state.actions = [...action.payload];
      })
      .addCase(getCompanyActions.fulfilled, (state, action) => {
        state.status = 'idle';
        state.companyActions = [...action.payload];
      })
      .addCase(getIndustries.fulfilled, (state, action) => {
        state.status = 'idle';
        state.industries = [...action.payload];
      })
      .addCase(getRoles.fulfilled, (state, action) => {
        state.status = 'idle';
        state.roles = [...action.payload];
      })
      .addCase(getAmounts.fulfilled, (state, action) => {
        state.status = 'idle';
        state.amounts = [...action.payload];
      })
      .addCase(getCompanyAmounts.fulfilled, (state, action) => {
        state.status = 'idle';
        state.companyAmounts = [...action.payload];
      })
      .addCase(setCompany.fulfilled, (state, action) => {
        state.company = {...action.payload}; /* frontend updating */
      })
      .addCase(saveCompany.fulfilled, (state, action) => {
        state.status = 'idle';
        state.company = {...action.payload}; /* backend updating */
      })
      .addCase(createTeam.fulfilled, (state, action) => {
        state.status = 'idle';
        state.teams = [...action.payload]; /* backend updating */
      })
      .addCase(saveGoal.fulfilled, (state, action) => {
        state.status = 'idle';
        state.company = {...action.payload}; 
      })
      .addCase(saveOutreach.fulfilled, (state, action) => {
        state.status = 'outreachSaved';
      })
      .addCase(getCompanyInfoById.fulfilled, (state, action) => {
        state.status = 'companyLoaded';
        state.company = {...action.payload}; /* backend updating */
      })
      .addCase(setCompanyStatus.fulfilled, (state, action) => {
        state.status = action.payload;
      })
      .addCase(archiveSuccess.fulfilled, (state, action) => {
        state.status = 'idle';
        /*
        const now = new Date();
        state.outreach = state.outreach.map(o =>
          o._id === action.payload
            ? { ...o, successArchived: false, modified: now }
            : o
        );
        */
      })
  },
});

export const getCompany = (state: RootState) => state.company;
export default CompanySlice.reducer;
