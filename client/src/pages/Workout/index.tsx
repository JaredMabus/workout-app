import React, { useEffect } from "react";
import UI from "../../components/UI";
import { Stack, Typography, Button, Link } from "@mui/material";
// COMPONENTS
import WorkoutContainer from "./components/WorkoutContainer";
import WorkoutCardInfo from "./components/WorkoutCardInfo";
// REDUX
import { useSelector } from "react-redux";
import * as account from "../../Redux/slices/accountSlice";

export default function Workout() {
  const accountState = useSelector(account.selectAccount);

  return (
    <>
      <UI>
        {accountState.loginStatus ? <WorkoutContainer /> : <WorkoutCardInfo />}
      </UI>
    </>
  );
}
