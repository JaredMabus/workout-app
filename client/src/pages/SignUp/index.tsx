import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useForm from "./useForm";
import {useTheme} from "@mui/material/styles";
// MUI
import SnackBar from "../../components/UI/components/SnackBar";
import { styled } from "@mui/material/styles";
import Container from "@mui/material/Container";
import {
  Box,
  FormControl,
  Stack,
  TextField,
  Typography,
  Button,
  IconButton,
  InputAdornment,
  Tooltip,
} from "@mui/material";
import { useSpring, animated } from "@react-spring/web";
// ICON
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import LifterIcon from "../../assets/images/icons/LifterIconTransparent.svg";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const CustomTextField = styled(TextField)(() => ({
  "& .MuiInput-root": {
    borderRadius: "5px",
    minWidth: 226,
    maxWidth: 226,
  },
}));

const NewSignUpComp = () => {
  const theme = useTheme();
  const props = useSpring({
    from: { x: 0, y: -10, opacity: 0 },
    to: { x: 0, y: 0, opacity: 1 },
    delay: 250,
  });

  return (
    <>
      <animated.div style={props}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            a: {
              textDecoration: "none",
            },
          }}
        >
          <Typography variant="h3">Welcome,</Typography>
          <Typography
            sx={{
              m: 1,
            }}
            align="center"
            variant="h5"
          >
            sign in to get started.
          </Typography>
          <Link to="/login">
            <Button
              sx={{
                m: 1,
                color: "text.light",
                backgroundColor: theme.palette.secondary.main,
                "&:hover": {
                  backgroundColor: theme.palette.primary.light,
                },
              }}
              size="large"
              variant="contained"
              endIcon={<NavigateNextIcon />}
            >
              <Typography variant="body2" align="justify">
                Sign in
              </Typography>
            </Button>
          </Link>
        </Box>
      </animated.div>
    </>
  );
};

const SignUp = () => {
  const {
    values,
    errors,
    newSignUp,
    setNewSignUp,
    handleChange,
    handleSubmit,
    handleMouseDownPassword,
    handleClickShowPassword,
  } = useForm();
  const theme = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    setNewSignUp(false);
  }, []);

  const initialAnimate = useSpring({
    from: { x: 0, y: -10, opacity: 0 },
    to: { x: 0, y: 0, opacity: 1 },
    delay: 250,
  });

  return (
    <>
      <SnackBar />
      <Container
        maxWidth={false}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          minHeight: "100vh",
          backgroundColor: theme.palette.secondary.main,
        }}
      >
        <Box
          sx={{
            position: "fixed",
            right: 0,
            top: 0,
            px: 5,
            py: 2,
          }}
        >
          <Tooltip placement="left" title="Back to App">
            <IconButton onClick={() => navigate(-1)} color="primary">
              <ExitToAppIcon sx={{ height: 30, width: 30 }} />
            </IconButton>
          </Tooltip>
        </Box>
        {newSignUp === false ? (
          <animated.div style={initialAnimate}>
            <Box
              sx={{
                borderRadius: 3,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Box
                component={Link}
                to="/"
                sx={{
                  mb: 1,
                  p: 0,
                  border: `3px solid ${theme.palette.secondary.main}`,
                  backgroundImage: `url(${LifterIcon})`,
                  height: 125,
                  width: 125,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  transition: "box-shadow 200ms ease-in-out",
                  boxShadow: "0px 3px 20px 5px rgba(0,0,0,.1)",
                  ":hover": {
                    boxShadow: "0px 3px 20px 5px rgba(0,0,0,.2)",
                  },
                }}
              />
              <Typography sx={{ mt: 2 }} variant="h4">
                New Account
              </Typography>
              <FormControl
                id="SignUp-form"
                component="form"
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <CustomTextField
                  name="email"
                  id="email"
                  value={values.email}
                  onChange={handleChange}
                  label="Email"
                  variant="standard"
                  required
                  error={"email" in errors ? true : false}
                  helperText={"email" in errors ? `${errors.email}` : ""}
                  margin="normal"
                />
                <CustomTextField
                  id="outlined-adornment-password"
                  label="Password"
                  name="password"
                  type={values.showPassword ? "text" : "password"}
                  value={values.password}
                  onChange={handleChange}
                  required
                  variant="standard"
                  error={"password" in errors ? true : false}
                  helperText={"password" in errors ? `${errors.password}` : ""}
                  margin="normal"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {values.showPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <CustomTextField
                  name="fname"
                  id="fname"
                  value={values.fname}
                  onChange={handleChange}
                  label="First Name"
                  variant="standard"
                  required
                  error={"firstName" in errors ? true : false}
                  helperText={"firstName" in errors ? `${errors.fname}` : ""}
                  margin="normal"
                />
                <Stack
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    my: 1,
                    mb: 2,
                    width: "100%",
                  }}
                >
                  <Button
                    sx={{
                      minWidth: 165.13,
                      my: 2,
                    }}
                    variant="contained"
                    onClick={handleSubmit}
                  >
                    Create
                  </Button>
                </Stack>
                <Typography variant="body2">
                  Already have an account? <Link to="/login">Login here</Link>
                </Typography>
              </FormControl>
            </Box>
          </animated.div>
        ) : (
          <NewSignUpComp />
        )}
      </Container>
    </>
  );
};

export default SignUp;
