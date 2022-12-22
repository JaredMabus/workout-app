import * as React from "react";
import useForm from "./useForm";
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
  Typography,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DataSaverOnIcon from "@mui/icons-material/DataSaverOn";
// REDUX
import { useDispatch, useSelector } from "react-redux";
import {
  selectUi,
  setNewWorkoutModalState,
} from "../../../../Redux/slices/uiSlice";

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
  const { values, errors, handleChange, handleSubmit } = useForm();

  const handleClose = () => {
    dispatch(setNewWorkoutModalState());
  };

  return (
    <div>
      <Dialog
        fullWidth={true}
        open={ui.form.workout.newWorkoutModalState}
        onClose={handleClose}
      >
        <Stack sx={{ px: 2, py: 2 }} divider={<Divider />}>
          <Stack direction="row" sx={{ p: 2, alignItems: "center" }}>
            <DataSaverOnIcon sx={{ height: 35, width: 35 }} />
            <Typography align="center" variant="h5" sx={{ fontWeight: 700 }}>
              New Workout
            </Typography>
          </Stack>
          <DialogContent sx={{ p: 2, pt: 2 }}>
            <Stack spacing={5}>
              <TextField
                id="name"
                name="name"
                label="Workout name"
                placeholder="Name your workout"
                type="text"
                variant="standard"
                value={values.name || ""}
                onChange={handleChange}
                autoFocus
                error={errors.name ? true : false}
                helperText={errors.name ? errors.name : ""}
                required
              />
              <TextField
                id="muscle-category-input"
                name="muscleCategory"
                select
                label="Muscle Category"
                variant="outlined"
                size="small"
                value={values.muscleCategory || ""}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                SelectProps={{
                  native: true,
                }}
                sx={{ maxWidth: 200 }}
                error={errors.muscleCategory ? true : false}
                helperText={errors.muscleCategory ? errors.muscleCategory : ""}
              >
                {ui.form.workout.muscleCategory.map((option) => (
                  <option key={`${option}-option`} value={option}>
                    {option}
                  </option>
                ))}
              </TextField>
              <TextField
                id="muscle-group-input"
                name="muscleGroup"
                select
                label="Muscle Group"
                variant="outlined"
                size="small"
                value={values.muscleGroup || ""}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                SelectProps={{
                  native: true,
                }}
                sx={{ maxWidth: 200 }}
                error={errors.muscleGroup ? true : false}
                helperText={errors.muscleGroup ? errors.muscleGroup : ""}
              >
                {ui.form.workout.muscleGroup.map((option) => (
                  <option key={`${option}-option`} value={option}>
                    {option}
                  </option>
                ))}
              </TextField>
              <FormControl>
                <InputLabel id="method-selction-label">
                  Method Selections
                </InputLabel>
                <Select
                  labelId="method-selction-label"
                  id="method-selection-input"
                  multiple
                  name="methodSelection"
                  value={values.methodSelection?.sort()}
                  onChange={handleChange}
                  required
                  input={
                    <OutlinedInput
                      id="select-multiple-methods-chip"
                      label="Method Selections"
                      error={errors.methodSelection ? true : false}
                      required
                    />
                  }
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip
                          key={value}
                          label={value}
                          variant="outlined"
                          sx={{ backgroundColor: grey[100] }}
                        />
                      ))}
                    </Box>
                  )}
                  MenuProps={MenuProps}
                >
                  {ui.form.workout.methodSelection.map((method) => (
                    <MenuItem key={method} value={method}>
                      <Checkbox
                        checked={
                          values.methodSelection &&
                          typeof method === "string" &&
                          values.methodSelection.indexOf(method) > -1
                        }
                      />
                      <ListItemText primary={method} />
                    </MenuItem>
                  ))}
                </Select>
                {errors.methodSelection && (
                  <FormHelperText sx={{ color: "#D53F40" }}>
                    {errors.methodSelection}
                  </FormHelperText>
                )}
                {!errors.methodSelection && (
                  <FormHelperText>
                    Add all the methods used for this workout
                  </FormHelperText>
                )}
              </FormControl>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleSubmit}
              sx={{ minWidth: 120 }}
            >
              Save
            </Button>
          </DialogActions>
        </Stack>
      </Dialog>
    </div>
  );
}
