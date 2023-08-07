import React, { useState, useRef, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import {
  Box,
  Stack,
  Paper,
  Button,
  IconButton,
  Typography,
  Tabs,
  Tab,
  Tooltip,
  Menu,
  MenuItem,
  alpha,
  Divider,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { grey } from "@mui/material/colors";
import {
  WorkoutType,
  WorkoutMethodType,
} from "../../../Redux/slices/workoutSlice";
// ICONS
import { AddCircle } from "@mui/icons-material";
import TargetGoalIcon from "../../../assets/images/icons/TargetGoal.svg";

export default function WorkoutCardDemo() {
  const theme = useTheme();

  // Tab state and logic
  const [value, setTabValue] = React.useState<WorkoutMethodType>("Barbell");

  return (
    <>
      <Stack
        sx={{
          flex: 1,
          py: { xs: 2, sm: 1, md: 2 },
          px: { xs: 2, sm: 2, md: 2, lg: 3 },
          borderRadius: 2,
          // width: 540,
          minWidth: 300,
          maxWidth: 530,
          // height: 260,
          minHeight: 260,
          // maxHeight: 270,
          boxShadow: "rgb(0 0 0 / 8%) 1px 2px 3px 1px",
          border: `1px solid ${theme.palette.border.main}`,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Tooltip placement="top" title="Bench Press" arrow>
            <Typography
              variant="h4"
              noWrap
              sx={{
                textOverflow: "ellipsis",
                fontWeight: 700,
              }}
            >
              Bench Press
            </Typography>
          </Tooltip>
          <Tooltip placement="top" title="Add New Rounds" arrow>
            {/* <IconButton disabled> */}
            <AddCircle color="secondary" sx={{ height: 40, width: 40 }} />
            {/* </IconButton> */}
          </Tooltip>
        </Stack>
        <Stack>
          <Tabs
            value={value}
            //   onChange={handleChange}
            disabled
            variant="scrollable"
            scrollButtons
            allowScrollButtonsMobile
            aria-label="scrollable force tabs example"
            sx={{
              maxWidth: 234,
              height: 30,
              mt: -0.5,
              ml: -2,
              p: 0,
              ".MuiButtonBase-root": {
                padding: 0,
                borderRadius: 2,
                height: 40,
              },
              ".MuiTabs-scrollButtons": {
                height: 40,
              },
              ".MuiTabs-scroller": {
                height: 35,
              },
              ".MuiTabs-indicator": {
                opacity: 0,
              },
              ".MuiTabs-scrollButtons.Mui-disabled": {
                opacity: 0.2,
              },
            }}
          >
            {["Barbell", "Cable", "Dumbbell"].map((method: string) => (
              <Tab
                value={method}
                key={`${method}-tab`}
                label={method}
                disabled
                sx={{
                  color: alpha(theme.palette.text.primary, 0.4),
                  height: 30,
                  mt: -0.7,
                  ml: -1,
                  "&.Mui-selected": {
                    color: alpha(theme.palette.text.primary, 1),
                    fontWeight: 700,
                  },
                  "&:hover": {
                    fontWeight: 700,
                    color: alpha(theme.palette.text.primary, 0.8),
                    backgroundColor:
                      theme.palette.mode === "light"
                        ? alpha(grey[200], 0.3)
                        : alpha(theme.palette.background.paper, 1),
                  },
                }}
              />
            ))}
          </Tabs>
        </Stack>
        <Grid container spacing={3} sx={{ p: 0 }}>
          <Grid
            xs={5}
            // sx={{ display: "flex", flexDirection: "column" }}
          >
            <Stack
              sx={{
                // alignSelf: "end",
                flexDirection: "row",
                gap: { xs: 0.2, sm: 0.5, md: 0.5 },
                borderBottom: `1px solid ${theme.palette.border.main}`,
                py: 0.5,
              }}
            >
              <Typography
                variant={"body1"}
                noWrap
                sx={{
                  fontFamily: "Titillium Web",
                  fontWeight: "bold",
                }}
              >
                Last:
              </Typography>
              <Typography
                variant={"body1"}
                noWrap
                sx={{
                  fontFamily: "Titillium Web",
                }}
              >
                3 days
              </Typography>
            </Stack>
            <List dense={true} disablePadding>
              <ListItem disablePadding>
                <ListItemText
                  sx={{
                    display: "flex",
                    flex: 1,
                    justifyContent: "end",
                  }}
                >
                  <Typography
                    variant={"body1"}
                    sx={{
                      fontFamily: "Titillium Web",
                    }}
                  >
                    Weight:
                  </Typography>
                </ListItemText>
                <ListItemText
                  sx={{
                    display: "flex",
                    flex: 1,
                    justifyContent: "center",
                  }}
                >
                  <Stack
                    direction={"row"}
                    spacing={0.5}
                    sx={{
                      justifyContent: "baseline",
                      alignItems: "baseline",
                    }}
                  >
                    <Typography
                      variant={"h6"}
                      sx={{
                        fontFamily: "Titillium Web",
                        fontWeight: "bold",
                      }}
                    >
                      150
                    </Typography>
                    <Typography
                      variant={"body2"}
                      sx={{
                        fontFamily: "Titillium Web",
                      }}
                    >
                      (lbs)
                    </Typography>
                  </Stack>
                </ListItemText>
              </ListItem>
              <Divider />
              <ListItem
                disablePadding
                sx={{
                  px: 1,
                  gap: 1,
                }}
              >
                <ListItemText
                  sx={{
                    display: "flex",
                    flex: 1,
                    justifyContent: "end",
                  }}
                >
                  <Typography
                    variant={"body1"}
                    sx={{
                      fontFamily: "Titillium Web",
                    }}
                  >
                    Sets:
                  </Typography>
                </ListItemText>
                <ListItemText
                  sx={{
                    display: "flex",
                    flex: 1,
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    variant={"h6"}
                    sx={{
                      fontFamily: "Titillium Web",
                      fontWeight: "bold",
                    }}
                  >
                    3
                  </Typography>
                </ListItemText>
              </ListItem>
              <Divider />
              <ListItem
                disablePadding
                sx={{
                  px: 1,
                  gap: 1,
                }}
              >
                <ListItemText
                  sx={{
                    // px: 1,
                    display: "flex",
                    flex: 1,
                    justifyContent: "end",
                  }}
                >
                  <Typography
                    variant={"body1"}
                    sx={{
                      fontFamily: "Titillium Web",
                    }}
                  >
                    Reps:
                  </Typography>
                </ListItemText>
                <ListItemText
                  sx={{
                    display: "flex",
                    flex: 1,
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    variant={"h6"}
                    sx={{
                      fontFamily: "Titillium Web",
                      fontWeight: "bold",
                    }}
                  >
                    8
                  </Typography>
                </ListItemText>
              </ListItem>
            </List>
          </Grid>
          <Grid xs={2}>
            <Stack
              direction={"row"}
              spacing={0.5}
              alignItems={"center"}
              sx={{
                justifyContent: "end",
                borderBottom: `1px solid ${grey[200]}`,
                py: 0.5,
              }}
            >
              <Box
                component="img"
                src={TargetGoalIcon}
                alt="Goal Icon"
                sx={{ height: 20, width: 20 }}
              />
              <Typography
                variant={"body1"}
                sx={{
                  fontFamily: "Titillium Web",
                  fontWeight: "bold",
                }}
              >
                Goal
              </Typography>
            </Stack>
            <List dense={true} disablePadding sx={{ color: grey[500] }}>
              <ListItem
                disablePadding
                sx={{
                  px: 1,
                  gap: 1,
                }}
              >
                <ListItemText
                  sx={{
                    display: "flex",
                    flex: 1,
                    justifyContent: "end",
                  }}
                >
                  <Typography
                    variant={"h6"}
                    sx={{
                      fontFamily: "Titillium Web",
                      fontWeight: "bold",
                    }}
                  >
                    155
                  </Typography>
                </ListItemText>
              </ListItem>
              <Divider />
              <ListItem
                disablePadding
                sx={{
                  px: 1,
                  gap: 1,
                }}
              >
                <ListItemText
                  sx={{
                    display: "flex",
                    flex: 1,
                    justifyContent: "end",
                  }}
                >
                  <Typography
                    variant={"h6"}
                    sx={{
                      fontFamily: "Titillium Web",
                      fontWeight: "bold",
                    }}
                  >
                    3
                  </Typography>
                </ListItemText>
              </ListItem>
              <Divider />
              <ListItem
                disablePadding
                sx={{
                  px: 1,
                  gap: 1,
                }}
              >
                <ListItemText
                  sx={{
                    display: "flex",
                    flex: 1,
                    justifyContent: "end",
                  }}
                >
                  <Typography
                    variant={"h6"}
                    sx={{
                      fontFamily: "Titillium Web",
                      fontWeight: "bold",
                    }}
                  >
                    8
                  </Typography>
                </ListItemText>
              </ListItem>
            </List>
          </Grid>
          <Grid
            xs={5}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Stack
              sx={{
                borderBottom: `1px solid ${grey[200]}`,
                py: 0.5,
              }}
            >
              <Typography
                variant={"body1"}
                sx={{
                  fontFamily: "Titillium Web",
                  fontWeight: "bold",
                }}
              >
                Progress
              </Typography>
            </Stack>
            <Box
              sx={{
                display: "flex",
                position: "relative",
                justifySelf: "center",
                alignSelf: "center",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <CircularProgress
                variant="determinate"
                value={50}
                size={75}
                thickness={2.5}
                sx={{
                  color: "#6AB73D",
                  borderRadius: 50,
                  backgroundColor: theme.palette.background.paper,
                  boxShadow: "rgb(0 0 0 / 45%) 0px 0px 3px",
                  "& .MuiCircularProgress-circle": {
                    strokeLinecap: "round",
                  },
                }}
              />
              <Box
                sx={{
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  position: "absolute",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography
                  variant="h6"
                  color="text.secondary"
                  sx={{
                    fontWeight: 700,
                    fontFamily: "Saira Semi Condensed",
                  }}
                >
                  3/6
                </Typography>
              </Box>
            </Box>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                fontFamily: "Titillium Web",
                fontWeight: "bold",
              }}
            >
              3 more rounds
            </Typography>
          </Grid>
        </Grid>
      </Stack>
    </>
  );
}
