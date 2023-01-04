import * as React from "react";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { grey } from "@mui/material/colors";
import * as api from "./workoutApi";
import { useSelector, useDispatch } from "react-redux";
import { selectUi, setSnackBar } from "../../../Redux/slices/uiSlice";
import { WorkoutType, removeWorkout } from "../../../Redux/slices/workoutSlice";
import { Warning } from "@mui/icons-material";
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
  const ui = useSelector(selectUi);
  const dispatch = useDispatch();

  //   const handleClickOpen = () => {
  //     setDialogStatus(true);
  //   };

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
            <Warning color="error" sx={{ height: 25, width: 25 }} />
            <Typography variant="h6">Delete Workout</Typography>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Stack spacing={2}>
              <Typography variant="body1">
                Are you sure you want to delete this workout?
              </Typography>
              <Typography variant="body1">
                All its rounds will be permanently lost.
              </Typography>
            </Stack>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button color="error" onClick={confirmDelete} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
