import { useState, useRef, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import * as api from "./workoutApi";
import {
  Grid,
  Stack,
  Button,
  IconButton,
  Typography,
  alpha,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import { animated, useTransition } from "@react-spring/web";
// ICONS
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
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
  const [filteredWorkouts, setFilteredWorkouts] = useState<WorkoutType[] | []>(
    workoutState.workouts
  );
  const [loading, setLoading] = useState<boolean>(false);

  // Filter workouts logic
  const [filters, setFilterState] = useState<FilterState>({
    muscleCategory: [],
    muscleGroup: [],
    methodSelection: [],
  });

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

  const filterWorkouts = () => {
    if (workoutState.workouts.length > 0) {
      setFilteredWorkouts(filterData(workoutState.workouts, filters));
    }
    return;
  };

  // Filter Container State
  const [flexFilter, setFlexFilter] = useState(0);
  const toggleFlexFilter = () => {
    if (flexFilter === 0) {
      setFlexFilter(0.4);
      return;
    }
    setFlexFilter(0);
  };

  // Animation for Cards
  const animateStyles = {
    from: { x: 0, y: 20, opacity: 0 },
    enter: { x: 0, y: 0, opacity: 1 },
  };

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
  }, [filters, workoutState.workouts]);

  return (
    <>
      <WorkoutModal />
      <UpdateWorkoutModal />
      <NewRoundModal />
      <NewGoalModal />
      {/* Workout menu */}
      <Stack
        sx={{
          mt: 10,
          mb: 2,
          border: `1px solid ${grey[200]}`,
          overflowX: "hidden",
        }}
        direction="row"
        justifyContent={"space-between"}
      >
        <Button
          onClick={() => dispatch(setNewWorkoutModalState())}
          variant="contained"
          color="secondary"
          sx={{ maxWidth: 250 }}
        >
          New Workout
        </Button>
        <Stack direction="row">
          <IconButton>
            <SearchIcon />
          </IconButton>
          <IconButton onClick={toggleFlexFilter}>
            <FilterListIcon />
          </IconButton>
        </Stack>
      </Stack>
      {/* Workout Filter and Grid  */}
      <Stack
        direction="row"
        sx={{
          border: `1px solid ${grey[200]}`,
          height: 650,
          maxHeight: 650,
          // backgroundColor: "#FAFAFA",
          backgroundColor: alpha(grey[50], 0.5),
        }}
      >
        <Stack
          sx={{
            flex: 1,
            overflowY: "scroll",
          }}
        >
          <Grid container spacing={3} sx={{ px: 3, py: 1 }}>
            {/* {loading && (
              <Grid item xs={12}>
                <LinearProgress />
              </Grid>
            )} */}
            {filteredWorkouts.length > 0 ? (
              transitions((style, workout: Partial<WorkoutType>) => (
                <Grid item key={workout._id} xs={12} sm={6} md={4}>
                  <animated.div style={style} className="item">
                    <WorkoutCard workout={workout} />
                  </animated.div>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Stack sx={{ justifyConent: "center", alignItems: "center" }}>
                  <Typography variant="h5">No data</Typography>
                </Stack>
              </Grid>
            )}
          </Grid>
        </Stack>
        <Stack
          sx={{
            flex: flexFilter,
            boxShadow: "rgb(0 0 0 / 3%) -4px 0px 1px 1px",
            position: {
              xs: flexFilter === 0 ? "fixed" : "absolute",
              sm: flexFilter === 0 ? "fixed" : "relative",
            },
            visibility: flexFilter === 0 ? "hidden" : "visible",
            width: {
              xs: flexFilter === 0 ? 0 : "99%",
            },
            right: {
              xs: flexFilter === 0 ? "" : 0,
            },
            height: {
              xs: flexFilter === 0 ? "" : "100%",
            },
            minHeight: "100%",
            backgroundColor: "#fff",
            transition: "flex 250ms ease-in-out",
          }}
        >
          <Stack
            sx={{
              p: 1,
              backgroundColor: "#fff",
            }}
          >
            <FilterChips
              filters={filters}
              setFilterState={setFilterState}
              filterOptions={filterOptions}
            />
          </Stack>
        </Stack>
      </Stack>
    </>
  );
}
