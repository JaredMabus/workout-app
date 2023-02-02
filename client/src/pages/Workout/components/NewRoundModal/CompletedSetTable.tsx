import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { alpha } from "@mui/material";
import { grey } from "@mui/material/colors";
import { useTheme } from "@mui/material/styles";
import { RoundType, SetType } from "../../../../Redux/slices/workoutSlice";
// REDUX
import { useSelector, useDispatch } from "react-redux";
import * as ui from "../../../../Redux/slices/uiSlice";

interface Props {
  values: Partial<RoundType>;
}

export interface CompletedSetType extends RoundType {
  isCompleted: boolean;
}

export default function CompletedSetTable({ values }: Props) {
  const uiState = useSelector(ui.selectUi);
  const dispatch = useDispatch();
  const theme = useTheme();
  const [completedSets, setCompletedSets] =
    React.useState<Partial<CompletedSetType> | null>(values);

  //   const setSetCompleteObj = (index: number) => {
  //     if (
  //       completedSets != null &&
  //       values.sets != null &&
  //       values.sets[index] != null &&
  //       completedSets.sets != null &&
  //       completedSets.sets[index] != null
  //     ) {

  //       console.log(completedSetIndex);
  //       let newObj = JSON.parse(JSON.stringify(completedSets));
  //       newObj.sets[index].isComplete = true;
  //       newObj.sets[index].weight = values.sets[index].weight;
  //       newObj.sets[index].reps = values.sets[index].reps;
  //       console.log(newObj);
  //     setCompletedSets(newObj);
  //     }
  //   };

  React.useEffect(() => {
    if (values.sets != null) {
      setCompletedSets(values);
    }
  }, [values]);

  React.useEffect(() => {
    if (uiState.form.round.completedSetsIndices != null) {
      setCompletedSets(values);
    }
  }, [uiState.form.round.completedSetsIndices]);

  return (
    <TableContainer
      component={Paper}
      sx={{
        display: "flex",
        justifyContent: "start",
        boxShadow: "none",
        // maxWidth: 300,
        minHeight: 137,
        maxHeight: 137,
        overflowY: "scroll",
      }}
    >
      <Table
        stickyHeader
        aria-label="a dense table"
        size="small"
        sx={{
          // maxWidth: 300,
          maxHeight: 153,
          overflowY: "scroll",
          border: `1px solid ${grey[200]}`,
          ".MuiTableHead-root": {
            ".MuiTableCell-root": {
              backgroundColor: grey[500],
              color: "#fff",
              fontWeight: 700,
            },
          },
          ".MuiTableBody-root": {
            ".MuiTableCell-root": {
              //   backgroundColor: theme.palette.primary.light,
              //   color: "#fff",
            },
          },
        }}
      >
        <TableHead>
          <TableRow>
            <TableCell align="left">Set</TableCell>
            <TableCell align="left">Weight</TableCell>
            <TableCell align="left">Reps</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {completedSets &&
            completedSets != null &&
            completedSets.sets &&
            completedSets.sets != null &&
            Array.isArray(completedSets.sets) &&
            completedSets.sets.length > 0 &&
            completedSets.sets.map((set, index) => (
              <TableRow
                key={`set-table-row-${index}`}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell align="left" component="th" scope="row">
                  {index + 1}
                </TableCell>

                {uiState.form.round.completedSetsIndices != null &&
                Object.keys(uiState.form.round.completedSetsIndices).includes(
                  index.toString()
                ) ? (
                  <>
                    <TableCell align="left">{set.weight}</TableCell>
                    <TableCell align="left">{set.reps}</TableCell>
                  </>
                ) : (
                  <>
                    <TableCell align="left">-</TableCell>
                    <TableCell align="left">-</TableCell>
                  </>
                )}
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
