import UI from "../../components/UI";
import { Container } from "@mui/material";
import WorkoutContainer from "./components/WorkoutContainer";

export default function Workout() {
  return (
    <>
      <UI />
      <Container
        disableGutters
        sx={{
          pb: "56px",
          maxWidth: { xs: "xl", sm: "lg", height: "100%" },
        }}
      >
        <WorkoutContainer />
      </Container>
    </>
  );
}
