import axios from "../../lib/axios";
import { WorkoutCardDragObj } from "../../Redux/slices/workoutSlice";

export const getWorkoutPlanWeekApi = async () => {
  let res = await axios.get("/plan");

  return res;
};

export const updateWorkoutPlanWeekApi = async (data: WorkoutCardDragObj) => {
  let res = await axios.put("/plan", data);
  return res;
};
