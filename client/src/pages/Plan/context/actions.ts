import { PlanStateAction } from "./PlanContext";

export const setHydrate = (data: boolean): PlanStateAction => {
  return {
    type: "HYDRATE",
    payload: data,
  };
};

export const setExpandCard = (data: boolean): PlanStateAction => {
  return {
    type: "CARD_EXPANDED",
    payload: data,
  };
};
