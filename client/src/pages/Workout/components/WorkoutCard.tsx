import React, { useState, useRef, useEffect } from "react";
import { useTheme, styled } from "@mui/material/styles";
import * as date from "../../../utils/date";
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
  Chip,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { grey } from "@mui/material/colors";
// REDUX
import {
  selectAccount,
  setApiStatus,
  setAvatarUrl,
} from "../../../Redux/slices/accountSlice";
import {
  selectUi,
  setUpdateWorkoutDefaultValues,
  setUpdateWorkoutModalState,
  setNewRoundModalState,
  setNewRoundDefaultValues,
  setActiveWorkout,
  setSnackBar,
  setNewGoalModalState,
  setActiveTabMethodFilter,
} from "../../../Redux/slices/uiSlice";
import { useSelector, useDispatch } from "react-redux";
import {
  RecentRound,
  WorkoutMethodType,
  RoundType,
  WorkoutType,
  removeWorkout,
} from "../../../Redux/slices/workoutSlice";
// ICONS
import {
  AddCircle,
  MoreHoriz,
  Edit,
  Delete,
  TrackChanges,
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

export default function WorkoutCard({ workout }: any) {
  const dispatch = useDispatch();
  const ui = useSelector(selectUi);
  const theme = useTheme();
  const account = useSelector(selectAccount);
  const [filterLastRound, setFilterLastRound] =
    useState<Partial<RecentRound> | null>(null);
  const [loading, setLoading] = useState(false);

  // Tab state and logic
  const [value, setTabValue] = React.useState<WorkoutMethodType>(
    workout.methodSelection[0]
  );
  const [tabHasRecentRound, setTabHasRecentRound] = useState<boolean>(true);
  const handleChange = (
    event: React.SyntheticEvent,
    newValue: WorkoutMethodType
  ) => {
    setTabValue(newValue);
    if (workout.lastRounds) {
      const tabInLastRound = workout.lastRounds.findIndex(
        (item: Partial<RoundType>) => item._id === newValue
      );

      if (workout.lastRounds && tabInLastRound >= 0) {
        setFilterLastRound(
          workout.lastRounds.find((round: RecentRound) =>
            round._id === newValue ? round : null
          )
        );
        setTabHasRecentRound(true);
      } else {
        setTabHasRecentRound(false);
      }
    }
  };

  useEffect(() => {
    try {
      if (workout.lastRounds) {
        const tabInLastRound = workout.lastRounds.findIndex(
          (item: Partial<RoundType>) => item._id === workout.methodSelection[0]
        );

        if (workout.lastRounds && tabInLastRound >= 0) {
          setFilterLastRound(
            workout.lastRounds.find((round: RecentRound) =>
              round._id === workout.methodSelection[0] ? round : null
            )
          );
          setTabHasRecentRound(true);
        } else {
          setTabHasRecentRound(false);
        }
      }
    } catch (err) {
      throw err;
    }
  }, []);

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

  const deleteWorkout = async () => {
    setLoading(true);
    setDialogStatus(true);
  };

  useEffect(() => {
    if (
      workout.lastRounds &&
      workout.lastRounds.length === 0 &&
      filterLastRound !== null
    ) {
      setFilterLastRound({
        _id: workout.methodSelection[0],
        lastWeight: 0,
        lastSets: 0,
        lastReps: 0,
        successSetsReps: true,
      });
    }
  }, []);

  useEffect(() => {
    if (workout.lastRounds && workout.lastRounds.length > 0) {
      setFilterLastRound(
        workout.lastRounds.find((round: RecentRound) =>
          round._id === value ? round : null
        )
      );
    }
  }, []);

  const openAddRound = () => {
    dispatch(setActiveWorkout(workout));
    if (
      !workout.lastRounds ||
      workout.lastRounds.length === 0 ||
      !tabHasRecentRound
    ) {
      dispatch(
        setNewRoundDefaultValues({
          accountId: account.accountData._id,
          workoutId: workout._id,
          method: value,
          date: new Date(Date.now()),
          weight: 100,
          sets: 3,
          reps: 8,
          successSetsReps: true,
        })
      );
      dispatch(setNewRoundModalState());
      return;
    }
    if (filterLastRound !== null) {
      dispatch(
        setNewRoundDefaultValues({
          accountId: account.accountData._id,
          workoutId: workout._id,
          method: filterLastRound._id,
          date: new Date(Date.now()),
          weight: filterLastRound.lastWeight,
          sets: filterLastRound.lastSets,
          reps: filterLastRound.lastReps,
          successSetsReps: filterLastRound.successSetsReps,
        })
      );
      dispatch(setNewRoundModalState());
    }
  };

  return (
    <>
      <DeleteWorkoutDialog
        openDialog={openDialog}
        setDialogStatus={setDialogStatus}
        handleCloseMenu={handleCloseMenu}
        loading={loading}
        setLoading={setLoading}
        workout={workout}
      />
      <Paper
        elevation={1}
        sx={{
          p: 2,
          border: `1px solid ${grey[300]}`,
          boxShadow: "rgb(0 0 0 / 8%) 1px 2px 3px 1px",
          borderRadius: 2,
          minHeight: 250,
          maxHeight: 250,
        }}
      >
        <Grid container>
          <Grid item xs={12} sx={{ mb: 0.5 }}>
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
                    fontWeight: 600,
                    // fontSize: "1.4rem",
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
                        setUpdateWorkoutDefaultValues({
                          _id: workout._id,
                          name: workout.name,
                          muscleCategory: workout.muscleCategory,
                          muscleGroup: workout.muscleGroup,
                          methodSelection: workout.methodSelection,
                        })
                      );
                      dispatch(setUpdateWorkoutModalState());
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
                        sx={{ fontWeight: 700, mt: 0.4 }}
                      >
                        Edit
                      </Typography>
                    </Button>
                  </MenuItem>
                  <MenuItem
                    onClick={async () => {
                      await dispatch(setActiveWorkout(workout));
                      await dispatch(setActiveTabMethodFilter(value));
                      await dispatch(setNewGoalModalState());
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
                        sx={{ fontWeight: 700, mt: 0.4 }}
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
                        sx={{ fontWeight: 700, mt: 0.4 }}
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
                  <AddCircle sx={{ height: 30, width: 30 }} />
                </IconButton>
              </Stack>
            </Stack>
          </Grid>
          <Grid item xs={8}>
            <Tabs
              value={value}
              onChange={handleChange}
              variant="scrollable"
              scrollButtons
              allowScrollButtonsMobile
              aria-label="scrollable force tabs example"
              sx={{
                maxWidht: 234,
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
                      // backgroundColor: alpha(grey[200], 0.2),
                      fontWeight: 700,
                    },
                  }}
                />
              ))}
            </Tabs>
          </Grid>
          <Grid item xs={12}>
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
                <Typography variant="body2">No rounds using {value}</Typography>
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
              />
            )}
          </Grid>
        </Grid>
      </Paper>
    </>
  );
}