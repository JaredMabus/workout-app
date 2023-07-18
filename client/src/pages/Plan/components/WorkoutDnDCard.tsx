import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useContext,
} from "react";
import * as date from "../../../utils/date";
// import { ItemType } from "../../../utils/items";
// import * as planApi from "../PlanApi";
// DRAG N DROP
import { useDrag, useDrop } from "react-dnd";
// MUI
import { useTheme } from "@mui/material/styles";
// import Container from "@mui/material/Container";
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
import { Expand } from "@mui/icons-material";
// WORKOUT CARD MENU ICONS
import DateRangeOutlinedIcon from "@mui/icons-material/DateRangeOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
// REDUX
import { selectAccount } from "../../../Redux/slices/accountSlice";
import {
  WorkoutType,
  WeekDayNumberType,
  setWorkouts,
  setWorkoutPlanWeek,
  moveWorkoutCard,
  moveWorkoutCardFromMenu,
  removeWorkoutFromDay,
  selectWorkout,
  WorkoutCardDragObj,
} from "../../../Redux/slices/workoutSlice";
import { useSelector, useDispatch } from "react-redux";
import * as ui from "../../../Redux/slices/uiSlice";
import { PlanContext } from "../context/PlanContext";
import * as action from "../context/actions";

export const ItemType = {
  CARD: "card",
};

export interface DnDWorkoutCardProps {
  id: string;
  index: string | number;
  dayIndex: string;
  item: {
    dragIndex: string | number;
    hoverIndex: string | number;
    dayIndex: string;
    dayHoverIndex: string;
    workout: Partial<WorkoutType>;
    addNewWorkout: boolean;
  };
  workout: Partial<WorkoutType>;
  addWorkout: boolean;
}
/**
 * Draggable component that is managed by react-dnd and rendered by a useCallback function.
 * @param index used for both initial index position and used for updating hover index position
 * @param dayIndex used for both initial index position and used for updating hover index position
 * @param item the drag item. Contains workout data, initial indicies, and new/hover indicies
 * @param workout workout card data used for component view
 * @returns
 */
export default function DnDWorkoutCard({
  index,
  dayIndex,
  item,
  workout,
  addWorkout = false,
}: Partial<DnDWorkoutCardProps>) {
  const ref = useRef<HTMLElement | null>(null);
  const dispatch = useDispatch();
  const [, dispatchCtx] = useContext(PlanContext);
  const theme = useTheme();
  // Card Menu State
  const cardMenuDayOptions = [
    { value: "0", option: "Sunday" },
    { value: "1", option: "Monday" },
    { value: "2", option: "Tuesday" },
    { value: "3", option: "Wednesday" },
    { value: "4", option: "Thursday" },
    { value: "5", option: "Friday" },
    { value: "6", option: "Saturday" },
  ];
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    handleCloseDay();
    setAnchorEl(null);
  };

  const [anchorElDay, setAnchorElDay] = React.useState<null | HTMLElement>(
    null
  );
  const openDay = Boolean(anchorElDay);
  const handleClickDay = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElDay(event.currentTarget);
  };
  const handleCloseDay = () => {
    setAnchorElDay(null);
  };

  // DnD State
  const [{ isDragging }, drag] = useDrag({
    type: "workoutCard",
    item: () => {
      return item as WorkoutCardDragObj;
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ handlerId, isOver }, drop] = useDrop({
    accept: "workoutCard",
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
        isOver: !!monitor.isOver(),
      };
    },
    hover(item: any, monitor) {
      if (!ref.current) {
        return;
      }

      const dragIndex = item.index;
      var hoverIndex = index;
      item.hoverIndex = hoverIndex;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }
      // Determine rectangle on screen
      const hoverBoundingRect = ref.current.getBoundingClientRect();
      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      // Get pixels to the top
      if (clientOffset !== null && hoverIndex) {
        const hoverClientY = clientOffset.y - hoverBoundingRect.top;
        // Only perform the move when the mouse has crossed half of the items height
        // When dragging downwards, only move when the cursor is below 50%
        // When dragging upwards, only move when the cursor is above 50%
        // Dragging downwards
        if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
          return;
        }
        // Dragging upwards
        if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
          return;
        }
      } else {
        return;
      }
    },
  });

  const placementIndicator = isDragging
    ? `1px solid ${theme.palette.secondary.main}`
    : "1px solid #E0E0E0";

  drag(drop(ref));

  const cardMenuItemStyle = {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    px: 1.5,
    pl: 2,
    py: 1,
    mx: 1,
    borderRadius: 2,
  };

  return (
    <>
      <Menu
        autoFocus={true}
        disableAutoFocusItem={true}
        disableScrollLock
        // PopoverClasses={{ hideBackdrop: true }}
        hideBackdrop={true}
        sx={{
          maxWidth: 200,
        }}
        id={`${dayIndex}-${index}-workout-card-day-select`}
        anchorEl={anchorEl}
        open={openDay}
        onClose={handleCloseDay}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
        anchorOrigin={{
          vertical: "top",
          horizontal: 150,
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        onMouseOver={(e: any) => {
          handleClickDay(e);
        }}
        onMouseLeave={() => {
          handleCloseDay();
        }}
      >
        {cardMenuDayOptions.map((item, i) => {
          return (
            <MenuItem
              disabled={
                i.toString() === dayIndex && addWorkout === false ? true : false
              }
              key={`${i}-move-card-day-option`}
              onClick={() => {
                dispatch(
                  moveWorkoutCardFromMenu({
                    index,
                    dayIndex,
                    newDayIndex: item.value,
                    workout,
                    addNewWorkout: addWorkout,
                  })
                );
                dispatchCtx(action.setHydrate(true));
                handleCloseDay();
              }}
              sx={cardMenuItemStyle}
            >
              <Typography
                align="center"
                sx={{
                  px: 1,
                  fontSize: ".9em",
                  fontWeight: 600,
                }}
              >
                {item.option}
              </Typography>
            </MenuItem>
          );
        })}
      </Menu>
      <Box
        key={`${workout ? workout._id : `no-workout`}-dnd-workoutcards`}
        ref={ref}
        data-handler-id={handlerId}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "start",
          height: 58,
          minHeight: 58,
          pt: 1,
          pb: 2,
          px: 1,
          my: 0.5,
          width: { xs: "94%", sm: "100%" },
          maxWidth: 275,
          borderRadius: 2,
          opacity: isDragging ? 1 : 1,
          border: placementIndicator,
          backgroundColor: "#fff",
          boxShadow: "0 2px 4px 1px rgba(140, 149, 159, .1)",
          cursor: "grab",
          "&: hover": {
            border: "2px solid grey",
            boxShadow: "none",
            ".plan-workout-card-menu-btn": {
              visibility: "visible",
            },
          },
          "&: active": {
            borderRadius: 1,
            cursor: " grabbing",
            border: `2px solid ${theme.palette.secondary.light}`,
            boxShadow: "none",
            ".plan-workout-card-menu-btn": {
              visibility: "visible",
            },
          },
        }}
      >
        <Typography variant="body2">
          {workout ? workout.name : "No name"}
        </Typography>
        {/* CARD MENU */}
        <Box>
          <IconButton
            className="plan-workout-card-menu-btn"
            size="small"
            id="basic-button"
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
            sx={{ visibility: "hidden", mt: -0.5 }}
          >
            <MoreHorizIcon fontSize="small" color="primary" />
          </IconButton>
          <Menu
            sx={{ maxWidth: 200 }}
            id={`${dayIndex}-${index}-workout-card-menu`}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
            // disableScrollLock
            variant="menu"
            autoFocus={true}
            // disableAutoFocusItem={true}
          >
            {/* MOVE TO.. OPTION */}
            <MenuItem
              sx={cardMenuItemStyle}
              onMouseOver={(e: any) => {
                handleClickDay(e);
              }}
            >
              <DateRangeOutlinedIcon fontSize="small" />
              <Typography
                align="center"
                sx={{
                  px: 1,
                  fontSize: ".9em",
                  fontWeight: 600,
                }}
              >
                Move to...
              </Typography>
              <ArrowRightIcon />
              <IconButton
                className="plan-workout-card-menu-btn"
                size="small"
                id="basic-button"
                aria-controls={open ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
                sx={{ visibility: "hidden", mt: -0.5 }}
                onMouseOver={() => {
                  handleCloseDay();
                }}
              >
                <MoreHorizIcon fontSize="small" color="primary" />
              </IconButton>
            </MenuItem>
            {addWorkout === false && (
              <MenuItem
                onClick={() => {
                  dispatch(removeWorkoutFromDay({ index, dayIndex }));
                  dispatchCtx(action.setHydrate(true));
                  handleClose();
                }}
                onMouseOver={() => {
                  handleCloseDay();
                }}
                sx={{
                  px: 1.5,
                  pl: 2,
                  py: 1,
                  mx: 1,
                  borderRadius: 2,
                  color: "#DA636B",
                  transition: "150ms ease-in-out",
                  "&: hover": {
                    backgroundColor: "#DA636B30",
                  },
                }}
              >
                <DeleteOutlineIcon fontSize="small" />
                <Typography
                  align="center"
                  sx={{
                    px: 1,
                    fontSize: ".9em",
                    fontWeight: 700,
                    color: "#DA636B",
                  }}
                >
                  <b>Remove</b>
                </Typography>
              </MenuItem>
            )}
          </Menu>
        </Box>
      </Box>
    </>
  );
}
