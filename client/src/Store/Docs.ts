// store/docsSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../Core/store";
import { axiosPrivate, axiosPublic } from "../Core/axios";

// -----------------------------
// Types
// -----------------------------
export type ArtifactKind = "file" | "link";
export type ArtifactCategory =
  | "video"
  | "document"
  | "spreadsheet"
  | "image"
  | "link"
  | "other";

export type DocsArtifact = {
  _id: string;

  kind: ArtifactKind;
  category: ArtifactCategory;

  title: string;
  description?: string;

  // link
  url?: string;

  // file
  fileName?: string;
  fileSizeBytes?: number;
  mimeType?: string;

  // storage
  storageKey?: string;
  downloadUrl?: string;

  createdAt: string; // ISO
  createdByName?: string;
};

export interface DocsState {
  items: DocsArtifact[];
  loading: boolean;
  uploading: boolean;
  error: string;
}

const initialState: DocsState = {
  items: [],
  loading: false,
  uploading: false,
  error: "",
};

// -----------------------------
// Thunks
// -----------------------------

/**
 * Fetch all docs (files + links)
 * ✅ companyId is REQUIRED (route: GET api/docs/:companyId)
 */
export const fetchDocs = createAsyncThunk(
  "docs/fetch",
  async (args: { companyId: string }) => {
    return await axiosPrivate
      .get(`api/docs/${args.companyId}`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .then((res) => res.data as DocsArtifact[]);
  }
);

/**
 * Upload multiple files.
 * ✅ companyId is REQUIRED in body (controller expects it)
 * POST api/docs/upload
 */
export const uploadDocsFiles = createAsyncThunk(
  "docs/uploadFiles",
  async (payload: {
    companyId: string;
    title?: string;
    description?: string;
    files: Array<{
      file: File;
      category: ArtifactCategory;
    }>;
  }) => {
    const form = new FormData();

    // ✅ include companyId per controller
    form.append("companyId", payload.companyId);

    if (payload.title) form.append("title", payload.title);
    if (payload.description) form.append("description", payload.description);

    payload.files.forEach((f) => {
      form.append("files", f.file);
      // optional metadata per file if you want:
      // form.append("categories", f.category);
    });

    return await axiosPublic
      .post("api/docs/upload", form, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      })
      .then((res) => res.data as DocsArtifact[]);
  }
);

/**
 * Create a link artifact.
 * ✅ companyId is REQUIRED in body (controller expects it)
 * POST api/docs/link
 */
export const createDocsLink = createAsyncThunk(
  "docs/createLink",
  async (payload: { companyId: string; title: string; url: string; description?: string }, thunkAPI) => {
    try {
      const res = await axiosPublic.post("api/docs/link", payload, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      return res.data as DocsArtifact;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err?.response?.data?.message || "Failed to add link.");
    }
  }
);



/**
 * Delete an artifact (file or link)
 * ✅ companyId is REQUIRED (route: DELETE api/docs/:companyId/:id)
 */
export const deleteDocsArtifact = createAsyncThunk(
  "docs/delete",
  async (payload: { companyId: string; id: string }) => {
    return await axiosPublic
      .delete(`api/docs/${payload.companyId}/${payload.id}`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .then((res) => res.data as DocsArtifact[]);
  }
);

// Optional: local set (mirrors your set* thunks pattern)
export const setDocs = createAsyncThunk(
  "docs/set",
  async (items: DocsArtifact[]) => {
    return items;
  }
);

// -----------------------------
// Slice
// -----------------------------
export const DocsSlice = createSlice({
  name: "docs",
  initialState,
  reducers: {
    clearDocsError: (state) => {
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch
      .addCase(fetchDocs.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchDocs.fulfilled, (state, action: PayloadAction<DocsArtifact[]>) => {
        state.loading = false;
        state.items = [...(action.payload || [])];
      })
      .addCase(fetchDocs.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.error.message as string) || "Failed to load docs.";
      })

      // upload files
      .addCase(uploadDocsFiles.pending, (state) => {
        state.uploading = true;
        state.error = "";
      })
      .addCase(uploadDocsFiles.fulfilled, (state, action: PayloadAction<DocsArtifact[]>) => {
        state.uploading = false;
        state.items = [...(action.payload || [])];
      })
      .addCase(uploadDocsFiles.rejected, (state, action) => {
        state.uploading = false;
        state.error = (action.error.message as string) || "Upload failed.";
      })

      .addCase(createDocsLink.pending, (state) => {
        state.uploading = true;
        state.error = "";
      })
      .addCase(createDocsLink.fulfilled, (state, action: PayloadAction<DocsArtifact>) => {
        state.uploading = false;
      
        const created = action.payload;
      
        // replace if exists, else prepend (keeps list stable)
        const idx = state.items.findIndex((x) => x._id === created._id);
        if (idx >= 0) {
          state.items[idx] = created;
        } else {
          state.items.unshift(created);
        }
      })
      .addCase(createDocsLink.rejected, (state, action) => {
        state.uploading = false;
        state.error = (action.payload as string) || action.error.message || "Failed to add link.";
      })
      

      // delete
      .addCase(deleteDocsArtifact.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(deleteDocsArtifact.fulfilled, (state, action: PayloadAction<DocsArtifact[]>) => {
        state.loading = false;
        state.items = [...(action.payload || [])];
      })
      .addCase(deleteDocsArtifact.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.error.message as string) || "Delete failed.";
      })

      // setDocs (local)
      .addCase(setDocs.fulfilled, (state, action: PayloadAction<DocsArtifact[]>) => {
        state.items = [...(action.payload || [])];
      });
  },
});

// Selectors
export const getDocsState = (state: RootState) => state.docs as DocsState;
export const getDocs = (state: RootState) => (state.docs?.items ?? []) as DocsArtifact[];
export const getDocsLoading = (state: RootState) => !!state.docs?.loading;
export const getDocsUploading = (state: RootState) => !!state.docs?.uploading;
export const getDocsError = (state: RootState) => (state.docs?.error ?? "") as string;

export const { clearDocsError } = DocsSlice.actions;

export default DocsSlice.reducer;
