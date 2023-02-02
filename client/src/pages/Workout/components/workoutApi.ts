import axios from "../../../lib/axios";
import { WorkoutType } from "../../../Redux/slices/workoutSlice";

export const workoutApi = async () => {
  let res = await axios.get("workout/data");
  if (res.status === 200) {
    let data = res.data.payload;
    return data;
  }
  return [];
};

export const deleteWorkoutApi = async (data: WorkoutType) => {
  let res = await axios.delete("workout", { data: data });
  return res;
};
