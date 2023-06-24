import UI from "../../components/UI";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { Stack, Button, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
//IMAGES
import HeroSectionDarkBG from "../../assets/images/hero-section-darker-bg.svg";
// ICONS
import AddWorkoutIcon from "../../assets/images/icons/AddworkoutIcon.svg";
import TrackProgressIconLight from "../../assets/images/icons/TrackProgressIconLight.svg";
import CalendarOutlineLight from "../../assets/images/icons/CalendarOutlineLight.svg";
import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";

const Home = () => {
  const navigate = useNavigate();
  const muiTheme = useTheme();

  const cardTextHeader: any = {
    fontFamily: "Comfortaa",
    fontWeight: 500,
  };

  const cardStyle: any = {
    color: muiTheme.palette.text.primary,
    backgroundColor: grey[100],
    boxShadow: "rgb(0 0 0 / 15%) 0px 3px 8px",
    p: 5,
    pb: 8,
    m: 1,
    borderRadius: { xs: 0, sm: 0, md: 4},
    backgroundRepeat: "no-repeat",
    minHeight: 260, 
    minWidth: { sm: 360},
    maxWidth: "100%",
    
  };

  return (
    <>
      <UI>
        <Stack
          sx={{
            mb: { xs: 0, sm: 10, md: 5 },
            position: "relative",
            width: "100%"
          }}
        >
          <Stack
            sx={{
              position: "absolute",
              top: "20%",
              px: 5,
              justifyContent: "end",
              alignItems: "end",
            }}
          >
            <Stack sx={{justifyContent: "end", alignItems: "end", color: muiTheme.palette.common.white}}>
              <Typography sx={{fontFamily:"comfortaa", fontWeight:400}} variant="h1">Lift</Typography>
              <Typography sx={{fontFamily:"comfortaa"}} variant="h5">Weight Lifting</Typography>
              <Typography sx={{fontFamily:"comfortaa"}} variant="h5">Tracker</Typography>
            </Stack>
              <Button
                size="large"
                onClick={() => navigate("/sign-up")}
                variant="contained"
                endIcon={<DoubleArrowIcon />}
                sx={{mt: 1}}
                color="secondary"
              >
                Get Started
              </Button>
            </Stack>
          <Stack
            sx={{
              flex: { xs: 1, sm: 3.5 },
              minHeight: { xs: 250, sm: 350, md: 450 },
              maxHeight: { xs: 350, sm: 350, md: 450 },
              minWidth: { xs: "100%", sm: 385 },
              backgroundImage: `url(${HeroSectionDarkBG})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: { xs: "cover", sm: "cover" },
              backgroundPosition: "bottom-left",
              borderRadius: { xs: 0, sm: "20px 20px 10% 20px" },
            }}
          />
        </Stack>
        {/* CARD WRAPPER */}
        <Stack
          direction="row"
          flexWrap={"wrap"}
          sx={{
            mt: { xs: 0, sm: 10 },
            mb: 30,
            width: "100%"
          }}
        >
          {/* CREATE WORKOUT */}
          <Stack
            sx={{
              ...cardStyle,
              flex: 1,
              justifyContent: "start",
              alignItems: "end",
              backgroundImage: `url(${AddWorkoutIcon})`,
              backgroundPosition: "calc(0%) -22%;",
              backgroundSize: "125px 125px",
            }}
          >
            <Stack
              spacing={1}
              justifyContent={"end"}
              alignItems={"end"}
            >
              <Typography
                variant="h4"
                align="right"
                sx={{
                  ...cardTextHeader,
                }}
              >
                Add <br /> Workouts
              </Typography>
              <Typography
                sx={{
                  pl: 1,
                }}
                variant="body1"
                align="right"
              >
                Create and manage your workouts
              </Typography>
              {/* <Button
                onClick={() => navigate("/sign-up")}
                variant="contained"
                endIcon={<DoubleArrowIcon />}
                color="secondary"
                sx={{mt: 3, maxWidth: 165}}
              >
                Create account
              </Button> */}
            </Stack>
          </Stack>
          {/* WORKOUT PLAN */}
          <Stack
            sx={{
              ...cardStyle,
              flex: 1,
              backgroundImage: `url(${CalendarOutlineLight})`,
              backgroundPosition: "calc(100%) 100%;",
            }}
          >
            <Stack>
              <Typography
                variant="h4"
                sx={{
                  ...cardTextHeader,
                }}
              >
                Plan your 
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  ...cardTextHeader,
                }}
              >
                Workouts
              </Typography>
            </Stack>
            <Typography
              variant="body1"
              sx={{
                pl: .5,
                fontWeight: 500,
              }}
            >
              Schedule your weekly routine
            </Typography>
          </Stack>
          {/* TRACK PROGRESS */}
          <Stack
            sx={{
              ...cardStyle,
              flex: 1,
              backgroundImage: `url(${TrackProgressIconLight})`,
              backgroundPosition: "calc(105%) 110%;",
            }}
          >
            <Typography
              variant="h4"
              sx={{
                ...cardTextHeader,
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
          </Stack>
        </Stack>
      </UI>
    </>
  );
};

export default Home;
