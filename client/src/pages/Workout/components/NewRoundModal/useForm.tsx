import React, { useState, useEffect, FormEvent, ChangeEvent } from "react";
import validateFormData from "./validation";
import axios from "../../../../lib/axios";
// REDUX
import { useDispatch, useSelector } from "react-redux";
import {
  selectUi,
  setNewRoundModalState,
  setSnackBar,
  setCompletedSetsIndices,
} from "../../../../Redux/slices/uiSlice";
import * as wk from "../../../../Redux/slices/workoutSlice";

export const newRoundApi = async (data: Partial<wk.RoundType>) => {
  return await axios.post("round", data);
};

export type FormErrors = {
  [key: string]: any;
};

interface Props {
  handleClose: () => void;
}

const useForm = ({ handleClose }: Props) => {
  const dispatch = useDispatch();
  const ui = useSelector(selectUi);
  const [values, setValue] = useState<Partial<wk.RoundType>>(
    ui.form.round.defaultValues
  );
  const [errors, setErrors] = useState<Partial<FormErrors>>({});
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setValue(ui.form.round.defaultValues);
  }, [ui.form.round.defaultValues]);

  // useEffect(() => {
  // console.log(values);
  // console.log(errors);
  // }, [values, errors]);

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | React.RefObject<HTMLInputElement | null>,
    indexPosition: number | null = null
  ) => {
    if ("current" in e) {
      if (
        e.current != null &&
        e.current.name === "sets" &&
        values.sets != null
      ) {
        var numOfSets = Number(e.current.value);

        if (numOfSets <= 0) {
          numOfSets = 1;
        } else if (numOfSets > 20) {
          numOfSets = 20;
        }

        var copiedValues = JSON.parse(JSON.stringify(values));

        if (numOfSets < values.sets.length) {
          copiedValues.sets = values.sets.slice(0, numOfSets);

          setValue(copiedValues);
        } else if (numOfSets > values.sets.length) {
          let diffOfSets = numOfSets - values.sets.length;
          for (let i = 0; i < diffOfSets; i++) {
            copiedValues.sets.push(values.sets[values.sets.length - 1]);
          }
          setValue(copiedValues);
        }
        return;
      } else {
        return;
      }
    }
    if (indexPosition != null) {
      const numberFields = ["weight", "reps"];

      if (numberFields.includes(e.target.name) && values.sets) {
        var num = Number(e.target.value);

        if (num < 0) {
          num = 0;
        } else if (num > 1000) {
          num = 1000;
        }

        var newSetObject = {
          ...values.sets[indexPosition],
          [e.target.name]: num,
        };

        let copiedValues = JSON.parse(JSON.stringify(values));
        copiedValues.sets[indexPosition] = newSetObject;

        setValue(copiedValues);
        return;
      }

      // if (e.target.name === "successSetsReps" && e.target.type === "checkbox") {
      //   setValue({ ...values, [e.target.name]: e.target.checked });
      //   return;
      // }

      if (Array.isArray(e.target.value)) {
        setValue({ ...values, [e.target.name]: e.target.value.sort() });
        return;
      }

      setValue({ ...values, [e.target.name]: e.target.value });
    } else {
      if (e.target.name === "sets" && values.sets != null) {
        var numOfSets = Number(e.target.value);
        if (numOfSets <= 0) {
          numOfSets = 1;
        } else if (numOfSets > 20) {
          numOfSets = 20;
        }

        var copiedValues = JSON.parse(JSON.stringify(values));

        if (numOfSets < values.sets.length) {
          copiedValues.sets = values.sets.slice(0, numOfSets);
          setValue(copiedValues);
        } else if (numOfSets > values.sets.length) {
          let diffOfSets = numOfSets - values.sets.length;

          for (let i = 0; i < diffOfSets; i++) {
            copiedValues.sets.push(values.sets[values.sets.length - 1]);
          }

          setValue(copiedValues);
        }
        return;
      } else {
        return;
      }
    }
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
      var localErrors: Partial<FormErrors> = validateFormData(values);
      setErrors(localErrors);

      if (Object.keys(localErrors).length === 0) {
        if (values === null) return;
        const response = await newRoundApi(values);
        if (response.status === 200) {
          let data = response.data;
          dispatch(wk.addRound(data.payload));
          //if round belongs to today's workout, add to todayCompletedWorkouts array
          let newRound: Partial<wk.RoundType> = {
            _id: data.payload._id,
            workoutId: data.payload.workoutId,
            date: data.payload.date,
            sets: data.payload.sets,
          };
          dispatch(wk.addTodayCompletedWorkouts(newRound));
          dispatch(
            setSnackBar({
              open: true,
              severity: "success",
              duration: 5000,
              message: `Added round for ${
                ui?.activeWorkout?.name || "workout"
              }`,
            })
          );
          dispatch(setCompletedSetsIndices({}));
          handleClose();
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
