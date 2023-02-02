import { Provider } from "react-redux";
import { store } from "../../../../../Redux/store";
import * as ui from "../../../../../Redux/slices/uiSlice";
import { render, screen, act, cleanup } from "@testing-library/react";
import "jest-canvas-mock";
import NewGoalModal from "../index";

describe("Component Rendering", () => {
  test("Goal modal renders", () => {
    render(
      <Provider store={store}>
        <NewGoalModal />
      </Provider>
    );

    act(() => {
      store.dispatch(ui.setNewGoalModalState());
    });

    const setActiveGoalTextElement = screen.getByText(/Set Active Goal/i);
    expect(setActiveGoalTextElement).toBeInTheDocument();

    cleanup();
  });
});
