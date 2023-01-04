import React, { useState, useEffect } from "react";
import CircularProgress, {
  CircularProgressProps,
} from "@mui/material/CircularProgress";
import { Box, Typography, Stack, alpha } from "@mui/material";
import { grey, green } from "@mui/material/colors";
import { workoutGoalAchieved } from "../../../utils/math";
import {
  WorkoutType,
  RecentRound,
  WorkoutMethodType,
  GoalByMethod,
} from "../../../Redux/slices/workoutSlice";

function CircularProgressWithLabel(
  props: CircularProgressProps & { value: number }
) {
  return (
    <Box
      sx={{
        position: "relative",
        justifySelf: "center",
        alignSelf: "center",
        // border: "1px solid orange",
      }}
    >
      <CircularProgress
        variant="determinate"
        size={65}
        thickness={4}
        color="success"
        sx={{
          color: "#6AB73D",
          borderRadius: 50,
          backgroundColor: alpha("#6AB73D", 0.15),
        }}
        {...props}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          // border: "1px solid purple",
        }}
      >
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: "1rem",
            fontFamily: "Saira Semi Condensed",
          }}
          variant="body2"
          // component="div"
          color="text.secondary"
          // >{`${Math.round(props.value)}%`}</Typography>
        >{`4/6`}</Typography>
      </Box>
    </Box>
  );
}

interface Props {
  workout: WorkoutType;
  lastRound: Partial<RecentRound>;
  tabValue: WorkoutMethodType;
}

export default function ProgressChart({ workout, lastRound, tabValue }: Props) {
  const [progress, setProgress] = React.useState(0);
  const [activeGoal, setActiveGoal] = useState<GoalByMethod | null>(null);

  const setFilterGoals = () => {
    try {
      console.log(tabValue);
      if (
        workout != null &&
        workout.goalId != null &&
        Array.isArray(workout.goalId)
      ) {
        let filteredGoal = workout.goalId.find((item) => item._id === tabValue);
        if (filteredGoal != null) {
          setActiveGoal(filteredGoal);
        } else {
          setActiveGoal(null);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    setFilterGoals();
  }, [tabValue]);

  useEffect(() => {
    if (activeGoal != null && lastRound != null) {
      let progressObj = workoutGoalAchieved(workout, lastRound, activeGoal);
      setProgress(progressObj.progressPercent);
    }
    console.log(activeGoal);
  }, [activeGoal]);

  return (
    <>
      {activeGoal != null ? (
        <Stack>
          <CircularProgressWithLabel value={progress} />
        </Stack>
      ) : (
        <div>
          <Typography>No goal set</Typography>
        </div>
      )}
    </>
  );
}
