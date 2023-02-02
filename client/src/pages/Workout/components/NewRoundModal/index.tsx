import React, { useEffect, useState } from "react";
import useForm from "./useForm";
import { useTheme } from "@mui/material/styles";
import {
  Button,
  Stack,
  Divider,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
  PlaylistAdd,
  Tune,
  Lock,
  LockOpen,
  Add,
  Remove,
} from "@mui/icons-material";
// REDUX
import { useDispatch, useSelector } from "react-redux";
import {
  selectUi,
  setNewRoundModalState,
  setCompletedSetsIndices,
} from "../../../../Redux/slices/uiSlice";
import {
  selectWorkout,
  RoundType,
} from "../../../../Redux/slices/workoutSlice";
// COMPONENTS
import SetStepper from "./SetStepper";
import CompletedSetTable from "./CompletedSetTable";

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

const maxSets = 20;
const minSets = 1;

export default function FormDialog() {
  const dispatch = useDispatch();
  const ui = useSelector(selectUi);
  const {
    values,
    setValue,
    errors,
    handleChange,
    handleSubmit,
    handleDateChange,
  } = useForm();
  const theme = useTheme();
  const [completedSetIndex, setCompletedSetIndex] = useState<
    { [k: number]: boolean }[] | null
  >(null);
  const handleClose = () => {
    dispatch(setNewRoundModalState());
    dispatch(setCompletedSetsIndices({}));
  };

  const setInputRef = React.useRef<HTMLInputElement>();
  const incrementSets = () => {
    try {
      if (setInputRef.current != null && setInputRef.current.value != null) {
        if (Number(setInputRef.current.value) >= maxSets) {
          return;
        }
        setInputRef.current.stepUp();
        handleChange(setInputRef.current);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const decrementSets = () => {
    try {
      if (setInputRef.current != null && setInputRef.current.value != null) {
        if (Number(setInputRef.current.value) <= minSets) {
          return;
        }
        setInputRef.current.stepDown();
        handleChange(setInputRef.current);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const [dateValue, setDateValue] = React.useState<Date | null>(new Date());

  const handleDate = (newValue: Date | null) => {
    setDateValue(newValue);
    handleDateChange(newValue);
  };

  useEffect(() => {
    if (
      Array.isArray(ui.form.round.defaultValues) &&
      ui.form.round.defaultValues.length > 0 &&
      ui.form.round.defaultValues.date
    ) {
      setDateValue(ui.form.round?.defaultValues?.date || new Date());
    }
  }, [ui.form.round.defaultValues]);

  // SLIDERS
  // const [sliderStatusWeight, setSliderStatusWeight] = useState<boolean>(false);
  // const [sliderStatusSets, setSliderStatusSets] = useState<boolean>(false);
  // const [sliderStatusReps, setSliderStatusReps] = useState<boolean>(false);
  // const [marks, setMarks] = useState([
  //   {
  //     value: ui.form.round.defaultValues.weight,
  //     label: "Last Round",
  //   },
  // ]);

  // function valuetext(value: number) {
  //   return `${value}`;
  // }
  // const [lockedMax, setLockedMax] = useState<boolean>(true);

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
          {/* <Stack>
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
          </Stack> */}
        </Stack>
        <DialogContent sx={{ p: 2, pt: 2 }}>
          <Stack spacing={3} divider={<Divider />}>
            <Stack direction="row" spacing={3} sx={{ pt: 1 }}>
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
              {/* <Typography variant={"h6"}>Sets</Typography> */}
              <Stack
                spacing={2}
                direction="column"
                sx={{ alignItems: "baseline" }}
              >
                <Stack direction="row">
                  <TextField
                    id="sets"
                    inputRef={setInputRef}
                    name="sets"
                    label="Sets"
                    type="number"
                    size="small"
                    variant="outlined"
                    value={values?.sets?.length || 0}
                    onChange={handleChange}
                    error={errors.sets ? true : false}
                    helperText={errors.sets ? errors.sets : ``}
                    sx={{
                      maxWidth: 75,
                      "& input[type=number]::-webkit-inner-spin-button,& input[type=number]::-webkit-outer-spin-button ":
                        {
                          WebkitAppearance: "none",
                          margin: 0,
                        },
                    }}
                  />
                  <Button id="weight-decrement-btn" onClick={decrementSets}>
                    <Remove />
                  </Button>
                  <Button id="weight-increment-btn" onClick={incrementSets}>
                    <Add />
                  </Button>
                </Stack>
                <SetStepper
                  values={values}
                  setValue={setValue}
                  errors={errors}
                  handleChange={handleChange}
                />
              </Stack>
              <CompletedSetTable values={values} />
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
            Submit Workout
          </Button>
        </DialogActions>
      </Stack>
    </Dialog>
  );
}
