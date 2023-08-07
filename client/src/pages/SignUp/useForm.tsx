import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import Joi from "joi";
// REDUX
import { setSnackBar } from "../../Redux/slices/uiSlice";
import { setLoginStatus } from "../../Redux/slices/accountSlice";
import { useDispatch } from "react-redux";
// API
import { signUpApi } from "./signUpApi";

import Chance from "chance";
const chance = new Chance();

// Form validation
const schema = Joi.object({
  email: Joi.string()
    .required()
    .email({ tlds: { allow: false } }),
  password: Joi.string()
    .required()
    .min(8)
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
    )
    .messages({
      "string.pattern.base":
        "Must include one: (A-Z, a-z, 0-9, special character) and min 8 characters",
    }),
  showPassword: Joi.boolean().optional(),
});

export interface FormValues {
  email: string;
  password: string;
  showPassword: boolean;
}

/**
 * Custom hook for SignUp form.
 * @func [handleChange] handles changes to SignUp form state
 * @func [handleSubmit] validates form values, axios post signup new account api
 */
const useForm = () => {
  const [values, setValue] = useState<FormValues>({
    email: `${chance.email()}`,
    password: "",
    showPassword: false,
  });
  const [errors, setErrors] = useState<Partial<FormValues>>({});
  const [revalidatePassword, setRevalidatePassword] = useState<boolean>(false);
  const [newSignUp, setNewSignUp] = useState(false);
  const [newAccountData, setNewAccountData] = useState(null);
  const dispatch = useDispatch();

  // useEffect(() => {
  // console.log(values);
  // console.log(errors);
  // }, [values, errors]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (revalidatePassword) {
      handleErrors();
    }
    setValue({ ...values, [e.target.name]: e.target.value });
  };

  const handleErrors = () => {
    const { error } = schema.validate(values, { abortEarly: false });

    if (error) {
      const validationErrors = {};
      error.details.forEach((err) => {
        const key: string | undefined = err.context?.key ?? "unknown";
        //@ts-ignore
        validationErrors[key] = err.message;
      });
      setErrors(validationErrors);
      return validationErrors;
    } else {
      setErrors({});
      return {};
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    try {
      e.preventDefault();
      setRevalidatePassword(true);
      const error = handleErrors();
      if (Object.keys(error).length === 0) {
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
