import { configureStore, ThunkAction, Action, combineReducers, getDefaultMiddleware } from '@reduxjs/toolkit';
import settingsReducer from '../Store/Settings';

const combinedReducer = combineReducers({
  settings: settingsReducer,
});

const rootReducer = (state: any, action: any) => {
  if (action.type === 'api/auth/logout/fulfilled') {
    const { stripe } = state; /* preserver Stripe, specifically pricing plans */
    state = { stripe };
  }
  return combinedReducer(state, action)
}
/* middleware is so I don't get non-serializable errors in console. I store the websocket in
   redux store which works fine. Also, I try not to store dates in state from backend, but
   when I do it works fine, socket is fine too. I could move socket to react context, but
   for now I want to keep in redux store.
*/
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: true,
      serializableCheck: false,
    }),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
