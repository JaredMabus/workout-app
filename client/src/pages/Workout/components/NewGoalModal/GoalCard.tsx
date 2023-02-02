import { useState, useEffect } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { Check } from "@mui/icons-material";
import { grey } from "@mui/material/colors";
import { WorkoutType, GoalType } from "../../../../Redux/slices/workoutSlice";
import { ProgressObjType } from "../ProgressChart";
// ICONS
import fitnessPlan from "../../../../assets/images/icons/fitness-plan.svg";
import targetGoal from "../../../../assets/images/icons/target-goal.svg";

interface Props {
  workout: WorkoutType;
  activeGoal: GoalType | null;
  progressObj: ProgressObjType | null;
  type: "current" | "target" | "next" | "previous";
}

const numberFormatSX = {
  fontFamily: "Saira Semi Condensed",
  fontSize: "1.4rem",
  fontWeight: 500,
};

const metricTitlesSx = {
  fontFamily: "Titillium Web",
  fontSize: "1rem",
  fontWeight: 600,
  color: grey[600],
};

interface Values {
  rounds: number;
  sets: number;
  weight: number;
  reps: number;
}

export default function GoalCard({
  workout,
  activeGoal = null,
  progressObj = null,
  type,
}: Props) {
  const [values, setValues] = useState<Values>({
    rounds: 0,
    sets: 0,
    weight: 0,
    reps: 0,
  });

  const setCardValues = () => {
    if (activeGoal != null && type === "previous") {
      setValues({
        rounds: activeGoal.targetRounds - workout.targetGoal.setIncrease,
        sets: activeGoal.targetSets - workout.targetGoal.setIncrease,
        weight: activeGoal.targetWeight - workout.targetGoal.weightIncrease,
        reps: activeGoal.targetReps - workout.targetGoal.repIncrease,
      });
    } else if (
      activeGoal != null &&
      workout.targetGoal != null &&
      type === "current"
    ) {
      setValues({
        rounds: activeGoal.targetRounds,
        sets: activeGoal.targetSets,
        weight: activeGoal.targetWeight,
        reps: activeGoal.targetReps,
      });
    } else if (
      activeGoal != null &&
      workout.targetGoal != null &&
      type === "next"
    ) {
      setValues({
        rounds: activeGoal.targetRounds + workout.targetGoal.setIncrease,
        sets: activeGoal.targetSets + workout.targetGoal.setIncrease,
        weight: activeGoal.targetWeight + workout.targetGoal.weightIncrease,
        reps: activeGoal.targetReps + workout.targetGoal.repIncrease,
      });
    }
  };

  useEffect(() => {
    setCardValues();
  }, [activeGoal]);

  return (
    <>
      <Stack
        direction="row"
        sx={{
          width: "100%",
          boxShadow: `rgb(0 0 0 / 8% ) 0px 1px 3px 1px`,
          border: `1px solid ${grey[200]}`,
          py: 2,
          px: { xs: 2, sm: 3 },
          minWidth: 250,
        }}
      >
        <Stack
          direction="row"
          justifyContent={"space-between"}
          alignItems={"center"}
          sx={{ minWidth: 250, flexWrap: "flex-wrap" }}
        >
          <Box
            component="img"
            src={type === "previous" ? fitnessPlan : targetGoal}
            alt="Fitness Goal achieved icon"
            sx={{
              height: { xs: 40, sm: 50 },
              width: { xs: 40, sm: 50 },
              mb: -1,
            }}
          />
          <Stack direction="row" spacing={2}>
            <Stack justifyContent={"center"} alignItems={"center"}>
              <Typography sx={metricTitlesSx}>Sets</Typography>
              <Typography sx={numberFormatSX}>{values.sets}</Typography>
            </Stack>
            <Stack justifyContent={"center"} alignItems={"center"}>
              <Typography sx={metricTitlesSx}>Weight</Typography>
              <Typography sx={numberFormatSX}>{values.weight}</Typography>
            </Stack>
            <Stack justifyContent={"center"} alignItems={"center"}>
              <Typography sx={metricTitlesSx}>Reps</Typography>
              <Typography sx={numberFormatSX}>{values.reps}</Typography>
            </Stack>
          </Stack>
          <Stack direction="row" spacing={0.5} sx={{ mb: -1 }}>
            <Typography sx={{ alignSelf: "center" }} variant="h5">
              x
            </Typography>
            <Typography
              variant="h4"
              sx={{ fontFamily: "Saira Semi Condensed" }}
            >
              {values.rounds}
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </>
  );
}
