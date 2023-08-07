import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useContext,
  useMemo,
  memo,
} from "react";
import { flushSync } from "react-dom";
import * as date from "../../../utils/date";
// import { ItemType } from "../../../utils/items";
// import * as planApi from "../PlanApi";
import { updateWorkoutPlanWeekApi } from "../planApi";
// DRAG N DROP
import { useDrag, useDrop } from "react-dnd";
// MUI
import { useTheme, alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Menu from "@mui/material/Menu";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
// import Tooltip from "@mui/material/Tooltip";
import Divider from "@mui/material/Divider";
import Badge from "@mui/material/Badge";
// ICONS
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import { Monitor, MonitorTwoTone, Expand } from "@mui/icons-material";

// REDUX
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { selectAccount } from "../../../Redux/slices/accountSlice";
import {
  WorkoutType,
  WeekDayNumberType,
  WeekDayNumber,
  setWorkouts,
  setWorkoutPlanWeek,
  moveWorkoutCard,
  moveWorkoutCardFromMenu,
  removeWorkoutFromDay,
  selectWorkout,
  WorkoutCardDragObj,
  WorkoutPlanWeek,
} from "../../../Redux/slices/workoutSlice";
// COMPONENTS
import DnDWorkoutCard from "./WorkoutDnDCard";
import { setSnackBar } from "../../../Redux/slices/uiSlice";
import { PlanContext } from "../context/PlanContext";
import * as action from "../context/actions";

export const ItemType = {
  CARD: "card",
};

export default function WeekDayCard({ day }: any) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [planState, dispatchCtx] = useContext(PlanContext);
  const workoutState = useSelector(selectWorkout);
  const ref = useRef<any>(null);

  const [, drop] = useDrop(() => ({
    accept: "workoutCard",
    drop: async (item: any, monitor) => {
      if (
        item.dragIndex === item.hoverIndex &&
        item.dayHoverIndex === item.dayIndex &&
        item.addNewWorkout === false
      ) {
        return;
      } else {
        dispatch(
          moveWorkoutCard({
            dragIndex: item.dragIndex,
            hoverIndex: item.hoverIndex,
            dayIndex: item.dayIndex,
            dayHoverIndex: item.dayHoverIndex,
            workout: item.workout,
            addNewWorkout: item.addNewWorkout,
          })
        );
        dispatchCtx(action.setHydrate(true));
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver({ shallow: true }),
    }),
    hover: (item, monitor) => {
      item.dayHoverIndex = day[0];
      if (monitor.isOver({ shallow: true })) {
        if (day[1].length > 0) {
          item.hoverIndex = day[1].length;
        }
      }
    },
  }));

  drop(ref);

  //   const renderCard = useCallback(
  //     (
  //       workout: Partial<WorkoutType>,
  //       index: string | number,
  //       dayIndex: string
  //     ) => {
  //       <DnDWorkoutCard
  //         id={`${workout._id}-${index}-card`}
  //         key={`${workout._id}-${index}-card`}
  //         index={index}
  //         dayIndex={dayIndex}
  //         item={{
  //           dragIndex: index,
  //           hoverIndex: index,
  //           dayIndex: dayIndex,
  //           dayHoverIndex: dayIndex,
  //           workout,
  //         }}
  //         workout={workout}
  //       />;
  //     },
  //     []
  //   );

  return (
    <>
      <Box
        id={day[0]}
        ref={ref}
        sx={{
          my: 1,
          mx: { xs: 1, sm: 2 },
          borderRadius: 2,
          minHeight: 325,
          height: planState.cardExpanded ? 600 : 350,
          border: `1px solid ${theme.palette.border.main}`,
          boxShadow: "0 2px 2px 1px rgba(140, 149, 159, .15)",
          overflow: "hidden",
          transition: "150ms ease-in-out",
          "&: hover": {
            boxShadow: "1px 2px 3px 3px rgba(140, 149, 159, .15)",
          },
        }}
      >
        <Stack
          direction="row"
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 2,
            pb: 1,
            position: "sticky",
            top: 0,
            zIndex: 2,
            borderRadiusTop: 2,
            borderBottom: "1px solid #E9ECF0",
            backgroundColor: theme.palette.background.default,
          }}
        >
          <Typography align="center">
            {date.dayOfTheWeekToString(day[0])}
          </Typography>
          {/* <ButtonGroup>
            <IconButton sx={{ p: 0, m: 0 }} color="primary">
              <MoreHorizIcon />
            </IconButton>
          </ButtonGroup> */}
        </Stack>
        <Stack
          sx={{
            border: "border 1px solid blue",
            mb: 2,
            height: "100%",
            overflowY: "scroll",
            overflowX: "hidden",
            p: 1,
            pb: "103px",
            mr: "-15px",
            // backgroundColor: "#fff",
          }}
          direction="column"
        >
          {/* WORKOUT CARDS */}
          {day[1].map((workout: Partial<WorkoutType>, index: number) => {
            return (
              <DnDWorkoutCard
                id={`${workout._id}-${index}-card`}
                key={`${workout._id}-${index}-card`}
                index={index}
                dayIndex={day[0]}
                item={{
                  dragIndex: index,
                  hoverIndex: index,
                  dayIndex: day[0],
                  dayHoverIndex: day[0],
                  workout,
                  addNewWorkout: false,
                }}
                workout={workout}
                addWorkout={false}
              />
            );
          })}
        </Stack>
        {/* BOTTOM MENU */}
        <Stack
          direction="row"
          sx={{
            display: "flex",
            justifyContent: "end",
            alignItems: "center",
            p: 2,
            pb: 1,
            position: "sticky",
            bottom: 0,
            // width: 270,
            backgroundColor: theme.palette.background.default,
            zIndex: 2,
            borderRadiusTop: 2,
            borderTop: "1px solid #E0E0E0",
          }}
        >
          <Badge
            overlap="rectangular"
            sx={{ mx: 2, zIndex: 1 }}
            badgeContent={day[1].length}
            color="primary"
          >
            <FitnessCenterIcon fontSize="small" color="action" />
          </Badge>
          {day[1].length > 0 ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                flexwrap: "nowrap",
                justifyContent: "center",
                alignItems: "baseline",
              }}
            >
              <Typography
                sx={{
                  fontFamily: "Saira Semi Condensed",
                  fontWeight: 600,
                  fontSize: "1em",
                  letterSpacing: "1px",
                }}
              >
                ~{`${day[1].length * 6}`}
              </Typography>
              <Typography
                sx={{
                  fontFamily: "Saira Semi Condensed",
                  fontWeight: 600,
                  fontSize: ".8em",
                  letterSpacing: "1px",
                }}
              >
                min
              </Typography>
            </Box>
          ) : (
            ""
          )}
        </Stack>
      </Box>
    </>
  );
}
