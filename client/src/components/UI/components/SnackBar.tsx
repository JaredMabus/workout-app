import * as React from "react";
import { Snackbar, Typography } from "@mui/material";
import MuiAlert, { AlertProps } from "@mui/material/Alert";

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
  return <MuiAlert elevation={6} ref={ref} variant="outlined" {...props} />;
});

export default function CustomizedSnackbars() {
  const account = useSelector(selectAccount);
  const ui = useSelector(selectUi);
  const dispatch = useDispatch();

  // const [open, setOpen] = React.useState(false);

  // const handleClick = () => {
  //   setOpen(true);
  // };

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
      sx={{ mb: "50px", indexZ: 1, backgroundColor: "white", borderRadius: 1 }}
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
        <Typography
          sx={{
            fontSize: "1em",
          }}
          variant="body1"
        >
          {ui.snackBarStatus.message}
        </Typography>
      </Alert>
    </Snackbar>
  );
}
