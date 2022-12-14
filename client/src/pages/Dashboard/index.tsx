import React from "react";
import UI from "../../components/UI";
import { Link, useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import { Box, Container, Stack, Button, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <>
      <UI />
      <Container disableGutters sx={{ maxWidth: { xs: "xl", sm: "xl" } }}>
        <Typography variant="h4"> Dashboard</Typography>
      </Container>
    </>
  );
};

export default Dashboard;
