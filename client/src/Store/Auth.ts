import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../Core/store';
import { Credentials } from '../Models/Requests/Credentials';
import { RegistrationCredentials } from '../Models/Requests/RegistrationCredentials';
import { axiosPrivate, axiosPublic } from '../Core/axios';
import { decodeToken } from '../Helpers/DecodeToken';
import { SocialCredentials } from '../Models/Requests/SocialCredentials';
import { sliceStatus } from '../Helpers/types';
import { PasswordReset } from '../Models/Requests/PasswordReset';
import { strictEqual } from 'assert';

export interface UserState {
  _id: string;
  sessionId: string;
  accessToken: string;
  loggingIn: boolean;
  status: sliceStatus;
  email: string;
  errorMessage: string;
  activationNeeded: boolean;
  firstName: string;
  lastName: string;
  avatar: string;
  defaultAvatarColor: string;
  defaultAvatarFontColor: string;
  created: Date | null;
  lastHeartbeat: string;
  acceptedInvite: boolean;
  inviteCompanyId: string;
  loggedOutForInvite: boolean;
  earlyAdopter: boolean;
}

const initialState: UserState = {
  _id: "",
  sessionId: "",
  accessToken: "",
  loggingIn: false,
  status: 'unset',
  //type: "",
  email: "",
  errorMessage: "",
  activationNeeded: false,
  firstName: "",
  lastName: "",
  avatar: "",
  defaultAvatarColor: "",
  defaultAvatarFontColor: "",
  created: null,
  lastHeartbeat: "",
  acceptedInvite: false,
  inviteCompanyId: "",
  loggedOutForInvite: false,
  earlyAdopter: false
};

export const register = createAsyncThunk(
  'api/auth/register',
  async (credentials: RegistrationCredentials) => {    
      return await axiosPublic.post('api/auth/register',
          JSON.stringify(credentials),
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

export const activateUser = createAsyncThunk(
  'api/auth/activate',
  async (activationCode: string) => {    
    return await axiosPublic.post('api/auth/activate',
      JSON.stringify({
          activationCode: activationCode,
      }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    ).then(
      (res) => {
          return res.data;
      }
    );
});

export const login = createAsyncThunk(
  'api/auth/login',
  async (credentials: Credentials) => {    
    return await axiosPublic.post('api/auth/login',
      JSON.stringify(credentials),
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

export const resendActivationLink = createAsyncThunk(
  'api/auth/activate/resend',
  async (email: string) => {    
      return await axiosPublic.post('api/auth/activate/resend',
        JSON.stringify({
            email: email,
        }),
        {
            headers: { 'Content-Type': 'application/json' },
            //withCredentials: true
        }
      ).then(
        (res) => {
            return res.data;
        }
      );
});

export const sendRecoveryLink = createAsyncThunk(
  'api/auth/password/recover',
  async (email: string) => {    
    return await axiosPublic.post('api/auth/password/recover',
      JSON.stringify({
          email: email,
      }),
      {
          headers: { 'Content-Type': 'application/json' },
      }
    ).then(
      (res) => {
          return res.data;
      }
    );
});

export const resetPassword = createAsyncThunk(
  'api/auth/password/change',
  async (credentials: PasswordReset) => {    
    return await axiosPublic.post('api/auth/password/change',
      JSON.stringify({
          password: credentials.password,
          recoveryCode: credentials.recoveryCode
      }),
      {
          headers: { 'Content-Type': 'application/json' },
      }
    ).then(
      (res) => {
          return res.data;
      }
    );
});

export const socialLogin = createAsyncThunk(
  'api/auth/login/social',
  async (credentials: SocialCredentials) => {    
      return await axiosPublic.post('api/auth/login/social',
          JSON.stringify(credentials),
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

export const logout = createAsyncThunk(
  //action type string
  'api/auth/logout',
  // callback function
  async () => {
    return await axiosPublic.get('api/auth/logout',
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

export const logoutForInvite = createAsyncThunk(
  'api/auth/logout/forinvite',
  async () => {
    return await axiosPublic.get('api/auth/logout',
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

export const refreshAccessToken = createAsyncThunk(
  'api/auth/refresh',
  async () => {
    return await axiosPublic.get('api/auth/refresh',
        {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true 
        }
    ).then(res => res.data.accessToken);
});

export const getAvatar = createAsyncThunk(
  'api/auth/avatar',
  async () => {
    return await axiosPrivate.get('api/auth/avatar',
        {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true 
        }
    ).then(res => res.data);
});

export const setAvatar = createAsyncThunk(
  'set/avatar',
  async (avatar: string) => {    
      return avatar;
});

export const setLastHeartbeat = createAsyncThunk(
  'set-last-heartbeat',
  async (heartbeat: string) => {    
      return heartbeat;
});

export const setAuthStatus = createAsyncThunk(
  'set-auth-status',
  async (status: sliceStatus) => {    
      return status;
});

export const setLoggedOutForInvite = createAsyncThunk(
  'set-logged-out-for-invite',
  async (loggedOutForInvite: boolean) => {    
      return loggedOutForInvite;
});

export const User = createSlice({
  name: 'user',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    /*
    increment: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    // Use the PayloadAction type to declare the contents of `action.payload`
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },*/
    
    setAccessToken: (state, action: PayloadAction<string>) => {
        state.accessToken = action.payload;
    },
    setLoggingIn: (state, action: PayloadAction<boolean>) => {
        state.loggingIn = action.payload;
    },
    resetActivationNeeded: (state, action: PayloadAction<boolean>) => {
      state.activationNeeded = action.payload;
    },
  },
  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  extraReducers: (builder) => {
    builder
      .addCase(setLoggedOutForInvite.fulfilled, (state, action) => {
        state.loggedOutForInvite = action.payload;
      })
      .addCase(setAvatar.fulfilled, (state, action) => {
        state.status = 'idle';
        state.avatar = action.payload;
      })
      .addCase(setLastHeartbeat.fulfilled, (state, action) => {
        state.lastHeartbeat = action.payload;
      })
      .addCase(setAuthStatus.fulfilled, (state, action) => {
        state.status = action.payload;
        state.acceptedInvite = false; /* reset invite accepted flag */
        state.inviteCompanyId = "";
      })
      .addCase(getAvatar.fulfilled, (state, action) => {
        state.status = 'idle';
        state.earlyAdopter = action.payload.earlyAdopter;
        state.created = action.payload.created;
        state.avatar = action.payload.avatar;
        state.defaultAvatarColor = action.payload.defaultAvatarColor;
        state.defaultAvatarFontColor = action.payload.defaultAvatarFontColor;
      })
      /*
      .addCase(saveAvatar.fulfilled, (state, action) => {
        state.status = 'idle';
        state.avatar = action.payload;
      })
      .addCase(saveAvatar.rejected, (state, action) => {
        state.status = 'failed';
        state.errorMessage = action.error.message as string;
      })
      .addCase(removeAvatar.fulfilled, (state, action) => {
        state.status = 'idle';
        state.avatar = action.payload;
      })
      
      .addCase(removeAvatar.rejected, (state, action) => {
        state.status = 'failed';
        state.errorMessage = action.error.message as string;
      })
        */
      .addCase(login.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'loggedIn';
        state.loggingIn = action.payload.loggingIn;
        state.acceptedInvite = action.payload.isInvite;
        state.inviteCompanyId = action.payload.companyId;
        state.accessToken = action.payload.accessToken;
        let payload = decodeToken(action.payload.accessToken);
        if (payload) {
          state._id = payload._id;
          state.email = payload.email;
          state.firstName = payload.given_name;
          state.lastName = payload.family_name;
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.errorMessage = action.error.message as string;
        if (state.errorMessage === "Your account needs activated.") {
          state.activationNeeded = true;
        }
      })
      .addCase(socialLogin.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(socialLogin.fulfilled, (state, action) => {
        state.status = 'loggedIn';
        state.loggingIn = action.payload.loggingIn;
        state.acceptedInvite = action.payload.isInvite;
        state.inviteCompanyId = action.payload.companyId;
        state.accessToken = action.payload.accessToken;
        let payload = decodeToken(action.payload.accessToken);
        if (payload) {
          state._id = payload._id;
          state.email = payload.email;
          state.firstName = payload.given_name;
          state.lastName = payload.family_name;
        }
      })
      .addCase(socialLogin.rejected, (state, action) => {
        state.status = 'failed';
        state.errorMessage = action.error.message as string;
      })
      .addCase(refreshAccessToken.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        state.status = 'idle';
        //console.log(action.payload);
        state.accessToken = action.payload;
        let payload = decodeToken(action.payload);
        if (payload) {
          //console.log(payload);
          //state.type = payload.type;
          state._id = payload._id;
          state.email = payload.email;
          state.firstName = payload.given_name;
          state.lastName = payload.family_name;
        }
      })
      .addCase(refreshAccessToken.rejected, (state) => {
        state.status = 'failed';
        state.accessToken = ""; /* log user out */
      })

      .addCase(logout.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(logout.fulfilled, (state) => {
        state.status = 'idle';
        state.accessToken = "";
      })
      .addCase(logout.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(logoutForInvite.fulfilled, (state) => {
        state.status = 'idle';
        state.loggedOutForInvite = true;
      })
      .addCase(logoutForInvite.rejected, (state) => {
        state.status = 'failed';
        state.loggedOutForInvite = true;
      })
      .addCase(register.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(register.fulfilled, (state, action) => {
        
          state.status = 'loggedIn';
          state.loggingIn = action.payload.loggingIn;
          state.acceptedInvite = action.payload.isInvite;
          state.inviteCompanyId = action.payload.companyId;
          state.accessToken = action.payload.accessToken;
          state.sessionId = action.payload.sessionId;
          let payload = decodeToken(action.payload.accessToken);
          if (payload) {
            state._id = payload._id;
            state.email = payload.email;
            state.firstName = payload.given_name;
            state.lastName = payload.family_name;
          }

      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'failed';
        state.errorMessage = action.error.message as string;
      })
      .addCase(activateUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(activateUser.fulfilled, (state) => {
        state.status = 'idle';
      })
      .addCase(activateUser.rejected, (state, action) => {
        state.status = 'failed';
        state.errorMessage = action.error.message as string;
      })
      .addCase(resendActivationLink.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(resendActivationLink.fulfilled, (state) => {
        state.status = 'idle';
      })
      .addCase(resendActivationLink.rejected, (state, action) => {
        state.status = 'failed';
        state.errorMessage = action.error.message as string;
      })
      .addCase(sendRecoveryLink.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(sendRecoveryLink.fulfilled, (state) => {
        state.status = 'idle';
      })
      .addCase(sendRecoveryLink.rejected, (state, action) => {
        state.status = 'failed';
        state.errorMessage = action.error.message as string;
      })
      .addCase(resetPassword.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.status = 'idle';
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.status = 'failed';
        state.errorMessage = action.error.message as string;
      })
  },
});

export const { setAccessToken, setLoggingIn, resetActivationNeeded } = User.actions;
//export const { increment, decrement, incrementByAmount } = counterSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const getUser = (state: RootState) => state.user;

// We can also write thunks by hand, which may contain both sync and async logic.
// Here's an example of conditionally dispatching actions based on current state.
/*export const incrementIfOdd =
  (amount: number): AppThunk =>
  (dispatch, getState) => {
    const currentValue = selectCount(getState());
    if (currentValue % 2 === 1) {
      dispatch(incrementByAmount(amount));
    }
  };*/

export default User.reducer;
