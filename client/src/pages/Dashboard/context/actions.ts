import { DashStateAction } from "./DashContext";

export const filterWorkoutData = (data: any): DashStateAction => {
  return {
    type: "FILTER",
    payload: data,
  };
};
