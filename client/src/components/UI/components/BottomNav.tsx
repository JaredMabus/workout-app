import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// MUI
import Box from "@mui/material/Box";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
// ICONS
import HomeTwoToneIcon from "@mui/icons-material/HomeTwoTone";
import InsertChartTwoToneIcon from "@mui/icons-material/InsertChartTwoTone";
import DataSaverOnTwoToneIcon from "@mui/icons-material/DataSaverOnTwoTone";
import CalendarMonthTwoToneIcon from "@mui/icons-material/CalendarMonthTwoTone";
// import HomeIcon from "@mui/icons-material/Home";
// import SettingsIcon from "@mui/icons-material/Settings";
// import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
// import RestoreIcon from "@mui/icons-material/Restore";
// import FavoriteIcon from "@mui/icons-material/Favorite";
// import LocationOnIcon from "@mui/icons-material/LocationOn";
// import AssessmentIcon from "@mui/icons-material/Assessment";
// import BarChartIcon from "@mui/icons-material/BarChart";

export default function SimpleBottomNavigation() {
  const [value, setValue] = useState("/");
  const navigate = useNavigate();

  useEffect(() => {
    setValue(window.location.pathname);
  }, [value]);

  const handleChange = (event: any, newValue: any) => {
    navigate(newValue);
  };

  return (
    <Box
      sx={{
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
        <BottomNavigationAction
          showLabel={true}
          label="Home"
          icon={<HomeTwoToneIcon />}
          value="/"
        />
        <BottomNavigationAction
          showLabel={true}
          label="Workouts"
          icon={<DataSaverOnTwoToneIcon />}
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
  );
}
