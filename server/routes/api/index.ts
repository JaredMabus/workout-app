import { Router } from "express";
import cookieAuth from "../middleware/cookieAuth";
import accountApi from "./account-api";
import workoutApi from "./workout-api";
import roundApi from "./round-api";
import uploadApi from "./upload-api";

const router = Router();

router.use("/account", accountApi);
router.use("/workout", cookieAuth, workoutApi);
router.use("/round", cookieAuth, roundApi);
router.use("/upload", cookieAuth, uploadApi);

export default router;
