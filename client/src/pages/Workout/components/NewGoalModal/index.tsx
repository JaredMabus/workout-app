import React, { useEffect, useState } from "react";
import useForm from "./useForm";
import { useTheme } from "@mui/material/styles";
import {
  Button,
  Stack,
  Divider,
  TextField,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  Slider,
  FormGroup,
  FormControlLabel,
  Select,
  OutlinedInput,
  InputLabel,
  MenuItem,
  FormControl,
  Chip,
  Box,
  Checkbox,
  ListItemText,
  FormHelperText,
  IconButton,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import {
  TrackChanges,
  ExpandMore,
  EmojiEvents,
  EventRepeat,
  CheckBox,
  InfoOutlined,
} from "@mui/icons-material";
// REDUX
import { useDispatch, useSelector } from "react-redux";
import {
  selectUi,
  setNewGoalModalState,
} from "../../../../Redux/slices/uiSlice";
import { selectWorkout, GoalType } from "../../../../Redux/slices/workoutSlice";

export default function NewGoalModal() {
  const dispatch = useDispatch();
  const ui = useSelector(selectUi);
  const { values, setValue, errors, handleChange, handleSubmit } = useForm();
  const theme = useTheme();

  const handleClose = () => {
    dispatch(setNewGoalModalState(null));
  };

  return (
    <Dialog
      fullWidth={true}
      open={ui.form.goal.newGoalModalState}
      onClose={handleClose}
    >
      <Stack
        sx={{
          px: { xs: 0, sm: 2 },
          pt: 2,
          pb: 1,
          maxWidth: "100%",
          overflowX: "hidden",
        }}
        divider={<Divider />}
      >
        <Stack
          direction="row"
          sx={{
            p: 1,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Stack direction="row">
            <TrackChanges
              sx={{
                height: { xs: 35, sm: 45 },
                width: { xs: 35, sm: 45 },
                mr: 0.8,
              }}
            />
            <Stack>
              <Typography
                align="left"
                variant="h5"
                sx={{ fontWeight: 700, mt: 0.4, fontSize: { xs: 25, sm: 25 } }}
              >
                {ui?.activeWorkout?.name || "New Goal"}
              </Typography>
              <Typography
                data-testid="set-active-goal"
                align="left"
                variant="h5"
                sx={{
                  fontWeight: 700,
                  mt: 0.4,
                  fontSize: { xs: 15, sm: 18 },
                  color: grey[600],
                }}
              >
                Set Active Goal
              </Typography>
            </Stack>
          </Stack>
        </Stack>
        <DialogContent sx={{ p: 2, pt: 2 }}>
          {/* <DialogContentText> */}
          <Stack sx={{ py: 2, color: grey[600] }} spacing={1}>
            <Accordion elevation={0} sx={{ border: `1px solid ${grey[200]}` }}>
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                sx={{ fontWeight: 600, borderBottom: `1px solid ${grey[300]}` }}
              >
                Goal Info
              </AccordionSummary>
              <AccordionDetails sx={{ p: 1 }}>
                <List
                  sx={{
                    "& .MuiListItem-root": {
                      borderBottom: `1px solid ${grey[200]}`,
                      p: 1,
                      py: 1.5,
                    },
                  }}
                  disablePadding={true}
                  dense={false}
                >
                  <ListItem>
                    <ListItemIcon>
                      <TrackChanges />
                    </ListItemIcon>
                    <Typography variant="body2">
                      A goal is a target amount of weight, sets, and reps you
                      want to achieve for the current series of rounds. You can
                      set a goal for each workout's method/equipment.
                    </Typography>
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <EmojiEvents />
                    </ListItemIcon>
                    <Typography variant="body2">
                      Achieve a goal by consistently lifting a target weight at
                      a target amount of
                      <strong> sets, reps, and rounds</strong>.<br></br>
                      <strong>
                        ex: ( 150 lbs at 3 sets x 8 reps x 6 rounds )
                      </strong>
                    </Typography>
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <EventRepeat />
                    </ListItemIcon>
                    <Typography variant="body2">
                      Your next goal will be automatically set; increasing the
                      weight, sets, or reps based on the workout's type of
                      resistance training.
                      <br></br>
                      <strong>
                        ex: hypertrophy ( +5 lbs at 3 sets x 8 reps x 6 rounds )
                      </strong>
                    </Typography>
                  </ListItem>
                </List>
              </AccordionDetails>
              <Typography
                variant="body2"
                sx={{ fontSize: ".7rem", color: grey[700], p: 1 }}
              >
                <strong>*Round:</strong> completed session of all sets
              </Typography>
            </Accordion>
          </Stack>
          <Stack spacing={3} divider={<Divider />}>
            <Stack spacing={3} sx={{ pt: 1 }}>
              <TextField
                id="workout-method-input"
                name="method"
                select
                label="Method"
                variant="outlined"
                size="small"
                autoFocus
                value={values?.method || ""}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                SelectProps={{
                  native: true,
                }}
                sx={{ maxWidth: 200 }}
                error={errors.method ? true : false}
                helperText={errors.method ? errors.method : ""}
              >
                {ui.activeWorkout &&
                  Array.isArray(ui.form.workout.methodSelection) &&
                  ui.form.workout.methodSelection.map((option) => (
                    <option key={`${option}-option`} value={option}>
                      {option}
                    </option>
                  ))}
              </TextField>
              <Typography variant="body2">Target Values: </Typography>
              <TextField
                id="target-weight"
                name="targetWeight"
                label="Weight (lbs)"
                sx={{ maxWidth: 145 }}
                type="number"
                variant="outlined"
                size="small"
                value={values?.targetWeight || 0}
                onChange={handleChange}
                error={errors.targetWeight ? true : false}
                helperText={errors.targetWeight ? `${errors.targetWeight}` : ``}
              />
              <TextField
                id="target-sets"
                name="targetSets"
                label="Sets"
                sx={{ maxWidth: 120 }}
                type="number"
                size="small"
                variant="outlined"
                value={values?.targetSets || 0}
                onChange={handleChange}
                error={errors.targetSets ? true : false}
                helperText={errors.targetSets ? `${errors.targetSets}` : ""}
              />
              <TextField
                id="target-reps"
                name="targetReps"
                label="Reps"
                sx={{ maxWidth: 120 }}
                type="number"
                variant="outlined"
                size="small"
                value={values?.targetReps || 0}
                onChange={handleChange}
                error={errors.targetReps ? true : false}
                helperText={errors.targetReps ? `${errors.targetReps}` : ""}
              />
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions
          sx={{
            p: 2,
            justifyContent: { xs: "center", sm: "end" },
            alignItems: "center",
          }}
        >
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleSubmit}
            sx={{ minWidth: 120 }}
          >
            Set Goal
          </Button>
        </DialogActions>
      </Stack>
    </Dialog>
  );
}
