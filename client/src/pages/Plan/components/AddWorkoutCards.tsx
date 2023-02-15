import React, {
  useState,
  useEffect,
  useCallback,
  useContext,
  useMemo,
} from "react";
import { Box, Button, Stack } from "@mui/material";
import { useTheme } from "@mui/material/styles";
// COMPONENTS
import DnDWorkoutCard from "./WorkoutDnDCard";
// STATE
import * as wk from "../../../Redux/slices/workoutSlice";
import { workoutApi } from "../../Workout/components/workoutApi";

interface Props {
  filteredWorkouts: wk.WorkoutType[] | null;
}

export default function AddWorkoutCards({ filteredWorkouts }: Props) {
  const theme = useTheme();

  return (
    <>
      <Stack
        spacing={1}
        sx={{
          alignItems: { xs: "center", sm: "start" },
          p: 1,
          px: 4,
          borderTop: `2px solid ${theme.palette.primary.main}`,
          mr: "-16px",
          overflowY: "scroll",
        }}
      >
        {filteredWorkouts != null &&
          filteredWorkouts.map((workout: any, index: any) => (
            <DnDWorkoutCard
              id={`${workout._id}-${index}-card-add`}
              key={`${workout._id}-${index}-card-add`}
              index={index}
              dayIndex="0"
              item={{
                dragIndex: index,
                hoverIndex: index,
                dayIndex: "0",
                dayHoverIndex: "0",
                workout,
                addNewWorkout: true,
              }}
              workout={workout}
              addWorkout={true}
            />
          ))}
      </Stack>
    </>
  );
}
