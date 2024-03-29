import React, { useState, useRef, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import {
  Stack,
  Button,
  IconButton,
  Typography,
  alpha,
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { grey } from "@mui/material/colors";
import { animated, useTransition } from "@react-spring/web";
import * as comp from "../../../styles/components";
// ICONS
import FilterListIcon from "@mui/icons-material/FilterList";
import FilterListOffIcon from "@mui/icons-material/FilterListOff";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
// REDUX
import { useSelector, useDispatch } from "react-redux";
import { selectAccount } from "../../../Redux/slices/accountSlice";
import {
  selectWorkout,
  setWorkouts,
  setApiStatus,
  WorkoutType,
} from "../../../Redux/slices/workoutSlice";
import {
  setSnackBar,
  setNewWorkoutModalState,
  setNewRoundModalState,
} from "../../../Redux/slices/uiSlice";
// COMPONENTS
import WorkoutModal from "./NewWorkoutModal";
import UpdateWorkoutModal from "./UpdateWorkoutForm";
import NewRoundModal from "./NewRoundModal";
import NewGoalModal from "./NewGoalModal";
import WorkoutCard from "./WorkoutCard";
import FilterChips, {
  FilterState,
  FilterOptions,
} from "../../../components/Filter/FilterChips";
// UTILS
import { filterData } from "../../../utils/filterObject";

export default function WorkoutContainer() {
  const dispatch = useDispatch();
  const account = useSelector(selectAccount);
  const workoutState = useSelector(selectWorkout);
  const [loading, setLoading] = useState<boolean>(false);
  const [expanded, setExpanded] = React.useState<boolean>(false);
  const theme = useTheme();
  // Filter workout logic
  const [filteredWorkouts, setFilteredWorkouts] = useState<WorkoutType[] | []>(
    workoutState.workouts
  );
  const defaultFilterState: FilterState = {
    muscleCategory: [],
    muscleGroup: [],
    methodSelection: [],
  };
  const [filters, setFilterState] = useState<FilterState>(defaultFilterState);
  const [isFiltering, setIfFiltering] = useState<boolean>(false);
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
        "Chest",
        "Front Arm",
        "Back Arm",
        "Shoulder",
        "Glutes",
        "Legs",
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

  const checkIfFiltering = () => {
    setIfFiltering(
      Object.values(filters).some((filter) => {
        return filter.length > 0;
      })
    );
  };

  const filterWorkouts = () => {
    if (workoutState.workouts.length > 0) {
      setFilteredWorkouts(filterData(workoutState.workouts, filters));
    }
    return;
  };

  // Animation for Cards
  const animateStyles = {
    from: { x: 0, y: 20, opacity: 0 },
    enter: { x: 0, y: 0, opacity: 1 },
  };

  // Render and apply animation to each WorkoutCard for filteredWorkouts array
  const transitions = useTransition(filteredWorkouts, {
    from: animateStyles.from,
    enter: () => async (next) => {
      await next(animateStyles.enter);
    },
    expires: 100,
    trail: 75,
  });

  useEffect(() => {
    filterWorkouts();
    checkIfFiltering();
  }, [filters, workoutState.workouts]);

  return (
    <>
      <WorkoutModal />
      <UpdateWorkoutModal />
      <NewRoundModal />
      <NewGoalModal />
      <Grid
        container
        sx={{
          p: 0,
          m: 0,
          backgroundColor: "transparent",
          // borderLeft: `1px solid ${theme.palette.border.main}`,
          // borderRight: `1px solid ${theme.palette.border.main}`,
          borderBottom: `1px solid ${theme.palette.border.main}`,
        }}
      >
        {/* WORKOUT MENU */}
        <Grid xs={12} sx={{ position: "relative", p: 0 }}>
          <Stack
            direction="row"
            justifyContent={"space-between"}
            sx={{
              border: `1px solid ${theme.palette.border.light}`,
              backgroundColor: theme.palette.background.paper,
            }}
          >
            <Stack
              direction="row"
              spacing={1}
              justifyContent={"center"}
              alignItems={"center"}
            >
              <Button
                onClick={() => dispatch(setNewWorkoutModalState())}
                variant="contained"
                color="secondary"
                sx={{ maxWidth: 250 }}
              >
                New Workout
              </Button>
            </Stack>
            <Stack
              direction="row"
              justifyContent={"center"}
              alignItems={"center"}
              spacing={1}
            >
              {isFiltering && (
                <comp.OutlinedHoverContrastBtn
                  startIcon={<FilterListOffIcon />}
                  onClick={() => {
                    setFilterState(defaultFilterState);
                  }}
                >
                  Clear
                </comp.OutlinedHoverContrastBtn>
              )}
              <Typography variant={"body2"}>
                {filteredWorkouts.length}/{workoutState.workouts.length}
              </Typography>
              <IconButton
                onClick={() => {
                  setExpanded(!expanded);
                }}
                sx={{
                  borderRadius: 0,
                  "& .MuiTouchRipple-root": {
                    borderRadius: "0%",
                  },
                }}
              >
                {expanded ? <KeyboardArrowUpIcon /> : <FilterListIcon />}
              </IconButton>
            </Stack>
          </Stack>
          <Accordion disableGutters expanded={expanded}>
            <AccordionSummary
              aria-controls="panel1bh-content"
              id="panel1bh-header"
              sx={{
                display: "none",
              }}
            />
            <AccordionDetails
              sx={{
                height: expanded ? "auto" : 0,
                transition: "height 300ms ease-in-out",
              }}
            >
              <Stack
                sx={{
                  p: 1,
                  backgroundColor: theme.palette.background.paper,
                  borderRadius: 2,
                }}
              >
                <FilterChips
                  filters={filters}
                  setFilterState={setFilterState}
                  filterOptions={filterOptions}
                />
              </Stack>
            </AccordionDetails>
          </Accordion>
        </Grid>
        <Grid
          xs={12}
          sx={{
            p: 1,
            minHeight: 750,
            maxHeight: 750,
            overflowY: "scroll",
            overflowX: "hidden",
            "&::-webkit-scrollbar": {
              width: 10,
            },
            "&::-webkit-scrollbar-track": {
              border: `1px solid ${theme.palette.border.light}`,
              backgroundColor: theme.palette.background.paper,
            },
            "&::-webkit-scrollbar-thumb": {
              border: `2px solid ${theme.palette.background.paper}`,
              backgroundColor: alpha(theme.palette.border.dark, 0.5),
              borderRadius: 4,
            },
            "&::-webkit-scrollbar-thumb:hover": {
              backgroundColor: alpha(theme.palette.border.light, 1),
            },
          }}
        >
          <Grid
            container
            spacing={3}
            wrap="wrap"
            sx={{
              px: { xs: 2, sm: 1 },
              py: { xs: 0, sm: 2 },
            }}
          >
            {filteredWorkouts.length > 0 ? (
              transitions((style, workout: WorkoutType) => (
                <Grid key={workout._id} xs={12} sm={6} md={6} lg={4}>
                  <animated.div style={style} className="item">
                    <WorkoutCard workout={workout} />
                  </animated.div>
                </Grid>
              ))
            ) : (
              <Grid xs={12}>
                <Stack
                  sx={{
                    justifyConent: "center",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="h5">No workouts</Typography>
                </Stack>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
