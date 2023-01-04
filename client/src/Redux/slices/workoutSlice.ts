import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

// -- Workout Types -- //
export interface WorkoutType {
  _id: string;
  accountId: string;
  goalId: GoalByMethod[];
  roundId: Partial<RoundType>[] | string[];
  targetGoal: TargetGoalType;
  name: string;
  muscleCategory: MuscleCategoryType;
  muscleGroup: MuscleGroupType | MuscleGroupType[] | "";
  methodSelection: WorkoutMethodType[] | string[];
  lastRounds?: RecentRound[];
}

export interface TargetGoalType {
  weightIncrease: number;
  setIncrease: number;
  repIncrease: number;
  roundGoal: number;
}

export interface GoalType {
  _id: string;
  accountId: string;
  workoutId: string;
  method: WorkoutMethodType;
  achieved: boolean;
  dateAchieved: Date;
  targetWeight: number;
  targetSets: number;
  targetReps: number;
}

export interface GoalByMethod {
  _id: WorkoutMethodType;
  createdAt: Date;
  values: Partial<GoalType>[];
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
  totalRounds?: number;
  rounds?: RoundType[];
  goalByMethod?: {
    targetWeight: number;
    targetSet: number;
    targetRep: number;
  };
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
      state.workouts.forEach((workout: WorkoutType) => {
        // Create recentRound object based on Round document
        const newLastRound: RecentRound = {
          _id: action.payload.method,
          lastWeight: action.payload.weight,
          lastSets: action.payload.sets,
          lastReps: action.payload.reps,
          successSetsReps: action.payload.successSetsReps,
          startDate: action.payload.date,
          mostRecent: action.payload.date,
        };
        // Find workout id
        if (workout._id === action.payload.workoutId) {
          if (workout.roundId && Array.isArray(workout.roundId)) {
            workout.roundId.unshift(action.payload._id);
          }

          // Add to lastRounds
          if (workout.lastRounds && workout.lastRounds.length > 0) {
            var indexOfRound = workout.lastRounds.findIndex(
              (i) => i._id === action.payload.method
            );
            if (indexOfRound >= 0) {
              workout.lastRounds[indexOfRound]._id = action.payload.method;
              workout.lastRounds[indexOfRound].lastWeight =
                action.payload.weight;
              workout.lastRounds[indexOfRound].lastSets = action.payload.sets;
              workout.lastRounds[indexOfRound].lastReps = action.payload.reps;
              workout.lastRounds[indexOfRound].successSetsReps =
                action.payload.successSetsReps;
              workout.lastRounds[indexOfRound].startDate = action.payload.date;
              workout.lastRounds[indexOfRound].mostRecent = action.payload.date;
              if (
                workout != null &&
                workout.lastRounds != null &&
                workout.lastRounds[indexOfRound] != null &&
                workout.lastRounds[indexOfRound].rounds != null &&
                Array.isArray(workout.lastRounds[indexOfRound].rounds)
              ) {
                workout.lastRounds[indexOfRound].rounds?.unshift(
                  action.payload
                );
              }
            } else {
              // add method and recent round metrics
              newLastRound.rounds = [action.payload];
              workout.lastRounds.unshift(newLastRound);
            }
          } else {
            if (Array.isArray(workout.lastRounds)) {
              newLastRound.rounds = [action.payload];
              workout.lastRounds.unshift(newLastRound);
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
