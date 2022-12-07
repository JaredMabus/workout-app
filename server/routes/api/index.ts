import { Router } from "express";
import cookieAuth from "../middleware/cookieAuth";
import accountApi from "./account-api";
import workoutApi from "./workout-api";
import roundApi from "./round-api";

const router = Router();

router.use("/account", accountApi);
router.use("/workout", cookieAuth, workoutApi);
router.use("/round", cookieAuth, roundApi);

export default router;
