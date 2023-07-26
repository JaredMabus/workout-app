import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import validateFormData from "./validation";
// REDUX
import { setSnackBar } from "../../Redux/slices/uiSlice";
import { setLoginStatus } from "../../Redux/slices/accountSlice";
import { useDispatch } from "react-redux";
// API
import { signUpApi } from "./signUpApi";

export interface FormValues {
  email: string;
  password: string;
  showPassword: boolean;
}

export type FormErrors = Partial<FormValues>;

/**
 * Custom hook for SignUp form.
 * @func [handleChange] handles changes to SignUp form state
 * @func [handleSubmit] validates form values, axios post signup new account api
 */
const useForm = () => {
  const [errors, setErrors] = useState<FormErrors>({});
  const [values, setValue] = useState<FormValues>({
    email: "",
    password: "",
    showPassword: false,
  });
  const [newSignUp, setNewSignUp] = useState(false);
  const [newAccountData, setNewAccountData] = useState(null);
  const dispatch = useDispatch();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    try {
      e.preventDefault();
      var localErrors: FormErrors = validateFormData(values);
      setErrors(localErrors);

      if (Object.keys(localErrors).length === 0) {
        const response = await signUpApi(values);
        if (response.status === 200) {
          dispatch(setLoginStatus(response.data.payload));
          dispatch(
            setSnackBar({
              open: true,
              severity: "success",
              duration: 7000,
              message: "Welcome!",
            })
          );
        } else if (response.status === 405) {
          dispatch(
            setSnackBar({
              open: true,
              severity: "error",
              duration: 7000,
              message: "Account already exist",
            })
          );
        } else {
          dispatch(
            setSnackBar({
              open: true,
              severity: "error",
              duration: 5000,
              message: "Server Error",
            })
          );
        }
      }
    } catch (err) {
      dispatch(
        setSnackBar({
          open: true,
          severity: "error",
          duration: 5000,
          message: `Server Error`,
        })
      );
    }
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

  return {
    values,
    errors,
    newSignUp,
    setNewSignUp,
    handleChange,
    handleSubmit,
    handleMouseDownPassword,
    handleClickShowPassword,
    newAccountData,
  };
};

export default useForm;
