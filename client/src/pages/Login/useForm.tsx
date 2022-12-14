import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import validateFormData from "./validation";
// API
import { LoginApi } from "./LoginApi";
// STATE
import { useDispatch } from "react-redux";
import {
  setLoginStatus,
  setApiStatus,
  setApiError,
} from "../../Redux/slices/accountSlice";
import { setSnackBar } from "../../Redux/slices/uiSlice";

export interface FormValues {
  email: string;
  password: string;
  showPassword: boolean;
}
export type FormErrors = Partial<FormValues>;

/**
 * Custom hook for Login form.
 * @func [handleChange] handles changes to login form
 * @func [handleSubmit] handles submit for login form.
 * @func [attemptLogin] Runs POST login API and handles return logic
 * @returns
 */
const useForm = () => {
  const [values, setValue] = useState<FormValues>({
    email: "test@123.com",
    password: "password",
    showPassword: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // console.log(values);
    // console.log(errors);
  }, [values, errors]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue({ ...values, [e.target.name]: e.target.value });
  };

  const handleClickShowPassword = () => {
    setValue({
      ...values,
      showPassword: !values.showPassword,
    });
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  /**
   * Runs api login and data validation on form values.
   * @param e Login form event
   */
  const handleSubmit = async (e: FormEvent) => {
    try {
      e.preventDefault();
      dispatch(setApiStatus(true));

      let localErrors = validateFormData(values);
      setErrors(localErrors);

      if (Object.keys(localErrors).length === 0) {
        const response = await LoginApi(values);

        if (response.status === 200) {
          let data = await response.data.payload;

          if (data) {
            dispatch(setLoginStatus(data));
            dispatch(setApiError(false));
            return;
          }
        } else if (response.status === 404) {
          let msg = await response.data.msg;
          if (msg) {
            dispatch(
              setSnackBar({
                open: true,
                message: `${msg}`,
                severity: "error",
                duration: 10000,
              })
            );
          }
        } else {
          dispatch(
            setSnackBar({
              open: true,
              message: "Server Error",
              severity: "error",
              duration: 5000,
            })
          );
        }
      }
    } catch (err) {
      dispatch(
        setSnackBar({
          open: true,
          message: `Server Error`,
          severity: "error",
          duration: 10000,
        })
      );
    } finally {
      dispatch(setApiStatus(false));
    }
  };

  return {
    values,
    errors,
    handleChange,
    handleSubmit,
    handleClickShowPassword,
    handleMouseDownPassword,
    navigate,
  };
};

export default useForm;
