import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

// -- Workout Types -- //
export interface WorkoutType {
  _id: string;
  accountId: string;
  roundId: RoundType[];
  name: string;
  muscleCategory: MuscleCategoryType;
  muscleGroup: MuscleGroupType | MuscleGroupType[] | "";
  methodSelection: WorkoutMethodType[] | string[];
  lastRounds?: RecentRound[];
}

export interface RoundType {
  _id: string;
  accountId: string;
  workoutId: string;
  method: WorkoutMethodType;
  date: Date | null;
  weight: number;
  sets: number;
  reps: number;
  successSetsReps: boolean;
}

export interface RecentRound {
  _id: WorkoutMethodType; // aggregation grouped on workout's method value
  lastWeight: number;
  lastSets: number;
  lastReps: number;
  successSetsReps: boolean;
  startDate: Date | string | any;
  mostRecent: Date | string | any;
  count?: number;
}

export type MuscleCategoryType = "Upper Body" | "Lower Body" | "Core" | "";
export type MuscleGroupType =
  | "Chest"
  | "Legs"
  | "Glutes"
  | "Shoulder"
  | "Back"
  | "Front Arm"
  | "Back Arm"
  | "Abs";
export type WorkoutMethodType =
  | "Barbell"
  | "Cable"
  | "Dumbbell"
  | "Machine"
  | "";

export type WorkoutPlanWeek = WorkoutPlanDays[];

export interface WorkoutPlanDays {
  0: string[];
  1: string[];
  2: string[];
  3: string[];
  4: string[];
  5: string[];
  6: string[];
}

export type WeekDayNumber = "0" | "1" | "2" | "3" | "4" | "5" | "6";
export interface ApiStatusType {
  loading: boolean;
  error: boolean;
  msg: string | [] | {} | null;
}
export interface WorkoutInitialState {
  workouts: WorkoutType[];
  api: ApiStatusType;
}

export const initialState: WorkoutInitialState = {
  workouts: [],
  api: {
    loading: false,
    error: false,
    msg: "",
  },
};

const workoutSlice = createSlice({
  name: "WORKOUT",
  initialState,
  reducers: {
    setWorkouts: (state, action: PayloadAction<WorkoutType[] | []>) => {
      state.workouts = action.payload;
    },
    setApiStatus: (state, action: PayloadAction<ApiStatusType>) => {
      state.api = action.payload;
    },
    addWorkout: (state, action: PayloadAction<WorkoutType>) => {
      state.workouts.unshift(action.payload);
    },
    removeWorkout: (state, action: PayloadAction<WorkoutType>) => {
      let removeWorkoutIndex = state.workouts.findIndex(
        (i) => i._id === action.payload._id
      );
      state.workouts.splice(removeWorkoutIndex, 1);
    },
    addRound: (state, action: PayloadAction<RoundType>) => {
      state.workouts.forEach((item: WorkoutType) => {
        const newLastRound: RecentRound = {
          _id: action.payload.method,
          lastWeight: action.payload.weight,
          lastSets: action.payload.sets,
          lastReps: action.payload.reps,
          successSetsReps: action.payload.successSetsReps,
          startDate: action.payload.date,
          mostRecent: action.payload.date,
        };
        if (item._id === action.payload.workoutId) {
          if (Array.isArray(item.roundId)) item.roundId.unshift(action.payload);

          if (item.lastRounds && item.lastRounds.length > 0) {
            var indexOfRound = item.lastRounds.findIndex(
              (i) => i._id === action.payload.method
            );
            if (indexOfRound >= 0) {
              item.lastRounds.splice(indexOfRound, 1, newLastRound);
            } else {
              item.lastRounds.push(newLastRound);
            }
          } else {
            if (Array.isArray(item.lastRounds)) {
              item.lastRounds.push(newLastRound);
            }
          }
        }
      });
    },
    updateWorkout: (state, action: PayloadAction<any>) => {
      let i = state.workouts.findIndex(
        (item) => item._id === action.payload._id
      );
      state.workouts.splice(i, 1, action.payload);
    },
    reset: () => initialState,
  },
});

export const {
  setWorkouts,
  setApiStatus,
  addWorkout,
  removeWorkout,
  updateWorkout,
  addRound,
  reset,
} = workoutSlice.actions;

export const selectWorkout = (state: RootState) => state.workout;

export default workoutSlice.reducer;
