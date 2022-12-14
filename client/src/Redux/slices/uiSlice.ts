import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

interface UiInitialState {
  navBarOpen: boolean;
  snackBarStatus: SnackBarStatus;
  workoutsHydrated: boolean;
  roundHydrated: boolean;
}

type SnackBarStatus = {
  open: boolean;
  severity: SnackBarSeverityTypes;
  duration: number;
  message: string;
};

type SnackBarSeverityTypes = "error" | "warning" | "info" | "success";

const initialState: UiInitialState = {
  navBarOpen: false,
  snackBarStatus: {
    open: false,
    severity: "success",
    duration: 5000,
    message: "",
  },
  workoutsHydrated: true,
  roundHydrated: true,
};

const uiSlice = createSlice({
  name: "UI",
  initialState,
  reducers: {
    setNavBar: (state, action: PayloadAction<boolean>) => {
      state.navBarOpen = action.payload;
    },
    setSnackBar: (state, action: PayloadAction<SnackBarStatus>) => {
      state.snackBarStatus = action.payload;
    },
    closeSnackBar: (state, action: PayloadAction<boolean>) => {
      state.snackBarStatus.open = false;
    },
    setWorkoutsHydrate: (state, action: PayloadAction<boolean>) => {
      state.workoutsHydrated = action.payload;
    },
    setRoundHydrate: (state, action: PayloadAction<boolean>) => {
      state.roundHydrated = action.payload;
    },
  },
});

// Export actions
export const {
  setNavBar,
  setSnackBar,
  closeSnackBar,
  setWorkoutsHydrate,
  setRoundHydrate,
} = uiSlice.actions;

export const selectUi = (state: RootState) => state.ui;

export default uiSlice.reducer;
