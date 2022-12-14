import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import validateFormData from "./validation";
// API
import { AccountApi } from "./AccountApi";
// STATE
import { useDispatch, useSelector } from "react-redux";
import {
  setLoginStatus,
  setApiStatus,
  setApiError,
  selectAccount,
} from "../../Redux/slices/accountSlice";
import { setSnackBar } from "../../Redux/slices/uiSlice";

export interface FormValues {
  _id: string | null;
  email: string | null;
  fname: string | null;
  lname: string | null;
  height: number | string;
  weight: number | string;
}
export type FormErrors = Partial<FormValues>;

const useForm = (hideEdit: Function) => {
  const dispatch = useDispatch();
  const account = useSelector(selectAccount);
  const [values, setValue] = useState<FormValues>({ ...account.accountData });
  const [errors, setErrors] = useState<Partial<FormErrors>>({});
  const resetForm = () => {
    setValue({ ...account.accountData });
  };
  useEffect(() => {
    // console.log(values);
    // console.log(errors);
  }, [values, errors]);

  useEffect(() => {
    setValue({ ...account.accountData });
  }, [account]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    try {
      e.preventDefault();
      dispatch(setApiStatus(true));

      let localErrors = validateFormData(values);
      setErrors(localErrors);

      if (Object.keys(localErrors).length === 0) {
        const response = await AccountApi(values);

        if (response.status === 200) {
          let data = await response.data.payload;

          if (data) {
            hideEdit();
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
    resetForm,
  };
};

export default useForm;
