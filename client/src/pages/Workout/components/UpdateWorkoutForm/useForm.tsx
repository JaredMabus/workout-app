import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import validateFormData from "./validation";
import axios from "../../../../lib/axios";
// REDUX
import { useDispatch, useSelector } from "react-redux";
import {
  selectUi,
  setSnackBar,
  setUpdateWorkoutModalState,
} from "../../../../Redux/slices/uiSlice";
import {
  WorkoutType,
  updateWorkout,
} from "../../../../Redux/slices/workoutSlice";

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

export const updateWorkoutApi = async (data: Partial<WorkoutType>) => {
  return await axios.put("workout", data);
};

const useForm = () => {
  const dispatch = useDispatch();
  const ui = useSelector(selectUi);
  const [values, setValue] = useState<Partial<WorkoutType> | null>(
    ui.form.workout.updateWorkoutDefaultValues
  );
  const [errors, setErrors] = useState<Partial<WorkoutType>>({});
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setValue(ui.form.workout.updateWorkoutDefaultValues);
  }, [ui.form.workout.updateWorkoutDefaultValues]);

  // useEffect(() => {
  // console.log(values);
  // console.log(errors);
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
        if (values === null) return;
        const response = await updateWorkoutApi(values);

        if (response.status === 200) {
          let data = response.data;
          dispatch(updateWorkout(data.payload));
          dispatch(setUpdateWorkoutModalState());
          dispatch(
            setSnackBar({
              open: true,
              severity: "success",
              duration: 5000,
              message: "Updated Workout!",
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
    setValue,
    errors,
    handleChange,
    handleSubmit,
    loading,
  };
};

export default useForm;
