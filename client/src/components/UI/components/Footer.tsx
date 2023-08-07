import React, { useEffect, useState } from "react";
import { Stack, Button, Typography, Slide } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { grey } from "@mui/material/colors";
import LifterIconWhite from "../../../assets/images/icons/LifterIconWhiteBg.svg";
import LifterIconBlackBg from "../../../assets/images/icons/LifterIconWhite.svg";

export default function Footer() {
  const [showBottomNav, setShowBottomNav] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    let prevScrollPos = window.pageYOffset;
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      const isScrollingDown = prevScrollPos < currentScrollPos;
      setShowBottomNav(!isScrollingDown);
      prevScrollPos = currentScrollPos;
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [showBottomNav]);

  return (
    <>
      <Stack
        direction="row"
        justifyContent={"center"}
        alignContent={"center"}
        sx={{
          mt: 10,
          mb: showBottomNav ? "57px" : 0,
          p: 5,
          backgroundColor: theme.palette.background.paper,
          height: 70,
          borderRadius: "20px 20px 0px 0px",
          boxShadow: "rgb(0, 0, 0, 0.15)  0px 1px 4px",
        }}
      >
        <Stack
          direction="row"
          sx={{
            opacity: 0.5,
            justifyContent: "center",
            alignItems: "center",
            img: {
              height: 35,
            },
          }}
        >
          <Typography
            variant="h4"
            align="center"
            sx={{ fontFamily: "Comfortaa", mt: 0.5 }}
          >
            Lift
          </Typography>
          {theme.palette.mode === "light" ? (
            <img src={LifterIconWhite} alt="Lifter Icon" />
          ) : (
            <img src={LifterIconBlackBg} alt="Lifter Icon" />
          )}
        </Stack>
      </Stack>
    </>
  );
}
