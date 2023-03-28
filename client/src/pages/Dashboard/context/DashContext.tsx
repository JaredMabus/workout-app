import React from "react";

export interface DashStateAction {
  type: string;
  payload: any;
}

export interface DashState {
  filteredSetsData: null | any[];
}

export const initialState: DashState = {
  filteredSetsData: null,
} as const;

const reducer = (
  state: DashState,
  action: DashStateAction
): typeof initialState => {
  switch (action.type) {
    case "FILTER":
      return {
        ...state,
        filteredSetsData: action.payload,
      };
    default:
      return state;
  }
};

export interface DashContextObj {
  dashState: DashState;
  dispatchCtx: React.Dispatch<DashStateAction>;
}

const DashContext = React.createContext({});

export default function DashProvider({ children }: any) {
  return (
    <DashContext.Provider value={React.useReducer(reducer, initialState)}>
      {children}
    </DashContext.Provider>
  );
}
