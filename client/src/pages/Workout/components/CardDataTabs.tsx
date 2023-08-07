import React, { useState, useRef, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import * as date from "../../../utils/date";
import {
  Box,
  Stack,
  Button,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  alpha,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { grey } from "@mui/material/colors";
// REDUX
import { useSelector, useDispatch } from "react-redux";
import * as ui from "../../../Redux/slices/uiSlice";
import {
  WorkoutType,
  RoundType,
  RecentRound,
  WorkoutMethodType,
  GoalType,
} from "../../../Redux/slices/workoutSlice";
// COMPONENTS
import ProgressChart from "./ProgressChart";
import GoalCard from "../components/NewGoalModal/GoalCard";
// ICONS
import { AddCircle } from "@mui/icons-material";
import TargetGoalIcon from "../../../assets/images/icons/TargetGoal.svg";

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

interface Props {
  workout: WorkoutType;
  lastRound: Partial<RecentRound> | null;
  tabHasRecentRound: boolean;
  tabValue: WorkoutMethodType;
  activeGoal: GoalType | null;
  setActiveGoal: React.Dispatch<React.SetStateAction<GoalType | null>>;
}

export default function CardDataTabs({
  workout,
  lastRound,
  tabHasRecentRound,
  tabValue,
  activeGoal,
  setActiveGoal,
}: Props) {
  const dispatch = useDispatch();
  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);
  const maxSteps = tabs.length;
  const uiState = useSelector(ui.selectUi);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStepChange = (step: number) => {
    setActiveStep(step);
  };

  // useEffect(() => {
  //     console.log(activeGoal);
  // }, [tabValue]);

  return (
    <Grid
      container
      spacing={2}
      sx={{
        p: 0,
        borderLeft: `1px solid ${theme.palette.border.main}`,
        borderRadius: "15px 15px 0px 10px",
      }}
    >
      <Grid
        xs={6}
        sx={{
          p: 0,
          pr: 1,
          // px: 1,
          py: 0,
        }}
      >
        <Stack
          sx={{
            flexDirection: "row",
            alignItems: "baseline",
            gap: { xs: 0.7 },
            borderBottom: `1px solid ${theme.palette.border.main}`,
            borderRadius: "15px 15px 0 0",
            backgroundColor: theme.palette.surface.light,
            px: 1,
            py: 0.5,
          }}
        >
          <Typography
            variant={"body2"}
            noWrap
            sx={{
              fontFamily: "Titillium Web",
              fontWeight: "bold",
              fontSize: "1rem",
            }}
          >
            Last:
          </Typography>
          <Typography
            variant={"body1"}
            noWrap
            sx={{
              fontFamily: "Titillium Web",
            }}
          >
            {date.dateDiff(lastRound?.mostRecent, new Date().toString()) || ""}
          </Typography>
        </Stack>
        <List dense={true} disablePadding>
          <ListItem disablePadding>
            <ListItemText
              sx={{
                display: "flex",
                flex: 1,
                justifyContent: "end",
              }}
            >
              <Typography
                variant={"body1"}
                sx={{
                  fontFamily: "Titillium Web",
                }}
              >
                Weight:
              </Typography>
            </ListItemText>
            <ListItemText
              sx={{
                display: "flex",
                flex: 1,
                justifyContent: "center",
              }}
            >
              <Stack
                direction={"row"}
                spacing={0.5}
                sx={{
                  justifyContent: "baseline",
                  alignItems: "baseline",
                }}
              >
                <Typography
                  variant={"h6"}
                  sx={{
                    fontFamily: "Titillium Web",
                    fontWeight: "bold",
                  }}
                >
                  {lastRound?.lastWeight}
                </Typography>
                <Typography
                  variant={"body2"}
                  sx={{
                    fontFamily: "Titillium Web",
                  }}
                >
                  (lbs)
                </Typography>
              </Stack>
            </ListItemText>
          </ListItem>
          <Divider />
          <ListItem
            disablePadding
            sx={{
              px: 1,
              gap: 1,
            }}
          >
            <ListItemText
              sx={{
                display: "flex",
                flex: 1,
                justifyContent: "end",
              }}
            >
              <Typography
                variant={"body1"}
                sx={{
                  fontFamily: "Titillium Web",
                }}
              >
                Sets:
              </Typography>
            </ListItemText>
            <ListItemText
              sx={{
                display: "flex",
                flex: 1,
                justifyContent: "center",
              }}
            >
              <Typography
                variant={"subtitle1"}
                sx={{
                  fontFamily: "Titillium Web",
                  fontWeight: "bold",
                }}
              >
                {lastRound?.lastSets}
              </Typography>
            </ListItemText>
          </ListItem>
          <Divider />
          <ListItem
            disablePadding
            sx={{
              px: 1,
              gap: 1,
            }}
          >
            <ListItemText
              sx={{
                // px: 1,
                display: "flex",
                flex: 1,
                justifyContent: "end",
              }}
            >
              <Typography
                variant={"body1"}
                sx={{
                  fontFamily: "Titillium Web",
                }}
              >
                Reps:
              </Typography>
            </ListItemText>
            <ListItemText
              sx={{
                display: "flex",
                flex: 1,
                justifyContent: "center",
              }}
            >
              <Typography
                variant={"subtitle1"}
                sx={{
                  fontFamily: "Titillium Web",
                  fontWeight: "bold",
                }}
              >
                {lastRound?.lastReps}
              </Typography>
            </ListItemText>
          </ListItem>
        </List>
      </Grid>
      <Grid
        xs={6}
        sx={{
          p: 0,
          px: 0,
          py: 0,
        }}
      >
        <Stack
          direction={"row"}
          spacing={0.5}
          alignItems={"center"}
          sx={{
            justifyContent: "start",
            borderBottom: `1px solid ${theme.palette.border.main}`,
            borderRadius: "0 15px 0 0",
            px: 1,
            py: 0.5,
          }}
        >
          <Box
            component="img"
            src={TargetGoalIcon}
            alt="Goal Icon"
            sx={{ height: 20, width: 20 }}
          />
          <Typography
            variant={"body2"}
            sx={{
              fontFamily: "Titillium Web",
              fontWeight: "bold",
              fontSize: "1rem",
            }}
          >
            Goal
          </Typography>
        </Stack>
        <Stack direction={"row"} spacing={2}>
          {activeGoal !== null ? (
            <>
              <List
                dense={true}
                disablePadding
                sx={{
                  flex: 1,
                  color: alpha(theme.palette.text.secondary, 0.6),
                }}
              >
                <ListItem
                  disablePadding
                  sx={{
                    px: 1,
                    gap: 1,
                  }}
                >
                  <ListItemText
                    sx={{
                      display: "flex",
                      flex: 1,
                      justifyContent: "end",
                    }}
                  >
                    <Typography
                      variant={"h6"}
                      sx={{
                        fontFamily: "Titillium Web",
                        fontWeight: "bold",
                      }}
                    >
                      {activeGoal?.targetWeight}
                    </Typography>
                  </ListItemText>
                </ListItem>
                <Divider />
                <ListItem
                  disablePadding
                  sx={{
                    px: 1,
                    gap: 1,
                  }}
                >
                  <ListItemText
                    sx={{
                      display: "flex",
                      flex: 1,
                      justifyContent: "end",
                    }}
                  >
                    <Typography
                      variant={"subtitle1"}
                      sx={{
                        fontFamily: "Titillium Web",
                        fontWeight: "bold",
                      }}
                    >
                      {activeGoal?.targetSets}
                    </Typography>
                  </ListItemText>
                </ListItem>
                <Divider />
                <ListItem
                  disablePadding
                  sx={{
                    px: 1,
                    gap: 1,
                  }}
                >
                  <ListItemText
                    sx={{
                      display: "flex",
                      flex: 1,
                      justifyContent: "end",
                    }}
                  >
                    <Typography
                      variant={"subtitle1"}
                      sx={{
                        fontFamily: "Titillium Web",
                        fontWeight: "bold",
                      }}
                    >
                      {activeGoal?.targetReps}
                    </Typography>
                  </ListItemText>
                </ListItem>
              </List>
              <Stack
                spacing={0.5}
                justifyContent={"center"}
                alignItems={"center"}
                sx={{ flex: 1 }}
              >
                <ProgressChart
                  workout={workout}
                  lastRound={lastRound}
                  tabValue={tabValue}
                  activeGoal={activeGoal}
                  setActiveGoal={setActiveGoal}
                />
                <Typography
                  variant={"body2"}
                  sx={{
                    fontFamily: "Titillium Web",
                    color: "text.secondary",
                  }}
                >
                  Rounds
                </Typography>
              </Stack>
            </>
          ) : (
            <Stack
              sx={{
                flex: 1,
                p: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Button
                size={"small"}
                onClick={() => {
                  dispatch(ui.setActiveWorkout(workout));
                  dispatch(ui.setActiveTabMethodFilter(tabValue));
                  dispatch(ui.setNewGoalModalState(null));
                }}
                sx={{
                  width: "50%",
                  border: `1px solid ${grey[200]}`,
                }}
              >
                Start goal
              </Button>
            </Stack>
          )}
        </Stack>
      </Grid>
    </Grid>
  );
}
