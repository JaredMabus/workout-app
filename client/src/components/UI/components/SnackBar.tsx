import * as React from "react";
import { Snackbar, Typography } from "@mui/material";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import { AlertTitle } from "@mui/material";

// REDUX
import { useSelector, useDispatch } from "react-redux";
import { selectAccount } from "../../../Redux/slices/accountSlice";
import {
  selectUi,
  setSnackBar,
  closeSnackBar,
} from "../../../Redux/slices/uiSlice";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={3} ref={ref} {...props} />;
});

export default function CustomizedSnackbars() {
  const ui = useSelector(selectUi);
  const dispatch = useDispatch();

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    dispatch(closeSnackBar(false));
  };

  return (
    <Snackbar
      data-testid="snackbar"
      sx={{ mb: "50px", indexZ: 1, borderRadius: 1 }}
      open={ui.snackBarStatus.open}
      autoHideDuration={ui.snackBarStatus.duration}
      onClose={handleClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
    >
      <Alert
        onClose={handleClose}
        severity={ui.snackBarStatus.severity}
        sx={{ width: "100%" }}
      >
        {ui.snackBarStatus.severity === "success" && (
          <AlertTitle>
            <Typography sx={{ fontWeight: "bold" }} variant="body2">
              Success
            </Typography>
          </AlertTitle>
        )}
        {ui.snackBarStatus.severity === "error" && (
          <AlertTitle>
            <Typography sx={{ fontWeight: "bold" }} variant="body2">
              Error
            </Typography>
          </AlertTitle>
        )}

        <Typography variant="body2">{ui.snackBarStatus.message}</Typography>
      </Alert>
    </Snackbar>
  );
}
