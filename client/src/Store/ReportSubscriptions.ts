// Store/ReportSubscriptions.ts
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../Core/store";
import { axiosPrivate } from "../Core/axios";
import { companyStatus } from "../Helpers/types";

// -----------------------------
// Types
// -----------------------------
export type ReportType = "actions_leaderboard" | "leadership_dashboard"; // add more as needed

export type Recipient =
  | { type: "email"; email: string }
  | { type: "user"; userId: string };

export type Schedule = {
  frequency: "daily" | "weekly" | "monthly";
  timeOfDay: string; // "HH:mm"
  timezone: string; // IANA
  daysOfWeek?: number[]; // 0-6 Sun-Sat
  dayOfMonth?: number; // 1-31
};

export type Delivery = {
  //format: "email_html" | "pdf" | "both";
  format: "email_html" | "pdf" | "both" | "csv" | "email_csv";
  subject: string;
  message?: string;
};

export type ReportSubscriptionDto = {
  _id: string;
  companyId: string;

  name: string;
  reportType: ReportType;

  // report-specific config (you decide structure per report)
  reportConfig: any;

  recipients: Recipient[];
  timezone: string;
  schedule: Schedule;
  delivery: Delivery;

  isEnabled: boolean;

  lastRunAt?: string | Date;
  lastStatus?: "success" | "error" | "unset";
  lastError?: string;

  created?: string | Date;
  modified?: string | Date;
};

export type CreateSubscriptionArgs = {
  companyId: string;
  name: string;
  reportType: ReportType;
  reportConfig: any;
  recipients: Recipient[];
  schedule: Schedule;
  delivery: Delivery;
  isEnabled?: boolean;
};

export type UpdateSubscriptionArgs = {
  id: string;
  patch: Partial<{
    name: string;
    reportConfig: any;
    recipients: Recipient[];
    schedule: Schedule;
    delivery: Delivery;
    isEnabled: boolean;
  }>;
};

// -----------------------------
// State
// -----------------------------
export interface ReportSubscriptionsState {
  byReportType: Record<string, ReportSubscriptionDto[]>;
  activeSubscription?: ReportSubscriptionDto | null;

  status: companyStatus; // loading/failed/idle/unset
  errorMessage: string;

  // optional: more granular statuses for UX
  createStatus: companyStatus;
  updateStatus: companyStatus;
  toggleStatus: companyStatus;
  runNowStatus: companyStatus;
}

const initialState: ReportSubscriptionsState = {
  byReportType: {},
  activeSubscription: null,

  status: "unset",
  errorMessage: "",

  createStatus: "unset",
  updateStatus: "unset",
  toggleStatus: "unset",
  runNowStatus: "unset",
};



// -----------------------------
// Thunks (API calls)
// -----------------------------


export const deleteSubscription = createAsyncThunk(
  "reportSubscriptions/delete",
  async (args: { id: string; companyId: string; reportType: ReportType }, { rejectWithValue }) => {
    try {
      await axiosPrivate.delete(`api/report/company/${args.companyId}/subscriptions/${args.id}`);
      return { id: args.id, reportType: args.reportType };
    } catch (e: any) {
      return rejectWithValue(e?.response?.data?.message || "Failed to delete subscription.");
    }
  }
);




export const createSubscription = createAsyncThunk(
  "reportSubscriptions/create",
  async (args: CreateSubscriptionArgs) => {
    const res = await axiosPrivate.post(
      "api/report/subscriptions",
      args,
      { headers: { "Content-Type": "application/json" }, withCredentials: true }
    );
    return res.data as ReportSubscriptionDto;
  }
);

export const updateSubscription = createAsyncThunk(
  "reportSubscriptions/update",
  async (args: UpdateSubscriptionArgs) => {
    const res = await axiosPrivate.put(
      `api/report/subscriptions/${args.id}`,
      args.patch,
      { headers: { "Content-Type": "application/json" }, withCredentials: true }
    );
    return res.data as ReportSubscriptionDto;
  }
);

export const enableSubscription = createAsyncThunk(
  "reportSubscriptions/enable",
  async (args: { id: string }) => {
    const res = await axiosPrivate.post(
      `api/report/subscriptions/${args.id}/enable`,
      {},
      { headers: { "Content-Type": "application/json" }, withCredentials: true }
    );
    return res.data as ReportSubscriptionDto;
  }
);

export const disableSubscription = createAsyncThunk(
  "reportSubscriptions/disable",
  async (args: { id: string }) => {
    const res = await axiosPrivate.post(
      `api/report/subscriptions/${args.id}/disable`,
      {},
      { headers: { "Content-Type": "application/json" }, withCredentials: true }
    );
    return res.data as ReportSubscriptionDto;
  }
);

export const runNowSubscription = createAsyncThunk(
  "reportSubscriptions/runNow",
  async (args: { id: string }) => {
    const res = await axiosPrivate.post(
      `api/report/subscriptions/${args.id}/run-now`,
      {},
      { headers: { "Content-Type": "application/json" }, withCredentials: true }
    );
    // backend can return updated sub or just { ok: true }; we’ll assume updated sub
    return res.data as ReportSubscriptionDto;
  }
);

export const getSubscriptionsByReportType = createAsyncThunk(
  "reportSubscriptions/getByReportType",
  async (args: { companyId: string; reportType: ReportType }) => {
    const res = await axiosPrivate.get(
      `api/report/company/${args.companyId}/subscriptions/${args.reportType}`,
      { headers: { "Content-Type": "application/json" }, withCredentials: true }
    );

    return { reportType: args.reportType, items: res.data as ReportSubscriptionDto[] };
  }
);

// -----------------------------
// Helpers (state updates)
// -----------------------------
function upsertIntoList(list: ReportSubscriptionDto[], sub: ReportSubscriptionDto) {
  const idx = list.findIndex((x) => String(x._id) === String(sub._id));
  if (idx >= 0) {
    const next = [...list];
    next[idx] = sub;
    return next;
  }
  return [sub, ...list];
}

function removeFromList(list: ReportSubscriptionDto[], id: string) {
  return list.filter((x) => String(x._id) !== String(id));
}

// -----------------------------
// Slice
// -----------------------------
export const ReportSubscriptionsSlice = createSlice({
  name: "reportSubscriptions",
  initialState,
  reducers: {
    clearReportSubscriptionsError(state) {
      state.errorMessage = "";
    },
    setActiveSubscription(state, action: PayloadAction<ReportSubscriptionDto | null>) {
      state.activeSubscription = action.payload;
    },

    // handy for optimistic UI if you want later
    removeSubscriptionLocally(
      state,
      action: PayloadAction<{ reportType: ReportType; id: string }>
    ) {
      const { reportType, id } = action.payload;
      state.byReportType[reportType] = removeFromList(state.byReportType[reportType] || [], id);
    },
  },
  extraReducers: (builder) => {
    // -----------------------------
    // getSubscriptionsByReportType
    // -----------------------------
    builder
      .addCase(getSubscriptionsByReportType.pending, (state) => {
        state.status = "loading";
        state.errorMessage = "";
      })
      .addCase(getSubscriptionsByReportType.rejected, (state, action) => {
        state.status = "failed";
        state.errorMessage = (action.error.message as string) || "Failed to load subscriptions.";
      })
      .addCase(getSubscriptionsByReportType.fulfilled, (state, action) => {
        state.status = "idle";
        state.byReportType[action.payload.reportType] = action.payload.items || [];
      });

    // -----------------------------
    // createSubscription
    // -----------------------------
    builder
      .addCase(createSubscription.pending, (state) => {
        state.createStatus = "loading";
        state.errorMessage = "";
      })
      .addCase(createSubscription.rejected, (state, action) => {
        state.createStatus = "failed";
        state.errorMessage = (action.error.message as string) || "Failed to create subscription.";
      })
      .addCase(createSubscription.fulfilled, (state, action) => {
        state.createStatus = "idle";
        const sub = action.payload;
        const rt = sub.reportType;
        state.byReportType[rt] = upsertIntoList(state.byReportType[rt] || [], sub);
        state.activeSubscription = sub;
      });

    // -----------------------------
    // updateSubscription
    // -----------------------------
    builder
      .addCase(deleteSubscription.pending, (state) => {
        state.toggleStatus = "loading"; // or add deleteStatus if you want
        state.errorMessage = "";
      })
      .addCase(deleteSubscription.rejected, (state, action) => {
        state.toggleStatus = "failed";
        state.errorMessage =
          (action.payload as string) ||
          (action.error.message as string) ||
          "Failed to delete subscription.";
      })
      .addCase(deleteSubscription.fulfilled, (state, action) => {
        state.toggleStatus = "idle";
        const { id, reportType } = action.payload;
    
        state.byReportType[reportType] = removeFromList(state.byReportType[reportType] || [], id);
    
        if (state.activeSubscription?._id === id) {
          state.activeSubscription = null;
        }
      })
      .addCase(updateSubscription.pending, (state) => {
        state.updateStatus = "loading";
        state.errorMessage = "";
      })
      .addCase(updateSubscription.rejected, (state, action) => {
        state.updateStatus = "failed";
        state.errorMessage = (action.error.message as string) || "Failed to update subscription.";
      })
      .addCase(updateSubscription.fulfilled, (state, action) => {
        state.updateStatus = "idle";
        const sub = action.payload;
        const rt = sub.reportType;
        state.byReportType[rt] = upsertIntoList(state.byReportType[rt] || [], sub);
        state.activeSubscription = sub;
      });

    // -----------------------------
    // enable/disable
    // -----------------------------
    builder
      .addCase(enableSubscription.pending, (state) => {
        state.toggleStatus = "loading";
        state.errorMessage = "";
      })
      .addCase(disableSubscription.pending, (state) => {
        state.toggleStatus = "loading";
        state.errorMessage = "";
      })
      .addCase(enableSubscription.rejected, (state, action) => {
        state.toggleStatus = "failed";
        state.errorMessage = (action.error.message as string) || "Failed to enable subscription.";
      })
      .addCase(disableSubscription.rejected, (state, action) => {
        state.toggleStatus = "failed";
        state.errorMessage = (action.error.message as string) || "Failed to disable subscription.";
      })
      .addCase(enableSubscription.fulfilled, (state, action) => {
        state.toggleStatus = "idle";
        const sub = action.payload;
        const rt = sub.reportType;
        state.byReportType[rt] = upsertIntoList(state.byReportType[rt] || [], sub);
        state.activeSubscription = sub;
      })
      .addCase(disableSubscription.fulfilled, (state, action) => {
        state.toggleStatus = "idle";
        const sub = action.payload;
        const rt = sub.reportType;
        state.byReportType[rt] = upsertIntoList(state.byReportType[rt] || [], sub);
        state.activeSubscription = sub;
      });

    // -----------------------------
    // runNowSubscription
    // -----------------------------
    builder
      .addCase(runNowSubscription.pending, (state) => {
        state.runNowStatus = "loading";
        state.errorMessage = "";
      })
      .addCase(runNowSubscription.rejected, (state, action) => {
        state.runNowStatus = "failed";
        state.errorMessage = (action.error.message as string) || "Failed to run report now.";
      })
      .addCase(runNowSubscription.fulfilled, (state, action) => {
        state.runNowStatus = "idle";
        const sub = action.payload;
        const rt = sub.reportType;
        state.byReportType[rt] = upsertIntoList(state.byReportType[rt] || [], sub);
        state.activeSubscription = sub;
      });
  },
});

export const {
  clearReportSubscriptionsError,
  setActiveSubscription,
  removeSubscriptionLocally,
} = ReportSubscriptionsSlice.actions;

export const getReportSubscriptions = (state: RootState) => state.reportSubscriptions;

export default ReportSubscriptionsSlice.reducer;
