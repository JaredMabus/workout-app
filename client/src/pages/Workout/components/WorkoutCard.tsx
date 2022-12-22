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
import { AddCircle, MoreHoriz, Edit, Delete } from "@mui/icons-material";
// COMPONENTS
import { DeleteWorkoutDialog } from "./Dialogs";
export default function WorkoutCard({ workout }: any) {
  const dispatch = useDispatch();
  const ui = useSelector(selectUi);
  const theme = useTheme();
  const account = useSelector(selectAccount);
  const [filterLastRound, setFilterLastRound] = useState(
    workout.methodSelection[0]
  );
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
    if (workout.lastRounds && workout.lastRounds.length === 0) {
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

  const numberFormatSX = {
    fontFamily: "Saira Semi Condensed",
    // fontFamily: "Open Sans",
    // fontFamily: "Titillium Web",
    fontSize: "1.3rem",
    fontWeight: 500,
  };

  const metricTitlesSx = {
    // fontFamily: "Saira Semi Condensed",
    fontFamily: "Titillium Web",
    fontSize: ".9rem",
    fontWeight: 600,
    color: grey[600],
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
          maxHeight: 224,
          minHeight: 224,
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
                      sx={{
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
                      }}
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
                  onClick={() => {
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
                  }}
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
                    },
                    "&.Mui-selected": {
                      backgroundColor: alpha(grey[200], 0.3),
                    },
                  }}
                />
              ))}
            </Tabs>
          </Grid>
          <Grid item xs={8}>
            <Stack
              justifyContent={"center"}
              alignItems={"start"}
              // sx={{ border: "1px solid blue" }}
            >
              {workout.roundId.length > 0 &&
                tabHasRecentRound &&
                filterLastRound !== null &&
                filterLastRound !== undefined && (
                  <Stack
                    // alignItems={"center"}
                    spacing={1}
                    sx={{
                      // width: "100%",
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
                          filterLastRound?.mostRecent,
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
                            {filterLastRound.lastWeight}
                          </Typography>
                        </Stack>
                        <Stack sx={{ alignItems: "center" }}>
                          <Typography sx={metricTitlesSx}>Sets</Typography>{" "}
                          <Typography sx={numberFormatSX}>
                            {filterLastRound.lastSets}
                          </Typography>
                        </Stack>
                        <Stack sx={{ alignItems: "center" }}>
                          <Typography sx={metricTitlesSx}>Reps</Typography>
                          <Typography sx={numberFormatSX}>
                            {filterLastRound.lastReps}
                          </Typography>
                        </Stack>
                      </Stack>
                    </Stack>
                  </Stack>
                )}
              {!tabHasRecentRound && workout.roundId.length > 0 && (
                <Typography>No Rounds</Typography>
              )}
              {workout.roundId.length === 0 && (
                <Typography>New Workout</Typography>
              )}
            </Stack>
          </Grid>
          <Grid item xs={4}>
            {/* <Stack
              sx={{
                // width: "100%",
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
                    fontWeight: 600,
                    fontSize: ".9rem",
                  }}
                >
                  Progress:
                </Typography>
              </Stack>
              <Box>
                <RoundProgressChart />
              </Box>
            </Stack> */}
          </Grid>
        </Grid>
      </Paper>
    </>
  );
}
