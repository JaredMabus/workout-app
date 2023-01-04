import React, { useEffect, useState } from "react";
import useForm from "./useForm";
import { useTheme } from "@mui/material/styles";
import {
  Button,
  Stack,
  Divider,
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
  TextField,
  Typography,
  Slider,
  FormGroup,
  FormControlLabel,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { PlaylistAdd, Tune, Lock, LockOpen } from "@mui/icons-material";
// REDUX
import { useDispatch, useSelector } from "react-redux";
import {
  selectUi,
  setNewRoundModalState,
} from "../../../../Redux/slices/uiSlice";
import {
  selectWorkout,
  RoundType,
} from "../../../../Redux/slices/workoutSlice";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function FormDialog() {
  const dispatch = useDispatch();
  const ui = useSelector(selectUi);
  const { values, errors, handleChange, handleSubmit, handleDateChange } =
    useForm();
  const theme = useTheme();

  const handleClose = () => {
    dispatch(setNewRoundModalState());
  };

  const [dateValue, setDateValue] = React.useState<Date | null>(new Date());
  const handleDate = (newValue: Date | null) => {
    setDateValue(newValue);
    handleDateChange(newValue);
  };

  useEffect(() => {
    setDateValue(ui.form.round?.defaultValues?.date || new Date());
  }, [ui.form.round.defaultValues.date]);

  const [sliderStatusWeight, setSliderStatusWeight] = useState<boolean>(false);
  const [sliderStatusSets, setSliderStatusSets] = useState<boolean>(false);
  const [sliderStatusReps, setSliderStatusReps] = useState<boolean>(false);
  // const [marks, setMarks] = useState([
  //   {
  //     value: ui.form.round.defaultValues.weight,
  //     label: "Last Round",
  //   },
  // ]);

  function valuetext(value: number) {
    return `${value}`;
  }
  const [lockedMax, setLockedMax] = useState<boolean>(true);

  return (
    <Dialog
      fullWidth={true}
      open={ui.form.round.newRoundModalState}
      onClose={handleClose}
    >
      <Stack
        sx={{
          px: { xs: 0, sm: 2 },
          pt: 2,
          pb: 1,
          border: `3px solid ${theme.palette.primary.main}`,
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
            <PlaylistAdd
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
                {ui?.activeWorkout?.name || "New Round"}
              </Typography>
              <Typography
                align="left"
                variant="h5"
                sx={{
                  fontWeight: 700,
                  mt: 0.4,
                  fontSize: { xs: 15, sm: 18 },
                  color: grey[600],
                }}
              >
                New Round
              </Typography>
            </Stack>
          </Stack>
          <Stack>
            {lockedMax ? (
              <IconButton
                onClick={() => {
                  setLockedMax(!lockedMax);
                }}
                edge="end"
                sx={{ borderRadius: 2 }}
                title="Allow max values of sliders"
              >
                <Stack
                  direction="column"
                  spacing={0.2}
                  sx={{ alignItems: "center", justifyContent: "center" }}
                >
                  <Lock />
                  <Typography variant="body2" sx={{ fontSize: 12 }}>
                    Max Values
                  </Typography>
                </Stack>
              </IconButton>
            ) : (
              <IconButton
                onClick={() => {
                  setLockedMax(!lockedMax);
                }}
                edge="end"
                sx={{ borderRadius: 2 }}
                title="Limit max slider values"
              >
                <Stack
                  direction="column"
                  spacing={0.2}
                  sx={{ alignItems: "center", justifyContent: "center" }}
                >
                  <LockOpen />
                  <Typography variant="body2" sx={{ fontSize: 12 }}>
                    Max Values
                  </Typography>
                </Stack>
              </IconButton>
            )}
          </Stack>
        </Stack>
        <DialogContent sx={{ p: 2, pt: 2 }}>
          <Stack spacing={3} divider={<Divider />}>
            <Stack spacing={3} sx={{ pt: 1 }}>
              <TextField
                id="muscle-category-input"
                name="method"
                select
                label="Method"
                variant="outlined"
                size="small"
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
                  Array.isArray(ui.activeWorkout.methodSelection) &&
                  ui.activeWorkout.methodSelection.map((option) => (
                    <option key={`${option}-option`} value={option}>
                      {option}
                    </option>
                  ))}
              </TextField>
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <DatePicker
                  label="Date"
                  value={dateValue}
                  onChange={(newValue: Date | null) => {
                    handleDate(newValue);
                  }}
                  renderInput={(params: any) => (
                    <TextField
                      {...params}
                      sx={{ maxWidth: 200 }}
                      name="date"
                      variant="outlined"
                      id="date-workoutRound"
                      size="small"
                    />
                  )}
                />
              </LocalizationProvider>
            </Stack>
            <Stack spacing={3} sx={{ pt: 1, pb: 3 }}>
              <Stack
                direction="row"
                sx={{ alignItems: "baseline", justifyContent: "start" }}
              >
                <TextField
                  id="weight"
                  name="weight"
                  label="Weight (lbs)"
                  sx={{ maxWidth: 145 }}
                  type="number"
                  variant="outlined"
                  size="small"
                  value={values?.weight || 0}
                  onChange={handleChange}
                  autoFocus
                  error={errors.weight ? true : false}
                  helperText={
                    errors.weight
                      ? errors.weight
                      : ui.form.round.defaultValues.weight &&
                        ui.form.round.defaultValues.weight > 0
                      ? `Last round: ${ui.form.round.defaultValues.weight} lbs`
                      : ""
                  }
                />
                <IconButton
                  onClick={() => {
                    setSliderStatusWeight(!sliderStatusWeight);
                  }}
                  sx={{ borderRadius: 2, p: 0.5, mx: 1 }}
                >
                  <Tune />
                </IconButton>
              </Stack>
              {sliderStatusWeight && (
                <Slider
                  name="weight"
                  track={false}
                  value={values?.weight || 0}
                  onChange={handleChange}
                  aria-label="Always visible"
                  getAriaValueText={valuetext}
                  valueLabelDisplay="on"
                  marks={[
                    {
                      value:
                        typeof ui.form.round.defaultValues.weight === "number"
                          ? ui.form.round.defaultValues.weight
                          : 0,
                      label: "Last round",
                    },
                  ]}
                  step={1}
                  min={1}
                  max={
                    typeof ui.form.round.defaultValues.weight === "number" &&
                    ui.form.round.defaultValues.weight !== 0 &&
                    lockedMax
                      ? ui.form.round.defaultValues.weight * 2
                      : 1000
                  }
                />
              )}
              <Stack direction="row" sx={{ alignItems: "baseline" }}>
                <TextField
                  id="sets"
                  name="sets"
                  label="Sets"
                  sx={{ maxWidth: 120 }}
                  type="number"
                  size="small"
                  variant="outlined"
                  value={values?.sets || 0}
                  onChange={handleChange}
                  error={errors.sets ? true : false}
                  helperText={
                    errors.sets
                      ? errors.sets
                      : ui.form.round.defaultValues.sets &&
                        ui.form.round.defaultValues.sets > 0
                      ? `Last round: ${ui.form.round.defaultValues.sets}`
                      : ""
                  }
                />
                <IconButton
                  onClick={() => {
                    setSliderStatusSets(!sliderStatusSets);
                  }}
                  sx={{ borderRadius: 2, p: 0.5, mx: 1 }}
                >
                  <Tune />
                </IconButton>
              </Stack>
              {sliderStatusSets && (
                <Stack>
                  <Slider
                    name="sets"
                    track={false}
                    value={values?.sets || 0}
                    onChange={handleChange}
                    aria-label="Always visible"
                    getAriaValueText={valuetext}
                    valueLabelDisplay="on"
                    marks={[
                      {
                        value:
                          typeof ui.form.round.defaultValues.sets === "number"
                            ? ui.form.round.defaultValues.sets
                            : 0,
                        label: "Last round",
                      },
                    ]}
                    step={1}
                    min={1}
                    max={
                      typeof ui.form.round.defaultValues.sets === "number" &&
                      ui.form.round.defaultValues.sets !== 0 &&
                      lockedMax
                        ? ui.form.round.defaultValues.sets * 2
                        : 100
                    }
                  />
                </Stack>
              )}
              <Stack
                direction="row"
                sx={{ alignItems: "baseline", justifyContent: "start" }}
              >
                <TextField
                  id="reps"
                  name="reps"
                  label="Reps"
                  sx={{ maxWidth: 120 }}
                  type="number"
                  variant="outlined"
                  size="small"
                  value={values?.reps || 0}
                  onChange={handleChange}
                  error={errors.reps ? true : false}
                  helperText={
                    errors.reps
                      ? errors.reps
                      : ui.form.round.defaultValues.reps &&
                        ui.form.round.defaultValues.reps > 0
                      ? `Last round: ${ui.form.round.defaultValues.reps}`
                      : ""
                  }
                />
                <IconButton
                  onClick={() => {
                    setSliderStatusReps(!sliderStatusReps);
                  }}
                  sx={{ borderRadius: 2, p: 0.5, mx: 1 }}
                >
                  <Tune />
                </IconButton>
              </Stack>
              {sliderStatusReps && (
                <Stack>
                  <Slider
                    name="reps"
                    track={false}
                    value={values?.reps || 0}
                    onChange={handleChange}
                    aria-label="Always visible"
                    getAriaValueText={valuetext}
                    valueLabelDisplay="on"
                    marks={[
                      {
                        value:
                          typeof ui.form.round.defaultValues.reps === "number"
                            ? ui.form.round.defaultValues.reps
                            : 0,
                        label: "Last round",
                      },
                    ]}
                    step={1}
                    min={1}
                    max={
                      typeof ui.form.round.defaultValues.reps === "number" &&
                      ui.form.round.defaultValues.reps !== 0 &&
                      lockedMax
                        ? ui.form.round.defaultValues.reps * 2
                        : 100
                    }
                  />
                </Stack>
              )}
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="successSetsReps"
                      checked={values.successSetsReps}
                      value={values.successSetsReps}
                      onChange={handleChange}
                      size="medium"
                    />
                  }
                  label="All successful sets and reps?"
                />
              </FormGroup>
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
            color="primary"
            onClick={handleSubmit}
            sx={{ minWidth: 120 }}
          >
            Add
          </Button>
        </DialogActions>
      </Stack>
    </Dialog>
  );
}
