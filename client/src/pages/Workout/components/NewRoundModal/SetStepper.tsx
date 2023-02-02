import * as React from "react";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepButton from "@mui/material/StepButton";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { TextField, Stack, alpha } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { grey } from "@mui/material/colors";
import {
  Check,
  DoneAll,
  AddTask,
  Add,
  Remove,
  FactCheck,
  CheckCircleOutline,
  TimerOutlined,
} from "@mui/icons-material";
// REDUX
import { useSelector, useDispatch } from "react-redux";
import {
  WorkoutType,
  WorkoutMethodType,
  SetType,
  RoundType,
} from "../../../../Redux/slices/workoutSlice";
import * as ui from "../../../../Redux/slices/uiSlice";
import { filterData } from "../../../../utils/filterObject";
import Timer from "./Timer";

export interface Props {
  values: any;
  setValue: React.Dispatch<React.SetStateAction<Partial<RoundType>>>;
  errors: any;
  handleChange: React.ChangeEvent<HTMLInputElement> | any;
}

export default function SetStepper({
  values,
  setValue,
  errors,
  handleChange,
}: Props) {
  const uiState = useSelector(ui.selectUi);
  const workout = uiState.activeWorkout;
  const dispatch = useDispatch();
  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);
  const [steps, setSteps] = React.useState<SetType[] | []>([]);
  const [completed, setCompleted] = React.useState<{
    [k: number]: boolean;
  }>({});
  // TIMER
  const defaultTime = 10;
  let [time, setTime] = useState(defaultTime);
  const [timerOn, setTimeOn] = useState(false);

  // React.useEffect(() => {
  //   console.log(values.sets);
  //   console.log(steps);
  //   console.log(completed);
  // }, [steps, values, completed]);

  const totalSteps = () => {
    return steps.length;
  };

  const completedSteps = () => {
    return Object.keys(completed).length;
  };

  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };

  const handleNext = () => {
    if (activeStep > steps.length) {
      setActiveStep(steps.length - 1);
      return;
    }
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? // It's the last step, but not all steps have been completed,
          // find the first step that has been completed
          steps.findIndex((step, i) => !(i in completed))
        : activeStep + 1;
    setActiveStep(newActiveStep);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStep = (step: number) => () => {
    setActiveStep(step);
  };

  const handleComplete = () => {
    const newCompleted = completed;
    newCompleted[activeStep] = true;
    setCompleted(newCompleted);
    dispatch(ui.setCompletedSetsIndices({ ...newCompleted }));
    if (time === 0) {
      setTime(defaultTime);
    }
    setTimeOn(true);
    handleNext();
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
    dispatch(ui.setCompletedSetsIndices({}));
    setTime(defaultTime);
    setTimeOn(false);
  };

  React.useEffect(() => {
    if (uiState.form.round.defaultValues.sets) {
      setSteps(uiState.form.round.defaultValues.sets);
    }
  }, [ui]);

  React.useEffect(() => {
    setSteps(values.sets);
  }, [values.sets]);

  React.useEffect(() => {
    if (activeStep > steps.length) {
      setActiveStep(steps.length - 1);
      return;
    }
  }, [steps, values]);

  useEffect(() => {
    let interval: any = null;

    if (timerOn) {
      setTime(time--);
      interval = setInterval(() => {
        if (time <= 0) {
          setTime(0);
          clearInterval(interval);
          setTimeOn(false);
          return;
        }
        setTime(time--);
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [timerOn]);

  return (
    <Box sx={{ width: "100%" }}>
      <Stepper
        nonLinear
        activeStep={activeStep}
        sx={{
          gap: 1.5,
          flexWrap: "wrap",
          minHeight: 48,
          maxHeight: 75,
          maxWidth: "100%",
          overflowY: "scroll",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        {steps.map((label, index) => (
          <Step
            key={`${index}-set`}
            completed={completed[index]}
            sx={{
              display: "flex",
              m: 1,
              p: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <StepButton
              color="inherit"
              onClick={handleStep(index)}
              sx={{ p: 1.5 }}
            ></StepButton>
          </Step>
        ))}
      </Stepper>
      <div>
        {allStepsCompleted() ? (
          <React.Fragment>
            <Stack direction="row" sx={{ mt: 2, mb: 1, alignItems: "center" }}>
              <CheckCircleOutline sx={{ height: 35, width: 35 }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Finished your last set!
              </Typography>
            </Stack>

            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Box sx={{ flex: "1 1 auto" }} />
              <Button onClick={handleReset}>Reset</Button>
            </Box>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Stack
              sx={{
                alignItems: "center",
                justifyContent: "center",
                p: 1,
                height: 100,
                // borderTop: `1px solid ${grey[200]}}`,
                borderBottom: `1px solid ${grey[200]}}`,
              }}
            >
              <Timer
                time={time}
                defaultTime={defaultTime}
                setTime={setTime}
                timerOn={timerOn}
                setTimeOn={setTimeOn}
              />
            </Stack>
            <Typography sx={{ mt: 2, mb: 1, py: 1 }}>
              Set {activeStep + 1}
            </Typography>
            {steps && (
              <Stack spacing={3}>
                <Stack direction="row">
                  <TextField
                    id="weight"
                    name="weight"
                    label="Weight (lbs)"
                    sx={{
                      maxWidth: 100,
                      "& input[type=number]::-webkit-inner-spin-button,& input[type=number]::-webkit-outer-spin-button ":
                        {
                          WebkitAppearance: "none",
                          margin: 0,
                        },
                    }}
                    type="number"
                    variant="outlined"
                    size="medium"
                    value={
                      values.sets[activeStep] &&
                      values.sets[activeStep].weight != null
                        ? values.sets[activeStep].weight
                        : 0
                    }
                    onChange={(e) => handleChange(e, activeStep)}
                    autoFocus
                    error={errors.weight ? true : false}
                    helperText={errors.weight ? errors.weight : ``}
                  />
                  <Button
                    id="weight-decrement-btn"
                    onClick={() => {
                      let newValue = JSON.parse(JSON.stringify(values));
                      newValue.sets[activeStep].weight--;
                      setValue({ ...newValue });
                    }}
                  >
                    <Remove />
                  </Button>
                  <Button
                    id="weight-increment-btn"
                    onClick={() => {
                      let newValue = JSON.parse(JSON.stringify(values));
                      newValue.sets[activeStep].weight++;
                      setValue({ ...newValue });
                    }}
                  >
                    <Add />
                  </Button>
                </Stack>
                <Stack direction="row">
                  <TextField
                    id="reps-input"
                    name="reps"
                    label="Reps"
                    sx={{
                      maxWidth: 100,
                      "& input[type=number]::-webkit-inner-spin-button,& input[type=number]::-webkit-outer-spin-button ":
                        {
                          WebkitAppearance: "none",
                          margin: 0,
                        },
                    }}
                    type="number"
                    variant="outlined"
                    size="medium"
                    value={
                      values.sets[activeStep] &&
                      values.sets[activeStep].reps != null
                        ? values.sets[activeStep].reps
                        : 0
                    }
                    onChange={(e) => handleChange(e, activeStep)}
                    error={errors.reps ? true : false}
                    helperText={errors.reps ? errors.reps : ``}
                  />

                  <Button
                    id="reps-decrement-btn"
                    onClick={() => {
                      let newValue = JSON.parse(JSON.stringify(values));
                      newValue.sets[activeStep].reps--;
                      setValue({ ...newValue });
                    }}
                  >
                    <Remove />
                  </Button>
                  <Button
                    id="reps-increment-btn"
                    onClick={() => {
                      let newValue = JSON.parse(JSON.stringify(values));
                      newValue.sets[activeStep].reps++;
                      setValue({ ...newValue });
                    }}
                  >
                    <Add />
                  </Button>
                </Stack>
              </Stack>
            )}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "row",
                pt: 2,
                minHeight: 72.5,
              }}
            >
              {/* <Button
            color="inherit"
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{ mr: 1 }}
          >
            Back
          </Button>
          <Box sx={{ flex: "1 1 auto" }} />
          <Button onClick={handleNext} sx={{ mr: 1 }}>
            Next
          </Button> */}
              {activeStep !== steps.length &&
                (completed[activeStep] ? (
                  <Typography
                    variant="body2"
                    sx={{ py: 2, minHeight: 56, display: "inline-block" }}
                  >
                    Set {activeStep + 1} Completed! You can still edit your
                    weight and reps
                  </Typography>
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleComplete}
                    endIcon={timerOn === true ? <TimerOutlined /> : <AddTask />}
                    sx={{
                      backgroundColor:
                        timerOn === true
                          ? alpha(theme.palette.primary.main, 0.8)
                          : alpha(theme.palette.primary.main, 1),
                      minWidth: 200,
                      justifySelf: "center",
                      alignSelf: "center",
                      fontWeight: 700,
                      borderRadius: 10,
                      px: 5,
                      py: 2,
                    }}
                  >
                    {completedSteps() === totalSteps() - 1 && timerOn === false
                      ? "Finish"
                      : "Complete Set"}
                    <br></br>
                    {timerOn === true &&
                      ` Rest... ${
                        (time - (time %= 60)) / 60 +
                        (9 < time ? ":" : ":0") +
                        time
                      }`}
                  </Button>
                ))}
            </Box>
          </React.Fragment>
        )}
      </div>
    </Box>
  );
}
