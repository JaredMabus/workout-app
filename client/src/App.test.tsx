import { Provider } from "react-redux";
import { store } from "./Redux/store";
import { render, screen } from "@testing-library/react";
import "jest-canvas-mock";
import App from "./App";

test("renders learn react link", () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );
  const linkElement = screen.getByText(/Weight Lifting Tracker/i);
  expect(linkElement).toBeInTheDocument();
});
