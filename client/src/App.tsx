import { FC, useEffect, useLayoutEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  redirect,
} from "react-router-dom";
import * as page from "./pages/index";
import axios from "./lib/axios";
// DnD REACT
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
// THEME
import { themeLight } from "./styles/style";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
// UTILS
import useToken from "./utils/useToken";
// REDUX
import { useSelector, useDispatch } from "react-redux";
import {
  selectAccount,
  setLoginStatus,
  AccountInfo,
  AccountStateType,
} from "./Redux/slices/accountSlice";

const App: FC = () => {
  const account = useSelector(selectAccount);
  const dispatch = useDispatch();
  const { getTokenFromCookie } = useToken();

  useLayoutEffect(() => {
    try {
      const tokenPayload: AccountStateType | null = getTokenFromCookie();
      if (tokenPayload !== null) {
        dispatch(setLoginStatus(tokenPayload));
      }
    } catch (err) {
      throw err;
    }
  }, []);

  return (
    <>
      <MuiThemeProvider theme={themeLight}>
        <DndProvider backend={HTML5Backend}>
          <BrowserRouter>
            <Routes>
              <Route
                path="/"
                element={
                  account.loginStatus ? (
                    <Navigate to="/dashboard" />
                  ) : (
                    <page.Home />
                  )
                }
              />
              <Route
                path="/account"
                element={<page.Account />}
                // element={
                //   account.loginStatus ? <page.Account /> : <Navigate to="/" />
                // }
              />
              <Route
                path="/login"
                element={
                  account.loginStatus ? <Navigate to="/" /> : <page.Login />
                }
              />
              <Route
                path="/sign-up"
                element={
                  account.loginStatus ? <Navigate to="/" /> : <page.SignUp />
                }
              />
              <Route path="/dashboard" element={<page.Dashboard />} />
              <Route path="/workouts" element={<page.Workout />} />
              <Route path="/plan" element={<page.Plan />} />
              <Route path="/*" element={<page.Home />} />
            </Routes>
          </BrowserRouter>
        </DndProvider>
      </MuiThemeProvider>
    </>
  );
};

export default App;
