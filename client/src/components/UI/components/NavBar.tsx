import AppBar from "./AppBar";
import BottomNav from "./BottomNav";
// import { selectUi } from "../../../Redux/Slices/uiSlice";
import { useSelector, useDispatch } from "react-redux";

const NavBar = () => {
  return (
    <>
      <AppBar />
      <BottomNav />
    </>
  );
};

export default NavBar;
