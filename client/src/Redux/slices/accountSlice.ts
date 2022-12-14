import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import Cookie from "js-cookie";
import { AccountType } from "../../../../server/models/Account";

export interface AccountStateType {
  loginStatus: boolean;
  accountData: AccountInfo;
  err?:
    | {
        message?: string;
      }
    | boolean;
  api: {
    loading: boolean;
  };
}

export interface AccountInfo {
  _id: string;
  email: string;
  avatar?: string;
  fname: string;
  lname: string;
  height: number | string;
  weight: number | string;
}

// Account store initial state
const initialState: AccountStateType = {
  loginStatus: false,
  accountData: {
    _id: "",
    email: "",
    avatar: "",
    fname: "",
    lname: "",
    height: 0,
    weight: 0,
  },
  err: false,
  api: {
    loading: false,
  },
};

const accountSlice = createSlice({
  name: "ACCOUNT",
  initialState,
  reducers: {
    setLoginStatus: (state, action: PayloadAction<AccountStateType>) => {
      state.loginStatus = action.payload.loginStatus;
      state.accountData = action.payload.accountData;
      state.err = action.payload.err;
      state.api.loading = false;
    },
    logOut: (state) => {
      state.loginStatus = false;
      state.accountData = {
        _id: "",
        email: "",
        fname: "",
        lname: "",
        avatar: "",
        height: 0,
        weight: 0,
      };
      Cookie.remove("token");
    },
    setAvatarUrl: (state, action: PayloadAction<string>) => {
      state.accountData.avatar = action.payload;
    },
    setApiStatus: (state, action: PayloadAction<boolean>) => {
      state.api.loading = action.payload;
    },
    setApiError: (
      state,
      action: PayloadAction<{ message?: string } | boolean>
    ) => {
      state.err = action.payload;
    },
  },
});

// Export Actions
export const {
  setLoginStatus,
  setAvatarUrl,
  setApiStatus,
  setApiError,
  logOut,
} = accountSlice.actions;

// Export Selectors
export const selectAccount = (state: RootState) => state.account;

export default accountSlice.reducer;
