import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  AppBar,
  Box,
  Stack,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  alpha,
  Skeleton,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import { styled, useTheme } from "@mui/material/styles";
import HeaderAvatar from "./HeaderAvatar";
// ICONS
import { RiMenu4Line } from "react-icons/ri";
import LifterIcon from "../../../assets/images/icons/LifterIcon.svg";
import MenuItem from "@mui/material/MenuItem";
import CloseIcon from "@mui/icons-material/Close";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import DashboardIcon from "@mui/icons-material/Dashboard";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import LogoutIcon from "@mui/icons-material/Logout";
// REDUX
import {
  selectUi,
  setNavBar,
  setSnackBar,
} from "../../../Redux/slices/uiSlice";
import {
  selectAccount,
  logOut,
  setApiStatus,
} from "../../../Redux/slices/accountSlice";
import { useSelector, useDispatch } from "react-redux";
import { Account } from "../../../pages";

interface LinksLinks {
  id: string | number;
  name: string;
  path: string;
  icon: React.ReactElement | null | string;
}

const links: LinksLinks[] = [
  {
    id: "0",
    name: "Dashboard",
    path: "/dashboard",
    icon: <DashboardIcon id="link-element" />,
  },
  {
    id: "1",
    name: "Workouts",
    path: "/workouts",
    icon: <FitnessCenterIcon id="link-element" />,
  },
  {
    id: "2",
    name: "Plan",
    path: "/plan",
    icon: <CalendarMonthOutlinedIcon id="link-element" />,
  },
];

const StyledLink = styled(Link)(
  ({ theme }) => `
  text-decoration: none;
  transition: color 250ms ease-in-out;
  p {
    color: #fff;
  }
  p:hover {
    color: ${theme.palette.secondary.main}; 
  }
`
);

export interface OverlayNavProps {
  overlayHeight: string;
  handleNavMenu:
    | React.MouseEvent<HTMLElement>
    | React.MouseEventHandler<HTMLButtonElement>
    | any;
}

const OverlayNav = ({ overlayHeight, handleNavMenu }: OverlayNavProps) => {
  const theme = useTheme();
  const account = useSelector(selectAccount);
  const ui = useSelector(selectUi);

  const logOutClearState = () => {};

  return (
    <>
      {/* Overlay Container */}
      <Box
        sx={{
          position: "fixed",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          bottom: overlayHeight,
          minHeight: "100%",
          width: "100%",
          minWidth: "100%",
          backgroundColor: "inherit",
          overflowY: "none",
          zIndex: 5,
          transition: "150ms ease-in-out",
        }}
      >
        {/* Mobile nav top menu */}
        <Stack
          direction="row"
          sx={{
            position: "relative",
            justifyContent: "space-between",
            alignItems: "center",
            px: 3,
            pt: 1,
            pb: 1,
            backgroundColor: theme.palette.primary.light,
          }}
        >
          <IconButton
            size="small"
            sx={{}}
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleNavMenu}
            color="inherit"
          >
            <CloseIcon />
          </IconButton>
          <Box
            component={Link}
            to="/"
            onClick={handleNavMenu}
            sx={{
              position: "absolute",
              left: "45%",
              display: { xs: "flex", md: "none" },
              justifySelf: "center",
              alignSelf: "center",
              backgroundImage: `url(${LifterIcon})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "contain",
              height: 40,
              width: 40,
              borderRadius: 1,
            }}
          />
          {account.loginStatus ? (
            <HeaderAvatar />
          ) : (
            <Stack direction="row" spacing={1}>
              <Button
                size="small"
                variant="contained"
                component={Link}
                to="/login"
                onClick={handleNavMenu}
              >
                Login
              </Button>
              <Button
                size="small"
                variant="contained"
                component={Link}
                to="/sign-up"
                color="secondary"
                onClick={handleNavMenu}
              >
                Sign-up
              </Button>
            </Stack>
          )}
        </Stack>
        {/* Nav Wrapper */}
        <Stack
          direction="row"
          sx={{
            py: 3,
            pt: 10,
            flex: 1,
          }}
        >
          <Stack spacing={3} sx={{ flex: 0.3 }}>
            {links.map((link) => {
              return (
                <Stack
                  key={link.id}
                  direction="column"
                  sx={{
                    justifyContent: "start",
                    aligntItems: "center",
                    textTransform: "none",
                    textDecoration: "none",
                    borderBottom: `1px solid ${grey[700]}`,
                    borderRadius: "0 0 7px 0 ",
                    ":hover": {
                      backgroundColor: theme.palette.secondary.light + 15,
                      borderRadius: "0 10px 10px 0 ",
                      "#link-element": {},
                    },
                  }}
                >
                  <NavLink
                    to={link.path}
                    onClick={handleNavMenu}
                    style={({ isActive }) =>
                      isActive
                        ? {
                            textDecoration: "none",
                            color: "#F9BF03",
                          }
                        : {
                            textDecoration: "none",
                            color: "#fff",
                          }
                    }
                  >
                    <>
                      <Stack
                        direction="row"
                        spacing={1.5}
                        sx={{
                          p: 1,
                          px: 2,
                          alignItems: "center",
                          svg: { fontSize: "1.5rem", py: 0.1 },
                        }}
                      >
                        {link.icon}
                        <Typography
                          id="link-element"
                          variant="body1"
                          align="center"
                          gutterBottom={false}
                          sx={{ fontSize: "1.3rem", fontWeight: 500 }}
                        >
                          {link.name}
                        </Typography>
                      </Stack>
                    </>
                  </NavLink>
                </Stack>
              );
            })}
          </Stack>
          <Box sx={{ flex: 1 }}></Box>
        </Stack>
        <Stack
          sx={{
            justifyContent: "center",
            alignItems: "center",
            pb: 3,
            backgroundColor: theme.palette.primary.light,
          }}
        >
          <Button
            variant="contained"
            onClick={handleNavMenu}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: 250,
              maxWidth: 250,
              backgroundColor: alpha(grey[300], 0.9),
              borderRadius: "0 0 10rem 10rem",
              transition: "200ms ease-in-out",
              ":hover": {
                backgroundColor: grey[300],
              },
            }}
          >
            <KeyboardArrowUpIcon color="primary" />
          </Button>
        </Stack>
      </Box>
    </>
  );
};

const ResponsiveAppBar = () => {
  const account = useSelector(selectAccount);
  const ui = useSelector(selectUi);
  const dispatch = useDispatch();
  const [overlayHeight, setOverlayHeight] = useState<string>("100%");

  const handleNavMenu = () => {
    if (ui.navBarOpen) {
      setOverlayHeight("100%");
    } else {
      setOverlayHeight("0%");
    }
    dispatch(setNavBar(!ui.navBarOpen));
  };

  // useEffect(() => {
  //   handleNavMenu();
  // }, [ui.navBarOpen]);

  return (
    <>
      <AppBar position="relative">
        <OverlayNav
          overlayHeight={overlayHeight}
          handleNavMenu={handleNavMenu}
        />
        {/* Header/Toolbar > 1500px */}
        <Container maxWidth={"xl"} sx={{ backgroundColor: "inherit" }}>
          <Toolbar
            sx={{
              // position: "relative",
              display: "flex",
              width: "100%",
              justifyContent: "space-between",
              alignItems: "center",
              zIndex: 4,
            }}
            disableGutters
          >
            {/* Home Page Icon Link > md */}
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
              }}
            >
              <Link to="/">
                <Box
                  sx={{
                    mr: 2,
                    alignItems: "center",
                    backgroundImage: `url(${LifterIcon})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "contain",
                    border: "1px solid #EEB405",
                    height: 40,
                    width: 40,
                    borderRadius: 1,
                    "&: hover": {
                      border: "3px solid #EEB405",
                    },
                    "&: active": {
                      border: "2px solid #EEB405",
                    },
                  }}
                />
              </Link>
            </Box>
            {/* MENU ICON < 1500 */}
            <Box
              sx={{
                display: {
                  xs: "flex",
                  md: "none",
                },
                minHeight: 48,
              }}
            >
              <IconButton
                size="small"
                sx={{ p: "9.6px" }}
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleNavMenu}
                color="inherit"
              >
                {ui.navBarOpen === true ? <CloseIcon /> : <RiMenu4Line />}
              </IconButton>
            </Box>
            {/* Logo icon > md  */}
            {/* <Box
              sx={{
                position: "relative",
                display: { xs: "flex", md: "none" },
                justifyContent: "center",
              }}
            > */}
            {/* Logo icon < md  */}
            <Link to="/">
              <Box
                sx={{
                  display: { xs: "flex", md: "none" },
                  m: "0 auto",
                  alignItems: "center",
                  backgroundImage: `url(${LifterIcon})`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "contain",
                  border: "1px solid #EEB405",
                  height: 40,
                  width: 40,
                  borderRadius: 1,
                  "&: hover": {
                    border: "3px solid #EEB405",
                  },
                  "&: active": {
                    border: "2px solid #EEB405",
                  },
                }}
              />
            </Link>
            {/* </Box> */}
            {/* Header Links > md */}
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                justifyContent: "start",
                flex: 1,
              }}
            >
              {links.map((page) => (
                <Box
                  key={page.id}
                  sx={{
                    mx: 1,
                    ".nav-links-top-bar": {
                      p: 1,
                      fontWeight: 600,
                      fontSize: "1.1em",
                      color: "#fff",
                      textTransform: "none",
                      textDecoration: "none",
                      border: "2px solid none",
                      transition: "200ms ease-in-out",
                      borderRadius: 0.5,
                      "&: hover": {
                        color: "rgba(252, 186, 3)",
                        borderBottom: "2px solid rgba(252, 186, 3, .8)",
                      },
                    },
                  }}
                >
                  <NavLink
                    className="nav-links-top-bar"
                    to={page.path}
                    style={({ isActive }) =>
                      isActive
                        ? {
                            color: "#fff",
                            borderBottom: "2px solid rgba(252, 186, 3, .8)",
                            backgroundColor: "rgba(252, 186, 3,.2)",
                          }
                        : {
                            border: "2px solid none",
                          }
                    }
                  >
                    {page.name}
                  </NavLink>
                </Box>
              ))}
            </Box>
            {/* Login Sign-up Settings Button */}
            {account.loginStatus ? (
              <HeaderAvatar />
            ) : (
              <>
                <Stack direction="row" spacing={1}>
                  <MenuItem
                    sx={{ p: 0, mx: 1.2 }}
                    component={StyledLink}
                    disableGutters
                    to="/login"
                    tabIndex={0}
                  >
                    <Typography
                      sx={{
                        fontColor: "white",
                        fontSize: { xs: ".9em", sm: "1em" },
                        fontWeight: "bold",
                      }}
                      variant="body1"
                    >
                      Login
                    </Typography>
                  </MenuItem>
                  <MenuItem
                    sx={{ p: 0, mx: 1.2 }}
                    component={StyledLink}
                    disableGutters
                    to="/sign-up"
                    tabIndex={0}
                  >
                    <Typography
                      sx={{
                        fontSize: { xs: ".9em", sm: "1em" },
                        fontWeight: "bold",
                      }}
                      variant="body1"
                    >
                      Sign-up
                    </Typography>
                  </MenuItem>
                </Stack>
              </>
            )}
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
};
export default ResponsiveAppBar;
