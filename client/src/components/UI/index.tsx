import React, { useEffect, useState, useLayoutEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { useSpring, animated } from "@react-spring/web";
// COMPONENTS
import Snackbar from "./components/SnackBar";
import BottomNav from "./components/BottomNav";
import Footer from "./components/Footer";
// MUI
import {
  Stack,
  Toolbar,
  IconButton,
  Container,
  Button,
  alpha,
  Divider,
  useScrollTrigger,
} from "@mui/material";
import { styled, useTheme, Theme, CSSObject } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import { MenuOpen } from "@mui/icons-material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { grey } from "@mui/material/colors";
import HeaderAvatar from "./components/HeaderAvatar";
// ICONS
import LifterIcon from "../../assets/images/icons/LifterIconWhiteBg.svg";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import DashboardIcon from "@mui/icons-material/Dashboard";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import HomeIcon from "@mui/icons-material/Home";

// REDUX
import { useSelector, useDispatch } from "react-redux";
import * as ui from "../../Redux/slices/uiSlice";
import { selectAccount } from "../../Redux/slices/accountSlice";

interface LinksArrayObj {
  id: string | number;
  name: string;
  path: string;
  icon: React.ReactElement | null | string;
  loggedIn: boolean;
}

// const linksArray: LinksArrayObj[] = [

//   {
//     id: "0",
//     name: "Dashboard",
//     path: "/dashboard",
//     icon: <DashboardIcon id="link-element-dash" />,
//     loggedIn: true,
//   },
//   {
//     id: "1",
//     name: "Workouts",
//     path: "/workouts",
//     icon: <FitnessCenterIcon id="link-element-workout" />,
//     loggedIn: true,
//   },
//   {
//     id: "2",
//     name: "Plan",
//     path: "/plan",
//     icon: <CalendarMonthOutlinedIcon id="link-element-plan" />,
//     loggedIn: true,
//   },
// ];

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  boxShadow: "rgba(0, 0, 0, 0.26) 0px 2px 4px",
  backgroundColor: theme.palette.common.white,
  // backgroundColor: "rgba(0, 0, 0, 0)",
  // boxShadow: "rgba(0, 0, 0, 0) 0px 3px 8px",
  color: theme.palette.text.primary,
  borderRadius: "0px 0px 20px 20px",
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    // marginLeft: drawerStyle.width,
    // width: `calc(100% - ${drawerStyle.width}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

interface DrawerStyle {
  width: number;
  margin: number;
  close: {
    width: number;
    margin: number;
  };
}

const drawerStyle: DrawerStyle = {
  width: 240,
  margin: 10,
  close: {
    width: 0,
    margin: 74,
  },
};

const openedMixin = (theme: Theme): CSSObject => ({
  top: "80px",
  width: drawerStyle.width,
  borderRadius: "0px 20px 20px 0px",
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  top: "80px",
  borderRadius: "0px 20px 20px 0px",
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerStyle.width,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

/**
 * Master container component for general UI and renders all other child components.
 * General UI components: NavBar, BottomNav, and SnackBar.
 */
export default function UI(props: any) {
  const dispatch = useDispatch();
  const uiState = useSelector(ui.selectUi);
  const account = useSelector(selectAccount);
  const theme = useTheme();

  const linksArray: LinksArrayObj[] = [
    account.loginStatus
      ? {
          id: "0",
          name: "Dashboard",
          path: "/dashboard",
          icon: <DashboardIcon id="link-element-dash" />,
          loggedIn: true,
        }
      : {
          id: "0",
          name: "Home",
          path: "/",
          icon: <HomeIcon id="link-element-dash" />,
          loggedIn: true,
        },
    {
      id: "1",
      name: "Workouts",
      path: "/workouts",
      icon: <FitnessCenterIcon id="link-element-workout" />,
      loggedIn: true,
    },
    {
      id: "2",
      name: "Plan",
      path: "/plan",
      icon: <CalendarMonthOutlinedIcon id="link-element-plan" />,
      loggedIn: true,
    },
  ];

  const pageAnimate = useSpring({
    from: { x: 0, y: 10, opacity: 0 },
    to: { x: 0, y: 0, opacity: 1 },
    delay: 50,
  });

  const linkStyle: any = {
    flex: 1,
    color: theme.palette.primary.main,
    borderLeft: "5px solid transparent",
    textDecoration: "none",
  };

  return (
    <>
      <Container disableGutters>
        <CssBaseline />
        <AppBar
          open={uiState.navBarOpen}
          elevation={0}
          sx={{
            backgroundColor: "#fff",
            boxShadow: "rgba(0, 0, 0, 0.26) 0px 2px 4px",
            mb: 9,
            position: "sticky",
          }}
        >
          <Toolbar
            sx={{
              display: "flex",
              justifyContent: "space-between",
              backgroundColor: "transparent",
            }}
          >
            <Link to="/">
              <img src={LifterIcon} alt="Lifter Icon" />
            </Link>
            {account.loginStatus ? (
              <HeaderAvatar />
            ) : (
              <Stack direction="row" spacing={1} sx={{ maxHeight: "100%" }}>
                <Button
                  size="small"
                  variant="contained"
                  component={Link}
                  to="/login"
                  aria-label="Login"
                  aria-describedby="login-description"
                >
                  Login
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  component={Link}
                  to="/sign-up"
                  color="secondary"
                  aria-label="sign-up"
                  aria-describedby="sign-up-description"
                >
                  Sign-up
                </Button>
              </Stack>
            )}
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          open={uiState.navBarOpen}
          sx={{
            display: { xs: "none", sm: "flex", md: "flex" },
          }}
        >
          <DrawerHeader>
            {uiState.navBarOpen ? (
              <IconButton
                onClick={() => dispatch(ui.setNavBar(!uiState.navBarOpen))}
              >
                {theme.direction === "rtl" ? <MenuOpen /> : <MenuOpen />}
              </IconButton>
            ) : (
              <IconButton
                onClick={() => {
                  dispatch(ui.setNavBar(!uiState.navBarOpen));
                }}
              >
                {theme.direction === "rtl" ? (
                  <ChevronRightIcon />
                ) : (
                  <ChevronRightIcon />
                )}
              </IconButton>
            )}
          </DrawerHeader>
          <Divider />
          <List>
            {linksArray.map((link) => (
              <ListItem
                disablePadding
                key={link.id}
                sx={{
                  display: "flex",
                  justifyContent: "start",
                  // alignItems: "center",
                }}
              >
                <NavLink
                  to={link.path}
                  end
                  style={({ isActive }) => {
                    if (isActive) {
                      return {
                        ...linkStyle,
                        borderLeft: `5px solid ${theme.palette.secondary.main}`,
                        backgroundColor: grey[50],
                      };
                    } else {
                      return {
                        ...linkStyle,
                      };
                    }
                  }}
                >
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      px: uiState.navBarOpen ? 1 : 0,
                      justifyContent: uiState.navBarOpen ? "initial" : "center",
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        mr: uiState.navBarOpen ? 1 : "auto",
                        justifyContent: "center",
                      }}
                    >
                      {link.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={link.name}
                      sx={{
                        opacity: uiState.navBarOpen ? 1 : 0,
                      }}
                    />
                  </ListItemButton>
                </NavLink>
              </ListItem>
            ))}
          </List>
          <Divider />
        </Drawer>
        {/* Page containers rendered here */}
        <animated.div style={pageAnimate}>
          <Container
            disableGutters
            sx={{
              pb: { xs: "56px", sm: 0 },
              maxWidth: { xs: "xl", sm: "xl" },
              minHeight: "100vh",
              pl: {
                xs: 0,
                sm: uiState.navBarOpen
                  ? `${drawerStyle.width + drawerStyle.margin}px`
                  : `${drawerStyle.close.margin}px`,
                lg: uiState.navBarOpen
                  ? `${drawerStyle.width + drawerStyle.margin}px`
                  : `${drawerStyle.close.margin}px`,
                xl: 0,
              },
            }}
          >
            {props.children}
          </Container>
          <Footer />
        </animated.div>
        <BottomNav />
        <Snackbar />
      </Container>
    </>
  );
}
