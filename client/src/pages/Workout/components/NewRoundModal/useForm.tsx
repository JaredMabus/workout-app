import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import validateFormData from "./validation";
import axios from "../../../../lib/axios";
// REDUX
import { useDispatch, useSelector } from "react-redux";
import {
  selectUi,
  setNewRoundModalState,
  setSnackBar,
} from "../../../../Redux/slices/uiSlice";
import { RoundType, addRound } from "../../../../Redux/slices/workoutSlice";

export type FormErrors = Partial<RoundType>;

export const newRoundApi = async (data: Partial<RoundType>) => {
  return await axios.post("round", data);
};

const useForm = () => {
  const dispatch = useDispatch();
  const ui = useSelector(selectUi);
  const [values, setValue] = useState<Partial<RoundType>>(
    ui.form.round.defaultValues
  );
  const [errors, setErrors] = useState<Partial<RoundType>>({});
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setValue(ui.form.round.defaultValues);
  }, [ui.form.round.defaultValues]);

  // useEffect(() => {
  // console.log(values);
  // console.log(errors);
  // }, [values, errors]);

  const handleChange = (e: ChangeEvent<HTMLInputElement> | any) => {
    if (e.target.name === "successSetsReps") {
      setValue({ ...values, [e.target.name]: e.target.checked });
      return;
    }

    if (Array.isArray(e.target.value)) {
      setValue({ ...values, [e.target.name]: e.target.value.sort() });
      return;
    }

    if (
      e.target.name === "weight" ||
      e.target.name === "sets" ||
      e.target.name === "reps"
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

  const handleDateChange = (newDate: Date | null) => {
    if (newDate && newDate !== null) {
      setValue({
        ...values,
        ["date"]: newDate,
      });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    try {
      setLoading(true);
      e.preventDefault();
      var localErrors: FormErrors = validateFormData(values);
      setErrors(localErrors);

      if (Object.keys(localErrors).length === 0) {
        if (values === null) return;
        const response = await newRoundApi(values);

        if (response.status === 200) {
          let data = response.data;
          dispatch(addRound(data.payload));
          dispatch(setNewRoundModalState());
          dispatch(
            setSnackBar({
              open: true,
              severity: "success",
              duration: 7000,
              message: `Added round for ${
                ui?.activeWorkout?.name || "workout"
              }`,
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
    handleDateChange,
    handleSubmit,
    loading,
  };
};

export default useForm;
