import React, {
  useState,
  useEffect,
  useCallback,
  useContext,
  useMemo,
} from "react";
import UI from "../../components/UI";
import { styled, useTheme } from "@mui/material/styles";
import { getWorkoutPlanWeekApi, updateWorkoutPlanWeekApi } from "./planApi";
// COMPONENTS
import { filterData } from "../../utils/filterObject";
import FilterChips, { FilterState } from "../../components/Filter/FilterChips";
import WeekDayCard from "./components/WeekDayCard";
import AddWorkoutCards from "./components/AddWorkoutCards";
// MUI
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ButtonGroup from "@mui/material/ButtonGroup";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import CssBaseline from "@mui/material/CssBaseline";
import Accordion from "@mui/material/Accordion";
import { alpha } from "@mui/material";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Grid from "@mui/material/Grid";
// ICONS
import { Close, FilterList, ReadMore } from "@mui/icons-material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import { Expand, Add } from "@mui/icons-material";
import { grey } from "@mui/material/colors";
// import CalendarOutlineLight from "../../assets/images/icons/CalendarOutlineLight.svg";
import CalendarOutline from "@mui/icons-material/CalendarMonthOutlined";
// DRAG N DROP
import { useDrag, useDrop } from "react-dnd";
// ANIMATION
import { animated, useTransition } from "@react-spring/web";
// STATE MGMT
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import * as wk from "../../Redux/slices/workoutSlice";
import * as ui from "../../Redux/slices/uiSlice";

import PlanProvider, { PlanContext } from "./context/PlanContext";
import * as action from "./context/actions";

const drawerWidth = 450;
const drawerWidthxs = "100%";

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: drawerWidth,
  }),
}));

export const PlanContainer = () => {
  const dispatch = useDispatch();
  const [planState, dispatchCtx] = useContext(PlanContext);
  const workoutState = useSelector(wk.selectWorkout, shallowEqual);
  const theme = useTheme();

  const updateWorkoutPlan = async () => {
    try {
      const weekDay = new Map();
      Object.entries(workoutState.workoutPlanWeek).forEach((dayWorkouts) => {
        var idArray: string[] = [];
        dayWorkouts[1].forEach((w: any) => {
          if (w._id) idArray.push(w._id);
        });
        weekDay.set(dayWorkouts[0], idArray);
      });
      const res = await updateWorkoutPlanWeekApi(Object.fromEntries(weekDay));
      res.status !== 200 &&
        dispatch(
          ui.setSnackBar({
            message: "Could not update workout plan",
            severity: "error",
          })
        );

      dispatchCtx(action.setHydrate(false));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (planState.hydrate === true) {
      updateWorkoutPlan();
    }
  }, [planState.hydrate]);

  const [open, setOpen] = React.useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  const [filterOpen, setFilterOpen] = useState<boolean>(true);
  const toggleFilter = () => {
    setFilterOpen(!filterOpen);
  };

  const [filters, setFilterState] = useState<FilterState>({
    muscleCategory: [],
    muscleGroup: [],
    methodSelection: [],
  });

  const [filteredWorkouts, setFilteredWokrouts] = useState<
    wk.WorkoutType[] | null
  >(null);

  // const filteredWorkoutsMemo = useMemo<wk.WorkoutType[] | null>(() => {
  //   return filterData(workoutState.workouts, filters);
  // }, [filteredWorkouts]);

  useEffect(() => {
    setFilteredWokrouts(filterData(workoutState.workouts, filters));
  }, [workoutState.workouts, filters]);

  // useEffect(() => {
  //   setFilteredWokrouts(filterData(workoutState.workouts, filters));
  // }, [filters]);

  const filterOptions: any[] = [
    {
      muscleCategory: ["All", "Upper Body", "Lower Body", "Core"],
      filterByString: false,
      title: "Muscle Category:",
    },
    {
      muscleGroup: [
        "All",
        "Abs",
        "Back",
        "Back Arm",
        "Chest",
        "Front Arm",
        "Glutes",
        "Legs",
        "Shoulder",
      ],
      filterByString: false,
      title: "Muscle Group:",
    },
    {
      methodSelection: ["All", "Barbell", "Cable", "Dumbbell", "Machine"],
      filterByString: false,
      title: "Method:",
    },
  ];

  // const renderCard = useCallback(
  //   (day: any) => {
  //     return (
  //       <Grid
  //         key={`${day[0]}-day-card`}
  //         item
  //         xs={1}
  //         sm={2}
  //         sx={{
  //           minWidth: 300,
  //           maxWidth: 350,
  //         }}
  //       >
  //         <WeekDayCard day={day} />
  //       </Grid>
  //     );
  //   },
  //   [workoutState.workoutPlanWeek]
  // );

  useEffect(() => {
    (async () => {
      let res = await getWorkoutPlanWeekApi();
      if (res.status === 200) {
        dispatch(wk.setWorkoutPlanWeek(res.data.payload.workoutPlanWeek));
      }
    })();
  }, []);
  return (
    <>
      <header>
        <UI />
      </header>
      <main>
        {/* PLAN CONTAINER */}
        <Container
          maxWidth={"xl"}
          disableGutters={true}
          sx={{
            mt: 5,
            height: 800,
          }}
        >
          {/* MENU WRAPPER */}
          <Stack
            sx={{
              height: "100%",
              width: "100%",
            }}
          >
            <Stack
              sx={{
                position: "relative",
                width: "100%",
                height: "100%",
                bgcolor: "#fff",
                overflowX: "hidden",
                overflowY: "hidden",
              }}
            >
              <CssBaseline />
              <AppBar
                open={open}
                position={"relative"}
                sx={{
                  px: 2,
                  backgroundColor: grey[50],
                  boxShadow: "none",
                  borderBottom: "1px solid #E0E0E0",
                }}
              >
                <Toolbar
                  variant="dense"
                  sx={{
                    justifyContent: "space-between",
                    alignItems: "end",
                  }}
                >
                  <Stack
                    sx={{
                      pl: 1,
                      pr: 2,
                      py: 1,
                      mb: -0.1,
                      zIndex: 1,
                      borderTop: "1px solid #E0E0E0",
                      borderLeft: "1px solid #E0E0E0",
                      borderRight: "1px solid #E0E0E0",
                      borderRadius: "5px 5px 0px 0px",
                      backgroundColor: "#fff",
                      color: theme.palette.text.primary,
                    }}
                    direction="row"
                    justifyContent={"space-between"}
                    alignItems={"space-between"}
                  >
                    <CalendarOutline />
                    <Typography>
                      <b>Weekly</b>
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={2} sx={{ pb: 0.5 }}>
                    <IconButton
                      color="inherit"
                      aria-label="expand cards"
                      edge="end"
                      onClick={() =>
                        dispatchCtx(
                          action.setExpandCard(!planState.cardExpanded)
                        )
                      }
                      sx={{
                        color: theme.palette.text.primary,
                        borderRadius: 1,
                      }}
                    >
                      <Expand />
                    </IconButton>
                    {open === false && (
                      <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<Add />}
                        onClick={() => setOpen(true)}
                        sx={{ color: theme.palette.text.primary }}
                      >
                        Plan Workout
                      </Button>
                    )}
                  </Stack>
                </Toolbar>
              </AppBar>
              <Stack
                sx={{
                  flexGrow: 1,
                  height: "100%",
                  borderBottom: `2px solid ${grey[200]}`,
                  borderLeft: `2px solid ${grey[200]}`,
                  borderRight: `2px solid ${grey[200]}`,
                  borderRadius: 1,
                  minHeight: 900,
                  py: 3,
                  pl: { xs: 1, sm: 3 },
                  pb: 20,
                  maxWidth: "100%",
                  overflowX: "scroll",
                  mr: { xs: -drawerWidthxs, sm: `${-drawerWidth}px` },
                  transition: theme.transitions.create("margin", {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen,
                  }),
                  ...(open && {
                    transition: theme.transitions.create("margin", {
                      easing: theme.transitions.easing.easeOut,
                      duration: theme.transitions.duration.enteringScreen,
                    }),
                    mr: { xs: drawerWidthxs, sm: `${drawerWidth}px` },
                  }),
                }}
              >
                <Grid
                  container
                  spacing={1}
                  sx={{
                    overflowX: { xs: "scroll", sm: "hidden" },
                    width: "100%",
                    display: "flex",
                    flexWrap: { xs: "nowrap", sm: "wrap" },
                  }}
                >
                  {Object.entries(workoutState.workoutPlanWeek).map((day) => {
                    // return renderCard(day);
                    return (
                      <Grid
                        key={`${day[0]}-day-card`}
                        item
                        xs={1}
                        sm={2}
                        sx={{
                          minWidth: 300,
                          maxWidth: 350,
                        }}
                      >
                        <WeekDayCard day={day} />
                      </Grid>
                    );
                  })}
                </Grid>
              </Stack>
              <Drawer
                variant="persistent"
                anchor="right"
                open={open}
                sx={{
                  height: "100%",
                  width: { xs: drawerWidthxs, sm: drawerWidth },
                  flexShrink: 0,
                  borderRadius: "1rem",
                  backgroundColor: grey[300],
                  "& .MuiDrawer-paper": {
                    px: 0.5,
                    width: { xs: drawerWidthxs, sm: drawerWidth },
                    position: "absolute",
                    borderTop: `1px solid ${grey[100]}`,
                    borderRadius: ".5rem",
                    zIndex: 2,
                  },
                  "& .MuiDrawer-root": {
                    position: "absolute",
                    zIndex: 2,
                  },
                }}
              >
                <Stack
                  direction="row"
                  sx={{
                    height: 51,
                    backgroundColor: "#fff",
                    borderTop: `1px solid ${grey[300]}`,
                    borderBottom: `1px solid ${grey[300]}`,
                  }}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                >
                  <IconButton onClick={handleDrawerClose}>
                    <Close />
                  </IconButton>
                  <Typography>Workouts</Typography>
                  <IconButton onClick={toggleFilter}>
                    <FilterList />
                  </IconButton>
                </Stack>
                <Accordion
                  expanded={filterOpen}
                  onChange={toggleFilter}
                  sx={{ boxShadow: "none" }}
                >
                  <AccordionSummary
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    sx={{ display: "none" }}
                  />
                  <AccordionDetails>
                    <FilterChips
                      filters={filters}
                      setFilterState={setFilterState}
                      filterOptions={filterOptions}
                    />
                  </AccordionDetails>
                  <Divider />
                </Accordion>
                <Stack
                  sx={{
                    minHeight: 200,
                    overflowY: "hidden",
                    overflowX: "hidden",
                  }}
                >
                  <AddWorkoutCards filteredWorkouts={filteredWorkouts} />
                </Stack>
              </Drawer>
            </Stack>
          </Stack>
        </Container>
      </main>
    </>
  );
};

export default function Plan() {
  return (
    <PlanProvider>
      <PlanContainer />
    </PlanProvider>
  );
}
