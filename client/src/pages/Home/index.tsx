import UI from "../../components/UI";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import { Box, Container, Stack, Button, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
//IMAGES
import WeightAppSplashWeightRoom from "../../assets/images/WeightAppSplashWeightRoom2.svg";
// ICONS
import AddWorkoutIconLight from "../../assets/images/icons/AddWorkoutIconLight.svg";
import TrackProgressIconLight from "../../assets/images/icons/TrackProgressIconLight.svg";
import CalendarOutlineLight from "../../assets/images/icons/CalendarOutlineLight.svg";
import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";

const CustomButton = styled(Button)(
  ({ theme }) => `
  position: abosolute;
  bottom: 0; 
  display: flex;
  // align-self: end; 
  // justify-self: end; 
  justify-content: center;
  align-items: end; 
  background-color: ${theme.palette.secondary.main};
  font-weight: bold;
  max-width: 165px;
  border: 1px solid ${theme.palette.secondary.main}; 
  outline: none; 
  text-transform: none; 
  padding: 8px;
  margin: 15px 0 0 0; 
  :hover {
    background-color: ${theme.palette.secondary.light};
  }
`
);

const Home = () => {
  const navigate = useNavigate();

  return (
    <>
      <UI />
      <Container
        disableGutters
        sx={{ pb: "56px", maxWidth: { xs: "xl", sm: "lg" } }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            mb: { xs: 0, sm: 10, md: 5 },
          }}
        >
          <Box
            sx={{
              px: 5,
              flex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: grey[200],
              borderRadius: { xs: "0 0 0 0", xl: "0 0 0 30%" },
              "@media (max-width: 600px)": {
                justifyContent: "center",
                alignItems: "center",
              },
              maxHeight: 450,
            }}
          >
            <Box
              sx={{
                py: 4,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography
                variant="h3"
                align="center"
                sx={{
                  width: "100%",
                  fontWeight: "300",
                }}
              >
                Weight <br />
                Lifting <br />
                Tracker
              </Typography>
              <CustomButton
                onClick={() => navigate("/sign-up")}
                variant="contained"
              >
                <Typography
                  sx={{
                    pl: 1,
                    fontWeight: "bold",
                  }}
                  variant="body1"
                >
                  Get Started
                </Typography>
                <DoubleArrowIcon sx={{ ml: 1 }} />
              </CustomButton>
            </Box>
          </Box>
          <Box
            sx={{
              flex: { xs: 1, sm: 3.5 },
              minHeight: { xs: 250, sm: 350, md: 450, lg: 450 },
              maxHeight: { xs: 350, sm: 350, md: 450, lg: 450 },
              width: "100%",
              minWidth: { xs: "100%", sm: 385 },
              backgroundImage: `url(${WeightAppSplashWeightRoom})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: { xs: "cover", sm: "cover" },
              backgroundPosition: "bottom-left",
              borderRadius: { xs: 0, sm: "0 0 10% 0" },
            }}
          />
        </Box>
        <Stack
          sx={{
            mt: { xs: 0, sm: 10 },
            mb: 30,
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
          }}
        >
          {/* CREATE WORKOUT */}
          <Box
            sx={{
              p: 5,
              pb: 10,
              m: { xs: 0, sm: 0, md: 0, lg: 1 },
              borderRadius: { xs: 0, sm: 0, md: 0, lg: 4 },
              flex: 1.2,
              display: "flex",
              flexDirection: "column",
              justifyContent: "start",
              alignItems: "end",
              backgroundColor: "#3B3A37",
              boxShadow: "3px 4px 10px 3px rgba(0,0,0,.15)",
              backgroundImage: `url(${AddWorkoutIconLight})`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "calc(0%) -3%;",
              backgroundSize: "125px 125px",
            }}
          >
            <Typography
              variant="h4"
              align="right"
              sx={{
                display: "flex",
                justifySelf: "end",
                alignSelf: "end",
                fontWeight: 500,
                color: "#fff",
              }}
            >
              Add <br /> Workouts
            </Typography>
            <Typography
              sx={{
                pl: 1,
                // fontWeight: 400,
                color: "#fff",
              }}
              variant="body1"
              align="right"
            >
              Create and manage your workouts
            </Typography>
            <CustomButton
              sx={{ mt: 4 }}
              onClick={() => navigate("/workouts")}
              variant="contained"
            >
              <Typography
                sx={{
                  pl: 1,
                  fontWeight: "bold",
                }}
                variant="body1"
              >
                Take a Look
              </Typography>
              <DoubleArrowIcon sx={{ ml: 1 }} />
            </CustomButton>
          </Box>
          {/* WORKOUT PLAN */}
          <Box
            sx={{
              p: 5,
              pb: 10,
              m: { xs: 0, sm: 0, md: 0, lg: 1 },
              borderRadius: { xs: 0, sm: 0, md: 0, lg: 4 },
              flex: { xs: 1, sm: 1, md: 0.8 },
              display: "flex",
              flexDirection: "column",
              backgroundColor: grey[200],
              boxShadow: "3px 4px 10px 3px rgba(0,0,0,.15)",
              minWidth: { xs: "100%", sm: 385 },
              backgroundImage: `url(${CalendarOutlineLight})`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "calc(100%) 100%;",
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: 500,
              }}
            >
              Workout
              <br /> Plan
            </Typography>
            <Typography
              variant="body1"
              sx={{
                pl: 1,
                fontWeight: 500,
              }}
            >
              Schedule your weekly routine
            </Typography>
          </Box>
          {/* TRACK PROGRESS */}
          <Box
            sx={{
              p: 5,
              pb: 10,
              m: { xs: 0, sm: 0, md: 0, lg: 1 },
              borderRadius: { xs: 0, sm: 0, md: 0, lg: 4 },
              flex: 1,
              display: "flex",
              flexDirection: "column",
              backgroundColor: "#EEB405",
              boxShadow: "3px 4px 10px 3px rgba(0,0,0,.15)",
              backgroundImage: `url(${TrackProgressIconLight})`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "calc(105%) 110%;",
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: 500,
              }}
            >
              Track <br /> Progress
            </Typography>
            <Typography
              variant="body1"
              sx={{
                pl: 1,
                fontWeight: 500,
              }}
            >
              Submit workout rounds and track your progression
            </Typography>
          </Box>
        </Stack>
      </Container>
    </>
  );
};

export default Home;
