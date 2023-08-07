import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import {
  WorkoutType,
  MuscleCategoryType,
  MuscleGroupType,
  WorkoutMethodType,
  RoundType,
} from "./workoutSlice";

interface UiInitialState {
  light: boolean;
  navBarOpen: boolean;
  snackBarStatus: SnackBarStatus;
  workoutsHydrated: boolean;
  roundHydrated: boolean;
  modal: ModalStateType;
  activeWorkout: Partial<WorkoutType> | null;
  activeTabMethodFilter: WorkoutMethodType | null;
  activeTabDataFilter: WorkoutMethodType | null;
  form: FormDataType;
  dialog: DialogType;
}

/**
 * Set snack bar status
 * @param state
 * @param open snack bar open status
 * @param severity 'success', 'error', 'info'
 * @param duration in mili-seconds
 * @param message message to display
 */
type SnackBarStatus = {
  open?: boolean;
  severity: SnackBarSeverityTypes;
  duration?: number;
  message: string;
};

type SnackBarSeverityTypes = "error" | "warning" | "info" | "success";

interface ModalStateType {
  open: boolean;
}

interface CompletedSetsObjType extends RoundType {
  isCompleted: boolean;
}

interface DialogType {
  goal: {
    status: boolean;
  };
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
    completedSetsObj: Partial<CompletedSetsObjType>[] | null;
    completedSetsIndices: { [k: number]: boolean };
    activeSetsStep: number;
  };
  goal: {
    newGoalModalState: boolean;
  };
}

export const initialState: UiInitialState = {
  light: true,
  navBarOpen: true,
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
  activeTabMethodFilter: null,
  activeTabDataFilter: null,
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
        sets: [
          { weight: 100, reps: 8, datetime: new Date(Date.now()) },
          { weight: 100, reps: 8, datetime: new Date(Date.now()) },
          { weight: 100, reps: 8, datetime: new Date(Date.now()) },
        ],
        successSetsReps: true,
      },
      completedSetsObj: null,
      completedSetsIndices: [],
      activeSetsStep: 0,
    },
    goal: {
      newGoalModalState: false,
    },
  },
  dialog: {
    goal: {
      status: false,
    },
  },
};

const uiSlice = createSlice({
  name: "UI",
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<boolean>) => {
      state.light = action.payload;
      if (action.payload) {
        localStorage.setItem("theme", "light");
      } else {
        localStorage.setItem("theme", "dark");
      }
    },
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
    setNewGoalModalState: (
      state,
      action: PayloadAction<Partial<WorkoutMethodType | null>>
    ) => {
      if (action?.payload != null) {
        state.activeTabMethodFilter = action.payload;
      }
      state.form.goal.newGoalModalState = !state.form.goal.newGoalModalState;
    },
    setActiveWorkout: (state, action: PayloadAction<Partial<WorkoutType>>) => {
      state.activeWorkout = action.payload;
    },
    setActiveTabMethodFilter: (
      state,
      action: PayloadAction<Partial<WorkoutMethodType | null>>
    ) => {
      state.activeTabMethodFilter = action.payload;
    },
    setActiveTabDataFilter: (
      state,
      action: PayloadAction<WorkoutMethodType | null>
    ) => {
      state.activeTabDataFilter = action.payload;
    },
    setNewRoundDefaultValues: (
      state,
      action: PayloadAction<Partial<RoundType>>
    ) => {
      state.form.round.defaultValues = action.payload;
    },
    setCompletedSetsIndices: (
      state,
      action: PayloadAction<{
        [k: number]: boolean;
      }>
    ) => {
      state.form.round.completedSetsIndices = action.payload;
    },
    setGoalDialogStatus: (state, action: PayloadAction<boolean>) => {
      state.dialog.goal.status = action.payload;
    },
    reset: () => initialState,
  },
});

// Export actions
export const {
  setTheme,
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
  setNewGoalModalState,
  setActiveTabMethodFilter,
  setActiveTabDataFilter,
  setCompletedSetsIndices,
  setGoalDialogStatus,
  reset,
} = uiSlice.actions;

export const selectUi = (state: RootState) => state.ui;

export default uiSlice.reducer;
