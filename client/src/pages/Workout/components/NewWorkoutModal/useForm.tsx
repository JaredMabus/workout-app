import {
  useState,
  useEffect,
  FormEvent,
  ChangeEvent,
  useLayoutEffect,
} from "react";
import validateFormData from "./validation";
import axios from "../../../../lib/axios";
// REDUX
import { useDispatch, useSelector } from "react-redux";
import {
  setSnackBar,
  setNewWorkoutModalState,
} from "../../../../Redux/slices/uiSlice";
import {
  WorkoutType,
  WorkoutMethodType,
  addWorkout,
} from "../../../../Redux/slices/workoutSlice";
import { selectAccount } from "../../../../Redux/slices/accountSlice";
// TYPES
export interface FormValues {
  _id?: string;
  accountId?: string;
  name: string;
  muscleCategory?: string;
  muscleGroup?: string;
  methodSelection?: WorkoutType[] | [];
}
export type FormErrors = Partial<WorkoutType>;

export const newWorkoutApi = async (data: Partial<WorkoutType>) => {
  return await axios.post("workout", data);
};

const useForm = () => {
  const account = useSelector(selectAccount);
  const defaultValue: Partial<WorkoutType> = {
    accountId: account.accountData._id,
    name: "",
    muscleCategory: "Upper Body",
    muscleGroup: "Abs",
    methodSelection: [],
  };
  const [values, setValue] = useState<Partial<WorkoutType>>(defaultValue);
  const [errors, setErrors] = useState<Partial<WorkoutType>>({});

  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    setValue(defaultValue);
  }, [account]);

  // useEffect(() => {
  //   console.log(values);
  //   console.log(errors);
  // }, [values, errors]);

  // marked as any type to allow for SelectChangeEvent<string[] | string> from multi-select Select input
  const handleChange = (e: ChangeEvent<HTMLInputElement> | any) => {
    if (Array.isArray(e.target.value)) {
      setValue({ ...values, [e.target.name]: e.target.value.sort() });
      return;
    }
    setValue({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    try {
      setLoading(true);
      e.preventDefault();
      var localErrors: FormErrors = validateFormData(values);
      setErrors(localErrors);

      if (Object.keys(localErrors).length === 0) {
        const response = await newWorkoutApi(values);

        if (response.status === 200) {
          let data = response.data;
          dispatch(addWorkout(data.payload));
          setValue(defaultValue);
          dispatch(setNewWorkoutModalState());
          dispatch(
            setSnackBar({
              open: true,
              severity: "success",
              duration: 5000,
              message: "Workout Created!",
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
    } finally {
      setLoading(false);
    }
  };

  return {
    values,
    errors,
    handleChange,
    handleSubmit,
    loading,
  };
};

export default useForm;
