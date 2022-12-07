import { Router } from "express";
import {
  createRound,
  getAllRounds,
  getRoundById,
  updateRound,
  deleteRound,
  getLoggedInRoundData,
} from "../../controllers/round-controller";
const router = Router();

// Round CRUD routes
router.route("/data").get(getLoggedInRoundData);
router.route("/:id").get(getRoundById).delete(deleteRound);
router.route("/").get(getAllRounds).put(updateRound).post(createRound);

export default router;
