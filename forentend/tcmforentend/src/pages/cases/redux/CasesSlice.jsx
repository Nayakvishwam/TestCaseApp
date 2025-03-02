import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { 
    getCases, 
    createCase, 
    casesStatus, 
    casesAutomationStatus, 
    getTags, 
    getPriorities, 
    getCasesTemplates, 
    getCasesTypeCases 
} from "./casesApi";

const initialState = {
    loading: false,
    casesResponse: null,
    statusResponse: null,
    automationStatusResponse: null,
    tagsResponse: null,
    prioritiesResponse: null,
    templatesResponse: null,
    typeCasesResponse: null
};

const actions = {
    "cases": "cases/CASES",
    "createCase": "createCase/CREATECASE",
    "casesStatus": "casesStatus/CASES_STATUS",
    "casesAutomationStatus": "casesAutomationStatus/CASES_AUTOMATION_STATUS",
    "getTags": "getTags/GET_TAGS",
    "getPriorities": "getPriorities/GET_PRIORITIES",
    "getCasesTemplates": "getCasesTemplates/GET_CASES_TEMPLATES",
    "getCasesTypeCases": "getCasesTypeCases/GET_CASES_TYPE_CASES"
};

// Fetch Cases
export const casesAction = createAsyncThunk(
    actions.cases,
    async (params) => {
        const response = await getCases({ params: params.params, payload: params.payload });
        return response;
    }
);

// Create a Case
export const createCaseAction = createAsyncThunk(
    actions.createCase,
    async (payload) => {
        const response = await createCase(payload);
        return response;
    }
);

// Get Cases Status
export const casesStatusAction = createAsyncThunk(
    actions.casesStatus,
    async () => {
        const response = await casesStatus();
        return response;
    }
);

// Get Cases Automation Status
export const casesAutomationStatusAction = createAsyncThunk(
    actions.casesAutomationStatus,
    async () => {
        const response = await casesAutomationStatus();
        return response;
    }
);

// Get Tags
export const getTagsAction = createAsyncThunk(
    actions.getTags,
    async () => {
        const response = await getTags();
        return response;
    }
);

// Get Priorities
export const getPrioritiesAction = createAsyncThunk(
    actions.getPriorities,
    async () => {
        const response = await getPriorities();
        return response;
    }
);

// Get Cases Templates
export const getCasesTemplatesAction = createAsyncThunk(
    actions.getCasesTemplates,
    async () => {
        const response = await getCasesTemplates();
        return response;
    }
);

// Get Cases Type Cases
export const getCasesTypeCasesAction = createAsyncThunk(
    actions.getCasesTypeCases,
    async () => {
        const response = await getCasesTypeCases();
        return response;
    }
);

// Slice Definition
export const casesSlice = createSlice({
    name: "cases",
    initialState,
    extraReducers: (builder) => {
        builder
            // Cases Actions
            .addCase(casesAction.pending, (state) => {
                state.loading = true;
                state.casesResponse = null;
            })
            .addCase(casesAction.fulfilled, (state, action) => {
                state.loading = false;
                state.casesResponse = action.payload?.data;
            })
            .addCase(casesAction.rejected, (state) => {
                state.loading = false;
                state.casesResponse = null;
            })

            .addCase(createCaseAction.pending, (state) => {
                state.loading = true;
            })
            .addCase(createCaseAction.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(createCaseAction.rejected, (state) => {
                state.loading = false;
            })

            // Cases Status
            .addCase(casesStatusAction.pending, (state) => {
                state.loading = true;
            })
            .addCase(casesStatusAction.fulfilled, (state, action) => {
                state.loading = false;
                state.statusResponse = action.payload?.data;
            })
            .addCase(casesStatusAction.rejected, (state) => {
                state.loading = false;
            })

            .addCase(casesAutomationStatusAction.pending, (state) => {
                state.loading = true;
            })
            .addCase(casesAutomationStatusAction.fulfilled, (state, action) => {
                state.loading = false;
                state.automationStatusResponse = action.payload?.data;
            })
            .addCase(casesAutomationStatusAction.rejected, (state) => {
                state.loading = false;
            })

            // Tags
            .addCase(getTagsAction.pending, (state) => {
                state.loading = true;
            })
            .addCase(getTagsAction.fulfilled, (state, action) => {
                state.loading = false;
                state.tagsResponse = action.payload?.data;
            })
            .addCase(getTagsAction.rejected, (state) => {
                state.loading = false;
            })

            // Priorities
            .addCase(getPrioritiesAction.pending, (state) => {
                state.loading = true;
            })
            .addCase(getPrioritiesAction.fulfilled, (state, action) => {
                state.loading = false;
                state.prioritiesResponse = action.payload?.data;
            })
            .addCase(getPrioritiesAction.rejected, (state) => {
                state.loading = false;
            })

            // Cases Templates
            .addCase(getCasesTemplatesAction.pending, (state) => {
                state.loading = true;
            })
            .addCase(getCasesTemplatesAction.fulfilled, (state, action) => {
                state.loading = false;
                state.templatesResponse = action.payload?.data;
            })
            .addCase(getCasesTemplatesAction.rejected, (state) => {
                state.loading = false;
            })

            // Cases Type Cases
            .addCase(getCasesTypeCasesAction.pending, (state) => {
                state.loading = true;
            })
            .addCase(getCasesTypeCasesAction.fulfilled, (state, action) => {
                state.loading = false;
                state.typeCasesResponse = action.payload?.data;
            })
            .addCase(getCasesTypeCasesAction.rejected, (state) => {
                state.loading = false;
            });
    }
});

// Export Actions & Reducer
export const casesActions = casesSlice.actions;
export default casesSlice.reducer;
