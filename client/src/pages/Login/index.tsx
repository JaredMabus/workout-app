import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useForm from "./useForm";
import LifterIcon from "../../assets/images/icons/LifterIcon.svg";
import { UISnack } from "../../components/UI";
import SnackBar from "../../components/UI/components/SnackBar";
import { styled as muiStyled } from "@mui/material/styles";
import {
  Box,
  Container,
  Stack,
  TextField,
  Typography,
  Button,
  IconButton,
  FormControl,
  InputAdornment,
  LinearProgress,
  Tooltip,
} from "@mui/material";
// ICON
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
// REDUX
import { useSelector } from "react-redux";
import { selectAccount } from "../../Redux/slices/accountSlice";
import { useSpring, animated } from "@react-spring/web";

const CustomTextField = muiStyled(TextField)({
  "& .MuiOutlinedInput-root": {
    borderRadius: "5px",
    minWidth: 250,
  },
  "& .MuiFormLabel-root": {},
});

const Login = () => {
  const account = useSelector(selectAccount);
  const {
    values,
    errors,
    handleChange,
    handleSubmit,
    handleMouseDownPassword,
    handleClickShowPassword,
  } = useForm();

  useEffect(() => {}, []);

  const initialAnimate = useSpring({
    from: { x: 0, y: -10, opacity: 0 },
    to: { x: 0, y: 0, opacity: 1 },
    delay: 250,
  });

  const navigate = useNavigate();
  return (
    <>
      <UISnack />

      <SnackBar />
      {account.api.loading ? (
        <Stack sx={{ width: "100%", position: "fixed", top: 0 }}>
          <LinearProgress sx={{ height: 5 }} color="primary"></LinearProgress>
        </Stack>
      ) : (
        <Stack sx={{ width: "100%", position: "fixed", top: 0 }}>
          <div></div>
        </Stack>
      )}
      <Box
        sx={{
          position: "absolute",
          right: 0,
          top: 0,
          px: 5,
          py: 2,
          zIndex: 2,
        }}
      >
        <Tooltip placement="left" title="Back to App">
          <IconButton onClick={() => navigate("/")} color="primary">
            <ExitToAppIcon sx={{ height: 30, width: 30 }} />
          </IconButton>
        </Tooltip>
      </Box>
      <animated.div style={initialAnimate}>
        <Container
          maxWidth={false}
          sx={{ position: "relative", display: "flex", height: "100vh" }}
        >
          <Stack
            sx={{
              justifySelf: "center",
              alignSelf: "center",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Box
              component={Link}
              to="/"
              sx={{
                p: 0,
                backgroundImage: `url(${LifterIcon})`,
                height: 125,
                width: 125,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                boxShadow: "0px 3px 20px 5px rgba(0,0,0,.1)",
                transition: "box-shadow 150ms ease-in-out",
                ":hover": {
                  boxShadow: "0px 4px 10px 2px rgba(0,0,0,.2)",
                },
              }}
            />
            <Box
              sx={{
                p: 0,
                my: 2,
              }}
            >
              <FormControl
                id="Login-form"
                component="form"
                sx={{
                  p: 0,
                  my: 2,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                noValidate
                autoComplete="off"
                onSubmit={handleSubmit}
                method="post"
              >
                <CustomTextField
                  name="email"
                  id="email"
                  type="email"
                  value={values.email}
                  onChange={handleChange}
                  label="Email"
                  variant="outlined"
                  required
                  error={"email" in errors ? true : false}
                  helperText={"email" in errors ? `${errors.email}` : ""}
                  margin="normal"
                  sx={{ maxWidth: 250, minWidth: 250 }}
                />
                <TextField
                  id="outlined-adornment-password"
                  label="Password"
                  name="password"
                  type={values.showPassword ? "text" : "password"}
                  value={values.password}
                  onChange={handleChange}
                  required
                  margin="normal"
                  error={"password" in errors ? true : false}
                  helperText={"password" in errors ? `${errors.password}` : ""}
                  sx={{ maxWidth: 250, minWidth: 250 }}
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
                <Stack
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    my: 2,
                  }}
                >
                  <Button
                    sx={{ minWidth: 165, m: 1 }}
                    variant="contained"
                    onClick={handleSubmit}
                  >
                    Login
                  </Button>
                </Stack>
                <Typography variant="body2">
                  Create an account? <Link to="/sign-up">Sign up here</Link>
                </Typography>
              </FormControl>
            </Box>
          </Stack>
        </Container>
      </animated.div>
    </>
  );
};

export default Login;
