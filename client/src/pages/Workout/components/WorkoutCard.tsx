import React, { useState, useRef, useEffect } from "react";
import { useTheme, styled } from "@mui/material/styles";
import * as date from "../../../utils/date";
import { format, formatISO } from "date-fns";
import {
  // Grid,
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
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import LoadingButton from "@mui/lab/LoadingButton";
import { grey } from "@mui/material/colors";
// REDUX
import { selectAccount } from "../../../Redux/slices/accountSlice";
import * as ui from "../../../Redux/slices/uiSlice";
import { useSelector, useDispatch } from "react-redux";
import {
  RecentRound,
  WorkoutMethodType,
  RoundType,
  WorkoutType,
  removeWorkout,
  SetType,
  GoalType,
} from "../../../Redux/slices/workoutSlice";
// ICONS
import {
  AddCircle,
  MoreHoriz,
  Edit,
  Delete,
  TrackChanges,
  Circle,
} from "@mui/icons-material";
// COMPONENTS
import { DeleteWorkoutDialog } from "./Dialogs";
import CardDataTabs from "./CardDataTabs";

const CardMenuItemStyle = {
  textTransform: "none",
  p: 0,
  justifyContent: "start",
  backgroundColor: alpha("#fff", 0),
  ":hover": {
    backgroundColor: alpha("#fff", 0),
  },
  ".MuiButton-startIcon": {
    m: 0,
  },
};

interface Props {
  workout: WorkoutType;
}

export default function WorkoutCard({ workout }: Props) {
  const dispatch = useDispatch();
  const uiState = useSelector(ui.selectUi);
  const account = useSelector(selectAccount);
  const theme = useTheme();
  const [filterLastRound, setFilterLastRound] = useState<RecentRound | null>(
    null
  );

  useEffect(() => {}, [filterLastRound]);
  const [activeGoal, setActiveGoal] = useState<GoalType | null>(null);
  const [loading, setLoading] = useState(false);
  // Tab state and logic
  const [value, setTabValue] = React.useState<WorkoutMethodType>(
    workout.methodSelection[0] || ""
  );
  const [tabHasRecentRound, setTabHasRecentRound] = useState<boolean>(true);

  /**
   * Handles tab change and sets filter values to update the workout card data based on
   * tab's filter value
   */
  const handleChange = (
    event: React.SyntheticEvent | null = null,
    newValue: WorkoutMethodType
  ) => {
    if (event == null) {
      setTabValue(newValue);
      if (workout.lastRounds) {
        const tabInLastRound = workout.lastRounds.findIndex(
          (item: Partial<RoundType>) => item._id === newValue
        );
        if (workout.lastRounds && tabInLastRound >= 0) {
          const match = workout.lastRounds.find(
            (round: RecentRound) => round._id === value
          );
          setFilterLastRound(match || null);
          setTabHasRecentRound(true);
        } else {
          setTabHasRecentRound(false);
        }
      }
    } else {
      setTabValue(newValue);
      if (workout.lastRounds) {
        const tabInLastRound = workout.lastRounds.findIndex(
          (item: Partial<RoundType>) => item._id === newValue
        );
        if (workout.lastRounds && tabInLastRound >= 0) {
          const match = workout.lastRounds.find(
            (round: RecentRound) => round._id === value
          );
          setFilterLastRound(match || null);
          setTabHasRecentRound(true);
        } else {
          setTabHasRecentRound(false);
        }
      }
    }
  };

  useEffect(() => {
    if (workout.lastRounds) {
      const tabInLastRound = workout.lastRounds.findIndex(
        (item: Partial<RoundType>) => item._id === value
      );
      if (workout.lastRounds && tabInLastRound >= 0) {
        const match = workout.lastRounds.find(
          (round: RecentRound) => round._id === value
        );
        setFilterLastRound(match || null);
        setTabHasRecentRound(true);
      } else {
        setTabHasRecentRound(false);
      }
    }
  }, [value]);

  useEffect(() => {
    try {
      if (
        workout.lastRounds &&
        workout.lastRounds.length > 0 &&
        tabHasRecentRound &&
        uiState.activeWorkout != null &&
        uiState.activeTabMethodFilter != null &&
        workout.lastRounds.findIndex(
          (round: RecentRound) => round._id === uiState.activeTabMethodFilter
        ) >= 0
      ) {
        handleChange(null, uiState.activeTabMethodFilter);
      } else {
        handleChange(null, workout.methodSelection[0]);
      }
    } catch (err) {
      console.log(err);
    }
  }, [workout]);

  useEffect(() => {
    if (workout.goalId != null) {
      const activeGoalNew = workout.goalId.find(
        (goal: GoalType) => goal._id === value
      );
      if (activeGoalNew != null) {
        setActiveGoal(activeGoalNew);
      } else {
        setActiveGoal(null);
      }
    }
  }, [value, workout]);

  /**
   * Update tab filter value in Redux state
   */
  useEffect(() => {
    try {
      dispatch(ui.setActiveTabDataFilter(value));
    } catch (err) {
      console.log(err);
    }
  }, [value]);

  // Card Menu state and logic
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  const [openDialog, setDialogStatus] = useState<boolean>(false);
  const [dialogResponse, setDialogResponse] = useState<boolean>(false);

  /**
   * Delete Workout Dialog
   */
  const deleteWorkout = async () => {
    setLoading(true);
    setDialogStatus(true);
  };

  // WORKOUT CARD LIFE CYCLE
  // Initial render, load first method if no rounds
  useEffect(() => {
    if (
      workout &&
      workout.lastRounds &&
      workout.lastRounds.length === 0 &&
      filterLastRound !== null
    ) {
      setFilterLastRound({
        _id: workout.methodSelection[0],
        lastSets: 3,
        lastWeight: 100,
        lastReps: 8,
        successSetsReps: true,
      } as RecentRound);
    }
  }, []);

  // Initial render, load last rounds for a given method
  useEffect(() => {
    try {
      if (workout.lastRounds && workout.lastRounds.length > 0) {
        const match = workout.lastRounds.find(
          (round: RecentRound) => round._id === value
        );
        setFilterLastRound(match || null);
      }
    } catch (err) {
      console.log(err);
    }
  }, [workout]);

  /**
   * Open Add Round Modal and update Redux state to load default values for the form
   */
  const openAddRound = () => {
    dispatch(ui.setActiveWorkout(workout));
    dispatch(ui.setActiveTabMethodFilter(value));
    if (
      !workout.lastRounds ||
      workout.lastRounds.length === 0 ||
      !tabHasRecentRound
    ) {
      dispatch(
        ui.setNewRoundDefaultValues({
          accountId: account.accountData._id,
          workoutId: workout._id,
          method: value,
          date: new Date(),
          sets: createSetObj(3, 100, 8),
          successSetsReps: true,
        })
      );
      dispatch(ui.setNewRoundModalState());
      return;
    }
    if (filterLastRound !== null) {
      dispatch(
        ui.setNewRoundDefaultValues({
          accountId: account.accountData._id,
          workoutId: workout._id,
          method: filterLastRound._id,
          date: new Date(),
          successSetsReps: filterLastRound.successSetsReps,
          sets:
            filterLastRound != null &&
            filterLastRound.rounds != null &&
            filterLastRound.rounds[0] != null &&
            filterLastRound.rounds.length > 0
              ? resetSetsDate(filterLastRound.rounds[0].sets)
              : createSetObj(
                  filterLastRound.lastSets,
                  filterLastRound.lastWeight,
                  filterLastRound.lastReps
                ),
        })
      );
      dispatch(ui.setNewRoundModalState());
    }
  };

  const resetSetsDate = (sets: SetType[]) => {
    if (sets != null && Array.isArray(sets)) {
      let newSets = sets.map((set) => {
        return {
          ...set,
          datetime: formatISO(new Date(), {
            format: "extended",
          }),
        };
      });
      return newSets;
    }
    return sets;
  };

  const createSetObj = (
    setLength: number,
    weight: number,
    reps: number
  ): SetType[] => {
    var setsArray: SetType[] = [];
    for (let i = 0; i < setLength; i++) {
      let obj: SetType = {
        weight: weight,
        reps: reps,
        datetime: new Date(Date.now()),
      };
      setsArray.push(obj);
    }
    return setsArray;
  };

  return (
    <>
      {workout && workout.methodSelection.length > 0 && value.length > 0 && (
        <>
          <DeleteWorkoutDialog
            openDialog={openDialog}
            setDialogStatus={setDialogStatus}
            handleCloseMenu={handleCloseMenu}
            loading={loading}
            setLoading={setLoading}
            workout={workout}
          />
          <Stack
            sx={{
              flex: 1,
              m: 1,
              pt: { xs: 1, sm: 1, md: 1 },
              pb: { xs: 1, sm: 1, md: 1 },
              px: { xs: 1, sm: 2, md: 2.5, lg: 2.5 },
              borderRadius: 2,
              // width: { xs: 300, sm: 350, md: 400 },
              // minWidth: 300,
              maxWidth: 500,
              height: 260,
              minHeight: 260,
              maxHeight: 260,
              boxShadow: "rgb(0 0 0 / 8%) 1px 2px 3px 1px",
              border: `1px solid ${grey[300]}`,
              backgroundColor: "#fff",
            }}
          >
            <Stack>
              <Stack
                justifyContent={"space-between"}
                alignItems={"center"}
                direction="row"
                sx={{ mb: 1 }}
              >
                <Tooltip placement="top" title={workout.name}>
                  <Typography
                    variant="h5"
                    noWrap
                    sx={{
                      textOverflow: "ellipsis",
                      fontWeight: 700,
                    }}
                  >
                    {workout.name}
                  </Typography>
                </Tooltip>
                <Stack direction="row">
                  <IconButton
                    aria-controls={openMenu ? "basic-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={openMenu ? "true" : undefined}
                    onClick={handleClick}
                    size="medium"
                  >
                    <MoreHoriz />
                  </IconButton>
                  <Menu
                    elevation={3}
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={openMenu}
                    onClose={handleCloseMenu}
                    MenuListProps={{
                      "aria-labelledby": "basic-button",
                    }}
                    sx={{
                      justifyContent: "start",
                      alignItems: "start",
                      "& .MuiPaper-root": {
                        borderRadius: 2,
                        border: `1px solid ${grey[300]}`,
                        fontSize: 14,
                        minWidth: 125,
                      },
                      "& .MuiMenu-list": {},
                      "& .MuiMenuItem-root": {
                        p: 0.5,
                        px: 0.7,
                        mx: 1,
                        my: 0.2,
                        border: `1px solid ${alpha(grey[200], 0)}`,
                        borderRadius: 1,
                        "&:hover": {
                          border: `1px solid ${grey[200]}`,
                        },
                        "&:active": {
                          border: `1px solid ${grey[300]}`,
                        },
                        "& .MuiSvgIcon-root": {
                          fontSize: 16,
                          mr: 0.8,
                        },
                      },
                    }}
                  >
                    <MenuItem
                      onClick={() => {
                        handleCloseMenu();
                        dispatch(
                          ui.setUpdateWorkoutDefaultValues({
                            _id: workout._id,
                            name: workout.name,
                            muscleCategory: workout.muscleCategory,
                            muscleGroup: workout.muscleGroup,
                            methodSelection: workout.methodSelection,
                          })
                        );
                        dispatch(ui.setUpdateWorkoutModalState());
                      }}
                      autoFocus
                    >
                      <Button
                        startIcon={<Edit sx={{ m: 0 }} />}
                        variant="text"
                        disableRipple
                        sx={CardMenuItemStyle}
                      >
                        <Typography
                          variant="body2"
                          align="center"
                          sx={{
                            fontWeight: 700,
                            mt: 0.4,
                          }}
                        >
                          Edit
                        </Typography>
                      </Button>
                    </MenuItem>
                    <MenuItem
                      onClick={async () => {
                        await dispatch(ui.setActiveWorkout(workout));
                        await dispatch(ui.setActiveTabMethodFilter(value));
                        await dispatch(ui.setNewGoalModalState(null));
                        handleCloseMenu();
                      }}
                    >
                      <Button
                        startIcon={<TrackChanges sx={{ m: 0 }} />}
                        variant="text"
                        disableRipple
                        sx={CardMenuItemStyle}
                      >
                        <Typography
                          variant="body2"
                          align="center"
                          sx={{
                            fontWeight: 700,
                            mt: 0.4,
                          }}
                        >
                          New Goal
                        </Typography>
                      </Button>
                    </MenuItem>
                    <MenuItem>
                      <LoadingButton
                        onClick={deleteWorkout}
                        loading={loading}
                        loadingPosition="start"
                        startIcon={<Delete sx={{ m: 0 }} />}
                        variant="text"
                        disableRipple
                        disabled={loading ? true : false}
                        sx={{
                          textTransform: "none",
                          justifyContent: "start",
                          p: 0,
                          color: "#DA636B",
                          backgroundColor: alpha("#fff", 0),
                          ":hover": {
                            backgroundColor: alpha("#DA636B", 0),
                          },
                          ".MuiButton-startIcon": {
                            m: 0,
                          },
                          ".MuiLoadingButton-loadingIndicator": {
                            ml: -1,
                            height: 16,
                            width: 16,
                          },
                        }}
                      >
                        <Typography
                          variant="body2"
                          align="center"
                          sx={{
                            fontWeight: 700,
                            mt: 0.4,
                          }}
                        >
                          Delete
                        </Typography>
                      </LoadingButton>
                    </MenuItem>
                  </Menu>
                  <IconButton
                    size="medium"
                    color="secondary"
                    title="New Round"
                    onClick={openAddRound}
                  >
                    <AddCircle sx={{ height: 35, width: 35 }} />
                  </IconButton>
                </Stack>
              </Stack>
            </Stack>
            <Stack>
              <Tabs
                value={value}
                onChange={handleChange}
                variant="scrollable"
                scrollButtons
                allowScrollButtonsMobile
                aria-label="scrollable force tabs example"
                sx={{
                  maxWidth: 234,
                  height: 30,
                  mt: -2,
                  ml: -2,
                  p: 0,
                  ".MuiButtonBase-root": {
                    padding: 0,
                    borderRadius: 2,
                    height: 40,
                  },
                  ".MuiTabs-scrollButtons": {
                    height: 40,
                  },
                  ".MuiTabs-scroller": {
                    height: 35,
                  },
                  ".MuiTabs-indicator": {
                    opacity: 0,
                  },
                  ".MuiTabs-scrollButtons.Mui-disabled": {
                    opacity: 0.2,
                  },
                }}
              >
                {workout.methodSelection.map((method: string) => (
                  <Tab
                    value={method}
                    key={`${method}-tab`}
                    label={method}
                    sx={{
                      height: 30,

                      mt: -0.7,
                      ml: -1,
                      "&:hover": {
                        fontWeight: 700,
                        color: grey[700],
                        opacity: 1,
                        backgroundColor: alpha(grey[200], 0.3),
                      },
                      "&.Mui-selected": {
                        fontWeight: 700,
                      },
                    }}
                  />
                ))}
              </Tabs>
            </Stack>
            <Grid xs={12} sx={{ p: 0 }}>
              {!tabHasRecentRound && workout.roundId.length > 0 && (
                <Stack
                  spacing={1}
                  sx={{
                    pt: 1,
                    height: "100%",
                    justifyContent: "start",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="body2">
                    No rounds using {value}
                  </Typography>
                  <Button
                    onClick={openAddRound}
                    sx={{
                      width: 150,
                      borderRadius: 2,
                    }}
                    variant="outlined"
                  >
                    Add Round
                  </Button>
                </Stack>
              )}
              {workout.roundId.length === 0 && (
                <Stack
                  spacing={1}
                  sx={{
                    pt: 1,
                    height: "100%",
                    justifyContent: "start",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="body2">New Workout</Typography>
                  <Button
                    onClick={openAddRound}
                    sx={{
                      width: 150,
                      borderRadius: 2,
                    }}
                    variant="outlined"
                  >
                    Add Round
                  </Button>
                </Stack>
              )}
              {tabHasRecentRound && workout.roundId.length > 0 && (
                <CardDataTabs
                  workout={workout}
                  lastRound={filterLastRound}
                  tabHasRecentRound={tabHasRecentRound}
                  tabValue={value}
                  activeGoal={activeGoal}
                  setActiveGoal={setActiveGoal}
                />
              )}
            </Grid>
          </Stack>
        </>
      )}
    </>
  );
}
