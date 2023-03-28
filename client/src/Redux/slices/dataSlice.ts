import {
  createSlice,
  PayloadAction,
  createAsyncThunk,
  isRejectedWithValue,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import { WorkoutType } from "./workoutSlice";
import type { RootState } from "../store";
import axios from "../../lib/axios";

export const fetchWorkouts = createAsyncThunk(
  "data/fetchWorkouts",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.get("/workout/data");
      if (res.data.payload) {
        let workoutData = normWorkoutData(res.data.payload);
        return workoutData;
      }
    } catch (err: any) {
      return rejectWithValue(err.res.data);
    }
  }
);

export const addWorkout = createAsyncThunk(
  "data/addWorkout",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post("/workout", data);
      return res.data.payload;
    } catch (err: any) {
      return rejectWithValue(err.res.data);
    }
  }
);

export const removeWorkout = createAsyncThunk(
  "data/removeWorkout",
  async (data: WorkoutType, { rejectWithValue }) => {
    try {
      const res = await axios.delete("/workout", { data: data });
      return res.data.payload;
    } catch (err: any) {
      return rejectWithValue(err.res.data);
    }
  }
);

const normWorkoutData = (data: WorkoutType[]) => {
  try {
    const normData = {
      id: [],
      entities: {},
    };
    const finalData = data.reduce((normData: any, workout: WorkoutType) => {
      normData.id.push(workout._id);
      normData.entities[workout._id] = workout;
      return normData;
    }, normData);

    return finalData;
  } catch (err) {
    throw new Error("Could not normalize data");
  }
};

export interface DynamicObject {
  [key: string]: any;
}

export interface WorkoutNType {
  id: any[];
  entities: DynamicObject;
  status: "success" | "failed" | "idle" | "hydrate";
  loading: boolean;
  error: any;
}

export interface DataInitialStateType {
  workouts: WorkoutNType;
}

const initialState: DataInitialStateType = {
  workouts: {
    id: [],
    entities: {},
    status: "idle",
    loading: false,
    error: false,
  },
};

const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    reset: () => initialState,
    setWorkoutDataIdle: (state) => {
      state.workouts.status = "idle";
    },
  },
  extraReducers(builder) {
    builder
      // WORKOUTS
      // Fetch all workouts
      .addCase(fetchWorkouts.pending, (state) => {
        state.workouts.loading = true;
      })
      .addCase(fetchWorkouts.fulfilled, (state, action) => {
        const { id, entities } = action.payload;
        state.workouts.id = id;
        state.workouts.entities = entities;
        state.workouts.status = "success";
        state.workouts.loading = false;
      })
      .addCase(fetchWorkouts.rejected, (state, action) => {
        state.workouts.status = "failed";
        state.workouts.error = action;
        state.workouts.loading = false;
      })
      // Add workout
      .addCase(addWorkout.pending, (state) => {
        state.workouts.loading = true;
      })
      .addCase(addWorkout.fulfilled, (state, action) => {
        state.workouts.id.push(action.payload._id);
        state.workouts.entities[action.payload._id] = action.payload;
        state.workouts.status = "success";
        state.workouts.loading = false;
      })
      .addCase(addWorkout.rejected, (state, action) => {
        state.workouts.status = "failed";
        state.workouts.error = action;
        state.workouts.loading = false;
      })
      // Remove workout
      .addCase(removeWorkout.pending, (state) => {
        state.workouts.loading = true;
      })
      .addCase(removeWorkout.fulfilled, (state, action) => {
        state.workouts.id.filter((id) => id === action.payload._id);
        delete state.workouts.entities[
          action.payload._id as keyof typeof state.workouts.entities
        ];
        state.workouts.status = "success";
        state.workouts.loading = false;
      })
      .addCase(removeWorkout.rejected, (state, action) => {
        state.workouts.status = "failed";
        state.workouts.error = action;
        state.workouts.loading = false;
      });
  },
});

export const { reset, setWorkoutDataIdle } = dataSlice.actions;

export const selectData = (state: RootState) => state.data;

export default dataSlice.reducer;
