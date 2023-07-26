import { renderProviders } from "../../../utils/test-utils";
import {
  screen,
  act,
  renderHook,
  fireEvent,
  createEvent,
} from "@testing-library/react";
// COMPONENTS
import SignUp from "../index";
import useForm from "../useForm";
// REDUX
import store from "../../../Redux/store";
import { Provider } from "react-redux";

describe("Component Rendering", () => {
  test("Initial component render", () => {
    renderProviders(<SignUp />);

    const EmailInputElement = screen.getByTestId("email");
    const PasswordInputElement = screen.getByTestId("password");
    const CreateAccountButton = screen.getByTestId("create-account-btn");

    expect(EmailInputElement).toBeInTheDocument();
    expect(PasswordInputElement).toBeInTheDocument();
    expect(CreateAccountButton).toBeInTheDocument();
  });
});

describe("useForm state and input values", () => {
  test("useForm state update correctly and mock api response is 200", async () => {
    // Render useForm hook
    const wrapper = ({ children }: any) => (
      <Provider store={store}>{children}</Provider>
    );
    renderProviders(<SignUp />);
    const { result } = renderHook(() => useForm(), { wrapper });

    // Input elements
    const emailInput = screen.getByTestId("email").querySelector("input");
    const passwordInput = screen.getByTestId("password").querySelector("input");
    const signUpForm = screen.getByTestId("sign-up-form");

    if (emailInput !== null && passwordInput !== null) {
      fireEvent.change(emailInput, { target: { value: "test@gmail.com" } });
      fireEvent.change(passwordInput, { target: { value: "password" } });
    }

    if (emailInput !== null && passwordInput !== null) {
      // Create synthetic change events
      const emailChangeEvent = createEvent.change(emailInput, {
        target: { name: "email", value: "test@gmail.com" },
      });
      const passwordChangeEvent = createEvent.change(passwordInput, {
        target: { name: "password", value: "password" },
      });

      // Fire the synthetic events
      fireEvent(emailInput, emailChangeEvent);
      fireEvent(passwordInput, passwordChangeEvent);

      // useForm.handleChange email update
      act(() => {
        result.current.handleChange(emailChangeEvent as any);
      });

      // useForm.handleChange password update
      act(() => {
        result.current.handleChange(passwordChangeEvent as any);
      });
    }

    // Test values updated correctly
    expect(emailInput?.value).toBe("test@gmail.com");
    expect(passwordInput?.value).toBe("password");
    expect(result.current.values.email).toBe("test@gmail.com");
    expect(result.current.values.password).toBe("password");
    expect(result.current.values).toEqual({
      email: "test@gmail.com",
      password: "password",
      showPassword: false,
    });

    // useForm.handleSubmit
    const submitFormEvent = createEvent.submit(signUpForm);
    await act(async () => {
      return await result.current.handleSubmit(submitFormEvent as any);
    });

    // UI snackbar component renders with response status
    const snackBar = screen.getByTestId("snackbar");
    const successText = screen.getByText("Success");

    expect(snackBar).toBeInTheDocument();
    expect(successText).toBeInTheDocument();
  });
});
