import { Router } from "express";
import cookieAuth from "../middleware/cookieAuth";
import accountApi from "./account-api";
import workoutApi from "./workout-api";
import roundApi from "./round-api";
import goalApi from "./goal-api";
import planApi from "./plan-api";
import uploadApi from "./upload-api";

const router = Router();

router.use("/account", accountApi);
router.use("/workout", cookieAuth, workoutApi);
router.use("/round", cookieAuth, roundApi);
router.use("/goal", cookieAuth, goalApi);
router.use("/plan", cookieAuth, planApi);
router.use("/upload", cookieAuth, uploadApi);

export default router;
