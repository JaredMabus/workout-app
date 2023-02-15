import React, { createContext, useReducer } from "react";

export interface PlanStateAction {
  type: string;
  payload: any;
}

export interface PlanState {
  hydrate: boolean;
  cardExpanded: boolean;
}

export const initialState: PlanState = {
  hydrate: false,
  cardExpanded: false,
} as const;

const reducer = (
  state: PlanState,
  action: PlanStateAction
): typeof initialState => {
  switch (action.type) {
    case "HYDRATE":
      return {
        ...state,
        hydrate: action.payload,
      };
    case "CARD_EXPANDED":
      return {
        ...state,
        cardExpanded: action.payload,
      };
    default:
      return { ...state };
  }
};

export interface PlanContextObj {
  planState: PlanState;
  dispatchCtx: React.Dispatch<PlanStateAction>;
}

export type PlanUseContextTuple = [PlanState, React.Dispatch<PlanStateAction>];

export const PlanContext = createContext<PlanUseContextTuple>({
  // @ts-ignore
  planState: initialState,
  dispatchCtx: () => {},
});

export default function PlanProvider({ children }: any) {
  const [planState, dispatchCtx] = useReducer(reducer, initialState);
  const value = [planState, dispatchCtx];
  return (
    <PlanContext.Provider
      // @ts-ignore
      value={value}
    >
      {children}
    </PlanContext.Provider>
  );
}
