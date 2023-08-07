import React, { useEffect, useState } from "react";
import useForm from "./useForm";
import { useTheme } from "@mui/material/styles";
import {
  Box,
  Step,
  Stepper,
  StepButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  IconButton,
  Stack,
  Divider,
  TextField,
  Typography,
  alpha,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// ICONS
import {
  AddTask,
  Add,
  Remove,
  CheckCircleOutline,
  TimerOutlined,
} from "@mui/icons-material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// REDUX
import { useDispatch, useSelector } from "react-redux";
import * as ui from "../../../../Redux/slices/uiSlice";
import * as wk from "../../../../Redux/slices/workoutSlice";
// COMPONENTS
// import SetStepper from "./SetStepper";
import CompletedSetTable from "./CompletedSetTable";
import Timer from "./Timer";
import * as CustomComp from "../../../../styles/components";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function FormDialog() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const uiState = useSelector(ui.selectUi);

  const handleClose = (): void => {
    dispatch(ui.setNewRoundModalState());
    dispatch(ui.setCompletedSetsIndices({}));
    handleReset();
  };

  const {
    values,
    setValue,
    errors,
    handleChange,
    handleSubmit,
    handleDateChange,
  } = useForm({ handleClose });

  // DATE PICKER
  const [dateValue, setDateValue] = React.useState<Date | null>(new Date());
  const handleDate = (newValue: Date | null) => {
    setDateValue(newValue);
    handleDateChange(newValue);
  };

  useEffect(() => {
    if (
      Array.isArray(uiState.form.round.defaultValues) &&
      uiState.form.round.defaultValues.length > 0 &&
      uiState.form.round.defaultValues.date
    ) {
      setDateValue(uiState.form.round?.defaultValues?.date || new Date());
    }
  }, [uiState.form.round.defaultValues]);

  // TIMER
  const defaultTime = 10;
  let [time, setTime] = useState(defaultTime);
  const [timerOn, setTimeOn] = useState(false);

  // SET STEPPER STATE
  const [activeStep, setActiveStep] = React.useState(0);
  const [steps, setSteps] = React.useState<wk.SetType[] | []>([]);
  const [completed, setCompleted] = React.useState<{
    [k: number]: boolean;
  }>({});

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
    if (values.sets) {
      setSteps(values.sets);
    }
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

  // INCREMENT AND DECREMENT REFS
  const inputRefSet = React.useRef<HTMLInputElement>(null);
  const inputRefWeight = React.useRef<HTMLInputElement>(null);
  const inputRefRep = React.useRef<HTMLInputElement>(null);

  const maxSets = 20;
  const minSets = 1;

  const incrementSets = () => {
    try {
      if (inputRefSet.current != null && inputRefSet.current.value != null) {
        if (Number(inputRefSet.current.value) >= maxSets) {
          return;
        }
        inputRefSet.current.stepUp();
        handleChange(inputRefSet);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const decrementSets = () => {
    try {
      if (inputRefSet.current != null && inputRefSet.current.value != null) {
        if (Number(inputRefSet.current.value) <= minSets) {
          return;
        }
        inputRefSet.current.stepDown();
        handleChange(inputRefSet);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleDecrement = (
    fieldName: keyof wk.RoundType | keyof wk.SetType
  ) => {
    try {
      var ref: React.RefObject<HTMLInputElement | null> | null = null;
      var num: number = 0;

      if (
        fieldName === "weight" &&
        inputRefWeight.current != null &&
        inputRefWeight.current.value != null
      ) {
        ref = inputRefWeight;
      }

      if (
        fieldName === "reps" &&
        inputRefRep.current != null &&
        inputRefRep.current.value != null
      ) {
        ref = inputRefRep;
      }

      if (ref != null && ref.current != null) {
        num = Number(ref.current.value);
        num--;
        ref.current.value = num.toString();

        const syntheticEvent = {
          target: ref.current,
        } as React.ChangeEvent<HTMLInputElement>;

        handleChange(syntheticEvent, activeStep);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleIncrement = (
    fieldName: keyof wk.RoundType | keyof wk.SetType
  ) => {
    try {
      var ref: React.MutableRefObject<HTMLInputElement | null> | null = null;
      var num: number = 0;

      if (
        fieldName === "weight" &&
        inputRefWeight.current != null &&
        inputRefWeight.current.value != null
      ) {
        ref = inputRefWeight;
      }

      if (
        fieldName === "reps" &&
        inputRefRep.current != null &&
        inputRefRep.current.value != null
      ) {
        ref = inputRefRep;
      }

      if (ref != null && ref.current != null) {
        num = Number(ref.current.value);
        num++;
        ref.current.value = num.toString();

        const syntheticEvent = {
          target: ref.current,
        } as React.ChangeEvent<HTMLInputElement>;

        handleChange(syntheticEvent, activeStep);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Dialog
      fullWidth={true}
      open={uiState.form.round.newRoundModalState}
      onClose={handleClose}
    >
      <Stack
        sx={{
          px: { xs: 1, sm: 2 },
          pt: 1,
          pb: 1,
          border: `3px solid ${theme.palette.primary.main}`,
          backgroundColor: theme.palette.surface.light,
          maxWidth: "100%",
          overflowX: "hidden",
        }}
      >
        <Stack
          direction="row"
          sx={{
            py: 1,
            px: 1,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Stack
            sx={{
              width: "100%",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: { xs: "start", sm: "space-between" },
              alighnItems: { xs: "start", sm: "space-between" },
              gap: { xs: 2, sm: 0 },
              borderBottom: `1px solid ${theme.palette.border.main}`,
            }}
          >
            <Stack>
              <Typography
                align="left"
                variant="h4"
                sx={{ fontWeight: 700, mt: 0.4 }}
              >
                {uiState?.activeWorkout?.name || "Workout"}
              </Typography>
              <Typography
                align="left"
                variant="h5"
                sx={{
                  fontWeight: 700,
                  mt: 0.4,
                  fontSize: { xs: 15, sm: 18 },
                  color: theme.palette.text.secondary,
                }}
              >
                New Round
              </Typography>
            </Stack>
            <Stack sx={{ alignSelf: { xs: "center" } }}>
              <Timer
                time={time}
                defaultTime={defaultTime}
                setTime={setTime}
                timerOn={timerOn}
                setTimeOn={setTimeOn}
              />
            </Stack>
          </Stack>
        </Stack>
        <DialogContent
          sx={{
            // px: 2,
            // pt: { xs: 1, sm: 2 },
            backgroundColor: theme.palette.background.paper,
            py: 1.5,
            px: 2,
            borderRadius: 4,
          }}
        >
          <Stack spacing={3}>
            <Accordion
              disableGutters
              sx={{
                // backgroundColor: "transparent",
                backgroundColor: theme.palette.background.paper,
                boxShadow: "none",
                borderBottom: `1px solid ${theme.palette.border.main}`,
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                sx={{ m: 0, p: 0, backgroundColor: "transparent" }}
              >
                <Typography variant="body2">Other Fields</Typography>
              </AccordionSummary>
              <AccordionDetails
                sx={{ px: 1, pb: 1, pt: 0, backgroundColor: "transparent" }}
              >
                <Stack>
                  <Stack
                    sx={{
                      p: 1,
                      rowGap: 3,
                      columnGap: 1,
                      flexDirection: { xs: "column", sm: "row" },
                      justifyContent: { xs: "start", sm: "baseline" },
                      alignItems: { xs: "start", sm: "baseline" },
                    }}
                  >
                    <TextField
                      id="muscle-category-input"
                      name="method"
                      select
                      label="Method"
                      variant="outlined"
                      size="small"
                      value={values?.method || ""}
                      onChange={handleChange}
                      InputLabelProps={{ shrink: true }}
                      SelectProps={{
                        native: true,
                      }}
                      sx={{ maxWidth: 200 }}
                      error={errors.method ? true : false}
                      helperText={errors.method ? errors.method : ""}
                    >
                      {uiState.activeWorkout &&
                        Array.isArray(uiState.activeWorkout.methodSelection) &&
                        uiState.activeWorkout.methodSelection.map((option) => (
                          <option key={`${option}-option`} value={option}>
                            {option}
                          </option>
                        ))}
                    </TextField>
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                      <DatePicker
                        label="Date"
                        value={dateValue}
                        onChange={(newValue: Date | null) => {
                          handleDate(newValue);
                        }}
                        renderInput={(params: any) => (
                          <TextField
                            {...params}
                            name="date"
                            variant="outlined"
                            id="date-workoutRound"
                            size="small"
                            sx={{
                              maxWidth: 175,
                            }}
                          />
                        )}
                      />
                    </LocalizationProvider>
                  </Stack>
                  <Stack direction="row">
                    <TextField
                      id="sets"
                      inputRef={inputRefSet}
                      name="sets"
                      label="Sets"
                      type="number"
                      size="small"
                      variant="outlined"
                      value={values?.sets?.length || 0}
                      onChange={handleChange}
                      error={errors.sets ? true : false}
                      helperText={errors.sets ? errors.sets : ``}
                      hidden={true}
                      sx={{
                        display: "none",
                        maxWidth: 75,
                        "& input[type=number]::-webkit-inner-spin-button,& input[type=number]::-webkit-outer-spin-button ":
                          {
                            WebkitAppearance: "none",
                            margin: 0,
                          },
                      }}
                    />
                  </Stack>
                </Stack>
              </AccordionDetails>
            </Accordion>
            <Stack>
              <Stack direction="row" alignItems={"center"} sx={{ m: 0 }}>
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ justifyContent: "center", alignItems: "baseline" }}
                >
                  <Typography variant="h4" sx={{ fontWeight: 600 }}>
                    Set
                  </Typography>
                  <Typography variant="body2">
                    {activeStep + 1} / {steps.length}
                  </Typography>
                </Stack>
                <Stack direction="row">
                  <CustomComp.ContrastBtn
                    id="weight-decrement-btn"
                    onClick={decrementSets}
                  >
                    <Remove />
                  </CustomComp.ContrastBtn>
                  <CustomComp.ContrastBtn
                    id="weight-increment-btn"
                    onClick={incrementSets}
                  >
                    <Add />
                  </CustomComp.ContrastBtn>
                </Stack>
              </Stack>
              <Stack sx={{}}>
                {/* STEPPER WRAPPER */}
                <Box sx={{ width: "100%" }}>
                  <Stepper
                    nonLinear
                    activeStep={activeStep}
                    sx={{
                      my: 2,
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
                        />
                      </Step>
                    ))}
                  </Stepper>
                  {allStepsCompleted() ? (
                    // COMPLETED WORKOUT
                    <React.Fragment>
                      <Stack
                        direction="row"
                        sx={{ mt: 2, mb: 1, alignItems: "center" }}
                      >
                        <CheckCircleOutline sx={{ height: 35, width: 35 }} />
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          Finished your last set!
                        </Typography>
                      </Stack>

                      <Box
                        sx={{ display: "flex", flexDirection: "row", pt: 2 }}
                      >
                        <Box sx={{ flex: "1 1 auto" }} />
                        <Button onClick={handleReset}>Reset</Button>
                      </Box>
                      <CompletedSetTable values={values} />
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      {steps && (
                        // WEIGHT AND REPS
                        <Stack spacing={3} sx={{ py: 2 }}>
                          <Stack direction="row">
                            <TextField
                              id="weight"
                              name="weight"
                              label="Weight (lbs)"
                              type="number"
                              variant="outlined"
                              size="medium"
                              inputRef={inputRefWeight}
                              value={
                                values &&
                                values.sets &&
                                values.sets[activeStep] &&
                                values.sets[activeStep].weight != null
                                  ? values.sets[activeStep].weight
                                  : 0
                              }
                              onChange={(e) => handleChange(e, activeStep)}
                              autoFocus
                              error={errors?.weight ? true : false}
                              helperText={errors?.weight ? errors.weight : ``}
                              sx={{
                                maxWidth: 100,
                                "& input[type=number]::-webkit-inner-spin-button,& input[type=number]::-webkit-outer-spin-button ":
                                  {
                                    WebkitAppearance: "none",
                                    margin: 0,
                                  },
                              }}
                            />
                            <CustomComp.ContrastBtn
                              id="weight-decrement-btn"
                              onClick={() => {
                                handleDecrement("weight");
                              }}
                            >
                              <Remove />
                            </CustomComp.ContrastBtn>
                            <CustomComp.ContrastBtn
                              id="weight-increment-btn"
                              onClick={() => {
                                handleIncrement("weight");
                              }}
                            >
                              <Add />
                            </CustomComp.ContrastBtn>
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
                              inputRef={inputRefRep}
                              value={
                                values &&
                                values.sets &&
                                values.sets[activeStep] &&
                                values.sets[activeStep].reps != null
                                  ? values.sets[activeStep].reps
                                  : 0
                              }
                              onChange={(e) => handleChange(e, activeStep)}
                              error={errors.reps ? true : false}
                              helperText={errors.reps ? errors.reps : ``}
                            />

                            <CustomComp.ContrastBtn
                              id="reps-decrement-btn"
                              onClick={() => {
                                handleDecrement("reps");
                              }}
                            >
                              <Remove />
                            </CustomComp.ContrastBtn>
                            <CustomComp.ContrastBtn
                              id="reps-increment-btn"
                              onClick={() => {
                                handleIncrement("reps");
                              }}
                            >
                              <Add />
                            </CustomComp.ContrastBtn>
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
                        {activeStep !== steps.length &&
                          (completed[activeStep] ? (
                            <Typography
                              variant="body2"
                              sx={{
                                py: 2,
                                minHeight: 56,
                                display: "inline-block",
                              }}
                            >
                              Set {activeStep + 1} Completed! You can still edit
                              your weight and reps
                            </Typography>
                          ) : (
                            <Button
                              variant="contained"
                              onClick={handleComplete}
                              endIcon={
                                timerOn === true ? (
                                  <TimerOutlined />
                                ) : (
                                  <AddTask />
                                )
                              }
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
                              {completedSteps() === totalSteps() - 1 &&
                              timerOn === false
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
                </Box>
                {/* <CompletedSetTable values={values} /> */}
              </Stack>
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions
          sx={{
            p: 2,
            justifyContent: { xs: "center", sm: "end" },
            alignItems: "center",
          }}
        >
          <CustomComp.OutlinedHoverContrastBtn onClick={handleClose}>
            Cancel
          </CustomComp.OutlinedHoverContrastBtn>
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{ minWidth: 120 }}
          >
            Submit Workout
          </Button>
        </DialogActions>
      </Stack>
    </Dialog>
  );
}
