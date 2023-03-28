import React from "react";
import { Container, Stack } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { grey } from "@mui/material/colors";
// COMPONENTS
import UI from "../../components/UI";
import TodaysWorkouts from "./components/TodaysWorkouts";
import UpdateWorkoutModal from "../Workout/components/UpdateWorkoutForm";
import NewRoundModal from "../Workout/components/NewRoundModal";
import NewGoalModal from "../Workout/components/NewGoalModal";

const Dashboard = () => {
  const theme = useTheme();

  return (
    <>
      <UI />
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
          pt: 5,
        }}
      >
        <Stack>
          <TodaysWorkouts />
        </Stack>
      </Container>
    </>
  );
};

export default Dashboard;

// Used for refactored normalized state.

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
