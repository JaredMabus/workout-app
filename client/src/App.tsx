import React, {
  FC,
  useEffect,
  useLayoutEffect,
  useState,
  createContext,
} from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import * as page from "./pages/index";
import axios from "./lib/axios";
// DnD REACT
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
// THEME
import { ThemeProvider, CssBaseline } from "@mui/material";
import { themeLight, themeDark } from "./styles/style";
// UTILS
import useToken from "./utils/useToken";
// REDUX
import { useSelector, useDispatch } from "react-redux";
import {
  selectAccount,
  setLoginStatus,
  AccountStateType,
} from "./Redux/slices/accountSlice";
import * as ui from "./Redux/slices/uiSlice";
import * as wk from "./Redux/slices/workoutSlice";
// API
import { getTodayCompletedWorkoutsAPI } from "./pages/Dashboard/dashApi";
import * as planApi from "./pages/Plan/planApi";
import * as wkApi from "./pages/Workout/components/workoutApi";

const App: FC = () => {
  const account = useSelector(selectAccount);
  const uiState = useSelector(ui.selectUi);
  const wkState = useSelector(wk.selectWorkout);
  const dispatch = useDispatch();
  const { getTokenFromCookie } = useToken();

  const getWorkoutData = async () => {
    try {
      // dispatch(wk.setApiStatus({ loading: true }));
      let data = await wkApi.workoutApi();
      dispatch(wk.setWorkouts(data));
    } catch (err) {
      dispatch(
        ui.setSnackBar({
          severity: "error",
          duration: 5000,
          message: "Oops, could not retrieve workout data",
        })
      );
    } finally {
      // dispatch(wk.setApiStatus({ loading: false }));
    }
  };

  const getWorkoutPlanData = async () => {
    try {
      // dispatch(wk.setApiStatus({ loading: true }));
      let res = await planApi.getWorkoutPlanWeekApi();
      if (res.status === 200) {
        dispatch(wk.setWorkoutPlanWeek(res.data.payload.workoutPlanWeek));
      }
    } catch (err) {
      dispatch(
        ui.setSnackBar({
          severity: "error",
          duration: 5000,
          message: "Oops, could not retrieve workout plan data",
        })
      );
    } finally {
      // dispatch(wk.setApiStatus({ loading: false }));
    }
  };

  const getTodayCompletedWorkouts = async () => {
    try {
      // dispatch(wk.setApiStatus({ loading: true }));
      let res = await getTodayCompletedWorkoutsAPI();
      if (res.status === 200) {
        dispatch(wk.setTodayCompletedWorkouts(res.data.payload));
      }
    } catch (err) {
      dispatch(
        ui.setSnackBar({
          severity: "error",
          duration: 5000,
          message: "Oops, could not retrieve workout plan data",
        })
      );
    } finally {
      // dispatch(wk.setApiStatus({ loading: false }));
    }
  };

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

  useEffect(() => {
    try {
      (async () => {
        if (account.loginStatus === true) {
          await getWorkoutData();
          await getWorkoutPlanData();
          await getTodayCompletedWorkouts();
        }
      })();
    } catch (err) {
      console.log(err);
    }
  }, [account.loginStatus]);

  // THEME
  const setInitialTheme = () => {
    const initialThemeMq = window.matchMedia("(prefers-color-scheme: light)");
    if (initialThemeMq.matches) {
      dispatch(ui.setTheme(true));
    } else {
      dispatch(ui.setTheme(false));
    }
  };

  useLayoutEffect(() => {
    const localTheme = localStorage.getItem("theme");
    if (!localTheme) {
      setInitialTheme();
    } else {
      ui.setTheme(localTheme === "light" ? true : false);
      localTheme === "light"
        ? dispatch(ui.setTheme(true))
        : dispatch(ui.setTheme(false));
    }
  }, []);

  return (
    <React.Fragment>
      <ThemeProvider theme={uiState.light ? themeLight : themeDark}>
        <CssBaseline />
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
      </ThemeProvider>
    </React.Fragment>
  );
};

export default App;
