import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import {
  WorkoutType,
  MuscleCategoryType,
  MuscleGroupType,
  WorkoutMethodType,
  RecentRound,
  RoundType,
} from "./workoutSlice";

interface UiInitialState {
  navBarOpen: boolean;
  snackBarStatus: SnackBarStatus;
  workoutsHydrated: boolean;
  roundHydrated: boolean;
  modal: ModalStateType;
  activeWorkout: Partial<WorkoutType> | null;
  form: FormDataType;
}

type SnackBarStatus = {
  open: boolean;
  severity: SnackBarSeverityTypes;
  duration: number;
  message: string;
};

interface ModalStateType {
  open: boolean;
}

interface FormDataType {
  workout: {
    muscleCategory: MuscleCategoryType[];
    muscleGroup: MuscleGroupType[];
    methodSelection: WorkoutMethodType[];
    newWorkoutModalState: boolean;
    updateWorkoutModalState: boolean;
    updateWorkoutDefaultValues: Partial<WorkoutType>;
  };
  round: {
    newRoundModalState: boolean;
    defaultValues: Partial<RoundType>;
  };
}

type SnackBarSeverityTypes = "error" | "warning" | "info" | "success";

export const initialState: UiInitialState = {
  navBarOpen: false,
  snackBarStatus: {
    open: false,
    severity: "success",
    duration: 5000,
    message: "",
  },
  workoutsHydrated: true,
  roundHydrated: true,
  modal: {
    open: true,
  },
  activeWorkout: null,
  form: {
    workout: {
      muscleCategory: ["Upper Body", "Lower Body", "Core"],
      muscleGroup: [
        "Abs",
        "Back",
        "Back Arm",
        "Chest",
        "Front Arm",
        "Glutes",
        "Legs",
        "Shoulder",
      ],
      methodSelection: ["Barbell", "Cable", "Dumbbell", "Machine"],
      newWorkoutModalState: false,
      updateWorkoutModalState: false,
      updateWorkoutDefaultValues: {
        _id: "",
        name: "",
        muscleCategory: "",
        muscleGroup: "",
        methodSelection: [],
      },
    },
    round: {
      newRoundModalState: false,
      defaultValues: {
        accountId: "",
        workoutId: "",
        method: "",
        date: new Date(Date.now()),
        weight: 100,
        sets: 3,
        reps: 8,
        successSetsReps: true,
      },
    },
  },
};

const uiSlice = createSlice({
  name: "UI",
  initialState,
  reducers: {
    setNavBar: (state, action: PayloadAction<boolean>) => {
      state.navBarOpen = action.payload;
    },
    setSnackBar: (state, action: PayloadAction<SnackBarStatus>) => {
      state.snackBarStatus.open = true;
      state.snackBarStatus.severity = action.payload.severity;
      state.snackBarStatus.duration = action.payload.duration || 5000;
      state.snackBarStatus.message = action.payload.message;
    },
    closeSnackBar: (state, action: PayloadAction<boolean>) => {
      state.snackBarStatus.open = false;
    },
    setModalState: (state) => {
      state.modal.open = !state.modal.open;
    },
    setNewWorkoutModalState: (state) => {
      state.form.workout.newWorkoutModalState =
        !state.form.workout.newWorkoutModalState;
    },
    setUpdateWorkoutModalState: (state) => {
      state.form.workout.updateWorkoutModalState =
        !state.form.workout.updateWorkoutModalState;
    },
    setUpdateWorkoutDefaultValues: (
      state,
      action: PayloadAction<Partial<WorkoutType>>
    ) => {
      state.form.workout.updateWorkoutDefaultValues = action.payload;
    },
    setNewRoundModalState: (state) => {
      state.form.round.newRoundModalState =
        !state.form.round.newRoundModalState;
    },
    setActiveWorkout: (state, action: PayloadAction<Partial<WorkoutType>>) => {
      state.activeWorkout = action.payload;
    },
    setNewRoundDefaultValues: (
      state,
      action: PayloadAction<Partial<RoundType>>
    ) => {
      state.form.round.defaultValues = action.payload;
    },

    reset: () => initialState,
  },
});

// Export actions
export const {
  setNavBar,
  setSnackBar,
  closeSnackBar,
  setActiveWorkout,
  setModalState,
  setNewWorkoutModalState,
  setUpdateWorkoutModalState,
  setUpdateWorkoutDefaultValues,
  setNewRoundModalState,
  setNewRoundDefaultValues,
  reset,
} = uiSlice.actions;

export const selectUi = (state: RootState) => state.ui;

export default uiSlice.reducer;
