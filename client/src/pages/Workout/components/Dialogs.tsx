import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import * as api from "./workoutApi";
import { useSelector, useDispatch } from "react-redux";
import { selectUi, setSnackBar } from "../../../Redux/slices/uiSlice";
import { WorkoutType, removeWorkout } from "../../../Redux/slices/workoutSlice";

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
        <DialogTitle id="alert-dialog-title">Delete Workout</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this workout? All the data will be
            permanently lost.
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
