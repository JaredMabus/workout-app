import React, { useState, useRef, useEffect } from "react";
import { useTheme, styled } from "@mui/material/styles";
import * as date from "../../../utils/date";
import { workoutGoalAchieved } from "../../../utils/math";
// import { toTitleCase } from "../../../utils/textFormat";
import {
  Grid,
  Stack,
  Paper,
  Button,
  IconButton,
  Typography,
  Tabs,
  Tab,
  Tooltip,
  Menu,
  MenuItem,
  alpha,
  Divider,
  MobileStepper,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import SwipeableViews from "react-swipeable-views";
// REDUX
// import { selectAccount } from "../../../Redux/slices/accountSlice";
// import { selectUi } from "../../../Redux/slices/uiSlice";
import { useSelector, useDispatch } from "react-redux";
import {
  WorkoutType,
  RoundType,
  RecentRound,
  WorkoutMethodType,
} from "../../../Redux/slices/workoutSlice";
// COMPONENTS
import ProgressChart from "./ProgressChart";
interface Props {
  workout: WorkoutType;
  lastRound: Partial<RecentRound> | null;
  tabHasRecentRound: boolean;
  tabValue: WorkoutMethodType;
}

const numberFormatSX = {
  fontFamily: "Saira Semi Condensed",
  fontSize: "1.3rem",
  fontWeight: 500,
};

const metricTitlesSx = {
  fontFamily: "Titillium Web",
  fontSize: ".9rem",
  fontWeight: 600,
  color: grey[600],
};

const tabs = [0, 1];

export default function CardDataTabs({
  workout,
  lastRound,
  tabHasRecentRound,
  tabValue,
}: Props) {
  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);
  const maxSteps = tabs.length;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStepChange = (step: number) => {
    setActiveStep(step);
  };

  useEffect(() => {
    // console.log(workout);
    // console.log(lastRound);
    // workoutGoalAchieved(workout);
  }, []);

  return (
    <div>
      <SwipeableViews
        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
        index={activeStep}
        onChangeIndex={handleStepChange}
        enableMouseEvents
      >
        {/* <div> */}
        <Stack
          justifyContent={"start"}
          alignItems={"center"}
          direction="row"
          sx={{
            // border: "1px solid red",
            width: "100%",
          }}
        >
          {workout.roundId.length > 0 &&
            tabHasRecentRound &&
            lastRound !== null &&
            lastRound !== undefined && (
              <Stack
                direction="row"
                spacing={1}
                justifyContent={"start"}
                alignItems={"center"}
                sx={{
                  position: "relative",
                  width: "100%",
                  // border: "1px solid green",
                }}
              >
                <Stack
                  spacing={1}
                  sx={{
                    flex: 1,
                    maxWidth: 175,
                    minWidth: 175,
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "8px",
                    border: `1px solid ${grey[200]}`,
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{
                      width: "100%",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: grey[200],
                      borderBottom: `1px solid ${grey[200]}`,
                      borderRadius: "8px 8px 0 0",
                      px: 2,
                      pt: 0.5,
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: "Titillium Web",
                        fontWeight: 500,
                        fontSize: ".9rem",
                      }}
                    >
                      Last Round:
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: "Titillium Web",
                        fontWeight: 700,
                        fontSize: ".9rem",
                        backgroundColor: grey[200],
                      }}
                    >
                      {date.dateDiff(
                        lastRound?.mostRecent,
                        new Date().toString()
                      ) || ""}
                    </Typography>
                  </Stack>
                  <Stack
                    direction="row"
                    spacing={0.5}
                    sx={{ alignItems: "center", pb: 0.5 }}
                  >
                    <Stack direction="row" spacing={1} divider={<Divider />}>
                      <Stack sx={{ alignItems: "center" }}>
                        <Typography sx={metricTitlesSx}>Weight</Typography>
                        <Typography sx={numberFormatSX}>
                          {lastRound.lastWeight}
                        </Typography>
                      </Stack>
                      <Stack sx={{ alignItems: "center" }}>
                        <Typography sx={metricTitlesSx}>Sets</Typography>{" "}
                        <Typography sx={numberFormatSX}>
                          {lastRound.lastSets}
                        </Typography>
                      </Stack>
                      <Stack sx={{ alignItems: "center" }}>
                        <Typography sx={metricTitlesSx}>Reps</Typography>
                        <Typography sx={numberFormatSX}>
                          {lastRound.lastReps}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Stack>
                </Stack>
                <Stack
                  sx={{
                    flex: 1,
                    height: 100,
                    width: "100%",
                    // border: "1px solid blue",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 400, fontFamily: "Titillium Web" }}
                  >
                    Progress
                  </Typography>
                  <ProgressChart
                    workout={workout}
                    lastRound={lastRound}
                    tabValue={tabValue}
                  />
                </Stack>
              </Stack>
            )}
        </Stack>
        {/* </div> */}
        {/* <div> */}
        <Stack>
          {/* <ProgressChart workout={workout} lastRound={lastRound} /> */}
        </Stack>
        {/* </div> */}
      </SwipeableViews>
      {lastRound && Object.keys(lastRound).length > 0 && tabHasRecentRound && (
        <MobileStepper
          steps={maxSteps}
          position="static"
          activeStep={activeStep}
          nextButton={
            <Button
              size="small"
              onClick={handleNext}
              disabled={activeStep === maxSteps - 1}
              sx={{ "&.Mui-disabled": { opacity: 0.5 } }}
            >
              {theme.direction === "rtl" ? (
                <KeyboardArrowLeft />
              ) : (
                <KeyboardArrowRight />
              )}
            </Button>
          }
          backButton={
            <Button
              size="small"
              onClick={handleBack}
              disabled={activeStep === 0}
              sx={{ "&.Mui-disabled": { opacity: 0.5 } }}
            >
              {theme.direction === "rtl" ? (
                <KeyboardArrowRight />
              ) : (
                <KeyboardArrowLeft />
              )}
            </Button>
          }
          sx={{
            justifyContent: "center",
            background: "none",
            py: 0,
            pt: 1,
            width: "100%",
          }}
        />
      )}
    </div>
  );
}
