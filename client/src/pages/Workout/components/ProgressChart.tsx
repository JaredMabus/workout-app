import React, { useState, useEffect } from "react";
import CircularProgress, {
  CircularProgressProps,
} from "@mui/material/CircularProgress";
import { Box, Typography, Stack, alpha } from "@mui/material";
import { grey, green } from "@mui/material/colors";
import { workoutGoalAchieved } from "../../../utils/math";
import axios from "../../../lib/axios";
import { useDispatch, useSelector } from "react-redux";
import {
  WorkoutType,
  RecentRound,
  WorkoutMethodType,
  GoalType,
  addWorkoutGoal,
} from "../../../Redux/slices/workoutSlice";
import * as ui from "../../../Redux/slices/uiSlice";
import { CompletedGoal } from "./Dialogs";

const updateGoalApi = async (id: string | undefined) => {
  try {
    if (id == null) return;

    let data: Partial<GoalType> = {
      _id: id,
      achieved: true,
      dateAchieved: new Date(),
    };
    let res = await axios.put("goal", data);
    // console.log(res.status);
    return res.data;
  } catch (err) {
    console.log(err);
  }
};

type GoalTypeOptional = Optional<GoalType, "_id" | "createdAt" | "updatedAt">;

export const addNewGoalApi = async (
  workout: WorkoutType,
  activeGoal: GoalType
) => {
  try {
    if (activeGoal != null && workout.targetGoal != null) {
      const { setIncrease, weightIncrease, repIncrease } = workout.targetGoal;
      const { targetSets, targetWeight, targetReps } = activeGoal;
      if (targetSets != null && targetWeight != null && targetReps != null) {
        let newGoal: GoalTypeOptional = {
          workoutId: workout._id,
          accountId: workout.accountId,
          method: activeGoal.method,
          achieved: false,
          dateAchieved: new Date(),
          targetRounds: activeGoal.targetRounds,
          targetSets: targetSets + setIncrease,
          targetWeight: targetWeight + weightIncrease,
          targetReps: targetReps + repIncrease,
        };

        if (newGoal != null) {
          let res = await axios.post("goal", newGoal);
          if (res.status) {
            let data = res.data;
            return data.payload;
          }
        }
      }
    }
  } catch (err) {
    console.log(err);
  }
};

export interface ProgressObjType {
  totalRounds: number;
  totalSucessRounds: number;
  targetRounds: number;
  progressPercent: number;
}

function CircularProgressWithLabel(
  props: CircularProgressProps & { value: number; progressobj: ProgressObjType }
) {
  return (
    <Box
      sx={{
        position: "relative",
        justifySelf: "center",
        alignSelf: "center",
      }}
    >
      <CircularProgress
        variant="determinate"
        size={55}
        thickness={3}
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
        }}
      >
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: "1rem",
            fontFamily: "Saira Semi Condensed",
          }}
          variant="body2"
          color="text.secondary"
        >
          {props.progressobj.totalSucessRounds}/{props.progressobj.targetRounds}
        </Typography>
      </Box>
    </Box>
  );
}

export interface Props {
  workout: WorkoutType;
  lastRound: Partial<RecentRound>;
  tabValue: WorkoutMethodType;
  activeGoal: GoalType | null;
  setActiveGoal: React.Dispatch<React.SetStateAction<GoalType | null>>;
}

export default function ProgressChart({
  workout,
  lastRound,
  tabValue,
  activeGoal,
  setActiveGoal,
}: Props) {
  const dispatch = useDispatch();
  const uiState = useSelector(ui.selectUi);
  const [progressObj, setProgress] = React.useState<ProgressObjType>({
    targetRounds: 0,
    totalRounds: 0,
    totalSucessRounds: 0,
    progressPercent: 0,
  });

  // useEffect(() => {
  // console.log(workout);
  // console.log(lastRound);
  // console.log(tabValue);
  // console.log(activeGoal);
  // }, [tabValue]);

  useEffect(() => {
    if (activeGoal != null && lastRound != null) {
      setProgress(workoutGoalAchieved(workout, lastRound, activeGoal));
    }
  }, [activeGoal]);

  useEffect(() => {
    if (
      activeGoal != null &&
      activeGoal.achieved === false &&
      progressObj.progressPercent >= 100
    ) {
      dispatch(ui.setGoalDialogStatus(true));
      (async () => {
        await updateGoalApi(activeGoal._id);
        let newGoal = await addNewGoalApi(workout, activeGoal);
        if (newGoal != null) {
          dispatch(addWorkoutGoal(newGoal));
        }
      })();
    }
  }, [progressObj]);

  return (
    <>
      <CompletedGoal
        workout={workout}
        activeGoal={activeGoal}
        progressObj={progressObj}
      />
      {activeGoal != null ? (
        <Stack>
          <CircularProgressWithLabel
            value={progressObj.progressPercent}
            progressobj={progressObj}
          />
        </Stack>
      ) : (
        <div>
          <Typography>No goal set</Typography>
        </div>
      )}
    </>
  );
}
