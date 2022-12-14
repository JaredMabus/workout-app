import NavBar from "./components/NavBar";
import SnackBar from "./components/SnackBar";

export const UISnack = () => {
  return <SnackBar />;
};

const UI = () => {
  return (
    <>
      <NavBar />
      <SnackBar />
    </>
  );
};

export default UI;
