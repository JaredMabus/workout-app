import React from "react";
import {
  DataGrid,
  GridColDef,
  GridValueGetterParams,
  GridRowSelectionModel,
  GridToolbar,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
  GridToolbarDensitySelector,
} from "@mui/x-data-grid";
import { Stack, Button, IconButton, Typography, alpha } from "@mui/material";
import { grey } from "@mui/material/colors";
import { useTheme } from "@mui/material/styles";
import { StepObj } from "../../Dashboard/components/TodaysWorkouts";
// ICONS
import { DeleteOutline } from "@mui/icons-material";
// REDUX
import { useSelector, useDispatch } from "react-redux";
import { AppThunkDispatch } from "../../../Redux/store";
import * as acc from "../../../Redux/slices/accountSlice";
import * as ui from "../../../Redux/slices/uiSlice";
import * as wk from "../../../Redux/slices/workoutSlice";
// import { deleteRound } from "../../../Redux/slices/workoutSlice";

interface ToolBarProps {
  selectedRows: GridRowSelectionModel;
  completed?: StepObj;
  setCompleted?: React.Dispatch<React.SetStateAction<StepObj | {}>>;
}

export const ToolbarGrid = ({
  selectedRows,
  completed,
  setCompleted,
}: ToolBarProps) => {
  const dispatch: AppThunkDispatch = useDispatch();
  const wkState = useSelector(wk.selectWorkout);

  const removeRounds = async () => {
    await dispatch(wk.deleteRound(selectedRows));
    if (completed && completed != null && setCompleted != null) {
      const newCompleted = Object.fromEntries(
        Object.entries(completed).filter(
          ([key, value]) => !selectedRows.includes(value.id)
        )
      );
      setCompleted(newCompleted);
    }
  };

  return (
    <GridToolbarContainer
      sx={{
        p: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: `1px solid ${grey[300]}`,
        backgroundColor: alpha(grey[50], 1),
      }}
    >
      <Typography variant="h5">Workout Rounds</Typography>
      <Stack>
        <Stack direction="row" spacing={1}>
          {selectedRows.length > 0 && (
            <Button
              startIcon={<DeleteOutline />}
              onClick={removeRounds}
              color="error"
              sx={{ mr: 1, py: "4px", px: "5px" }}
            >
              DELETE
            </Button>
          )}
          <GridToolbarFilterButton />
          <GridToolbarDensitySelector />
        </Stack>
      </Stack>
    </GridToolbarContainer>
  );
};

interface Props {
  data: Partial<wk.RoundType>[] | [] | null;
  columns: GridColDef[];
  completed: StepObj;
  setCompleted?: React.Dispatch<React.SetStateAction<StepObj | {}>>;
}

export default function RoundTable({
  data,
  columns,
  completed,
  setCompleted,
}: Props) {
  const [rows, setRows] = React.useState<Partial<wk.RoundType>[] | [] | null>(
    data
  );
  const [selectedRows, setSelectedRows] = React.useState<GridRowSelectionModel>(
    []
  );

  React.useEffect(() => {
    setRows(data);
  }, [data]);

  return (
    <>
      <Stack sx={{ height: 400, width: "100%" }}>
        {rows != null && columns != null && (
          <DataGrid
            rows={rows}
            columns={columns}
            getRowId={(row: any) => row._id}
            autoPageSize={true}
            checkboxSelection
            editMode="cell"
            rowSelectionModel={selectedRows}
            onRowSelectionModelChange={(
              newSelection: GridRowSelectionModel
            ) => {
              setSelectedRows(newSelection);
            }}
            disableColumnFilter={false}
            disableDensitySelector={false}
            disableColumnMenu={true}
            disableColumnSelector={true}
            disableRowSelectionOnClick={true}
            slots={{ toolbar: ToolbarGrid }}
            slotProps={{
              toolbar: { selectedRows, completed, setCompleted },
            }}
            sx={{
              "& .MuiDataGrid-columnHeaderTitle": {
                display: "flex",
                justifyContent: "start",
                alignItems: "start",
              },
            }}
          />
        )}
      </Stack>
    </>
  );
}
