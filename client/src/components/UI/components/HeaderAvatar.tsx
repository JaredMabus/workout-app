import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { useTheme } from "@mui/material/styles";
// ICONS
import MenuItem from "@mui/material/MenuItem";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import LogoutIcon from "@mui/icons-material/Logout";
// REDUX
import {
  selectUi,
  setNavBar,
  setSnackBar,
  reset as uiReset,
} from "../../../Redux/slices/uiSlice";
import {
  selectAccount,
  logOut,
  setApiStatus,
} from "../../../Redux/slices/accountSlice";
import { reset as workoutReset } from "../../../Redux/slices/workoutSlice";
import { useSelector, useDispatch } from "react-redux";

export default function HeaderAvatar() {
  const account = useSelector(selectAccount);
  const ui = useSelector(selectUi);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const settingsIconSX = { height: 23, width: 23, mr: 1 };

  interface TypesSettings {
    id: string;
    name: string;
    path: string;
    icon: React.ReactElement | null | string;
    event: any;
  }

  const settings: TypesSettings[] = [
    {
      id: "0",
      name: "Account",
      path: "/account",
      icon: <AccountBoxIcon sx={settingsIconSX} />,
      event: () => {
        if (!ui.navBarOpen) {
          navigate("/account");
          return;
        }
        dispatch(setNavBar(!ui.navBarOpen));
        navigate("/account");
      },
    },
    {
      id: "1",
      name: "Logout",
      path: "/logout",
      icon: <LogoutIcon sx={settingsIconSX} />,
      event: () => {
        if (!ui.navBarOpen) {
          dispatch(logOut());
          dispatch(uiReset());
          dispatch(workoutReset());
          dispatch(setNavBar(ui.navBarOpen));
          return;
        }
        dispatch(logOut());
        dispatch(setNavBar(ui.navBarOpen));
      },
    },
  ];

  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  return (
    <Box
      sx={{
        minHeight: 48,
        display: "flex",
        flexDirection: "row",
        justifyContent: "end",
      }}
    >
      {/* <Box sx={{ height: 38, width: 38 }}> */}
      <Tooltip title="My Account">
        <IconButton onClick={handleOpenUserMenu}>
          {account.api.loading ? (
            <Skeleton
              variant="circular"
              sx={{
                backgroundColor: alpha(grey[300], 0.6),
                border: `2px solid ${theme.palette.secondary.light}`,
              }}
              height={38}
              width={38}
            />
          ) : (
            <Avatar
              alt="Account avatar"
              sx={{
                maxWidth: "100%",
                objectFit: "cover",
                border: `1px solid ${theme.palette.secondary.light}`,
                boxShadow: "rgb(0 0 0 / 15%) 1px 1px 6px 2px",
              }}
              src={account.accountData.avatar}
            />
          )}
        </IconButton>
      </Tooltip>
      <Menu
        sx={{ mt: "45px" }}
        id="menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
        disableScrollLock={true}
      >
        {settings.map((setting) => {
          return (
            <MenuItem
              key={setting.id}
              onClick={setting.event}
              sx={{ justifyContent: "start", alignItems: "center" }}
            >
              {setting.icon}
              <Typography
                variant="body2"
                sx={{ fontWeight: 700 }}
                textAlign="center"
              >
                {setting.name}
              </Typography>
            </MenuItem>
          );
        })}
      </Menu>
    </Box>
  );
};
