import * as React from "react";
import { useEffect, useRef } from "react";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { grey } from "@mui/material/colors";
import * as comp from "../../../styles/components";
import * as api from "./workoutApi";
import { useTheme, alpha } from "@mui/material/styles";
// REDUX
import { useSelector, useDispatch } from "react-redux";
import { selectUi, setSnackBar } from "../../../Redux/slices/uiSlice";
import * as ui from "../../../Redux/slices/uiSlice";
import {
  WorkoutType,
  removeWorkout,
  GoalType,
} from "../../../Redux/slices/workoutSlice";
import { WarningAmberOutlined, KeyboardArrowDown } from "@mui/icons-material";
// LOTTIE
import Lottie from "lottie-react";
import GoalComplete from "../../../assets/lottie/goal-complete.json";
// COMPONENTS
import GoalCard from "../components/NewGoalModal/GoalCard";
import { ProgressObjType } from "./ProgressChart";

export interface Props {
  openDialog: boolean;
  setDialogStatus: React.Dispatch<boolean>;
  handleCloseMenu: React.Dispatch<boolean>;
  loading: boolean;
  setLoading: React.Dispatch<boolean>;
  workout: WorkoutType;
}

export function DeleteWorkoutDialog({
  openDialog,
  setDialogStatus,
  handleCloseMenu,
  loading,
  setLoading,
  workout,
}: Props) {
  const uiState = useSelector(selectUi);
  const dispatch = useDispatch();
  const theme = useTheme();
  const handleClose = () => {
    setDialogStatus(false);
    setLoading(false);
  };

  const confirmDelete = async () => {
    try {
      const res = await api.deleteWorkoutApi(workout);
      if (res.status === 200) {
        setDialogStatus(false);
        dispatch(
          setSnackBar({
            open: true,
            severity: "success",
            duration: 5000,
            message: "Deleted Workout",
          })
        );
        dispatch(removeWorkout(res.data.payload));
      } else {
        dispatch(
          setSnackBar({
            open: true,
            severity: "error",
            duration: 5000,
            message: "Could not delete workout",
          })
        );
      }
    } catch (err) {
      dispatch(
        setSnackBar({
          open: true,
          severity: "error",
          duration: 5000,
          message: "Server Error",
        })
      );
    }
  };

  return (
    <div>
      <Dialog
        open={openDialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle
          id="alert-dialog-title"
          sx={{ borderBottom: `1px solid ${grey[200]}`, pb: 1, mb: 1 }}
        >
          <Stack direction="row" spacing={1} alignItems={"center"}>
            <WarningAmberOutlined sx={{ height: 25, width: 25 }} />
            <Typography variant="h6">Delete workout</Typography>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Stack spacing={1} sx={{ mt: 2 }}>
              <Typography variant="body2">
                Are you sure you want to delete this workout?
              </Typography>
              <Typography variant="body2">Round data will be lost.</Typography>
            </Stack>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <comp.OutlinedHoverContrastBtn onClick={handleClose}>
            Cancel
          </comp.OutlinedHoverContrastBtn>
          <Button
            color="error"
            autoFocus
            onClick={confirmDelete}
            sx={{
              border: `1px solid transparent`,
              "&:hover": {
                border: `1px solid ${alpha(theme.palette.error.main, 0.4)}`,
              },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

interface CompletedGoalDialogProps {
  workout: WorkoutType;
  activeGoal: GoalType | null;
  progressObj: ProgressObjType;
}

export function CompletedGoal({
  workout,
  activeGoal,
  progressObj,
}: CompletedGoalDialogProps) {
  const uiState = useSelector(ui.selectUi);
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(false);
  const [checkComplete, setCheckComplete] = React.useState<boolean>(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    dispatch(ui.setGoalDialogStatus(false));
  };
  const lottieRef = useRef(null);

  const style = {
    height: 350,
    maxWidth: "100%",
  };

  const stop = () => {
    if (lottieRef != null && lottieRef.current != null) {
      // @ts-ignore
      setCheckComplete(true);
      // lottieRef.current.goToAndStop(70, true);
    }
  };

  useEffect(() => {
    return () => setCheckComplete(false);
  }, []);

  useEffect(() => {
    if (uiState.dialog.goal.status === true) {
      setTimeout(() => {
        setOpen(true);
      }, 500);
    } else {
      setOpen(false);
    }
  }, [uiState.dialog.goal]);

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle align={"center"}>
          <Box>
            <Typography sx={{ fontWeight: 600 }} variant="h4">
              Completed Goal!
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ maxWidth: 350 }}>
          <Stack justifyContent={"center"} alignItems={"center"}>
            <Typography variant="h5">{workout.name}</Typography>
            <Typography variant="h6">
              {activeGoal ? activeGoal.method : "No method"}
            </Typography>
          </Stack>
          {!checkComplete && (
            <Lottie
              lottieRef={lottieRef}
              animationData={GoalComplete}
              style={style}
              // loop={false}
              initialSegment={[1, 70]}
              onLoopComplete={() => stop()}
            />
          )}
          {checkComplete && (
            <Stack
              justifyContent={"center"}
              alignItems={"center"}
              sx={{ height: 350 }}
              spacing={2}
            >
              <GoalCard
                workout={workout}
                activeGoal={activeGoal}
                progressObj={progressObj}
                type="previous"
              />
              <Stack justifyContent={"center"} alignItems={"center"}>
                <Typography variant="h5">Next Goal</Typography>
                <KeyboardArrowDown />
              </Stack>
              <GoalCard
                workout={workout}
                activeGoal={activeGoal}
                progressObj={progressObj}
                type="current"
              />
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
