import {
  createSlice,
  PayloadAction,
  createAsyncThunk,
  AsyncThunkAction,
} from "@reduxjs/toolkit";
import type { RootState } from "../store";
import axios from "../../lib/axios";
import { GridRowSelectionModel } from "@mui/x-data-grid";

export const deleteRound = createAsyncThunk(
  "WORKOUT/deleteRound",
  async (data: GridRowSelectionModel, { rejectWithValue }) => {
    try {
      let res = await axios.delete("/round", { data: data });
      return res;
    } catch (err: any) {
      return rejectWithValue(err.res.data);
    }
  }
);

// -- Workout Types -- //
export interface TargetGoalType {
  weightIncrease: number;
  setIncrease: number;
  repIncrease: number;
  roundGoal: number;
}

export interface GoalType {
  _id: string; // _id is the method type from a group agg
  id?: string; // This is the goal's _id
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
  workoutId: string | Partial<WorkoutType>;
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
export type WeekDayNumberType = "0" | "1" | "2" | "3" | "4" | "5" | "6";
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

// WORKOUT PLAN
// export type WorkoutPlanWeek = WorkoutPlanDays[];
export interface WorkoutPlanWeek {
  0: Partial<WorkoutType>[] | [];
  1: Partial<WorkoutType>[] | [];
  2: Partial<WorkoutType>[] | [];
  3: Partial<WorkoutType>[] | [];
  4: Partial<WorkoutType>[] | [];
  5: Partial<WorkoutType>[] | [];
  6: Partial<WorkoutType>[] | [];
}
export type WeekDayNumber = "0" | "1" | "2" | "3" | "4" | "5" | "6";

export interface ApiStatusType {
  loading: boolean;
  error?: boolean;
  msg?: string | [] | {} | null;
}
// DnD Workout Types
export interface WorkoutCardDragObj {
  _id?: string;
  index?: number | string;
  dragIndex: number;
  hoverIndex: number;
  dayIndex: WeekDayNumber | string;
  dayHoverIndex: WeekDayNumber;
  workout: Partial<WorkoutType>;
  addNewWorkout?: boolean;
}

export interface WorkoutCardMoveObjMenu {
  index: number | string;
  dayIndex: WeekDayNumber | string;
  newDayIndex: WeekDayNumber | string;
  workout: Partial<WorkoutType>;
  addNewWorkout?: boolean;
}

export interface WorkoutType {
  _id: string;
  accountId: string;
  goalId: GoalType[];
  roundId: RoundType[] | string[];
  targetGoal: TargetGoalType;
  name: string;
  muscleCategory: MuscleCategoryType;
  muscleGroup: MuscleGroupType | MuscleGroupType[] | "";
  methodSelection: WorkoutMethodType[];
  lastRounds: RecentRound[];
}

export interface WorkoutInitialState {
  workouts: WorkoutType[];
  api: ApiStatusType;
  workoutPlanWeek: WorkoutPlanWeek;
  todayCompletedWorkouts: Partial<RoundType>[] | null;
}

export const initialState: WorkoutInitialState = {
  workouts: [],
  api: {
    loading: false,
    error: false,
    msg: "",
  },
  workoutPlanWeek: { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] },
  todayCompletedWorkouts: null,
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
        if (
          typeof action.payload.workoutId === "object" &&
          workout._id === action.payload.workoutId._id
        ) {
          if (workout.roundId && Array.isArray(workout.roundId)) {
            workout.roundId.unshift(action.payload as string & RoundType);
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
        (goal) => goal._id === action.payload.method
      );

      state.workouts[workoutIndex].goalId.splice(
        goalIdIndex,
        1,
        action.payload
      );
    },
    setWorkoutPlanWeek: (state, action: PayloadAction<WorkoutPlanWeek>) => {
      state.workoutPlanWeek = action.payload;
    },
    moveWorkoutCard: (state, action: PayloadAction<WorkoutCardDragObj>) => {
      // console.log(action.payload);
      if (action.payload.addNewWorkout === false) {
        // @ts-ignore
        state.workoutPlanWeek[action.payload.dayIndex].splice(
          Number(action.payload.dragIndex),
          1
        );
      }

      if (action.payload.workout) {
        state.workoutPlanWeek[action.payload.dayHoverIndex].splice(
          Number(action.payload.hoverIndex),
          0,
          action.payload.workout
        );
      }
    },
    moveWorkoutCardFromMenu: (
      state,
      action: PayloadAction<Partial<WorkoutCardMoveObjMenu>>
    ) => {
      if (action.payload.addNewWorkout === false) {
        // @ts-ignore
        state.workoutPlanWeek[action.payload.dayIndex].splice(
          action.payload.index,
          1
        );
      }
      // @ts-ignore
      state.workoutPlanWeek[action.payload.newDayIndex].push(
        action.payload.workout
      );
    },
    removeWorkoutFromDay: (
      state,
      action: PayloadAction<Partial<WorkoutCardDragObj>>
    ) => {
      if (Object.keys(state.workoutPlanWeek).length > 0) {
        // @ts-ignore
        state.workoutPlanWeek[action.payload.dayIndex].splice(
          action.payload.index,
          1
        );
      }
    },
    setTodayCompletedWorkouts: (
      state,
      action: PayloadAction<Partial<RoundType>[] | null>
    ) => {
      state.todayCompletedWorkouts = action.payload;
    },
    addTodayCompletedWorkouts: (
      state,
      action: PayloadAction<Partial<RoundType>>
    ) => {
      if (state.todayCompletedWorkouts != null) {
        state.todayCompletedWorkouts.unshift(action.payload);
      } else {
        state.todayCompletedWorkouts = [];
        state.todayCompletedWorkouts.unshift(action.payload);
      }
    },
  },
  extraReducers(builder) {
    builder
      // Delete Round from today's workouts
      .addCase(deleteRound.pending, (state) => {})
      .addCase(deleteRound.fulfilled, (state, action) => {
        if (
          state.todayCompletedWorkouts != null &&
          Array.isArray(action.payload.data.payload)
        ) {
          // console.log(action.payload);
          let idArray = action.payload.data.payload;
          let newArray = state.todayCompletedWorkouts.filter((round) => {
            if (round._id != null && idArray.includes(round._id)) {
              return false;
            } else {
              return round;
            }
          });
          // console.log(newArray);
          state.todayCompletedWorkouts = newArray;
        }
      })
      .addCase(deleteRound.rejected, (state, action) => {
        console.log("Error trying to delete round");
      });
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
  setWorkoutPlanWeek,
  moveWorkoutCard,
  moveWorkoutCardFromMenu,
  removeWorkoutFromDay,
  setTodayCompletedWorkouts,
  addTodayCompletedWorkouts,
} = workoutSlice.actions;

export const selectWorkout = (state: RootState) => state.workout;

export default workoutSlice.reducer;
