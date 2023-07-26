import React, { PropsWithChildren } from "react";
import { render } from "@testing-library/react";
import type { RenderOptions } from "@testing-library/react";
// import { configureStore } from "@reduxjs/toolkit";
// import type { PreloadedState } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import store from "../Redux/store";
import { BrowserRouter } from "react-router-dom";

// This type interface extends the default options for render from RTL, as well
// as allows the user to specify other things such as initialState, store.
interface ExtendedRenderOptions extends Omit<RenderOptions, "queries"> {
  store?: typeof store;
}

export function renderProviders(
  ui: React.ReactElement,
  {
    // Automatically create a store instance if no store was passed in
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  function Wrapper({ children }: PropsWithChildren<{}>): JSX.Element {
    return (
      <Provider store={store}>
        <BrowserRouter>{children}</BrowserRouter>
      </Provider>
    );
  }

  // Return an object with the store and all of RTL's query functions
  return { ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}
