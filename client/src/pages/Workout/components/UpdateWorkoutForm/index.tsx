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
  alpha,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import { useTheme } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import { Edit } from "@mui/icons-material";
// REDUX
import { useDispatch, useSelector } from "react-redux";
import {
  selectUi,
  setUpdateWorkoutModalState,
} from "../../../../Redux/slices/uiSlice";
import * as comp from "../../../../styles/components";

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
  const theme = useTheme();
  const { values, errors, handleChange, handleSubmit } = useForm();

  const handleClose = () => {
    dispatch(setUpdateWorkoutModalState());
  };

  return (
    <div>
      <Dialog
        fullWidth={true}
        open={ui.form.workout.updateWorkoutModalState}
        onClose={handleClose}
      >
        <Stack sx={{ px: 2, py: 2 }} divider={<Divider />}>
          <Stack
            spacing={1}
            direction="row"
            sx={{ p: 2, alignItems: "center" }}
          >
            <Edit sx={{ height: 30, width: 30 }} />
            <Typography align="center" variant="h5" sx={{ fontWeight: 700 }}>
              Edit workout
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
                value={values?.name || ""}
                onChange={handleChange}
                autoFocus
                error={errors.name ? true : false}
                helperText={errors.name ? errors.name : ""}
              />
              <TextField
                id="muscle-category-input"
                name="muscleCategory"
                select
                label="Muscle Category"
                variant="outlined"
                size="small"
                value={values?.muscleCategory || ""}
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
                value={values?.muscleGroup || ""}
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
                  value={values?.methodSelection || []}
                  onChange={handleChange}
                  input={
                    <OutlinedInput
                      id="select-multiple-methods-chip"
                      label="Method Selections"
                      error={errors.methodSelection ? true : false}
                    />
                  }
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} variant="outlined" />
                      ))}
                    </Box>
                  )}
                  MenuProps={MenuProps}
                >
                  {ui.form.workout.methodSelection.map((method) => (
                    <MenuItem key={method} value={method}>
                      <Checkbox
                        checked={
                          values?.methodSelection &&
                          typeof method === "string" &&
                          values?.methodSelection.indexOf(method) > -1
                        }
                        sx={{
                          color: theme.palette.text.primary,
                          "&.Mui-checked": {
                            color: theme.palette.text.primary,
                          },
                        }}
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
            <comp.OutlinedHoverContrastBtn onClick={handleClose}>
              Cancel
            </comp.OutlinedHoverContrastBtn>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleSubmit}
              sx={{ minWidth: 120 }}
            >
              Update
            </Button>
          </DialogActions>
        </Stack>
      </Dialog>
    </div>
  );
}
