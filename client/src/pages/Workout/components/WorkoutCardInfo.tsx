import React from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Stack,
  Button,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// COMPONENTS
import WorkoutCardDemo from "./WorkoutCardDemo";
// ICONS
import {
  AddCircle,
  EmojiEventsOutlined,
  PendingActions,
  TimerOutlined,
} from "@mui/icons-material";
import FitnessPlanIcon from "../../../assets/images/icons/fitness-plan.svg";
import TargetGoalIcon from "../../../assets/images/icons/TargetGoal.svg";

export default function WorkoutCardInfo() {
  const accordianStackStyle: any = {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 1,
  };

  const accordianDetailsStyle: any = {
    pl: 3,
  };

  return (
    <>
      <Grid
        container
        rowSpacing={15}
        sx={{
          px: {
            xs: 2,
            sm: 0,
          },
          py: 2,
        }}
      >
        <Grid xs={12} md={6}>
          <Stack sx={{ maxWidth: 500 }}>
            <Typography variant="h4" fontWeight={600}>
              Workout Cards
            </Typography>
            <Typography
              variant="subtitle1"
              fontWeight={500}
              sx={{ pl: 0.5, py: 1 }}
            >
              Manage your workouts, round submissions, and goals with workout
              cards
            </Typography>
            <List dense={true}>
              {/* ROUNDS */}
              <ListItem>
                <Accordion
                  defaultExpanded={true}
                  disableGutters
                  sx={{
                    boxShadow: "none",
                    backgroundColor: "transparent",
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Stack
                      sx={{
                        ...accordianStackStyle,
                      }}
                    >
                      <AddCircle
                        color="secondary"
                        sx={{ height: 30, width: 30 }}
                      />
                      <Typography variant="h5" fontWeight={600}>
                        Submit Your Rounds
                      </Typography>
                    </Stack>
                  </AccordionSummary>
                  <AccordionDetails
                    sx={{
                      ...accordianDetailsStyle,
                    }}
                  >
                    <List dense={true}>
                      <ListItem>
                        <ListItemIcon>
                          <PendingActions />
                        </ListItemIcon>
                        <ListItemText>
                          <Typography variant="body2">
                            Save time at the gym with autofilling round
                            submissions based on your last workout
                          </Typography>
                        </ListItemText>
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <TimerOutlined />
                        </ListItemIcon>
                        <ListItemText>
                          <Typography variant="body2">
                            Monitor and control your rest periods with ease
                            using an integrated rest timer
                          </Typography>
                        </ListItemText>
                      </ListItem>
                    </List>
                  </AccordionDetails>
                </Accordion>
              </ListItem>
              <Divider />
              {/* GOALS */}
              <ListItem>
                <Accordion
                  defaultExpanded={true}
                  disableGutters
                  sx={{
                    boxShadow: "none",
                    backgroundColor: "transparent",
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Stack
                      sx={{
                        ...accordianStackStyle,
                      }}
                    >
                      <Box
                        component="img"
                        src={TargetGoalIcon}
                        alt="Goal Icon"
                        sx={{ height: 30, width: 30 }}
                      />
                      <Typography variant="h5" fontWeight={600}>
                        Set Goals
                      </Typography>
                    </Stack>
                  </AccordionSummary>
                  <AccordionDetails
                    sx={{
                      ...accordianDetailsStyle,
                    }}
                  >
                    <List dense={true}>
                      <ListItem>
                        <ListItemIcon>
                          <EmojiEventsOutlined />
                        </ListItemIcon>
                        <ListItemText>
                          <Typography variant="body2">
                            Effortlessly track and advance your goals with our
                            automated progress system
                          </Typography>
                        </ListItemText>
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <Box
                            component="img"
                            src={FitnessPlanIcon}
                            alt="Goal Icon"
                            sx={{
                              height: 30,
                              width: 30,
                            }}
                          />
                        </ListItemIcon>
                        <ListItemText>
                          <Typography variant="body2">
                            Establish and monitor workout goals for each
                            training method
                          </Typography>
                        </ListItemText>
                      </ListItem>
                    </List>
                  </AccordionDetails>
                </Accordion>
              </ListItem>
              <Divider />
              <Button
                sx={{
                  maxWidth: 150,
                  minWidth: 150,
                  m: 3,
                  justfiySelf: "end",
                  alignSelf: "end",
                }}
                component={Link}
                to="/sign-up"
                variant="contained"
                endIcon={<DoubleArrowIcon />}
              >
                Get Started
              </Button>
            </List>
          </Stack>
        </Grid>
        <Grid
          xs={12}
          md={6}
          display={"flex"}
          justifyContent="center"
          alignItems="center"
        >
          <WorkoutCardDemo />
        </Grid>
      </Grid>
    </>
  );
}
