import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

// -- Workout Types -- //
export interface WorkoutType {
  _id: string;
  accountId: string;
  goalId: GoalType[];
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
  targetRounds: number;
  targetSets: number;
  targetWeight: number;
  targetReps: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface RoundType {
  _id: string;
  accountId: string;
  workoutId: string;
  method: WorkoutMethodType;
  date: Date | null;
  sets: SetType[];
  successSetsReps: boolean;
}

export interface RecentRound {
  _id: WorkoutMethodType; // aggregation grouped on workout's method value
  lastSets: number;
  lastWeight: number;
  lastReps: number;
  successSetsReps: boolean;
  startDate?: Date | string | any;
  mostRecent?: Date | string | any;
  totalRounds?: number;
  rounds?: RecentRoundsRoundsType[];
  // sets?: SetType[]; // optional when using Round and RecentRound together
}

export interface RecentRoundsRoundsType {
  _id: string;
  date: Date | string | null;
  sets: SetType[];
  successSetsReps: boolean;
}

export interface SetType {
  weight: number;
  reps: number;
  datetime: Date | string | null;
  isComplete?: boolean;
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
    reset: () => initialState,
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
          lastSets: action.payload.sets.length,
          lastWeight: action.payload.sets[0].weight,
          lastReps: action.payload.sets[0].reps,
          successSetsReps: action.payload.successSetsReps,
          startDate: action.payload.date,
          mostRecent: action.payload.date,
        };

        const roundObj: RecentRoundsRoundsType = {
          _id: action.payload._id,
          date: action.payload.date,
          sets: action.payload.sets,
          successSetsReps: action.payload.successSetsReps,
        };

        // Find workout id
        if (workout._id === action.payload.workoutId) {
          if (workout.roundId && Array.isArray(workout.roundId)) {
            workout.roundId.unshift(action.payload._id);
          }

          // Add and update lastRounds by using the round object returned from new round api
          if (workout.lastRounds && workout.lastRounds.length > 0) {
            var i = workout.lastRounds.findIndex(
              (i) => i._id === action.payload.method
            );
            if (i >= 0) {
              workout.lastRounds[i]._id = action.payload.method;
              workout.lastRounds[i].lastSets = action.payload.sets.length;
              workout.lastRounds[i].lastWeight = action.payload.sets[0].weight;
              workout.lastRounds[i].lastReps = action.payload.sets[0].reps;
              workout.lastRounds[i].successSetsReps =
                action.payload.successSetsReps;
              workout.lastRounds[i].startDate = action.payload.date;
              workout.lastRounds[i].mostRecent = action.payload.date;
              // Add new round to lastRounds.rounds array
              if (
                workout != null &&
                workout.lastRounds != null &&
                workout.lastRounds[i] != null &&
                workout.lastRounds[i].rounds != null &&
                Array.isArray(workout.lastRounds[i].rounds)
              ) {
                workout.lastRounds[i].rounds?.unshift(roundObj);
              }
            } else {
              // lastRounds does NOT contain method
              newLastRound.rounds = [roundObj];
              workout.lastRounds.unshift(newLastRound);
            }
          } else {
            // add lastRounds array if doesn't exist
            workout.lastRounds = [];
            newLastRound.rounds = [roundObj];
            workout.lastRounds.unshift(newLastRound);
          }
        }
      });
    },
    updateWorkout: (state, action: PayloadAction<any>) => {
      console.log(action.payload);
      let i = state.workouts.findIndex(
        (item) => item._id === action.payload._id
      );
      state.workouts.splice(i, 1, action.payload);
    },
    addWorkoutGoal: (state, action: PayloadAction<GoalType>) => {
      let workoutIndex = state.workouts.findIndex(
        (workout) => workout._id === action.payload.workoutId
      );

      let goalIdIndex = state.workouts[workoutIndex].goalId.findIndex(
        (goal) => goal.method === action.payload.method
      );

      state.workouts[workoutIndex].goalId.splice(
        goalIdIndex,
        1,
        action.payload
      );
    },
  },
});

export const {
  reset,
  setWorkouts,
  setApiStatus,
  addWorkout,
  removeWorkout,
  updateWorkout,
  addRound,
  addWorkoutGoal,
} = workoutSlice.actions;

export const selectWorkout = (state: RootState) => state.workout;

export default workoutSlice.reducer;
