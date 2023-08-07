import { useState, useRef, useEffect } from "react";
import UI from "../../components/UI";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import {
  Grid,
  Paper,
  Container,
  Stack,
  Button,
  Typography,
  TextField,
  Avatar,
  IconButton,
  Badge,
  alpha,
  Skeleton,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import useForm from "./useForm";
import * as api from "./AccountApi";
// ICONS
// import ImageIcon from "@mui/icons-material/Image";
import EditIcon from "@mui/icons-material/Edit";
// REDUX
import {
  selectAccount,
  setApiStatus,
  setAvatarUrl,
} from "../../Redux/slices/accountSlice";
import { useSelector, useDispatch } from "react-redux";

const Account = () => {
  const account = useSelector(selectAccount);
  const dispatch = useDispatch();
  const theme = useTheme();
  const navigate = useNavigate();
  const toggleEdit = () => {
    setLockFields(!lockFields);
  };
  const hideEdit = () => {
    resetForm();
    toggleEdit();
  };
  const { values, errors, handleSubmit, handleChange, resetForm } =
    useForm(hideEdit);
  const [lockFields, setLockFields] = useState(true);

  useEffect(() => {
    if (!account.loginStatus) {
      window.location.href = "/";
    }
  }, [account]);

  const avatarRef = useRef<HTMLInputElement | null | any>(null);
  const handleImageUpload = async () => {
    try {
      dispatch(setApiStatus(true));
      if (avatarRef.current && avatarRef.current.files !== undefined) {
        const res = await api.uploadImage(avatarRef.current.files);
        if (res?.status === 200) {
          dispatch(setAvatarUrl(res.data.payload));
        }
      }
    } catch (err) {
      console.log(err);
    } finally {
      dispatch(setApiStatus(false));
    }
  };

  const textFieldSX = {
    maxWidth: { xs: "100%", sm: 275 },
  };

  return (
    <>
      <UI>
        <Container
          disableGutters
          sx={{ pb: "56px", maxWidth: { xs: "xl", sm: "xl" } }}
        >
          <Grid
            container
            spacing={1}
            wrap="wrap"
            sx={{ py: 5, px: { xs: 3, sm: 2 } }}
          >
            <Grid
              item
              xs={12}
              sm={12}
              md={3}
              sx={{ minWidth: 250, pb: { xs: 4, sm: 0 } }}
            >
              <Stack
                sx={{
                  position: "relative",
                  alignItems: { xs: "center", md: "center" },
                }}
              >
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  badgeContent={
                    <IconButton
                      component="label"
                      aria-label="upload picture"
                      // color="inherit"
                      title="Upload Photo"
                      sx={{
                        color: alpha(theme.palette.text.primary, 0.8),
                        backgroundColor: alpha(
                          theme.palette.background.default,
                          0.8
                        ),
                        border: `2px solid ${theme.palette.border.main}`,
                        borderRadius: 50,
                        transition: "150ms ease-in-out",
                        ":hover": {
                          color: alpha(theme.palette.text.primary, 1),
                          backgroundColor: alpha(
                            theme.palette.background.default,
                            1
                          ),
                          border: `2px solid ${theme.palette.border.dark}`,
                          boxShadow: `${alpha(
                            theme.palette.secondary.light,
                            0.2
                          )} 0px 0px 4px 2px`,
                        },
                      }}
                    >
                      <EditIcon sx={{ height: 25, width: 25 }} />
                      <form>
                        <input
                          id="raised-button-file"
                          type="file"
                          accept="image/png, image/jpg"
                          ref={avatarRef}
                          style={{ display: "none" }}
                          onChange={handleImageUpload}
                        />
                      </form>
                    </IconButton>
                  }
                >
                  {account.api.loading === true ? (
                    <Skeleton
                      variant="circular"
                      sx={{
                        height: { xs: 150, sm: 250 },
                        width: { xs: 150, sm: 250 },
                      }}
                    />
                  ) : (
                    <Avatar
                      alt="Account avatar"
                      src={account.accountData.avatar}
                      sx={{
                        height: { xs: 150, sm: 250 },
                        width: { xs: 150, sm: 250 },
                        maxWidth: "100%",
                        objectFit: "cover",
                        border: `2px solid ${theme.palette.border.dark}`,
                        boxShadow: "rgb(0 0 0 / 15%) 1px 1px 6px 2px",
                        color: theme.palette.text.primary,
                        backgroundColor: alpha(
                          theme.palette.background.paper,
                          0.7
                        ),
                      }}
                    />
                  )}
                </Badge>
              </Stack>
            </Grid>
            <Grid
              item
              xs={12}
              sm={12}
              md={9}
              sx={{
                justifyContent: { xs: "center" },
                alignItems: { xs: "center" },
              }}
            >
              <Paper elevation={0}>
                <Stack
                  spacing={2}
                  sx={{
                    minHeight: 600,
                    alignItems: { xs: "start", sm: "center", md: "start" },
                    backgroundColor: theme.palette.background.default,
                  }}
                >
                  <Stack
                    direction="column"
                    spacing={1}
                    sx={{ justifyContent: "space-between" }}
                  >
                    <Typography variant="h5">
                      {`${account.accountData.fname} ${account.accountData.lname}` ||
                        "New User"}
                    </Typography>
                    {lockFields && (
                      <Button
                        variant="contained"
                        onClick={toggleEdit}
                        sx={{
                          alignSelf: "start",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        startIcon={<EditIcon sx={{ height: 19, width: 19 }} />}
                      >
                        Edit Info
                      </Button>
                    )}
                  </Stack>
                  <TextField
                    id="account-email"
                    name="email"
                    type="text"
                    variant="standard"
                    value={values.email}
                    label="Email"
                    fullWidth={true}
                    sx={textFieldSX}
                    disabled={true}
                    onChange={handleChange}
                  />
                  <TextField
                    id="account-fname"
                    name="fname"
                    type="text"
                    variant="standard"
                    value={values.fname}
                    label="First Name"
                    fullWidth={true}
                    sx={textFieldSX}
                    disabled={lockFields}
                    onChange={handleChange}
                  />
                  <TextField
                    id="account-lname"
                    name="lname"
                    type="text"
                    variant="standard"
                    value={values.lname}
                    label="Last Name"
                    fullWidth={true}
                    sx={textFieldSX}
                    disabled={lockFields}
                    onChange={handleChange}
                  />
                  <TextField
                    id="account-height"
                    name="height"
                    type="number"
                    variant="standard"
                    value={values.height}
                    label="Height"
                    fullWidth={false}
                    sx={{ maxWidth: 100 }}
                    disabled={lockFields}
                    onChange={handleChange}
                  />
                  <TextField
                    id="account-weight"
                    name="weight"
                    type="number"
                    variant="standard"
                    value={values.weight}
                    label="Weight"
                    fullWidth={false}
                    sx={{ maxWidth: 100 }}
                    disabled={lockFields}
                    onChange={handleChange}
                  />
                  {!lockFields && (
                    <Stack direction="row" spacing={1}>
                      <Button onClick={hideEdit} variant="outlined">
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSubmit}
                        color="primary"
                        variant="contained"
                      >
                        Update
                      </Button>
                    </Stack>
                  )}
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </UI>
    </>
  );
};

export default Account;
