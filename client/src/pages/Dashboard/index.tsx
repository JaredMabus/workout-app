import React, { useEffect } from "react";
import { Container, Stack } from "@mui/material";
import { grey } from "@mui/material/colors";
// COMPONENTS
import UI from "../../components/UI";
import TodaysWorkouts from "./components/TodaysWorkouts";
import UpdateWorkoutModal from "../Workout/components/UpdateWorkoutForm";
import NewRoundModal from "../Workout/components/NewRoundModal";
import NewGoalModal from "../Workout/components/NewGoalModal";
// REDUX
import { useSelector } from "react-redux";
import * as account from "../../Redux/slices/accountSlice";

const Dashboard = () => {
  const accountState = useSelector(account.selectAccount);

  useEffect(() => {
    if (!accountState.loginStatus) {
      window.location.href = "/";
    }
  }, [accountState]);

  return (
    <>
      <UI>
        <UpdateWorkoutModal />
        <NewRoundModal />
        <NewGoalModal />
        <Container
          sx={{
            maxWidth: {
              xs: "xl",
              sm: "xl",
              md: "lg",
            },
          }}
        >
          <Stack>
            <TodaysWorkouts />
          </Stack>
        </Container>
      </UI>
    </>
  );
};

export default Dashboard;

// Used for refactored normalized redux state.
// const [todayWorkouts, setTodayWorkouts] = React.useState<
//   Partial<wk.WorkoutType>[]
// >([]);

// React.useEffect(() => {
//   setTodayWorkouts(wkState.workouts);
// }, []);

// React.useEffect(() => {
//   if (dataState.workouts.status === "failed") {
//     dispatch(db.setWorkoutDataIdle());
//   }
// }, []);

// React.useEffect(() => {
//   if (dataState.workouts.status === "idle") {
//     dispatch(db.fetchWorkouts());
//   }
// }, [dataState.workouts.status, account.loginStatus]);
