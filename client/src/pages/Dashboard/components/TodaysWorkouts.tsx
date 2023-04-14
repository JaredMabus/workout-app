import React from "react";
import {
  Box,
  Paper,
  Container,
  Stack,
  Button,
  IconButton,
  Typography,
  Step,
  Stepper,
  StepButton,
  MobileStepper,
  alpha,
  StepLabel,
  Link as MuiLink,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import { Link } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import {
  Add,
  CalendarMonth,
  ArrowCircleRight,
  ArrowCircleLeft,
} from "@mui/icons-material";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import { getDay, format, isToday } from "date-fns";
// REDUX
import { useSelector, useDispatch } from "react-redux";
import * as acc from "../../../Redux/slices/accountSlice";
import * as ui from "../../../Redux/slices/uiSlice";
import * as wk from "../../../Redux/slices/workoutSlice";
// COMPONENTS
import WorkoutCard from "../../Workout/components/WorkoutCard";
import StepLineChart from "./StepLineCart";
import { chartData } from "../mockData";
import RoundTable from "../../Workout/components/RoundTable";
import { GridColDef, GridValueGetterParams } from "@mui/x-data-grid";

export interface StepObj {
  [k: number]: { id?: string; status: boolean };
}

export default function TodaysWorkout() {
  const dispatch = useDispatch();
  const wkState = useSelector(wk.selectWorkout);
  const uiState = useSelector(ui.selectUi);
  const theme = useTheme();
  const [todayIndex, setTodayIndex] = React.useState(
    getDay(new Date()) as keyof wk.WorkoutPlanWeek
  );
  const [steps, setSteps] = React.useState<wk.WorkoutType[]>([]);
  const [initialLoad, setInitialLoad] = React.useState<boolean>(true);
  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState<StepObj>({});

  const getTodaysWorkout = () => {
    try {
      var todayWorkoutsIdArray = wkState.workoutPlanWeek[todayIndex].map(
        (item: Partial<wk.RoundType>) => item._id
      );
      if (todayWorkoutsIdArray != null && todayWorkoutsIdArray.length > 0) {
        // For each id, find workout._id in Redux State
        var todaysWorkoutFinal = todayWorkoutsIdArray.map((workoutId) => {
          var indexOfWorkout: number = wkState.workouts.findIndex(
            (workout: wk.WorkoutType) => workout._id === workoutId
          );
          if (indexOfWorkout >= 0) {
            return wkState.workouts[indexOfWorkout];
          }
        });
        if (todaysWorkoutFinal[0] != null) {
          setSteps(todaysWorkoutFinal as wk.WorkoutType[]);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

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
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? // It's the last step, but not all steps have been completed,
          // find the first step that has been completed
          steps.findIndex((step, i) => !(i in completed))
        : activeStep + 1;
    setActiveStep(newActiveStep);
  };

  const setLastComplete = () => {
    let lastCompletedStep = steps.findIndex(
      (step: any, i: number) => !(i in completed)
    );
    if (lastCompletedStep < 0 || lastCompletedStep > steps.length) {
      setActiveStep(0);
      return;
    }
    setActiveStep(lastCompletedStep);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStep = (step: number) => () => {
    setActiveStep(step);
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
  };

  const handleComplete = (stepIndex: number, completedWorkout: any) => {
    if (stepIndex != null && steps[stepIndex]) {
      setCompleted((prevCompleted) => ({
        ...prevCompleted,
        [stepIndex]: { id: completedWorkout._id, status: true },
      }));
      // handleNext();
    }
  };

  /** If a round is submitted prior to component's initial render, auto complete each of those workouts */
  const setCompletedWorkout = (): void => {
    try {
      Object.entries(steps).forEach((todaysWorkout) => {
        var [stepIndex, workoutObj] = todaysWorkout;

        wkState.todayCompletedWorkouts?.findIndex((completedWorkout) => {
          if (
            completedWorkout.workoutId != null &&
            typeof completedWorkout.workoutId != "string" &&
            completedWorkout.workoutId._id != null &&
            completedWorkout.workoutId._id === workoutObj?._id
          ) {
            handleComplete(parseInt(stepIndex), completedWorkout);
            return true;
          } else {
            return false;
          }
        });
      });
    } catch (err) {
      console.log(err);
    }
  };

  /** Test the redux state object, workout.todayCompletedWorkouts, if the loaded workouts
   * belong to the current day. If true, do nothing, else dispatch null value to redux
   */
  const isTodaysWorkouts = (): void => {
    try {
      if (wkState.todayCompletedWorkouts != null) {
        let correctDaysWorkouts = Object.values(
          wkState.todayCompletedWorkouts
        ).some((workout) => {
          if (workout.date != null) {
            return isToday(new Date(workout?.date));
          }
          return true;
        });
        !correctDaysWorkouts && dispatch(wk.setTodayCompletedWorkouts(null));
      }
    } catch (err) {
      console.log(err);
    }
  };

  const columns: GridColDef[] = [
    {
      field: "date",
      headerName: "Date",
      width: 130,
      type: "date",
      valueGetter: (params: GridValueGetterParams) => new Date(params.row.date),
    },
    {
      field: "workoutId.name",
      headerName: "Workout",
      width: 130,
      valueGetter: (params: GridValueGetterParams) =>
        `${params.row.workoutId.name}`,
    },
    {
      field: "weight",
      headerName: "Weight (max)",
      width: 130,
      type: "number",
      valueGetter: (params: GridValueGetterParams) =>
        `${params.row.sets[0].weight}`,
    },
    {
      field: "reps",
      headerName: "Reps",
      width: 130,
      type: "number",
      valueGetter: (params: GridValueGetterParams) =>
        `${params.row.sets[0].reps}`,
    },
    {
      field: "sets",
      headerName: "Sets",
      width: 130,
      type: "number",
      valueGetter: (params: GridValueGetterParams) =>
        `${params.row.sets.length}`,
    },
  ];

  // Component Life Cycle
  React.useLayoutEffect(() => {
    try {
      getTodaysWorkout();
      // setInitalLoad(false);
      isTodaysWorkouts();
    } catch (err) {
      console.log(err);
    }
  }, [wkState.workouts, wkState.workoutPlanWeek, todayIndex]);

  React.useEffect(() => {
    try {
      if (initialLoad === false) {
        getTodaysWorkout();
      }
    } catch (err) {
      console.log(err);
    }
  }, [wkState.workouts, wkState.workoutPlanWeek]);

  React.useEffect(() => {
    try {
      if (initialLoad === false) {
        setLastComplete();
      }
    } catch (err) {
      console.log(err);
    }
  }, [completed]);

  React.useEffect(() => {
    try {
      if (initialLoad === true) {
        setCompletedWorkout();
        setInitialLoad(false);
      }
    } catch (err) {
      console.log(err);
    }
  }, [steps]);

  React.useEffect(() => {
    try {
      if (
        wkState.todayCompletedWorkouts != null &&
        wkState.todayCompletedWorkouts.length > 0
      ) {
        setCompletedWorkout();
      }
    } catch (err) {
      console.log(err);
    }
  }, [wkState.todayCompletedWorkouts]);

  return (
    <>
      <Stack
        spacing={4}
        sx={{
          px: { xs: 2, sm: 3 },
          pt: 3,
          pb: 10,
          borderRadius: 0,
          border: `1px solid ${alpha(grey[300], 0.7)}`,
          boxShadow: `rgb(150 150 159 / 10%) 0px 1px 8px 2px`,
          minHeight: "100vh",
          backgroundColor: theme.palette.background.default,
        }}
      >
        <Stack
          spacing={1}
          direction="row"
          justifyContent={"start"}
          alignItems={"baseline"}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: { xs: 600, sm: 600 },
              // fontSize: { xs: "1.7rem", sm: "2.5rem" },
            }}
          >
            {format(new Date(), "EEEE")}'s Workouts
          </Typography>
          <Typography variant="h6">
            {steps.length > 0
              ? Object.values(completed).filter((item) => item.status === true)
                  .length
              : 0}
            /{steps.length}
          </Typography>
          {/* <Box
            sx={{
              flex: 1,
              alignSelf: "baseline",
              borderBottom: `1px solid ${grey[300]}`,
            }}
          /> */}
        </Stack>
        {steps.length <= 0 && (
          <Stack
            spacing={1}
            sx={{
              my: 3,
              pl: 1,
            }}
          >
            <Typography variant="h5">No workouts planned for today.</Typography>
            <Button
              component={Link}
              to="/plan"
              variant="contained"
              endIcon={<CalendarMonth sx={{ height: 24, width: 24 }} />}
              size="large"
              sx={{
                width: 200,
                borderRadius: 5,
              }}
            >
              <Typography sx={{ fontWeight: 700 }}>Plan Workouts</Typography>
            </Button>
          </Stack>
        )}
        {steps.length > 0 && (
          <Stack sx={{ width: "100%" }}>
            <Stack spacing={1} sx={{}}>
              <Stepper
                nonLinear
                activeStep={activeStep}
                alternativeLabel
                sx={{
                  overflowX: "scroll",
                  overflowY: "hidden",
                  px: 2,
                  pb: 2,
                  pt: 1,
                  gap: 3,
                  "&::-webkit-scrollbar": {
                    height: "9px",
                    backgroundColor: grey[50],
                  },
                  "&::-webkit-scrollbar-thumb": {
                    border: `2px solid ${grey[50]}`,
                    backgroundColor: grey[200],
                    borderRadius: 1,
                    height: "3px",
                  },
                  "&::-webkit-scrollbar-thumb:hover": {
                    backgroundColor: grey[300],
                  },
                }}
              >
                {steps.map((workout, index) => (
                  <Step
                    key={index}
                    // @ts-ignore
                    completed={
                      completed[index]
                        ? completed[index].status
                        : completed[index]
                    }
                    sx={{
                      "& .MuiStepLabel-root .Mui-active": {
                        svg: {
                          color: alpha(theme.palette.secondary.main, 1),
                        },
                        text: {
                          color: alpha(theme.palette.primary.main, 1),
                        },
                      },
                      "& .MuiTypography-root": {
                        color: theme.palette.primary.main, // circle color (ACTIVE)
                      },
                      // "&.MuiStepButton-active": {
                      //   selected: {
                      //     color: theme.palette.secondary.main,
                      //     backgroundColor: theme.palette.secondary.main,
                      //   },
                      // },
                      // "&.MuiStepButton-root": {
                      //   color: theme.palette.secondary.main,
                      //   backgroundColor: theme.palette.secondary.main,
                      // },
                    }}
                  >
                    <StepButton
                      // color="inherit"
                      onClick={handleStep(index)}
                      sx={{
                        maxHeight: 88,
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ textOverflow: "ellipsis", maxHeight: 40 }}
                      >
                        {workout && workout.name
                          ? workout.name
                          : `Workout ${index}`}
                      </Typography>
                    </StepButton>
                  </Step>
                ))}
              </Stepper>
            </Stack>
            <div>
              {allStepsCompleted() ? (
                <React.Fragment>
                  <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                    You finished all of today's workouts!
                  </Typography>
                  <Stack direction="column" sx={{ pt: 2 }}>
                    {wkState.todayCompletedWorkouts != null && (
                      <RoundTable
                        data={Object.values(wkState.todayCompletedWorkouts)}
                        columns={columns}
                        completed={completed}
                        setCompleted={setCompleted}
                      />
                    )}
                  </Stack>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <Stack spacing={2}>
                    <Stack
                      sx={{
                        width: "100%",
                        pt: 3,
                        alignItems: "center",
                      }}
                    >
                      {steps[activeStep] != null &&
                        typeof steps[activeStep] === "object" && (
                          <WorkoutCard workout={steps[activeStep]} />
                        )}
                    </Stack>
                    <Stack
                      spacing={1}
                      direction="row"
                      sx={{
                        justifyContent: "center",
                        alignItems: "center",
                        p: 1,
                      }}
                    >
                      <IconButton
                        color="inherit"
                        disabled={activeStep === 0}
                        onClick={handleBack}
                        sx={{ borderRadius: 2 }}
                      >
                        <KeyboardArrowLeft sx={{ height: 35, width: 35 }} />
                      </IconButton>
                      <IconButton
                        color="inherit"
                        onClick={handleNext}
                        sx={{ borderRadius: 2 }}
                      >
                        <KeyboardArrowRight sx={{ height: 35, width: 35 }} />
                      </IconButton>
                      {/* {activeStep !== steps.length &&
                        completed[activeStep] &&
                        completed[activeStep].status && (
                          <Typography
                            variant="caption"
                            sx={{ display: "inline-block" }}
                          >
                            Workout {steps.length >= 0 ? activeStep + 1 : 0}{" "}
                            already completed
                          </Typography>
                        )} */}
                    </Stack>
                    {steps.length > 0 && (
                      <StepLineChart
                        data={steps[activeStep] as wk.WorkoutType | []}
                      />
                    )}
                  </Stack>
                </React.Fragment>
              )}
            </div>
          </Stack>
        )}
      </Stack>
    </>
  );
}
