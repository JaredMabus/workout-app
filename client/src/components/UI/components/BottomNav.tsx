import { useState, useEffect, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
// MUI
import {
  Box,
  Slide,
  AppBar,
  Toolbar,
  BottomNavigation,
  BottomNavigationAction,
  useScrollTrigger,
} from "@mui/material";
// ICONS
import HomeTwoToneIcon from "@mui/icons-material/HomeTwoTone";
import CalendarMonthTwoToneIcon from "@mui/icons-material/CalendarMonthTwoTone";
import DashboardTwoToneIcon from "@mui/icons-material/DashboardTwoTone";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
// REDUX
import { useSelector } from "react-redux";
import * as account from "../../../Redux/slices/accountSlice";

export default function SimpleBottomNavigation() {
  const [value, setValue] = useState("/");
  const navigate = useNavigate();
  const accountState = useSelector(account.selectAccount);
  const showBottomNav = useScrollTrigger();

  useLayoutEffect(() => {
    setValue(window.location.pathname);
  }, [value]);

  const handleChange = (event: any, newValue: any) => {
    navigate(newValue);
  };

  return (
    <Slide direction="up" in={!showBottomNav}>
      <Box
        sx={{
          display: { xs: "border-box", sm: "none" },
          width: "100%",
          minWidth: "100%",
          maxWidth: "100%",
          position: "fixed",
          bottom: 0,
          left: 0,
          mb: -0.1,
          zIndex: 3,
          borderTop: "1px solid",
          borderImage: `linear-gradient(
          to right,
          rgb(54, 68, 79, 0.1) 25%,
          rgb(54, 68, 79, 0.1) 25%,
          rgb(54, 68, 79, 0.1) 25%,
          rgb(54, 68, 79, 0.1) 25%
        )
        4`,
        }}
      >
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            handleChange(event, newValue);
          }}
        >
          {accountState.loginStatus ? (
            <BottomNavigationAction
              showLabel={true}
              label="Dashboard"
              icon={<DashboardTwoToneIcon />}
              value="/dashboard"
            />
          ) : (
            <BottomNavigationAction
              showLabel={true}
              label="Home"
              icon={<HomeTwoToneIcon />}
              value="/"
            />
          )}
          <BottomNavigationAction
            showLabel={true}
            label="Workouts"
            icon={<FitnessCenterIcon />}
            value="/workouts"
          />
          <BottomNavigationAction
            showLabel={true}
            label="Plan"
            icon={<CalendarMonthTwoToneIcon />}
            value="/plan"
          />
        </BottomNavigation>
      </Box>
    </Slide>
  );
}
