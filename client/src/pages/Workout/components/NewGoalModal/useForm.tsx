import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import validateFormData from "./validation";
import axios from "../../../../lib/axios";
// REDUX
import { useDispatch, useSelector } from "react-redux";
import {
  selectUi,
  setNewGoalModalState,
  setSnackBar,
} from "../../../../Redux/slices/uiSlice";
import { GoalType } from "../../../../Redux/slices/workoutSlice";
import { selectAccount } from "../../../../Redux/slices/accountSlice";

export type FormErrors = Partial<GoalType>;

export const newGoalApi = async (values: Partial<GoalType>) => {
  return await axios.post("goal", values);
};

export const updateGoalApi = async () => {
  let res = await axios.put("goal");
  if (res.status === 200) {
    let data = res.data.payload;
    return data;
  }
  return [];
};

const useForm = () => {
  const dispatch = useDispatch();
  const ui = useSelector(selectUi);
  const account = useSelector(selectAccount);
  const defaultValues: Partial<GoalType> = {
    workoutId: "",
    accountId: "",
    method: "",
    targetWeight: 50,
    targetSets: 3,
    targetReps: 8,
  };
  const [values, setValue] = useState<Partial<GoalType>>(defaultValues);
  const [errors, setErrors] = useState<Partial<GoalType>>({});
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // console.log("Account change");
    setValue({ ...values, accountId: account.accountData._id });
  }, [account]);

  useEffect(() => {
    if (
      ui.activeTabMethodFilter != null &&
      ui.activeWorkout != null &&
      ui.activeWorkout._id != null
    ) {
      setValue({
        ...values,
        method: ui.activeTabMethodFilter,
        workoutId: ui?.activeWorkout?._id,
      });
    }
  }, [ui]);

  // useEffect(() => {
  //   console.log(values);
  //   console.log(errors);
  // }, [values, errors]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (
      e.target.name === "targetWeight" ||
      e.target.name === "targetSets" ||
      e.target.name === "targetReps"
    ) {
      const num = parseInt(e.target.value);
      if (num > 0 && num <= 1000) {
        setValue({ ...values, [e.target.name]: num });
        return;
      } else if (num > 1000) {
        setValue({ ...values, [e.target.name]: 1000 });
        return;
      } else {
        setValue({ ...values, [e.target.name]: 1 });
        return;
      }
    }
    setValue({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    try {
      // console.log("Submit test");
      setLoading(true);
      e.preventDefault();
      var localErrors: FormErrors = validateFormData(values);
      setErrors(localErrors);

      if (Object.keys(localErrors).length === 0) {
        if (values === null) return;
        // console.log(values);
        const response = await newGoalApi(values);

        if (response.status === 200) {
          let data = response.data;

          dispatch(setNewGoalModalState());
          dispatch(
            setSnackBar({
              open: true,
              severity: "success",
              duration: 7000,
              message: `Added goal for ${ui?.activeWorkout?.name || "workout"}`,
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
