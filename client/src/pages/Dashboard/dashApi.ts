import axios from "../../lib/axios";

export const getTodayCompletedWorkoutsAPI = async () => {
  let res = await axios.get("/round/today");

  return res;
};
